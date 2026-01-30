import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import BackButton from '../../components/BackButton';
import { Images } from '../../constants';
import { AuthStackParamList } from '../../Navigation/types';

const { width, height } = Dimensions.get('window');

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;


const CreateNewPassword = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const [email, setEmail] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [spinnerRotation, setSpinnerRotation] = useState(0);


    useEffect(() => {
        let spinnerInterval: NodeJS.Timeout | undefined;

        if (showSuccessModal) {
            Keyboard.dismiss();
            spinnerInterval = setInterval(() => {
                setSpinnerRotation((prev) => (prev + 45) % 360);
            }, 150);
        } else {
            setSpinnerRotation(0);
        }

        return () => {
            if (spinnerInterval) clearInterval(spinnerInterval);
        };
    }, [showSuccessModal]);

    const spinnerDots = [
        { angle: 0, size: 12, opacity: 1 },
        { angle: 45, size: 11, opacity: 0.9 },
        { angle: 90, size: 10, opacity: 0.8 },
        { angle: 135, size: 9, opacity: 0.6 },
        { angle: 180, size: 8, opacity: 0.4 },
        { angle: 225, size: 7, opacity: 0.3 },
        { angle: 270, size: 6, opacity: 0.2 },
        { angle: 315, size: 6, opacity: 0.1 },
    ];

    if (showSuccessModal) {
        setInterval(() => {
            navigation.navigate("SignIn")
        }, 5000);
    }

    return (
        <SafeAreaView className="bg-[#F9F9FB] flex-1">
            <View className="px-5 flex-1">
                <AppHeader left={() => <BackButton />} />

                <View style={styles.logoContainer}>
                    <Image source={Images.Logo} style={styles.logoImage} resizeMode="contain" />
                </View>

                <View className="mt-10 flex-1">
                    <Text className="text-3xl text-center font-bold">Create New Password</Text>
                    <Text className="text-xl text-center text-[#636F85] my-4">
                        Your password must be different from{'\n'} previous used password.
                    </Text>


                    <Text style={styles.label}>New Password </Text>
                    <View style={styles.passwordContainer} className='border'>
                        <MaterialIcons name="email" size={24} color="#334155" />
                        <TextInput
                            style={styles.input}
                            placeholder="demo@gmail.com"
                            placeholderTextColor="#A0A0A0"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <Text style={styles.label}>Confirm Password</Text>
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


                    <TouchableOpacity
                        style={styles.mainButton}
                        activeOpacity={0.9}
                        onPress={() => setShowSuccessModal(true)}
                    >
                        <Text style={styles.mainButtonText}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                transparent={true}
                animationType="fade"
                visible={showSuccessModal}
                onRequestClose={() => setShowSuccessModal(false)}
            >
                <View style={StyleSheet.absoluteFill}>
                    {/* Blur */}
                    <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />

                    {/* Extra dim layer to make Android look closer to iOS */}
                    <View className='flex-1 items-center justify-center bg-[rgba(0,0,0,0.8)]'>

                        {/* Content */}
                        <View className="flex-1 justify-center items-center px-10">
                            <View className="w-full max-w-[350px]">
                                <View className="bg-white rounded-3xl p-10 items-center shadow-2xl">
                                    <View className="mt-6">
                                        <Image source={Images.Success} resizeMode="contain" />
                                    </View>

                                    <Text className="text-3xl font-bold text-center mt-8 mb-8">
                                        Successful!
                                    </Text>

                                    <Text className="text-xl text-[#636F85] text-center mb-8 leading-6">
                                        Your Password was change successfully
                                    </Text>

                                    {/* Spinner */}
                                    <View className="w-16 h-16 my-8 items-center justify-center">
                                        {spinnerDots.map((dot, index) => {
                                            const angle = (dot.angle + spinnerRotation) * (Math.PI / 180);
                                            const radius = 20;
                                            const x = Math.cos(angle) * radius;
                                            const y = Math.sin(angle) * radius;

                                            return (
                                                <View
                                                    key={index}
                                                    style={{
                                                        position: 'absolute',
                                                        width: dot.size,
                                                        height: dot.size,
                                                        borderRadius: dot.size / 2,
                                                        backgroundColor: '#2355B6',
                                                        opacity: dot.opacity,
                                                        transform: [{ translateX: x }, { translateY: y }],
                                                    }}
                                                />
                                            );
                                        })}
                                    </View>


                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    )
}

export default CreateNewPassword;

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        paddingTop: height * 0,
    },
    logoImage: {
        width: width * 0.4,
        height: height * 0.1,
    },
    otpInput: {
        width: 64,
        height: 64,
        textAlign: 'center',
        borderRadius: 12,
        fontSize: 24,
        fontWeight: 'bold',
        borderWidth: 2,
        backgroundColor: '#FFFFFF',
    },
    optionsRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    rememberMeText: {
        fontSize: 16,
    },
    forgotPassword: {
        fontSize: 16,
    },
    mainButton: {
        backgroundColor: '#2355B6',
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 160,
    },
    mainButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#636F85',
        marginBottom: 8,
        marginTop: 24,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: '#636F85',
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
});