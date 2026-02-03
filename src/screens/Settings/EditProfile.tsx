import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BlurView } from 'expo-blur'
import React, { useEffect, useState } from 'react'
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppHeader from '../../components/AppHeader'
import BackButton from '../../components/BackButton'
import { Images } from '../../constants'
import { AuthStackParamList } from '../../Navigation/types'

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;


const EditProfile = () => {
    const navigation = useNavigation<NavigationProp<AuthNavProp>>();

    const [interestsItem, setInterestsItem] = useState<string[]>([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [spinnerRotation, setSpinnerRotation] = useState(0);

    const toggle = (item: string) => {
        setInterestsItem(prev =>
            prev.includes(item)
                ? prev.filter(x => x !== item)
                : [...prev, item]
        );
    };


    if (showSuccessModal) {
        setInterval(() => {
            setShowSuccessModal(false)
        }, 5000);
    }
    const interests = [
        "Grocery", "Electronics", "Pets", "Home", "Beauty", "Fashion", "Automotive"
    ]
    useEffect(() => {
        let spinnerInterval: NodeJS.Timeout | undefined;

        if (showSuccessModal) {

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

    return (
        <SafeAreaView className="bg-[#F9F9FB] flex-1">
            <View className="px-5">
                <View className='flex-row items-center gap-4' >
                    <AppHeader left={() => <BackButton />} middle={() => <Text className='text-lg font-semibold'>Edit Profile</Text>} />

                </View>

                <View>
                    <View className='items-center my-2'>
                        <MaterialCommunityIcons name="account-circle" size={120} color="#E3E3E9" />
                    </View>
                    <MaterialIcons name="add-circle" size={24} color="#2355B6" className='absolute left-64
                  bottom-6 border border-white rounded-full' />
                </View>
                <Text className='text-[#636F85] font-bold text-xl my-2'>Full Name </Text>
                <View className='border rounded-2xl border-[#D1D6DB] flex-row p-2 items-center gap-4 pl-4'>
                    <FontAwesome name="user" size={24} color="#334155" />
                    <TextInput

                        placeholder="Your Name ex: Ahmed ReFat"
                        placeholderTextColor="#A0A0A0"
                        value=''

                    />
                </View>
                <Text className='text-[#636F85] font-bold text-xl my-2'>Email address </Text>
                <View className='border rounded-2xl border-[#D1D6DB] flex-row p-2 items-center gap-4 pl-4'>
                    <MaterialIcons name="email" size={24} color="#334155" />
                    <TextInput
                        placeholder="Your email ex: yourmail@gamil.com"
                        placeholderTextColor="#A0A0A0"
                        value=''
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <Text className='text-[#636F85] font-bold text-xl my-2'>ZIP CODE</Text>
                <View className='border rounded-2xl border-[#D1D6DB] flex-row p-2 items-center gap-4 pl-4'>
                    <Ionicons name="location-sharp" size={26} color="black" />
                    <TextInput
                        value=''
                        placeholder="e.g. 90210"
                    />
                </View>
                <Text className='text-xl my-4'>Interests</Text>
                <View className='flex-row flex-wrap gap-3 my-3'>
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
                <TouchableOpacity style={styles.mainButton} onPress={() => setShowSuccessModal(true)} className='flex-row items-center justify-center gap-4'>
                    <Text style={styles.mainButtonText}>Save Changes</Text>
                </TouchableOpacity>
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
                    <View className='flex-1 items-center justify-center bg-[rgba(0,0,0,0.60)]'>

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

                                        Your profile has been set up successfully.
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

export default EditProfile


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