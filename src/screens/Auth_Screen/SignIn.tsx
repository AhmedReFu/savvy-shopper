import { IPA_BASE, LOGIN } from '@env';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import * as AppleAuthentication from 'expo-apple-authentication';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SuccessModal from '../../components/SuccessModal';
import { Images } from '../../constants';
import { AuthStackParamList } from '../../Navigation/types';

const { width, height } = Dimensions.get('window');

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

const API_BASE_URL = IPA_BASE;
const END_POINTS = LOGIN;

const SignIn = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Load remembered data on mount
    useEffect(() => {
        const loadRememberedData = async () => {
            try {
                const savedRememberMe = await AsyncStorage.getItem('rememberMe');
                if (savedRememberMe !== null) {
                    const rememberMeValue = JSON.parse(savedRememberMe);
                    setRememberMe(rememberMeValue);

                    if (rememberMeValue) {
                        const savedEmail = await AsyncStorage.getItem('rememberedEmail');
                        if (savedEmail) setEmail(savedEmail);
                    }
                }
            } catch (error) {
                console.error('Error loading remembered data:', error);
            }
        };

        loadRememberedData();
    }, []);

    // Save remember me data
    const handleRememberMeChange = async (value: boolean) => {
        setRememberMe(value);

        try {
            await AsyncStorage.setItem('rememberMe', JSON.stringify(value));

            if (value && email.trim()) {
                await AsyncStorage.setItem('rememberedEmail', email.trim().toLowerCase());
            } else if (!value) {
                await AsyncStorage.removeItem('rememberedEmail');
            }
        } catch (error) {
            console.error('Error saving remember me data:', error);
        }
    };

    // Load remembered email on focus
    useFocusEffect(
        useCallback(() => {
            const loadRememberedEmail = async () => {
                try {
                    if (rememberMe) {
                        const savedEmail = await AsyncStorage.getItem('rememberedEmail');
                        if (savedEmail) setEmail(savedEmail);
                    }
                } catch (error) {
                    console.error('Error loading remembered email:', error);
                }
            };

            loadRememberedEmail();
        }, [rememberMe]),
    );

    // Keep storage synced if user edits email while rememberMe ON
    useEffect(() => {
        const syncEmail = async () => {
            try {
                if (rememberMe) {
                    if (email.trim()) {
                        await AsyncStorage.setItem('rememberedEmail', email.trim().toLowerCase());
                    } else {
                        await AsyncStorage.removeItem('rememberedEmail');
                    }
                }
            } catch (e) {
                console.error('Error syncing remembered email:', e);
            }
        };
        syncEmail();
    }, [email, rememberMe]);

    const handleAppleSignIn = async () => {
        try {
            if (Platform.OS !== 'ios') {
                Alert.alert('Apple Sign-In', 'Apple Sign-In is available on iOS only.');
                return;
            }

            const available = await AppleAuthentication.isAvailableAsync();
            if (!available) {
                Alert.alert('Apple Sign-In', 'Apple Sign-In is not available on this device.');
                return;
            }

            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            const identityToken = credential.identityToken;
            if (!identityToken) {
                Alert.alert('Apple Sign-In', 'identityToken not found. Please try again.');
                return;
            }

            const res = await fetch(
                'https://agen-backend-office.vercel.app/api/v1/auth/appleLogin',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ identityToken }),
                },
            );

            const data = await res.json();

            if (!res.ok) {
                Alert.alert('Login Failed', data?.message || 'Apple login failed');
                return;
            }

            navigation.navigate('MainTabs');
        } catch (e: any) {
            if (e?.code === 'ERR_REQUEST_CANCELED') return;
            Alert.alert('Apple Sign-In Error', e?.message || 'Something went wrong');
        }
    };

    const handleSignInEmail = async () => {
        if (!email.trim() || !password) {
            Alert.alert('Missing info', 'Please enter email and password.');
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${API_BASE_URL}${END_POINTS}`,
                {
                    email: email.trim().toLowerCase(),
                    password,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 15000,
                },
            );

            const data = res.data;

            if (data?.success === true) {
                // Save email if rememberMe ON (extra safety)
                if (rememberMe) {
                    await AsyncStorage.setItem('rememberedEmail', email.trim().toLowerCase());
                }

                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false);
                    navigation.navigate(
                        'MainTabs',
                        { email: email.trim().toLowerCase() } as any,
                    );
                }, 1500);
            } else {
                Alert.alert('Sign in failed', data?.message || 'Invalid credentials');
            }
        } catch (e: any) {
            const msg =
                e?.response?.data?.message || e?.message || 'Something went wrong';
            Alert.alert('Sign in failed', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F9F9FB]">
            <View className="px-5">
                <View style={styles.logoContainer}>
                    <Image source={Images.Logo} style={styles.logoImage} resizeMode="contain" />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="text-3xl font-bold">Welcome to DEALNUX!</Text>
                    <Text className="text-xl text-[#636F85] my-4">
                        Sign in to track prices and save money.
                    </Text>

                    <Text style={styles.label}>Email address</Text>
                    <View style={styles.passwordContainer} className="border gap-4">
                        <MaterialIcons name="email" size={24} color="#334155" />
                        <TextInput
                            className="text-xl flex-1"
                            placeholder="Your email ex: yourmail@gmail.com"
                            placeholderTextColor="#A0A0A0"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer} className="border gap-4">
                        <Entypo name="lock" size={24} color="#334155" />
                        <TextInput
                            className="text-xl flex-1"
                            placeholder="****************"
                            placeholderTextColor="#A0A0A0"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                                <Ionicons name="eye-outline" size={24} color="black" />
                            ) : (
                                <Ionicons name="eye-off-outline" size={24} color="black" />
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.optionsRow}>
                        <TouchableOpacity
                            style={styles.termsContainer}
                            onPress={() => handleRememberMeChange(!rememberMe)}
                        >
                            <View
                                style={[
                                    styles.checkboxSquare,
                                    rememberMe && styles.checkboxSquareChecked,
                                ]}
                            >
                                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.rememberMeText}>Remember Me</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
                            <Text style={styles.forgotPassword}>Forgot Password</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.mainButton, loading && { opacity: 0.7 }]}
                        onPress={handleSignInEmail}
                        disabled={loading}
                    >
                        <Text style={styles.mainButtonText}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.orText}>Or Login With</Text>
                        <View style={styles.divider} />
                    </View>

                    <View className="flex-row justify-between my-2">
                        <TouchableOpacity>
                            <Image className="h-16 w-52" source={Images.Google} resizeMode="stretch" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleAppleSignIn}>
                            <Image className="h-16 w-52" source={Images.Apple} resizeMode="stretch" />
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}
                        className="mb-20"
                    >
                        <Text style={{ fontSize: 18 }}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={{ fontSize: 18, color: 'red' }}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            <SuccessModal
                visible={showSuccessModal}
                title="Successful!"
                description="You have signed in successfully."
                onClose={() => setShowSuccessModal(false)}
            />
        </SafeAreaView>
    );
};

export default SignIn;

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        paddingTop: height * 0.02,
    },
    logoImage: {
        width: width * 0.6,
        height: height * 0.2,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#636F85',
        marginBottom: 8,
        marginTop: 16,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    rememberMeText: {
        fontSize: 16,
        color: '#666666',
    },
    forgotPassword: {
        fontSize: 16,
        color: '#E74C3C',
    },
    mainButton: {
        backgroundColor: '#2355B6',
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 0,
    },
    mainButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    orText: {
        fontSize: 16,
        color: '#666666',
        marginHorizontal: 16,
    },
    passwordContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 16,
        marginBottom: 16,
    },
    checkboxSquare: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#1A4D5C',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    checkboxSquareChecked: {
        backgroundColor: '#2355B6',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
});
