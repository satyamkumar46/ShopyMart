import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CategoryFilter from '../components/CategoryFilter';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import useDebounce from '../hooks/useDebounce';
import { logout } from '../store/slices/authSlice';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import {
    getCategories,
    getProducts,
    setSearchQuery,
    setSelectedCategory,
} from '../store/slices/productsSlice';

const HomeScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const { filteredItems, categories, loading, error, searchQuery, selectedCategory } =
        useSelector((state) => state.products);
    const favoriteItems = useSelector((state) => state.favorites.items);
    const user = useSelector((state) => state.auth.user);

    const [localSearch, setLocalSearch] = useState(searchQuery);
    const [refreshing, setRefreshing] = useState(false);

    const debouncedSearch = useDebounce(localSearch, 400);

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => {
        dispatch(setSearchQuery(debouncedSearch));
    }, [debouncedSearch, dispatch]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await dispatch(getProducts());
        await dispatch(getCategories());
        setRefreshing(false);
    }, [dispatch]);

    const handleProductPress = useCallback(
        (product) => {
            navigation.navigate('ProductDetails', { id: product.id });
        },
        [navigation]
    );

    const handleToggleFavorite = useCallback(
        (product) => {
            dispatch(toggleFavorite(product));
        },
        [dispatch]
    );

    const handleCategorySelect = useCallback(
        (category) => {
            dispatch(setSelectedCategory(category));
        },
        [dispatch]
    );

    const handleLogout = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    const isFavorite = useCallback(
        (productId) => {
            return favoriteItems.some((item) => item.id === productId);
        },
        [favoriteItems]
    );

    const renderProduct = useCallback(
        ({ item }) => (
            <ProductCard
                product={item}
                onPress={() => handleProductPress(item)}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={handleToggleFavorite}
            />
        ),
        [handleProductPress, isFavorite, handleToggleFavorite]
    );

    if (loading && filteredItems.length === 0) {
        return <LoadingSpinner message="Fetching products..." />;
    }

    if (error && filteredItems.length === 0) {
        return <ErrorState message={error} onRetry={() => dispatch(getProducts())} />;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.greeting}>
                        Hello, {user?.firstName || 'Shopper'} 👋
                    </Text>
                    <Text style={styles.subtitle}>Find your perfect product</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
                    <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <SearchBar value={localSearch} onChangeText={setLocalSearch} />
            </View>

            {/* Categories */}
            <View style={styles.categoryContainer}>
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleCategorySelect}
                />
            </View>

            {/* Results count */}
            <View style={styles.resultsBar}>
                <Text style={styles.resultsText}>
                    {filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''} found
                </Text>
            </View>

            {/* Products List */}
            {filteredItems.length === 0 ? (
                <EmptyState
                    icon="search-outline"
                    title="No products found"
                    message="Try adjusting your search or category filter"
                />
            ) : (
                <FlatList
                    data={filteredItems}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor="#6C63FF"
                            colors={['#6C63FF']}
                        />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F1A',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    headerLeft: {
        flex: 1,
    },
    greeting: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 14,
        color: '#A8A8B3',
        marginTop: 2,
    },
    logoutBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.2)',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 14,
    },
    categoryContainer: {
        marginBottom: 12,
    },
    resultsBar: {
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    resultsText: {
        fontSize: 13,
        color: '#555570',
        fontWeight: '600',
    },
    row: {
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    listContent: {
        paddingBottom: 100,
    },
});

export default HomeScreen;
