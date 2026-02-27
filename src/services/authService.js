import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_BASE_URL = 'https://dummyjson.com/auth';
const LOCAL_USERS_KEY = '@ShopyMart:localUsers';

/**
 * Get all locally registered users from AsyncStorage.
 */
export const getLocalUsers = async () => {
    try {
        const usersStr = await AsyncStorage.getItem(LOCAL_USERS_KEY);
        return usersStr ? JSON.parse(usersStr) : [];
    } catch {
        return [];
    }
};

/**
 * Save a new user to local storage during sign-up.
 * Stores the user's credentials so they can log in later.
 */
export const saveLocalUser = async (userData) => {
    const users = await getLocalUsers();

    // Check if username already exists locally
    const exists = users.some(
        (u) => u.username.toLowerCase() === userData.username.toLowerCase()
    );
    if (exists) {
        throw new Error('Username already taken. Please choose a different one.');
    }

    const newUser = {
        id: Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: userData.username,
        password: userData.password, // stored locally only
        image: null,
    };

    users.push(newUser);
    await AsyncStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));

    // Return user without the password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

/**
 * Attempt to log in a user.
 * First checks locally registered users, then falls back to the DummyJSON API.
 */
export const loginUser = async (username, password) => {
    // 1. Check local users first
    const localUsers = await getLocalUsers();
    const localMatch = localUsers.find(
        (u) =>
            u.username.toLowerCase() === username.toLowerCase() &&
            u.password === password
    );

    if (localMatch) {
        // Found a local match — create a local session
        const { password: _pw, ...userWithoutPassword } = localMatch;
        return {
            ...userWithoutPassword,
            accessToken: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        };
    }

    // 2. Check if the username exists locally but password is wrong
    const usernameExists = localUsers.some(
        (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (usernameExists) {
        throw new Error('Invalid password. Please try again.');
    }

    // 3. Fall back to the remote DummyJSON API
    const response = await fetch(`${AUTH_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
    }

    return data;
};
