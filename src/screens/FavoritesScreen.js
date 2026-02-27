import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import EmptyState from '../components/EmptyState';
import { clearAllFavorites, removeFavorite } from '../store/slices/favoritesSlice';

const FavoritesScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const favoriteItems = useSelector((state) => state.favorites.items);

    const handleRemove = useCallback(
        (productId) => {
            Alert.alert(
                'Remove Favorite',
                'Are you sure you want to remove this product from favorites?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Remove',
                        style: 'destructive',
                        onPress: () => dispatch(removeFavorite(productId)),
                    },
                ]
            );
        },
        [dispatch]
    );

    const handleClearAll = useCallback(() => {
        Alert.alert(
            'Clear All Favorites',
            'This will remove all products from your favorites. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: () => dispatch(clearAllFavorites()),
                },
            ]
        );
    }, [dispatch]);

    const handleProductPress = useCallback(
        (product) => {
            navigation.navigate('ProductDetails', { id: product.id });
        },
        [navigation]
    );

    const renderFavoriteItem = ({ item }) => (
        <TouchableOpacity
            style={styles.favoriteCard}
            onPress={() => handleProductPress(item)}
            activeOpacity={0.85}
        >
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.infoSection}>
                <Text style={styles.productTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <View style={styles.categoryRow}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                </View>
                <View style={styles.bottomRow}>
                    <Text style={styles.productPrice}>${item.price?.toFixed(2)}</Text>
                    {item.rating && (
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={12} color="#FFD700" />
                            <Text style={styles.ratingText}>{item.rating.rate}</Text>
                        </View>
                    )}
                </View>
            </View>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemove(item.id)}
                activeOpacity={0.7}
            >
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (favoriteItems.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Favorites</Text>
                </View>
                <EmptyState
                    icon="heart-outline"
                    title="No favorites yet"
                    message="Start adding products to your favorites to see them here"
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>My Favorites</Text>
                    <Text style={styles.headerSubtitle}>
                        {favoriteItems.length} item{favoriteItems.length !== 1 ? 's' : ''} saved
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.clearAllBtn}
                    onPress={handleClearAll}
                    activeOpacity={0.7}
                >
                    <Ionicons name="trash-bin-outline" size={16} color="#FF6B6B" />
                    <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={favoriteItems}
                renderItem={renderFavoriteItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
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
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#A8A8B3',
        marginTop: 2,
    },
    clearAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.2)',
    },
    clearAllText: {
        color: '#FF6B6B',
        fontSize: 13,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    favoriteCard: {
        flexDirection: 'row',
        backgroundColor: '#1A1A2E',
        borderRadius: 18,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.1)',
        alignItems: 'center',
    },
    imageWrapper: {
        width: 80,
        height: 80,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        padding: 8,
        marginRight: 14,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    infoSection: {
        flex: 1,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#E8E8F0',
        lineHeight: 19,
        marginBottom: 6,
    },
    categoryRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    categoryBadge: {
        backgroundColor: 'rgba(108, 99, 255, 0.12)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    categoryText: {
        color: '#6C63FF',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: '#6C63FF',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    ratingText: {
        fontSize: 12,
        color: '#A8A8B3',
        fontWeight: '600',
    },
    removeButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});

export default FavoritesScreen;
