import React, { useState, useRef, useEffect } from 'react';
import MapLocator from '../components/MapLocator';
import ConfirmationModal from '../components/ConfirmationModal';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [pdfThumb, setPdfThumb] = useState(null);
  const [pageCount, setPageCount] = useState('');
  const [copies, setCopies] = useState(1);
  const [printType, setPrintType] = useState('bw');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [gcashReceipt, setGcashReceipt] = useState(null);
  const [receiptImage, setReceiptImage] = useState(null); // New state for receipt image
  const [showToast, setShowToast] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    address: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (receiptImage) {
        URL.revokeObjectURL(URL.createObjectURL(receiptImage));
      }
    };
  }, [receiptImage]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const selected = e.dataTransfer.files[0];
    if (selected) processFile(selected);
  };

  const handleFileDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleFileDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) processFile(selected);
  };

  const processFile = async (selected) => {
    setFile(selected);
    setPdfThumb(null);

    if (selected.type === 'application/pdf') {
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        setPageCount(pdf.numPages);

        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        setPdfThumb(canvas.toDataURL());
      };
      fileReader.readAsArrayBuffer(selected);
    } else {
      setPageCount('—');
      setPdfThumb(null);
    }
  };

  const calculateCost = () => {
    const pages = parseInt(pageCount, 10);
    const numCopies = parseInt(copies, 10);
    if (isNaN(pages) || isNaN(numCopies) || pages <= 0 || numCopies <= 0) return 0;
    const perPage = printType === 'color' ? 10 : 5;
    return pages * perPage * numCopies;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setIsModalOpen(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const isSubmitDisabled = paymentMethod === 'gcash' && !receiptImage;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 space-y-6">
      {isModalOpen && (
        <ConfirmationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      {/* Toast Container */}
      <div className="relative w-full max-w-2xl">
        {showToast && (
          <div className="absolute -top-2 left-0 right-0 z-50">
            <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg mx-auto text-center transform transition-all duration-300 ease-out animate-fade-in-down">
              Order submitted successfully!
            </div>
          </div>
        )}
      </div>

      {/* Upload Card */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl space-y-4">
        <h2 className="text-xl font-bold text-gray-800">1. Upload File</h2>

        <div
          onClick={() => fileInputRef.current.click()}
          onDrop={handleFileDrop}
          onDragOver={handleFileDragOver}
          onDragLeave={handleFileDragLeave}
          className={`w-full p-6 border-2 border-dashed rounded cursor-pointer text-center transition-transform duration-300 ease-in-out ${
            isDragging ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-400 hover:scale-105'
          }`}
        >
          <p className="text-gray-600">
            📤 Drag and drop your PDF, Word, or Excel file here or <span className="underline">click to select</span>
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* PDF or file preview */}
        {pdfThumb && (
          <div className="bg-gray-50 p-3 rounded border border-green-400 text-sm text-gray-700 relative">
            <img src={pdfThumb} alt="PDF preview" className="rounded shadow w-full mx-auto" />
            {pageCount && (
              <div className="absolute bottom-2 left-2 text-xl font-bold bg-white bg-opacity-80 px-2 py-1 rounded shadow">
                📄 {pageCount} pages detected
              </div>
            )}
          </div>
        )}

        {file && !pdfThumb && (
          <div className="bg-gray-50 p-4 rounded border border-gray-300 text-gray-700">
            <p className="font-medium">📎 {file.name}</p>
            <p className="text-sm text-gray-500">Size: {(file.size / 1024).toFixed(2)} KB</p>
            <p className="text-sm text-gray-500 italic">Preview not available for this file type</p>
          </div>
        )}

        {file && (
          <div className="flex items-center justify-between border border-gray-300 rounded px-4 py-2 mt-4">
            <label className="text-sm font-medium">Number of Copies:</label>
            <div className="flex items-center space-x-2 w-1/2">
              <button type="button" onClick={() => setCopies((c) => Math.max(1, c - 1))} className="w-8 h-8 bg-gray-200 rounded">-</button>
              <input
                type="number"
                className="text-center w-full border border-gray-300 rounded"
                value={copies}
                onChange={(e) => setCopies(Number(e.target.value))}
              />
              <button type="button" onClick={() => setCopies((c) => c + 1)} className="w-8 h-8 bg-gray-200 rounded">+</button>
            </div>
          </div>
        )}

        <div className="mt-4">
          <p className="text-sm text-gray-700 font-semibold mb-1">🖨️ Choose print color:</p>
          <div className="flex space-x-4">
            <button
              onClick={() => setPrintType('bw')}
              className={`px-4 py-2 rounded-full border ${printType === 'bw' ? 'bg-black text-white' : 'bg-gray-200'}`}
            >
              🖤 Black & White (₱5/page)
            </button>
            <button
              onClick={() => setPrintType('color')}
              className={`px-4 py-2 rounded-full border ${printType === 'color' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              🎨 Color (₱10/page)
            </button>
          </div>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl space-y-4">
        <h2 className="text-xl font-bold text-gray-800">2. Delivery Details <span className="text-sm text-gray-500">(Optional)</span></h2>
        <p className="text-xs text-gray-500">Only required for pickup or delivery orders.</p>

        <input type="text" placeholder="Customer Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 p-2 rounded" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 p-2 rounded" />
        <input type="tel" placeholder="Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} className="w-full border border-gray-300 p-2 rounded" />

        <MapLocator 
          onLocationChange={(position) => {
            setLocation({
              lat: position.lat,
              lng: position.lng,
              address: position.address
            });
            setAddress(position.address); // Add this line to update textarea
          }}
        />

        {location.lat && (
          <div className="text-sm text-gray-600 mt-2">
            <input 
              type="text" 
              value={location.address} 
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Selected Location"
              readOnly
            />
          </div>
        )}

        <textarea 
          placeholder="Full delivery address" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          className="w-full border border-gray-300 p-2 rounded" 
        />
      </div>

      {/* Payment Card */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl space-y-4">
        <h2 className="text-xl font-bold text-gray-800">3. Payment Method</h2>

        <div className="flex space-x-4">
          <button
            onClick={() => setPaymentMethod('cash')}
            className={`px-4 py-2 rounded-full ${
              paymentMethod === 'cash' ? 'bg-black text-white' : 'bg-gray-200'
            }`}
          >
            💵 Cash
          </button>
          <button
            onClick={() => setPaymentMethod('gcash')}
            className={`px-4 py-2 rounded-full ${
              paymentMethod === 'gcash' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            📱 GCash
          </button>
        </div>

        {paymentMethod === 'gcash' && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Scan QR code to pay:</p>
              <img 
                src="/assets/gcash-qr.png" 
                alt="GCash QR" 
                className="w-48 h-48 mx-auto border rounded shadow mt-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload payment screenshot:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReceiptImage(e.target.files[0])}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700"
              />
              {receiptImage && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(receiptImage)}
                    alt="Receipt Preview"
                    className="w-40 border rounded shadow"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-left font-semibold text-gray-800 border-t pt-2 text-xl">
          Total: ₱{calculateCost().toLocaleString()}
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className={`w-full py-2 rounded font-semibold ${
            isSubmitDisabled 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          Submit Print Order
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
