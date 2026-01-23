
import { Entypo, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Images } from '../../constants';
import { AuthStackParamList } from '../../Navigation/types';

const { width, height } = Dimensions.get('window');

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

const SignUp = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(true);


    return (
        <SafeAreaView className='bg-[#F9F9FB] flex-1' >
            <View>
                <View style={styles.logoContainer}>
                    <Image
                        source={Images.Logo}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>
                <View className=' px-5'>
                    <Text className='text-3xl font-bold'>Sign up</Text>
                    <Text className='text-xl text-[#636F85] my-2'>Welcome, let's get you signed up.
                    </Text>
                    <Text style={styles.label}>Full Name </Text>
                    <View style={styles.passwordContainer} className='border'>
                        <FontAwesome name="user" size={24} color="#334155" />
                        <TextInput
                            style={styles.input}
                            placeholder="Your Name ex: Ahmed ReFat"
                            placeholderTextColor="#A0A0A0"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <Text style={styles.label}>Email address </Text>
                    <View style={styles.passwordContainer} className='border'>
                        <MaterialIcons name="email" size={24} color="#334155" />
                        <TextInput
                            style={styles.input}
                            placeholder="Your email ex: yourmail@gamil.com"
                            placeholderTextColor="#A0A0A0"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer} className='border'>
                        <Entypo name="lock" size={24} color="#334155" />
                        <TextInput
                            style={styles.passwordInput}
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


                    <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate("OtpAuth")}>
                        <Text style={styles.mainButtonText}>Sign Up</Text>
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.orText}>Or Sign Up With</Text>
                        <View style={styles.divider} />
                    </View>

                    <View className='flex-row justify-between my-2'>
                        <TouchableOpacity >
                            <Image className='h-16 w-52' source={Images.Google} resizeMode='stretch'/>
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <Image className='h-16 w-52' source={Images.Apple} resizeMode='stretch' />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
                        <Text style={{ fontSize: 18 }}>Already have an account? </Text>

                        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                            <Text style={{ fontSize: 18, color: "red" }}>Sign In</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>


        </SafeAreaView >
    )
}

export default SignUp;

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
        marginTop:16,
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
        marginTop: 20,
        marginBottom: 24,
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