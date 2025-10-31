const openGoogleMaps = (address) => {
    if (!address) return;
    
    // Prefer coordinates if available for exact location
    if (address.coordinates && address.coordinates.latitude && address.coordinates.longitude) {
      const { latitude, longitude } = address.coordinates;
      window.open(
        `https://www.google.com/maps?q=${latitude},${longitude}`,
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      // Fallback to address search
      const { address_line, city, province, postal_code } = address;
      const addressString = encodeURIComponent(
        `${address_line}, ${city}, ${province} ${postal_code}`
      );
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${addressString}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  export default openGoogleMaps;