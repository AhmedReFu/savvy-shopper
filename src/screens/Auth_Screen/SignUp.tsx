import { IPA_BASE, REGISTER } from '@env';
import { Entypo, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Images } from '../../constants';
import { AuthStackParamList } from '../../Navigation/types';

const { width, height } = Dimensions.get('window');

const API_BASE_URL = IPA_BASE
const END_POINTS = REGISTER


const SignUp = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!name.trim()) return 'Name required';
        if (!email.trim()) return 'Email required';
        if (!password) return 'Password required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        return null;
    };

    const handleSignUp = async () => {
        const err = validate();
        if (err) {
            Alert.alert('Error', err);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(
                `${API_BASE_URL}${END_POINTS}`,
                {
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    password: password,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 15000,
                }
            );
            const data = res.data;
            Alert.alert('Success', data?.message ?? 'Account created');
            navigation.navigate('OtpAuth', {
                email: email.trim().toLowerCase(),
            } as any);

        } catch (e: any) {
            const msg =
                e?.response?.data?.message ||
                e?.message ||
                'Something went wrong';
            Alert.alert('Sign up failed', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className='bg-[#F9F9FB] flex-1'>
            <View className=' px-5'>
                <View style={styles.logoContainer}>
                    <Image source={Images.Logo} style={styles.logoImage} resizeMode="contain" />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className='text-3xl font-bold'>Sign up</Text>
                    <Text className='text-xl text-[#636F85] my-2'>Welcome, let's get you signed up.</Text>

                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.passwordContainer} className='border gap-4'>
                        <FontAwesome name="user" size={24} color="#334155" />
                        <TextInput
                            className='text-xl flex-1'
                            placeholder="Your Name ex: Ahmed ReFat"
                            placeholderTextColor="#A0A0A0"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <Text style={styles.label}>Email address</Text>
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
                    <View style={styles.passwordContainer} className='border gap'>
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
                            {showPassword
                                ? <Ionicons name="eye-outline" size={24} color="black" />
                                : <Ionicons name="eye-off-outline" size={24} color="black" />}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.mainButton, { opacity: loading ? 0.7 : 1 }]}
                        disabled={loading}
                        onPress={handleSignUp}
                    >
                        {loading ? <ActivityIndicator /> : <Text style={styles.mainButtonText}>Sign Up</Text>}
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.orText}>Or Sign Up With</Text>
                        <View style={styles.divider} />
                    </View>

                    <View className='flex-row justify-between my-2'>
                        <TouchableOpacity>
                            <Image className='h-16 w-52' source={Images.Google} resizeMode='stretch' />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image className='h-16 w-52' source={Images.Apple} resizeMode='stretch' />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }} className='mb-10'>
                        <Text style={{ fontSize: 18 }}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                            <Text style={{ fontSize: 18, color: "red" }}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        paddingTop: height * 0.02
    },

    logoImage: {
        width: width * 0.6,
        height: height * 0.2
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#636F85',
        marginBottom: 8,
        marginTop: 16
    },
    mainButton: {
        backgroundColor: '#2355B6',
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 16
    },
    mainButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF'
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0'
    },
    orText: {
        fontSize: 16,
        color: '#666666',
        marginHorizontal: 16
    },
    passwordContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center'
    },
});
