import { useEffect, useState } from 'react';

export function useImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/image`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch images');
        const data = await res.json();
        setImages(data.items ?? []);
      } catch (err) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return { images, loading, error };
} 