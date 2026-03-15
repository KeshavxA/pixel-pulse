export const initialState = JSON.parse(localStorage.getItem('favorites')) || [];

export const favoritesReducer = (state, action) => {
    let newState;
    switch (action.type) {
        case 'ADD_FAVORITE':

            if (state.find((item) => item.id === action.payload.id)) {
                return state;
            }
            newState = [...state, action.payload];
            break;
        case 'REMOVE_FAVORITE':
            newState = state.filter((item) => item.id !== action.payload.id);
            break;
        default:
            return state;
    }

    localStorage.setItem('favorites', JSON.stringify(newState));
    return newState;
};
