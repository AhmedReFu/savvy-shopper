import { IPA_BASE, PROFILE_SETUP } from '@env'
import { Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker'
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppHeader from '../../components/AppHeader'
import BackButton from '../../components/BackButton'
import SuccessModal from '../../components/SuccessModal'
import { AuthStackParamList } from '../../Navigation/types'

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

const API_BASE_URL = IPA_BASE;
const END_POINTS = PROFILE_SETUP;
interface RouteParams {
    email?: string;
}

const ProfileSetup = () => {
    const navigation = useNavigation<NavigationProp<AuthNavProp>>();
    const route = useRoute();

    const params = route.params as RouteParams;
    const [interestsItem, setInterestsItem] = useState<string[]>([]);
    const [image, setImage] = useState<any>(null);
    const [address, setAddress] = useState<string>('');
    const [referCode, setReFerCode] = useState<string>('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const toggle = (item: string) => {
        setInterestsItem(prev =>
            prev.includes(item)
                ? prev.filter(x => x !== item)
                : [...prev, item]
        );
    };

    const pickImage = async () => {

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
        });

        setImage(result);

    };
    const handleSubmit = async () => {
        if (!image || image.canceled || !image.assets?.[0]) {
            Alert.alert('Error', 'Please select a profile picture');
            return;
        }

        const selectedImage = image.assets[0];


        const formData = new FormData();
        formData.append('email', params.email || '');
        formData.append('address', address);
        formData.append('interests', JSON.stringify(interestsItem));
        formData.append('refaradal_code', referCode)


        formData.append('profile_picture', {
            uri: selectedImage.uri,
            type: selectedImage.mimeType || 'image/jpeg',
            name: selectedImage.fileName || 'profile.jpg',
        } as any);
        console.log(formData)
        try {
            const res = await axios.post(
                `${API_BASE_URL}${END_POINTS}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 15000,
                }
            );

            const data = res.data;
            if (data?.success === true) {
                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false);
                    (navigation as any).navigate('SignIn' as any);
                }, 5000);
            } else {
                const msg = data?.message || 'Invalid Information';
                Alert.alert('Profile Set', msg);

            }
        } catch (e: any) {
            const msg =
                e?.response?.data?.message ||
                e?.message ||
                'Something went wrong';

            Alert.alert('Profile Set Failed', msg);


        }
    }



    // useEffect(() => {
    //     if (!showSuccessModal) return;

    //     const t = setTimeout(() => {
    //         setShowSuccessModal(false);
    //         navigation.reset({
    //             index: 0,
    //             routes: [{ name: "MainTabs" as never }],
    //         });
    //     }, 5000);

    //     return () => clearTimeout(t);
    // }, [showSuccessModal]);




    const interests = [
        "Grocery", "Electronics", "Pets", "Home", "Beauty", "Fashion", "Automotive"
    ]

    return (
        <SafeAreaView className="bg-[#F9F9FB] flex-1">
            <View className="px-5 flex-1">
                <View className='flex-row items-center gap-4' >
                    <AppHeader left={() => <BackButton />} />
                    <Text className='text-lg'>Profile Update</Text>

                </View>

                <Text className='text-2xl font-bold'>Let's get to know you</Text>
                <Text className='text-xl my-2'>Customize your feed to see the best deals
                    near you,</Text>
                <TouchableOpacity onPress={pickImage}>
                    <View className='items-center my-2'>
                        <MaterialCommunityIcons name="account-circle" size={120} color="#E3E3E9" />
                    </View>
                    <MaterialIcons name="add-circle" size={24} color="#2355B6" className='absolute left-60
                  bottom-6 border border-white rounded-full' />
                </TouchableOpacity>
                <Text className='text-[#2355B6] text-xl font-bold text-center'>
                    Upload Photo
                </Text>

                <Text className='text-[#636F85] text-xl my-2'>Location Address</Text>
                <View className='border rounded-2xl border-[#D1D6DB] flex-row p-2 items-center gap-4'>
                    <Ionicons name="location-sharp" size={26} color="black" />
                    <TextInput
                        className='text-lg flex-1'
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Gulshan 1, Dhaka 1200"
                    />
                </View>
                <Text className='text-[#636F85] text-xl my-2 mt-6'>Referral Code</Text>
                <View className='border rounded-2xl border-[#D1D6DB] flex-row p-2 items-center gap-4 pl-4'>
                    <MaterialCommunityIcons name="account" size={26} color="black" />
                    <TextInput
                        value={referCode}
                        onChangeText={setReFerCode}
                        className='text-lg flex-1'
                        placeholder="Enter Referral Code (Optional)"
                    />
                </View>
                <Text className='text-xl my-5'>Interests</Text>
                <View className='flex-row flex-wrap gap-3 my-2'>
                    {interests.map((data, index) => {
                        const active = interestsItem.includes(data);

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => toggle(data)}
                                className={`border-2 rounded-full py-3 px-6 ${active ? "border-[#2355B6] bg-[#EEF4FF]" : "border-[#D1D6DB]"
                                    }`}
                            >
                                <Text className={`text-lg ${active ? "text-[#2355B6] font-semibold" : ""}`}>
                                    {data}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <TouchableOpacity style={styles.mainButton} onPress={handleSubmit} className='flex-row items-center justify-center gap-4'>
                    <Text style={styles.mainButtonText}>Save & Continue</Text>

                    <Fontisto name="arrow-right-l" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <SuccessModal
                visible={showSuccessModal}
                title="Successful!"
                description="Your profile has been set up successfully."
                onClose={() => setShowSuccessModal(false)}
            />
        </SafeAreaView>
    )
}

export default ProfileSetup


const styles = StyleSheet.create({
    mainButton: {
        backgroundColor: '#2355B6',
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 16,
    },
    mainButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
})