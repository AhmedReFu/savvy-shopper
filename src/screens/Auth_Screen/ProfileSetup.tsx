import { Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppHeader from '../../components/AppHeader'
import BackButton from '../../components/BackButton'
import SuccessModal from '../../components/SuccessModal'
import { AuthStackParamList } from '../../Navigation/types'

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;


const ProfileSetup = () => {
        const navigation = useNavigation<NavigationProp<AuthNavProp>>();
    
    const [interestsItem, setInterestsItem] = useState<string[]>([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const toggle = (item: string) => {
        setInterestsItem(prev =>
            prev.includes(item)
                ? prev.filter(x => x !== item)
                : [...prev, item]
        );
    };


    useEffect(() => {
        if (!showSuccessModal) return;

        const t = setTimeout(() => {
            setShowSuccessModal(false);
            navigation.reset({
                index: 0,
                routes: [{ name: "MainTabs" as never }],
            });
        }, 5000);

        return () => clearTimeout(t);
    }, [showSuccessModal]);


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
                <View>
                    <View className='items-center my-2'>
                        <MaterialCommunityIcons name="account-circle" size={120} color="#E3E3E9" />
                    </View>
                    <MaterialIcons name="add-circle" size={24} color="#2355B6" className='absolute left-60
                  bottom-6 border border-white rounded-full' />
                </View>
                <Text className='text-[#2355B6] text-xl font-bold text-center'>
                    Upload Photo
                </Text>

                <Text className='text-[#636F85] text-xl my-2'>Location Address</Text>
                <View className='border rounded-2xl border-[#D1D6DB] flex-row p-2 items-center gap-4'>
                    <Ionicons name="location-sharp" size={26} color="black" />
                    <TextInput
                        className='text-lg flex-1'
                        placeholder="Gulshan 1, Dhaka 1200"
                    />
                </View>
                <Text className='text-[#636F85] text-xl my-2 mt-6'>Referral Code</Text>
                <View className='border rounded-2xl border-[#D1D6DB] flex-row p-2 items-center gap-4 pl-4'>
                    <MaterialCommunityIcons name="account" size={26} color="black" />
                    <TextInput
                        value=''
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
                <TouchableOpacity style={styles.mainButton} onPress={()=> setShowSuccessModal(true)}  className='flex-row items-center justify-center gap-4'>
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