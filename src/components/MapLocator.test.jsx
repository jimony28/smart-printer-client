import { render, screen, fireEvent } from '@testing-library/react';
import MapLocator from './MapLocator';
import '@testing-library/jest-dom';

describe('MapLocator', () => {
  const mockOnLocationChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input', () => {
    render(<MapLocator onLocationChange={mockOnLocationChange} />);
    expect(screen.getByPlaceholderText('Search location...')).toBeInTheDocument();
  });

  it('loads google maps', () => {
    render(<MapLocator onLocationChange={mockOnLocationChange} />);
    const mapElement = screen.getByRole('region');
    expect(mapElement).toBeInTheDocument();
  });
});