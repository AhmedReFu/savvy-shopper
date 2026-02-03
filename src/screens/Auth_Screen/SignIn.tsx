import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Images } from '../../constants';
import { AuthStackParamList } from '../../Navigation/types';

const { width, height } = Dimensions.get('window');

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

const SignIn = () => {

    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(true);


    return (
        <SafeAreaView className='flex-1 bg-[#F9F9FB] ' >
            <View className=' px-5 '>
                <View style={styles.logoContainer}>
                    <Image
                        source={Images.Logo}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>
                <ScrollView showsVerticalScrollIndicator={false} >
                    <Text className='text-3xl font-bold'>Welcome to DEALNUX!</Text>
                    <Text className='text-xl text-[#636F85] my-4'>Sign in to track prices and save money. </Text>
                    <Text style={styles.label}>Email address </Text>
                    <View style={styles.passwordContainer} className='border gap-4'>
                        <MaterialIcons name="email" size={24} color="#334155" />
                        <TextInput
                            className='text-xl flex-1'
                            placeholder="Your email ex: yourmail@gamil.com"
                            placeholderTextColor="#A0A0A0"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer} className='border gap-4'>
                        <Entypo name="lock" size={24} color="#334155" />
                        <TextInput
                            className='text-xl flex-1'
                            placeholder="****************"
                            placeholderTextColor="#A0A0A0"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? <Ionicons name="eye-outline" size={24} color="black" /> : <Ionicons name="eye-off-outline" size={24} color="black" />}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.optionsRow}>
                        <TouchableOpacity
                            style={styles.termsContainer}
                            onPress={() => setRememberMe(!rememberMe)}
                        >
                            <View
                                style={[
                                    styles.checkboxSquare,
                                    rememberMe && styles.checkboxSquareChecked,
                                ]}
                            >
                                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.rememberMeText}>
                                Remember Me
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
                            <Text style={styles.forgotPassword}>Forgot Password</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate("MainTabs")}>
                        <Text style={styles.mainButtonText}>Sign In</Text>
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.orText}>Or Login With</Text>
                        <View style={styles.divider} />
                    </View>

                    <View className='flex-row justify-between my-2'>
                        <TouchableOpacity >
                            <Image className='h-16 w-52' source={Images.Google} resizeMode='stretch' />
                            {/* <LoginButton
                                onLoginFinished={(error, result) => {
                                    if (error) {
                                        console.log("Login error:", error);
                                    } else if (result.isCancelled) {
                                        console.log("Login cancelled");
                                    } else {
                                        AccessToken.getCurrentAccessToken().then(async data => {
                                            if (!data) return;

                                            try {
                                                const response = await fetch(
                                                    "https://agen-backend-office.vercel.app/api/v1/auth/facebook",
                                                    {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                        },
                                                        body: JSON.stringify({
                                                            accessToken: data.accessToken,
                                                        }),
                                                    }
                                                );

                                                const json = await response.json();
                                                console.log("Backend login success:", json);
                                            } catch (err) {
                                                console.log("API error:", err);
                                            }
                                        });
                                    }
                                }}
                                onLogoutFinished={() => console.log("Logged out")}
                            /> */}
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <Image className='h-16 w-52' source={Images.Apple} resizeMode='stretch' />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }} className='mb-20'>
                        <Text style={{ fontSize: 18 }}>Don't have an account? </Text>

                        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                            <Text style={{ fontSize: 18, color: "red" }}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView >
    )
}

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
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginRight: 10,
        fontSize: 16,
        color: '#636F85',
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
    passwordInput: {
        flex: 1,
        fontSize: 16,
        color: '#636F85',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        
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