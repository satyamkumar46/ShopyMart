import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './src/store';
import { restoreToken } from './src/store/slices/authSlice';
import { loadFavorites } from './src/store/slices/favoritesSlice';

// Screens
import FavoritesScreen from './src/screens/FavoritesScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import SignUpScreen from './src/screens/SignUpScreen';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Wraps a screen in the shared SafeAreaView container
function ScreenWrapper({ children }) {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {children}
        </SafeAreaView>
    );
}

// --- Tab screens --------------------------------------------------------
function HomeTab() {
    return (
        <ScreenWrapper>
            <HomeScreen />
        </ScreenWrapper>
    );
}

function FavoritesTab() {
    return (
        <ScreenWrapper>
            <FavoritesScreen />
        </ScreenWrapper>
    );
}

// --- Bottom Tab Navigator -----------------------------------------------
function TabNavigator() {
    const { isLoggedIn } = useSelector((state) => state.auth);
    // No need for a redirect effect here — the conditional navigator
    // in RootNavigator already handles auth gating.

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#1A1A2E',
                    borderTopColor: 'rgba(108, 99, 255, 0.1)',
                    borderTopWidth: 1,
                    height: 85,
                    paddingBottom: 28,
                    paddingTop: 10,
                    elevation: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                },
                tabBarActiveTintColor: '#6C63FF',
                tabBarInactiveTintColor: '#555570',
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 0.3,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeTab}
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Favorites"
                component={FavoritesTab}
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'heart' : 'heart-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

// --- Login / Signup screens (wrapped) -----------------------------------
function LoginScreenWrapper() {
    return (
        <ScreenWrapper>
            <LoginScreen />
        </ScreenWrapper>
    );
}

function SignUpScreenWrapper() {
    return (
        <ScreenWrapper>
            <SignUpScreen />
        </ScreenWrapper>
    );
}

function ProductDetailsScreenWrapper() {
    return (
        <ScreenWrapper>
            <ProductDetailsScreen />
        </ScreenWrapper>
    );
}

// --- Root Navigator (auth-gated) ----------------------------------------
function RootNavigator() {
    const dispatch = useDispatch();
    const { isLoggedIn, isRestoringToken } = useSelector((state) => state.auth);

    useEffect(() => {
        const bootstrap = async () => {
            await dispatch(restoreToken());
            await dispatch(loadFavorites());
            await SplashScreen.hideAsync();
        };
        bootstrap();
    }, [dispatch]);

    if (isRestoringToken) {
        return null;
    }

    return (
        <>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#0F0F1A' },
                    animation: 'slide_from_right',
                }}
            >
                {isLoggedIn ? (
                    <>
                        <Stack.Screen name="Tabs" component={TabNavigator} />
                        <Stack.Screen
                            name="ProductDetails"
                            component={ProductDetailsScreenWrapper}
                            options={{ animation: 'slide_from_bottom' }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreenWrapper} />
                        <Stack.Screen
                            name="SignUp"
                            component={SignUpScreenWrapper}
                            options={{ animation: 'slide_from_right' }}
                        />
                    </>
                )}
            </Stack.Navigator>
            <StatusBar style="light" />
        </>
    );
}

// --- App Entry -----------------------------------------------------------
export default function App() {
    return (
        <GestureHandlerRootView style={styles.flex}>
            <SafeAreaProvider>
                <Provider store={store}>
                    <NavigationContainer>
                        <RootNavigator />
                    </NavigationContainer>
                </Provider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#0F0F1A',
    },
});
