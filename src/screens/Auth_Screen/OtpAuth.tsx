

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../../Navigation/types';
import AppHeader from '../../components/AppHeader';
import BackButton from '../../components/BackButton';
import { Images } from '../../constants';

const { width, height } = Dimensions.get('window');

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;


const OtpAuth = () => {

    const navigation = useNavigation<NavigationProp<AuthNavProp>>();

    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [code, setCode] = useState<string[]>(['', '', '', '']);
    const [timer, setTimer] = useState<number>(60);
    const [spinnerRotation, setSpinnerRotation] = useState<number>(0);
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const inputsRef = useRef<TextInput[]>([]);
   
    useEffect(() => {
        inputsRef.current = inputsRef.current.slice(0, 4);
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        let spinnerInterval: NodeJS.Timeout;

        if (showSuccessModal) {
            // Spinner rotation animation
            
            spinnerInterval = setInterval(() => {
                setSpinnerRotation(prev => (prev + 45) % 360);
            }, 150);
            Keyboard.dismiss();
            // Auto redirect after 3 seconds
            // timer = setTimeout(() => {
            //     setShowSuccessModal(false);
            //     (navigation as any).navigate('SignIn');
            // }, 3000);
        } else {
            setSpinnerRotation(0);
        }

        return () => {
            // if (timer) clearTimeout(timer);
            if (spinnerInterval) clearInterval(spinnerInterval);
        };
    }, [showSuccessModal, navigation]);

    const handleChange = (text: string, index: number) => {
        const numericText = text.replace(/[^0-9]/g, '');
        const newCode = [...code];
        newCode[index] = numericText;
        setCode(newCode);

        // Move to next input if digit is entered and not the last input
        if (numericText && index < 3) {  // Fixed condition
            setTimeout(() => {
                inputsRef.current[index + 1]?.focus();
            }, 10);
        }

        // Auto-submit when last digit is entered
        if (numericText && index === 3) {
            const enteredCode = newCode.join('');
            if (enteredCode.length === 4) {
                handleSubmit(enteredCode);
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            // Only handle backspace when current field is empty
            // Clear previous input and focus it
            const newCode = [...code];
            newCode[index - 1] = '';
            setCode(newCode);
            setTimeout(() => {
                inputsRef.current[index - 1]?.focus();
            }, 10);
        }44
    };

    const handleSubmit = (enteredCode: string) => {
        setIsVerifying(true);
        setShowSuccessModal(true);

    }

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

    return (
        <SafeAreaView className='bg-[#F9F9FB] flex-1' >
          
                <View className='px-5'>
                    <AppHeader
                        left={() => {
                            return <BackButton />
                        }}
                    />
                    <View style={styles.logoContainer}>
                        <Image
                            source={Images.Logo}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                    <View className='text-center mt-10'>
                        <Text className='text-3xl text-center font-bold'>Verification Code</Text>
                        <Text className='text-xl text-center text-[#636F85] my-4'>Enter the verification code that we have sent to your email.</Text>


                        <View className="flex-row justify-between my-10">
                            {code.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    placeholder="0"
                                    placeholderTextColor="#6B7280"
                                    ref={(ref) => {
                                        if (ref) {
                                            inputsRef.current[index] = ref;
                                        }
                                    }}
                                    style={[
                                        styles.otpInput,
                                        { borderColor: digit ? '#2355B6' : '#E5E7EB' }
                                    ]}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    value={digit}
                                    onChangeText={text => handleChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    selectTextOnFocus
                                    autoFocus={index === 0}
                                />
                            ))}
                        </View>


                        <View style={styles.optionsRow}>
                            <View className='flex-row'>
                                <Text style={styles.rememberMeText}>
                                    Didn't receive the code?
                                </Text>
                                <Text style={styles.rememberMeText} className='text-[#EB4335]'> Resend code</Text>
                            </View>
                            <View className='flex-row mt-2'>
                                <Text style={styles.forgotPassword}>Resend code at </Text>
                                <Text style={styles.forgotPassword} className='text-[#2355b6]'>00:59</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.mainButton} className='mt-48'>
                            <Text style={styles.mainButtonText}>Verify OTP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {showSuccessModal && (
                    <View style={StyleSheet.absoluteFill}>
                        {/* Real Blur Background */}
                        <BlurView
                            style={StyleSheet.absoluteFill}
                            tint="dark"
                            intensity={100}
                        />

                        {/* Modal Content */}
                        <View
                            style={StyleSheet.absoluteFill}
                            className="justify-center items-center px-10"
                        >
                            <View className="w-full max-w-[400px]">
                                <View className="bg-white rounded-3xl p-10 items-center shadow-2xl">
                                    {/* Success Icon */}
                                    <View className="mt-6">
                                        <View className="rounded-full justify-center items-center">
                                            <Image source={Images.Success} resizeMode='contain' />
                                        </View>
                                    </View>

                                    {/* Success Title */}
                                    <Text className="text-3xl font-bold text-center mt-8 mb-8">
                                        Successful!
                                    </Text>

                                    {/* Success Subtitle */}
                                    <Text className="text-xl text-[#636F85] text-center mb-8 leading-6">
                                        Your registration was completed{'\n'}successfully
                                    </Text>

                                    {/* Circular Spinner Animation */}
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
                                                        transform: [
                                                            { translateX: x },
                                                            { translateY: y }
                                                        ]
                                                    }}
                                                />
                                            );
                                        })}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
           
        </SafeAreaView >
    )
}

export default OtpAuth;

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
        
    },
    mainButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    
    

    

   
    
    


});