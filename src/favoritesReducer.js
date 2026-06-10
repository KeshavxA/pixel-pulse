const getInitialState = () => {
    const data = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Migration check: If it's a flat array of photos, convert to a single collection
    if (data.length > 0 && !data[0].photos) {
        return [
            {
                id: 'default',
                name: 'Favorites',
                photos: data
            }
        ];
    }
    
    // If empty array, provide a default collection
    if (data.length === 0) {
        return [
            { id: 'default', name: 'Favorites', photos: [] }
        ];
    }
    
    return data;
};

export const initialState = getInitialState();

export const favoritesReducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_COLLECTION':
            return [...state, { id: Date.now().toString(), name: action.payload.name, photos: [] }];
        case 'DELETE_COLLECTION':
            return state.filter(c => c.id !== action.payload.id);
        case 'TOGGLE_PHOTO_IN_COLLECTION':
            return state.map(collection => {
                if (collection.id === action.payload.collectionId) {
                    const exists = collection.photos.some(p => p.id === action.payload.photo.id);
                    return {
                        ...collection,
                        photos: exists 
                            ? collection.photos.filter(p => p.id !== action.payload.photo.id)
                            : [...collection.photos, action.payload.photo]
                    };
                }
                return collection;
            });
        case 'SET_COLLECTIONS':
            return action.payload;
        default:
            return state;
    }
};
