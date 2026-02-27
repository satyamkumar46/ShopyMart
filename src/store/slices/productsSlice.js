import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAllCategories, fetchAllProducts } from '../../services/productService';

export const getProducts = createAsyncThunk(
    'products/getProducts',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchAllProducts();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getCategories = createAsyncThunk(
    'products/getCategories',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchAllCategories();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const applyFilters = (items, searchQuery, selectedCategory) => {
    let filtered = [...items];

    if (selectedCategory && selectedCategory !== 'all') {
        filtered = filtered.filter(
            (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
        );
    }

    if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter((item) =>
            item.title.toLowerCase().includes(query)
        );
    }

    return filtered;
};

const initialState = {
    items: [],
    filteredItems: [],
    categories: [],
    loading: false,
    error: null,
    searchQuery: '',
    selectedCategory: 'all',
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
            state.filteredItems = applyFilters(
                state.items,
                action.payload,
                state.selectedCategory
            );
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
            state.filteredItems = applyFilters(
                state.items,
                state.searchQuery,
                action.payload
            );
        },
        clearFilters: (state) => {
            state.searchQuery = '';
            state.selectedCategory = 'all';
            state.filteredItems = [...state.items];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.filteredItems = applyFilters(
                    action.payload,
                    state.searchQuery,
                    state.selectedCategory
                );
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch products';
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.categories = ['all', ...action.payload];
            });
    },
});

export const { setSearchQuery, setSelectedCategory, clearFilters } =
    productsSlice.actions;
export default productsSlice.reducer;
