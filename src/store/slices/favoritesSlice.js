import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const FAVORITES_KEY = '@ShopyMart:favorites';

export const loadFavorites = createAsyncThunk(
    'favorites/loadFavorites',
    async (_, { rejectWithValue }) => {
        try {
            const stored = await AsyncStorage.getItem(FAVORITES_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            return rejectWithValue('Failed to load favorites');
        }
    }
);

const saveFavoritesToStorage = async (items) => {
    try {
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
    } catch (error) {
        console.error('Failed to save favorites:', error);
    }
};

const initialState = {
    items: [],
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        toggleFavorite: (state, action) => {
            const product = action.payload;
            const existingIndex = state.items.findIndex(
                (item) => item.id === product.id
            );

            if (existingIndex >= 0) {
                state.items.splice(existingIndex, 1);
            } else {
                state.items.push(product);
            }

            saveFavoritesToStorage(state.items);
        },
        removeFavorite: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter((item) => item.id !== productId);
            saveFavoritesToStorage(state.items);
        },
        clearAllFavorites: (state) => {
            state.items = [];
            saveFavoritesToStorage([]);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadFavorites.fulfilled, (state, action) => {
            state.items = action.payload;
        });
    },
});

export const { toggleFavorite, removeFavorite, clearAllFavorites } =
    favoritesSlice.actions;
export default favoritesSlice.reducer;
