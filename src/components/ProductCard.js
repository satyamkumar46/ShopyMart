import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProductCard = ({ product, onPress, isFavorite, onToggleFavorite }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
                {onToggleFavorite && (
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => onToggleFavorite(product)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isFavorite ? 'heart' : 'heart-outline'}
                            size={20}
                            color={isFavorite ? '#FF6B6B' : '#A8A8B3'}
                        />
                    </TouchableOpacity>
                )}
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText} numberOfLines={1}>
                        {product.category}
                    </Text>
                </View>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={2}>
                    {product.title}
                </Text>
                <View style={styles.bottomRow}>
                    <Text style={styles.price}>${product.price?.toFixed(2)}</Text>
                    {product.rating && (
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={12} color="#FFD700" />
                            <Text style={styles.ratingText}>{product.rating.rate}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1A1A2E',
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 16,
        width: '48%',
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.1)',
    },
    imageContainer: {
        height: 160,
        backgroundColor: '#FFFFFF',
        padding: 16,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(15, 15, 26, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(108, 99, 255, 0.9)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    categoryText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoContainer: {
        padding: 12,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        color: '#E8E8F0',
        lineHeight: 18,
        marginBottom: 8,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: '800',
        color: '#6C63FF',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    ratingText: {
        fontSize: 12,
        color: '#A8A8B3',
        fontWeight: '600',
    },
});

export default ProductCard;
