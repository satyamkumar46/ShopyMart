import productsReducer, {
    clearFilters,
    setSearchQuery,
    setSelectedCategory,
} from '../src/store/slices/productsSlice';

describe('productsSlice reducer', () => {
    const initialState = {
        items: [],
        filteredItems: [],
        categories: [],
        loading: false,
        error: null,
        searchQuery: '',
        selectedCategory: 'all',
    };

    const sampleProducts = [
        {
            id: 1,
            title: 'Mens Cotton Jacket',
            price: 55.99,
            category: "men's clothing",
            image: 'https://fakestoreapi.com/img/1.jpg',
            rating: { rate: 4.7, count: 500 },
        },
        {
            id: 2,
            title: 'Gold Bracelet',
            price: 695.0,
            category: 'jewelery',
            image: 'https://fakestoreapi.com/img/2.jpg',
            rating: { rate: 3.9, count: 70 },
        },
        {
            id: 3,
            title: 'Womens T-Shirt',
            price: 12.99,
            category: "women's clothing",
            image: 'https://fakestoreapi.com/img/3.jpg',
            rating: { rate: 4.1, count: 259 },
        },
        {
            id: 4,
            title: 'Samsung SSD',
            price: 109.95,
            category: 'electronics',
            image: 'https://fakestoreapi.com/img/4.jpg',
            rating: { rate: 4.8, count: 319 },
        },
    ];

    it('should return the initial state', () => {
        expect(productsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle getProducts.pending', () => {
        const result = productsReducer(initialState, {
            type: 'products/getProducts/pending',
        });
        expect(result.loading).toBe(true);
        expect(result.error).toBeNull();
    });

    it('should handle getProducts.fulfilled', () => {
        const result = productsReducer(initialState, {
            type: 'products/getProducts/fulfilled',
            payload: sampleProducts,
        });

        expect(result.loading).toBe(false);
        expect(result.items).toHaveLength(4);
        expect(result.filteredItems).toHaveLength(4);
        expect(result.error).toBeNull();
    });

    it('should handle getProducts.rejected', () => {
        const result = productsReducer(initialState, {
            type: 'products/getProducts/rejected',
            payload: 'Network error',
        });

        expect(result.loading).toBe(false);
        expect(result.error).toBe('Network error');
    });

    it('should handle getCategories.fulfilled', () => {
        const categories = ["men's clothing", 'jewelery', 'electronics', "women's clothing"];
        const result = productsReducer(initialState, {
            type: 'products/getCategories/fulfilled',
            payload: categories,
        });

        expect(result.categories).toHaveLength(5); // 'all' + 4 categories
        expect(result.categories[0]).toBe('all');
    });

    describe('setSearchQuery', () => {
        const stateWithProducts = {
            ...initialState,
            items: sampleProducts,
            filteredItems: sampleProducts,
        };

        it('should filter products by search query', () => {
            const result = productsReducer(stateWithProducts, setSearchQuery('jacket'));
            expect(result.searchQuery).toBe('jacket');
            expect(result.filteredItems).toHaveLength(1);
            expect(result.filteredItems[0].title).toBe('Mens Cotton Jacket');
        });

        it('should return all products for empty search', () => {
            const result = productsReducer(stateWithProducts, setSearchQuery(''));
            expect(result.filteredItems).toHaveLength(4);
        });

        it('should be case insensitive', () => {
            const result = productsReducer(stateWithProducts, setSearchQuery('SAMSUNG'));
            expect(result.filteredItems).toHaveLength(1);
            expect(result.filteredItems[0].title).toBe('Samsung SSD');
        });
    });

    describe('setSelectedCategory', () => {
        const stateWithProducts = {
            ...initialState,
            items: sampleProducts,
            filteredItems: sampleProducts,
        };

        it('should filter products by category', () => {
            const result = productsReducer(
                stateWithProducts,
                setSelectedCategory('electronics')
            );
            expect(result.selectedCategory).toBe('electronics');
            expect(result.filteredItems).toHaveLength(1);
            expect(result.filteredItems[0].category).toBe('electronics');
        });

        it('should show all products for "all" category', () => {
            const result = productsReducer(
                stateWithProducts,
                setSelectedCategory('all')
            );
            expect(result.filteredItems).toHaveLength(4);
        });
    });

    describe('combined filters', () => {
        it('should apply both search and category filters', () => {
            let state = {
                ...initialState,
                items: sampleProducts,
                filteredItems: sampleProducts,
            };

            state = productsReducer(state, setSelectedCategory("men's clothing"));
            state = productsReducer(state, setSearchQuery('cotton'));

            expect(state.filteredItems).toHaveLength(1);
            expect(state.filteredItems[0].title).toBe('Mens Cotton Jacket');
        });
    });

    it('should handle clearFilters', () => {
        const filteredState = {
            ...initialState,
            items: sampleProducts,
            filteredItems: [sampleProducts[0]],
            searchQuery: 'jacket',
            selectedCategory: "men's clothing",
        };

        const result = productsReducer(filteredState, clearFilters());
        expect(result.searchQuery).toBe('');
        expect(result.selectedCategory).toBe('all');
        expect(result.filteredItems).toHaveLength(4);
    });
});
