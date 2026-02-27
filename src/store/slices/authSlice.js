import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUser } from '../../services/authService';

const AUTH_TOKEN_KEY = '@ShopyMart:authToken';
const AUTH_USER_KEY = '@ShopyMart:authUser';

export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const data = await loginUser(username, password);
            // Persist token and user info
            await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.accessToken || data.token);
            await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify({
                id: data.id,
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                image: data.image,
                email: data.email,
            }));
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const restoreToken = createAsyncThunk(
    'auth/restoreToken',
    async (_, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
            const userStr = await AsyncStorage.getItem(AUTH_USER_KEY);
            if (token && userStr) {
                return { token, user: JSON.parse(userStr) };
            }
            return null;
        } catch (error) {
            return rejectWithValue('Failed to restore session');
        }
    }
);

export const signupLogin = createAsyncThunk(
    'auth/signupLogin',
    async (userData, { rejectWithValue }) => {
        try {
            // DummyJSON doesn't persist new users, so we create a local session
            const mockToken = `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
            const user = {
                id: userData.id,
                username: userData.username,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image || null,
                email: userData.email,
            };
            await AsyncStorage.setItem(AUTH_TOKEN_KEY, mockToken);
            await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
            return { token: mockToken, user };
        } catch (error) {
            return rejectWithValue('Failed to create session after signup');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        await AsyncStorage.removeItem(AUTH_USER_KEY);
    }
);

const initialState = {
    token: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    user: null,
    isRestoringToken: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.token = action.payload.accessToken || action.payload.token;
                state.user = {
                    id: action.payload.id,
                    username: action.payload.username,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    image: action.payload.image,
                    email: action.payload.email,
                };
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Login failed';
            })
            // Restore Token
            .addCase(restoreToken.fulfilled, (state, action) => {
                state.isRestoringToken = false;
                if (action.payload) {
                    state.token = action.payload.token;
                    state.user = action.payload.user;
                    state.isLoggedIn = true;
                }
            })
            .addCase(restoreToken.rejected, (state) => {
                state.isRestoringToken = false;
            })
            // Signup Login (auto-login after signup)
            .addCase(signupLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(signupLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Auto-login failed';
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.token = null;
                state.isLoggedIn = false;
                state.user = null;
                state.error = null;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
