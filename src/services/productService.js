const PRODUCTS_BASE_URL = 'https://fakestoreapi.com';

export const fetchAllProducts = async () => {
    const response = await fetch(`${PRODUCTS_BASE_URL}/products`);

    if (!response.ok) {
        throw new Error('Failed to fetch products. Please try again.');
    }

    const data = await response.json();
    return data;
};

export const fetchProductById = async (id) => {
    const response = await fetch(`${PRODUCTS_BASE_URL}/products/${id}`);

    if (!response.ok) {
        throw new Error('Failed to fetch product details.');
    }

    const data = await response.json();
    return data;
};

export const fetchAllCategories = async () => {
    const response = await fetch(`${PRODUCTS_BASE_URL}/products/categories`);

    if (!response.ok) {
        throw new Error('Failed to fetch categories.');
    }

    const data = await response.json();
    return data;
};
