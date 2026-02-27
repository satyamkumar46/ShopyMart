import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
    if (!categories || categories.length === 0) return null;

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            {categories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                    <TouchableOpacity
                        key={category}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => onSelectCategory(category)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                            {category === 'all' ? '✨ All' : category.charAt(0).toUpperCase() + category.slice(1)}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        maxHeight: 44,
    },
    contentContainer: {
        paddingHorizontal: 16,
        gap: 8,
        alignItems: 'center',
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#1A1A2E',
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.15)',
    },
    chipSelected: {
        backgroundColor: '#6C63FF',
        borderColor: '#6C63FF',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#A8A8B3',
        textTransform: 'capitalize',
    },
    chipTextSelected: {
        color: '#FFFFFF',
    },
});

export default CategoryFilter;
