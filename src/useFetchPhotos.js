import { useState, useEffect, useCallback } from 'react';

export function useFetchPhotos() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const categoriesList = ['Photography', 'Nature', 'Architecture', 'Portrait', 'Urban'];

    const fetchPhotos = useCallback(async (pageNum) => {
        try {
            setLoading(true);
            const response = await fetch(`https://picsum.photos/v2/list?page=${pageNum}&limit=20`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.length === 0) {
                setHasMore(false);
            } else {
                const formattedPhotos = data.map(photo => {
                    // Create a deterministic category based on ID
                    const categoryIndex = parseInt(photo.id, 10) % categoriesList.length;
                    
                    return {
                        id: photo.id,
                        url: photo.download_url,
                        title: `Visual Series #${photo.id}`, 
                        author: photo.author,
                        category: categoriesList[categoryIndex]
                    };
                });

                setPhotos(prev => [...prev, ...formattedPhotos]);
            }
            setError(null);
        } catch (err) {
            console.error("Failed to fetch photos:", err);
            setError(err.message || 'An unexpected error occurred while fetching photos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPhotos(page);
    }, [page, fetchPhotos]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [loading, hasMore]);

    return { photos, loading, error, loadMore, hasMore };
}
