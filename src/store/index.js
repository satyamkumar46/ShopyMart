import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';
import productsReducer from './slices/productsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
        favorites: favoritesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
