export const initialState = JSON.parse(localStorage.getItem('favorites')) || [];

export const favoritesReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_FAVORITE':
            if (state.find((item) => item.id === action.payload.id)) {
                return state;
            }
            return [...state, action.payload];
        case 'REMOVE_FAVORITE':
            return state.filter((item) => item.id !== action.payload.id);
        case 'SET_FAVORITES':
            return action.payload;
        default:
            return state;
    }
};
