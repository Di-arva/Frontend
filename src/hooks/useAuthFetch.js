import { useState, useEffect } from 'react';

export const useAuthFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = getAuthToken();
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
          },
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("authToken");
            window.location.href = "/login";
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};