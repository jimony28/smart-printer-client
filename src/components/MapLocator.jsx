import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 10.3157, // Cebu coordinates
  lng: 123.8854
};

function MapLocator({ onLocationChange }) {
  const [marker, setMarker] = useState(null);

  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng }
      });
      
      if (response.results[0]) {
        return response.results[0].formatted_address;
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
    return `${lat}, ${lng}`;
  };

  const handleClick = useCallback(async (e) => {
    const newPos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setMarker(newPos);
    const address = await getAddressFromLatLng(newPos.lat, newPos.lng);
    onLocationChange({ ...newPos, address });
  }, [onLocationChange]);

  return (
    <div className="w-full">
      <LoadScript 
        googleMapsApiKey="AIzaSyBmFPeI1_jjz3FpmKauLG4SQCENM06Kotw"
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={15}
          onClick={handleClick}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default MapLocator;
