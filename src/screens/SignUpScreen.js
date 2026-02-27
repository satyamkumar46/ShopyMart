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
    View
} from 'react-native';

import { useDispatch } from 'react-redux';
import { saveLocalUser } from '../services/authService';
import { signupLogin } from '../store/slices/authSlice';

const SignUpScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

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

    const validateEmail = (emailValue) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailValue);
    };

    const validate = () => {
        const newErrors = {};

        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        } else if (username.trim().length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async () => {
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            username: true,
            password: true,
            confirmPassword: true,
        });

        if (!validate()) return;

        try {
            setLoading(true);
            setApiError(null);

            // Save user locally so they can log in with the same credentials
            const savedUser = await saveLocalUser({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                username: username.trim(),
                password,
            });

            // Auto-login the newly created user
            await dispatch(signupLogin(savedUser)).unwrap();
        } catch (error) {
            setApiError(error.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        validate();
    };

    const renderInput = ({
        label,
        icon,
        value,
        onChangeText,
        fieldName,
        placeholder,
        secureTextEntry = false,
        showToggle = false,
        isVisible = false,
        onToggleVisibility,
        keyboardType = 'default',
        autoCapitalize = 'none',
    }) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View
                style={[
                    styles.inputContainer,
                    touched[fieldName] && errors[fieldName] && styles.inputError,
                    value.length > 0 && !errors[fieldName] && styles.inputValid,
                ]}
            >
                <Ionicons name={icon} size={20} color="#6C63FF" />
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={(text) => {
                        onChangeText(text);
                        if (apiError) setApiError(null);
                    }}
                    onBlur={() => handleBlur(fieldName)}
                    placeholder={placeholder}
                    placeholderTextColor="#555570"
                    secureTextEntry={secureTextEntry && !isVisible}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                />
                {showToggle && (
                    <TouchableOpacity onPress={onToggleVisibility} activeOpacity={0.7}>
                        <Ionicons
                            name={isVisible ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#555570"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {touched[fieldName] && errors[fieldName] && (
                <Text style={styles.errorText}>{errors[fieldName]}</Text>
            )}
        </View>
    );

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
                    {/* Header with back button */}
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Brand */}
                    <View style={styles.brandSection}>
                        <View style={styles.logoContainer}>
                            <Ionicons name="person-add" size={36} color="#6C63FF" />
                        </View>
                        <Text style={styles.brandName}>Create Account</Text>
                        <Text style={styles.brandTagline}>Join ShopyMart today</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formSection}>
                        {/* API Error */}
                        {apiError && (
                            <View style={styles.errorBanner}>
                                <Ionicons name="alert-circle" size={18} color="#FF6B6B" />
                                <Text style={styles.errorBannerText}>{apiError}</Text>
                            </View>
                        )}

                        {/* Name Row */}
                        <View style={styles.nameRow}>
                            <View style={styles.halfInput}>
                                {renderInput({
                                    label: 'First Name',
                                    icon: 'person-outline',
                                    value: firstName,
                                    onChangeText: setFirstName,
                                    fieldName: 'firstName',
                                    placeholder: 'John',
                                    autoCapitalize: 'words',
                                })}
                            </View>
                            <View style={styles.halfInput}>
                                {renderInput({
                                    label: 'Last Name',
                                    icon: 'person-outline',
                                    value: lastName,
                                    onChangeText: setLastName,
                                    fieldName: 'lastName',
                                    placeholder: 'Doe',
                                    autoCapitalize: 'words',
                                })}
                            </View>
                        </View>

                        {renderInput({
                            label: 'Email',
                            icon: 'mail-outline',
                            value: email,
                            onChangeText: setEmail,
                            fieldName: 'email',
                            placeholder: 'john@example.com',
                            keyboardType: 'email-address',
                        })}

                        {renderInput({
                            label: 'Username',
                            icon: 'at-outline',
                            value: username,
                            onChangeText: setUsername,
                            fieldName: 'username',
                            placeholder: 'johndoe',
                        })}

                        {renderInput({
                            label: 'Password',
                            icon: 'lock-closed-outline',
                            value: password,
                            onChangeText: setPassword,
                            fieldName: 'password',
                            placeholder: 'Min. 6 characters',
                            secureTextEntry: true,
                            showToggle: true,
                            isVisible: showPassword,
                            onToggleVisibility: () => setShowPassword(!showPassword),
                        })}

                        {renderInput({
                            label: 'Confirm Password',
                            icon: 'shield-checkmark-outline',
                            value: confirmPassword,
                            onChangeText: setConfirmPassword,
                            fieldName: 'confirmPassword',
                            placeholder: 'Re-enter password',
                            secureTextEntry: true,
                            showToggle: true,
                            isVisible: showConfirmPassword,
                            onToggleVisibility: () => setShowConfirmPassword(!showConfirmPassword),
                        })}

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
                            onPress={handleSignUp}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <>
                                    <Text style={styles.signUpButtonText}>Create Account</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Login Link */}
                        <View style={styles.loginLinkSection}>
                            <Text style={styles.loginLinkText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
                                <Text style={styles.loginLinkAction}>Sign In</Text>
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
        padding: 24,
        paddingTop: 12,
    },
    content: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(108, 99, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.2)',
    },
    brandSection: {
        alignItems: 'center',
        marginBottom: 28,
    },
    logoContainer: {
        width: 72,
        height: 72,
        borderRadius: 22,
        backgroundColor: 'rgba(108, 99, 255, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.25)',
    },
    brandName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
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
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.1)',
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
    nameRow: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 14,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#A8A8B3',
        marginBottom: 6,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#12122A',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 50,
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
        fontSize: 11,
        marginTop: 4,
        marginLeft: 4,
        fontWeight: '500',
    },
    signUpButton: {
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
    signUpButtonDisabled: {
        opacity: 0.7,
    },
    signUpButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    loginLinkSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loginLinkText: {
        color: '#A8A8B3',
        fontSize: 14,
    },
    loginLinkAction: {
        color: '#6C63FF',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default SignUpScreen;
