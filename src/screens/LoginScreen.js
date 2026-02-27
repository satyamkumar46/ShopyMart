import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, login } from '../store/slices/authSlice';

const LoginScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { loading, error } = useSelector((state) => state.auth);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Animation
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(30))[0];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const validate = () => {
        const newErrors = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = () => {
        setTouched({ username: true, password: true });
        if (validate()) {
            dispatch(login({ username: username.trim(), password }));
        }
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        validate();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Animated.View
                    style={[
                        styles.content,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    {/* Logo / Brand */}
                    <View style={styles.brandSection}>
                        <View style={styles.logoContainer}>
                            <Ionicons name="storefront" size={40} color="#6C63FF" />
                        </View>
                        <Text style={styles.brandName}>ShopyMart</Text>
                        <Text style={styles.brandTagline}>Your smart shopping companion</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formSection}>
                        <Text style={styles.welcomeText}>Welcome Back</Text>
                        <Text style={styles.signInText}>Sign in to your account</Text>

                        {/* API Error */}
                        {error && (
                            <View style={styles.errorBanner}>
                                <Ionicons name="alert-circle" size={18} color="#FF6B6B" />
                                <Text style={styles.errorBannerText}>{error}</Text>
                            </View>
                        )}

                        {/* Username */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <View
                                style={[
                                    styles.inputContainer,
                                    touched.username && errors.username && styles.inputError,
                                    username.length > 0 && !errors.username && styles.inputValid,
                                ]}
                            >
                                <Ionicons name="person-outline" size={20} color="#6C63FF" />
                                <TextInput
                                    style={styles.input}
                                    value={username}
                                    onChangeText={(text) => {
                                        setUsername(text);
                                        if (error) dispatch(clearError());
                                    }}
                                    onBlur={() => handleBlur('username')}
                                    placeholder="Enter username"
                                    placeholderTextColor="#555570"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            {touched.username && errors.username && (
                                <Text style={styles.errorText}>{errors.username}</Text>
                            )}
                        </View>

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View
                                style={[
                                    styles.inputContainer,
                                    touched.password && errors.password && styles.inputError,
                                    password.length >= 6 && !errors.password && styles.inputValid,
                                ]}
                            >
                                <Ionicons name="lock-closed-outline" size={20} color="#6C63FF" />
                                <TextInput
                                    style={styles.input}
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        if (error) dispatch(clearError());
                                    }}
                                    onBlur={() => handleBlur('password')}
                                    placeholder="Enter password"
                                    placeholderTextColor="#555570"
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color="#555570"
                                    />
                                </TouchableOpacity>
                            </View>
                            {touched.password && errors.password && (
                                <Text style={styles.errorText}>{errors.password}</Text>
                            )}
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <>
                                    <Text style={styles.loginButtonText}>Sign In</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Sign Up Link */}
                        <View style={styles.signUpLinkSection}>
                            <Text style={styles.signUpLinkText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} activeOpacity={0.7}>
                                <Text style={styles.signUpLinkAction}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F1A',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    brandSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: 'rgba(108, 99, 255, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.25)',
    },
    brandName: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    brandTagline: {
        fontSize: 14,
        color: '#A8A8B3',
        marginTop: 4,
        letterSpacing: 0.5,
    },
    formSection: {
        backgroundColor: 'rgba(26, 26, 46, 0.6)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.1)',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    signInText: {
        fontSize: 14,
        color: '#A8A8B3',
        marginBottom: 24,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.2)',
    },
    errorBannerText: {
        color: '#FF6B6B',
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
    },
    inputGroup: {
        marginBottom: 18,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#A8A8B3',
        marginBottom: 8,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#12122A',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 52,
        borderWidth: 1.5,
        borderColor: 'rgba(108, 99, 255, 0.12)',
        gap: 10,
    },
    inputError: {
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.04)',
    },
    inputValid: {
        borderColor: 'rgba(108, 99, 255, 0.4)',
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#E8E8F0',
        fontWeight: '500',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
        fontWeight: '500',
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6C63FF',
        height: 54,
        borderRadius: 16,
        marginTop: 8,
        gap: 8,
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(108, 99, 255, 0.15)',
    },
    dividerText: {
        color: '#555570',
        fontSize: 11,
        fontWeight: '600',
        marginHorizontal: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    demoCard: {
        backgroundColor: 'rgba(108, 99, 255, 0.06)',
        borderRadius: 12,
        padding: 14,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.1)',
    },
    demoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    demoLabel: {
        fontSize: 12,
        color: '#A8A8B3',
        fontWeight: '500',
    },
    demoValue: {
        fontSize: 13,
        color: '#6C63FF',
        fontWeight: '700',
    },
    signUpLinkSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    signUpLinkText: {
        color: '#A8A8B3',
        fontSize: 14,
    },
    signUpLinkAction: {
        color: '#6C63FF',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default LoginScreen;
