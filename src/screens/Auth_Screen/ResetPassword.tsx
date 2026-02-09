import { FORGOT_PASSWORD, IPA_BASE } from '@env';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import BackButton from '../../components/BackButton';
import { Images } from '../../constants';
import { AuthStackParamList } from '../../Navigation/types';

const { width, height } = Dimensions.get('window');

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

const API_BASE_URL = IPA_BASE;
const END_POINTS = FORGOT_PASSWORD;

const ResetPassword = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);


    const hadnleResetPassword = async () => {
        if (!email.trim()) {
            Alert.alert('Missing info', 'Please enter email.');
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${API_BASE_URL}${END_POINTS}`,
                {
                    email: email.trim().toLowerCase(),
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 15000,
                },
            );

            const data = res.data;

            if (data?.success === true) {

                setTimeout(() => {

                    navigation.navigate(
                        'OtpResetPassword',
                        { email: email.trim().toLowerCase() } as any,
                    );
                }, 1500);
            } else {
                Alert.alert('Reset Password failed', data?.message || 'Invalid credentials');
            }
        } catch (e: any) {
            const msg =
                e?.response?.data?.message || e?.message || 'Something went wrong';
            Alert.alert('Reset Password Failed', msg);
        } finally {
            setLoading(false);
        }
    };

  return (
      <SafeAreaView className="bg-[#F9F9FB] flex-1">
          <View className="px-5 flex-1">
              <AppHeader left={() => <BackButton />} />

              <View style={styles.logoContainer}>
                  <Image source={Images.Logo} style={styles.logoImage} resizeMode="contain" />
              </View>

              <View className="mt-10 flex-1">
                  <Text className="text-3xl text-center font-bold">Reset Password</Text>
                  <Text className="text-xl text-center text-[#636F85] my-4">
                      Enter your email, we will send a verification
                      code to your email.
                  </Text>

                  
                  <Text style={styles.label}>Email address </Text>
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
                  <View className='h-30 w-40'>
                     
                  </View>

                  <TouchableOpacity
                      style={styles.mainButton}
                      activeOpacity={0.9}
                      onPress={hadnleResetPassword}
                  >
                      <Text style={styles.mainButtonText}>
                          Continue
                      </Text>
                  </TouchableOpacity>
              </View>
          </View>

         
      </SafeAreaView>
  )
}

export default ResetPassword;

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
        marginTop: 200,
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
    passwordContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
});