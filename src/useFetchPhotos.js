import { useState, useEffect } from 'react';


export function useFetchPhotos() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://picsum.photos/v2/list?limit=30');

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                const formattedPhotos = data.map(photo => ({
                    id: photo.id,
                    url: photo.download_url,
                    title: `Visual Series #${photo.id}`, 
                    author: photo.author,
                    category: 'Photography'
                }));

                setPhotos(formattedPhotos);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch photos:", err);
                setError(err.message || 'An unexpected error occurred while fetching photos.');
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, []);

    return { photos, loading, error };
}
