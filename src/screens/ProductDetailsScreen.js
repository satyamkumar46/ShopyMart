import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    Animated,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchProductById } from '../services/productService';
import { toggleFavorite } from '../store/slices/favoritesSlice';

const ProductDetailsScreen = () => {
    const route = useRoute();
    const { id } = route.params;
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const favoriteItems = useSelector((state) => state.favorites.items);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fadeAnim = useState(new Animated.Value(0))[0];

    const isFavorite = product
        ? favoriteItems.some((item) => item.id === product.id)
        : false;

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchProductById(id);
            setProduct(data);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = () => {
        if (product) {
            dispatch(toggleFavorite(product));
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading product details..." />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={loadProduct} />;
    }

    if (!product) {
        return <ErrorState message="Product not found" />;
    }

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <View style={styles.topBar}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.favoriteBtn, isFavorite && styles.favoriteBtnActive]}
                    onPress={handleToggleFavorite}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={22}
                        color={isFavorite ? '#FF6B6B' : '#FFFFFF'}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Animated.View style={{ opacity: fadeAnim }}>
                    {/* Product Image */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: product.image }}
                            style={styles.productImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Product Info */}
                    <View style={styles.infoContainer}>
                        {/* Category & Rating */}
                        <View style={styles.metaRow}>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>{product.category}</Text>
                            </View>
                            {product.rating && (
                                <View style={styles.ratingContainer}>
                                    <Ionicons name="star" size={16} color="#FFD700" />
                                    <Text style={styles.ratingText}>{product.rating.rate}</Text>
                                    <Text style={styles.ratingCount}>
                                        ({product.rating.count} reviews)
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>{product.title}</Text>

                        {/* Price */}
                        <View style={styles.priceRow}>
                            <Text style={styles.price}>${product.price?.toFixed(2)}</Text>
                            <View style={styles.stockBadge}>
                                <View style={styles.stockDot} />
                                <Text style={styles.stockText}>In Stock</Text>
                            </View>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Description */}
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{product.description}</Text>

                        {/* Rating Details */}
                        {product.rating && (
                            <>
                                <View style={styles.divider} />
                                <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
                                <View style={styles.ratingCard}>
                                    <View style={styles.ratingBig}>
                                        <Text style={styles.ratingBigNumber}>
                                            {product.rating.rate}
                                        </Text>
                                        <Text style={styles.ratingBigMax}>/5</Text>
                                    </View>
                                    <View style={styles.ratingStars}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Ionicons
                                                key={star}
                                                name={
                                                    star <= Math.round(product.rating.rate)
                                                        ? 'star'
                                                        : 'star-outline'
                                                }
                                                size={20}
                                                color="#FFD700"
                                            />
                                        ))}
                                        <Text style={styles.reviewCount}>
                                            {product.rating.count} reviews
                                        </Text>
                                    </View>
                                </View>
                            </>
                        )}

                        {/* Add to Favorites Button */}
                        <TouchableOpacity
                            style={[styles.addFavButton, isFavorite && styles.removeFavButton]}
                            onPress={handleToggleFavorite}
                            activeOpacity={0.85}
                        >
                            <Ionicons
                                name={isFavorite ? 'heart-dislike' : 'heart'}
                                size={20}
                                color="#FFFFFF"
                            />
                            <Text style={styles.addFavText}>
                                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F1A',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(108, 99, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.2)',
    },
    favoriteBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(108, 99, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.2)',
    },
    favoriteBtnActive: {
        backgroundColor: 'rgba(255, 107, 107, 0.15)',
        borderColor: 'rgba(255, 107, 107, 0.3)',
    },
    imageContainer: {
        height: 300,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryBadge: {
        backgroundColor: 'rgba(108, 99, 255, 0.12)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.2)',
    },
    categoryText: {
        color: '#6C63FF',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    ratingCount: {
        fontSize: 12,
        color: '#A8A8B3',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        lineHeight: 30,
        marginBottom: 12,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    price: {
        fontSize: 28,
        fontWeight: '800',
        color: '#6C63FF',
    },
    stockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(76, 217, 100, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    stockDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CD964',
    },
    stockText: {
        color: '#4CD964',
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
        letterSpacing: 0.3,
    },
    description: {
        fontSize: 15,
        color: '#A8A8B3',
        lineHeight: 24,
    },
    ratingCard: {
        backgroundColor: 'rgba(108, 99, 255, 0.06)',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.1)',
    },
    ratingBig: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 12,
    },
    ratingBigNumber: {
        fontSize: 42,
        fontWeight: '800',
        color: '#FFD700',
    },
    ratingBigMax: {
        fontSize: 18,
        color: '#555570',
        fontWeight: '600',
    },
    ratingStars: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    reviewCount: {
        fontSize: 13,
        color: '#A8A8B3',
        marginLeft: 8,
    },
    addFavButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6C63FF',
        height: 56,
        borderRadius: 18,
        marginTop: 28,
        gap: 10,
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    removeFavButton: {
        backgroundColor: '#FF6B6B',
        shadowColor: '#FF6B6B',
    },
    addFavText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});

export default ProductDetailsScreen;
