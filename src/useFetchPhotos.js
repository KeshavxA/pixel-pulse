import { useState, useEffect, useCallback } from 'react';

const CATEGORIES_LIST = ['Photography', 'Nature', 'Architecture', 'Portrait', 'Urban', 'Landscape'];
const PHOTOS_PER_PAGE = 20;
const IMAGE_WIDTH = 600;

export function useFetchPhotos() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPhotos = useCallback(async (pageNum) => {
        try {
            setLoading(true);
            const response = await fetch(`https://picsum.photos/v2/list?page=${pageNum}&limit=${PHOTOS_PER_PAGE}`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.length === 0) {
                setHasMore(false);
            } else {
                const formattedPhotos = data.map(photo => {
                    // Create a deterministic category based on ID
                    const categoryIndex = parseInt(photo.id, 10) % CATEGORIES_LIST.length;
                    const scaledHeight = Math.round((IMAGE_WIDTH / photo.width) * photo.height);
                    
                    return {
                        id: photo.id,
                        url: `https://picsum.photos/id/${photo.id}/${IMAGE_WIDTH}/${scaledHeight}`,
                        fullUrl: photo.download_url,
                        title: `Visual Series #${photo.id}`, 
                        author: photo.author,
                        category: CATEGORIES_LIST[categoryIndex]
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
