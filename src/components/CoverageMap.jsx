import { useEffect, useRef, useState } from 'react';

const CoverageMap = () => {
  const mapRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Skip if already loaded or no container
    if (!mapRef.current) return;

    // Check if script already exists
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      if (window.google && window.google.maps) {
        createMap();
      }
      return;
    }

    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('Missing Google Maps API key');
      setHasError(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      createMap();
    };

    script.onerror = () => {
      console.error('Failed to load Google Maps');
      setHasError(true);
    };

    document.head.appendChild(script);
  }, []);

  const createMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      // Center between Dundalk and Dublin
      const center = { lat: 53.7179, lng: -6.3561 };

      // Create map
      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 9,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#171717' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#171717' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e0e' }] },
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        ],
      });

      // Add coverage circle
      new window.google.maps.Circle({
        strokeColor: '#DC2626',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#DC2626',
        fillOpacity: 0.15,
        map: map,
        center: center,
        radius: 50000,
      });

      // Add markers
      const locations = [
        { lat: 54.0027, lng: -6.4003, title: 'Dundalk' },
        { lat: 53.7189, lng: -6.3478, title: 'Drogheda' },
        { lat: 53.3498, lng: -6.2603, title: 'Dublin' },
      ];

      locations.forEach((loc) => {
        new window.google.maps.Marker({
          position: { lat: loc.lat, lng: loc.lng },
          map: map,
          title: loc.title,
        });
      });

    } catch (error) {
      console.error('Map error:', error);
      setHasError(true);
    }
  };

  // Error fallback
  if (hasError) {
    return (
      <div className="w-full h-full min-h-[400px] bg-brand-surface rounded-sm border border-white/10 flex flex-col items-center justify-center p-8">
        <svg className="w-16 h-16 text-brand-red/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 className="font-heading text-xl text-white mb-2">Coverage Area</h3>
        <p className="text-brand-red font-medium mb-4">Dundalk → Drogheda → Dublin</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {['Dundalk', 'Drogheda', 'Dublin', 'Louth', 'Meath'].map((location) => (
            <span key={location} className="px-3 py-1 bg-brand-red/10 border border-brand-red/30 rounded-sm text-gray-300 text-sm">
              {location}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-sm" />;
};

export default CoverageMap;
