import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import BackButton from '../../components/BackButton';
import SuccessModal from '../../components/SuccessModal';
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


    useEffect(() => {
        if (!showSuccessModal) return;

        const t = setTimeout(() => {
            setShowSuccessModal(false);
            navigation.reset({
                index: 0,
                routes: [{ name: "SignIn" }],
            });
        }, 5000); 

        return () => clearTimeout(t);
    }, [showSuccessModal, navigation]);


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

            <SuccessModal
                visible={showSuccessModal}
                title="Successful!"
                description="Your password is change successfully"
                onClose={() => setShowSuccessModal(false)}
            />

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