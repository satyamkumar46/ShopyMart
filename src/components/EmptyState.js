import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const EmptyState = ({
    icon = 'heart-outline',
    title = 'Nothing here yet',
    message = 'Start adding items to see them here'
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <Ionicons name={icon} size={56} color="#6C63FF" />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#0F0F1A',
    },
    iconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(108, 99, 255, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#E8E8F0',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: '#A8A8B3',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default EmptyState;
