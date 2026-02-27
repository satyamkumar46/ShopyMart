import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const SearchBar = ({ value, onChangeText, placeholder = 'Search products...' }) => {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color="#6C63FF" style={styles.icon} />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#555570"
                returnKeyType="search"
            />
            {value?.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')} activeOpacity={0.7}>
                    <Ionicons name="close-circle" size={20} color="#555570" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A2E',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 48,
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.15)',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#E8E8F0',
        fontWeight: '500',
    },
});

export default SearchBar;
