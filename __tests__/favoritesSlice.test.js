import favoritesReducer, {
    clearAllFavorites,
    removeFavorite,
    toggleFavorite,
} from '../src/store/slices/favoritesSlice';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
}));

describe('favoritesSlice reducer', () => {
    const initialState = {
        items: [],
    };

    const sampleProduct1 = {
        id: 1,
        title: 'Test Product 1',
        price: 29.99,
        category: 'electronics',
        image: 'https://example.com/1.jpg',
        rating: { rate: 4.5, count: 100 },
    };

    const sampleProduct2 = {
        id: 2,
        title: 'Test Product 2',
        price: 49.99,
        category: "men's clothing",
        image: 'https://example.com/2.jpg',
        rating: { rate: 3.8, count: 50 },
    };

    it('should return the initial state', () => {
        expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    describe('toggleFavorite', () => {
        it('should add a product to favorites', () => {
            const result = favoritesReducer(initialState, toggleFavorite(sampleProduct1));
            expect(result.items).toHaveLength(1);
            expect(result.items[0].id).toBe(1);
        });

        it('should remove a product from favorites if already present', () => {
            const stateWithFavorite = { items: [sampleProduct1] };
            const result = favoritesReducer(stateWithFavorite, toggleFavorite(sampleProduct1));
            expect(result.items).toHaveLength(0);
        });

        it('should add multiple products to favorites', () => {
            let state = favoritesReducer(initialState, toggleFavorite(sampleProduct1));
            state = favoritesReducer(state, toggleFavorite(sampleProduct2));
            expect(state.items).toHaveLength(2);
        });

        it('should only remove the toggled product, keeping others', () => {
            const stateWithTwo = { items: [sampleProduct1, sampleProduct2] };
            const result = favoritesReducer(stateWithTwo, toggleFavorite(sampleProduct1));
            expect(result.items).toHaveLength(1);
            expect(result.items[0].id).toBe(2);
        });
    });

    describe('removeFavorite', () => {
        it('should remove a product by ID', () => {
            const stateWithFavorites = { items: [sampleProduct1, sampleProduct2] };
            const result = favoritesReducer(stateWithFavorites, removeFavorite(1));
            expect(result.items).toHaveLength(1);
            expect(result.items[0].id).toBe(2);
        });

        it('should handle removing non-existent product gracefully', () => {
            const stateWithFavorites = { items: [sampleProduct1] };
            const result = favoritesReducer(stateWithFavorites, removeFavorite(999));
            expect(result.items).toHaveLength(1);
        });
    });

    describe('clearAllFavorites', () => {
        it('should remove all favorites', () => {
            const stateWithFavorites = { items: [sampleProduct1, sampleProduct2] };
            const result = favoritesReducer(stateWithFavorites, clearAllFavorites());
            expect(result.items).toHaveLength(0);
        });

        it('should handle clearing empty favorites', () => {
            const result = favoritesReducer(initialState, clearAllFavorites());
            expect(result.items).toHaveLength(0);
        });
    });

    it('should handle loadFavorites.fulfilled', () => {
        const loadedFavorites = [sampleProduct1, sampleProduct2];
        const result = favoritesReducer(initialState, {
            type: 'favorites/loadFavorites/fulfilled',
            payload: loadedFavorites,
        });
        expect(result.items).toHaveLength(2);
        expect(result.items[0].id).toBe(1);
        expect(result.items[1].id).toBe(2);
    });
});
