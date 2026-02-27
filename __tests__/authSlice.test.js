import authReducer, { clearError } from '../src/store/slices/authSlice';

describe('authSlice reducer', () => {
    const initialState = {
        token: null,
        isLoggedIn: false,
        loading: false,
        error: null,
        user: null,
        isRestoringToken: true,
    };

    it('should return the initial state', () => {
        expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle clearError', () => {
        const stateWithError = { ...initialState, error: 'Some error' };
        const result = authReducer(stateWithError, clearError());
        expect(result.error).toBeNull();
    });

    it('should handle login.pending', () => {
        const result = authReducer(initialState, { type: 'auth/login/pending' });
        expect(result.loading).toBe(true);
        expect(result.error).toBeNull();
    });

    it('should handle login.fulfilled', () => {
        const payload = {
            accessToken: 'test-token-123',
            id: 1,
            username: 'emilys',
            firstName: 'Emily',
            lastName: 'Johnson',
            image: 'https://example.com/avatar.png',
            email: 'emily@example.com',
        };

        const result = authReducer(initialState, {
            type: 'auth/login/fulfilled',
            payload,
        });

        expect(result.loading).toBe(false);
        expect(result.isLoggedIn).toBe(true);
        expect(result.token).toBe('test-token-123');
        expect(result.user.username).toBe('emilys');
        expect(result.user.firstName).toBe('Emily');
    });

    it('should handle login.rejected', () => {
        const result = authReducer(initialState, {
            type: 'auth/login/rejected',
            payload: 'Invalid credentials',
        });

        expect(result.loading).toBe(false);
        expect(result.isLoggedIn).toBe(false);
        expect(result.error).toBe('Invalid credentials');
    });

    it('should handle restoreToken.fulfilled with token', () => {
        const payload = {
            token: 'restored-token',
            user: { id: 1, username: 'testuser' },
        };

        const result = authReducer(initialState, {
            type: 'auth/restoreToken/fulfilled',
            payload,
        });

        expect(result.isRestoringToken).toBe(false);
        expect(result.isLoggedIn).toBe(true);
        expect(result.token).toBe('restored-token');
        expect(result.user.username).toBe('testuser');
    });

    it('should handle restoreToken.fulfilled with null (no stored token)', () => {
        const result = authReducer(initialState, {
            type: 'auth/restoreToken/fulfilled',
            payload: null,
        });

        expect(result.isRestoringToken).toBe(false);
        expect(result.isLoggedIn).toBe(false);
        expect(result.token).toBeNull();
    });

    it('should handle restoreToken.rejected', () => {
        const result = authReducer(initialState, {
            type: 'auth/restoreToken/rejected',
        });

        expect(result.isRestoringToken).toBe(false);
    });

    it('should handle logout.fulfilled', () => {
        const loggedInState = {
            ...initialState,
            token: 'some-token',
            isLoggedIn: true,
            user: { id: 1, username: 'test' },
            isRestoringToken: false,
        };

        const result = authReducer(loggedInState, {
            type: 'auth/logout/fulfilled',
        });

        expect(result.token).toBeNull();
        expect(result.isLoggedIn).toBe(false);
        expect(result.user).toBeNull();
        expect(result.error).toBeNull();
    });
});
