import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ErrorState = ({ message = 'Something went wrong', onRetry }) => {
    return (
        <View style={styles.container}>
            <View style={styles.errorCard}>
                <View style={styles.iconWrapper}>
                    <Ionicons name="cloud-offline-outline" size={48} color="#FF6B6B" />
                </View>
                <Text style={styles.title}>Oops!</Text>
                <Text style={styles.message}>{message}</Text>
                {onRetry && (
                    <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
                        <Ionicons name="refresh" size={18} color="#FFFFFF" />
                        <Text style={styles.retryText}>Try Again</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F0F1A',
        padding: 24,
    },
    errorCard: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 107, 0.06)',
        borderRadius: 24,
        padding: 36,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.15)',
    },
    iconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: '#A8A8B3',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6C63FF',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 14,
        gap: 8,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default ErrorState;
