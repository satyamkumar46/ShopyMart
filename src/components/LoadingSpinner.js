import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const LoadingSpinner = ({ message = 'Loading...', size = 'large' }) => {
    return (
        <View style={styles.container}>
            <View style={styles.spinnerWrapper}>
                <ActivityIndicator size={size} color="#6C63FF" />
                <Text style={styles.message}>{message}</Text>
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
    },
    spinnerWrapper: {
        alignItems: 'center',
        padding: 30,
        borderRadius: 20,
        backgroundColor: 'rgba(108, 99, 255, 0.08)',
    },
    message: {
        marginTop: 16,
        fontSize: 15,
        color: '#A8A8B3',
        fontWeight: '500',
        letterSpacing: 0.3,
    },
});

export default LoadingSpinner;
