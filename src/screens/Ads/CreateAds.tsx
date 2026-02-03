import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { NavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BlurView } from 'expo-blur'
import AppHeader from '../../components/AppHeader'
import BackButton from '../../components/BackButton'
import { Images } from '../../constants'
import { AuthStackParamList } from '../../Navigation/types'

const FieldLabel = ({ children }: any) => (
    <Text className="text-[16px] font-semibold text-[#6B7280] mb-2">
        {children}
    </Text>
)

const BoxInput = ({
    placeholder,
    multiline,
    value,
    onChangeText,
    rightIcon,
}:any) => (
    <View className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-3">
        <View className="flex-row items-center">
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                className={`flex-1 text-[18px] text-[#111827] ${multiline ? 'min-h-[96px]' : ''}`}
                multiline={multiline}
                textAlignVertical={multiline ? 'top' : 'center'}
            />
            {rightIcon ? <View className="ml-3">{rightIcon}</View> : null}
        </View>
    </View>
)

const SelectBox = ({ placeholder, rightIcon, onPress }: any) => (
    <Pressable
        onPress={onPress}
        className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-4 flex-row items-center justify-between"
    >
        <Text className="text-[18px] text-[#9CA3AF]">{placeholder}</Text>
        {rightIcon}
    </Pressable>
)

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

const CreateAds = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
    
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [spinnerRotation, setSpinnerRotation] = useState(0);

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [url, setUrl] = useState('')
    const [budget, setBudget] = useState('')

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

useEffect(() => {
        if (!showSuccessModal) return;

        const t = setTimeout(() => {
            setShowSuccessModal(false);
            navigation.reset({
                index: 0,
                routes: [{ name: "MainTabs" as never }],
            });
        }, 3000);

        return () => clearTimeout(t);
    }, [showSuccessModal]);

    return (
        <SafeAreaView className="flex-1 bg-[#F7F7FA]">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header (center title like image) */}
                <View className="px-5 pt-2 pb-2">
                    <View className="flex-row items-center">
                        <View className="w-10">
                            <AppHeader left={() => <BackButton />} />
                           
                        </View>
                        <Text className="text-lg ml-4 font-semibold text-[#111827]">
                            Create Ad
                        </Text>
                        

                        {/* right spacer to keep title centered */}
                        <View className="w-10" />
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24 }}
                >
                    <View className="px-5">
                        {/* Upload Banner box */}
                        <View className="mt-4 bg-white rounded-2xl border border-[#D1D5DB] border-dashed p-6">
                            <Text className="text-[22px] font-extrabold text-[#111827] text-center">
                                Upload Banner
                            </Text>

                            <Text className="text-[16px] text-[#6B7280] text-center mt-3 leading-6">
                                Drag and drop or browse to upload your{'\n'}banner or video.
                            </Text>

                            <Pressable className="mt-6 self-center bg-[#1F56D8] px-6 py-3 rounded-xl flex-row items-center">
                                <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                                <Text className="text-white text-[16px] font-semibold ml-2">
                                    Browse Files
                                </Text>
                            </Pressable>
                        </View>

                        {/* Ad Title */}
                        <View className="mt-8">
                            <FieldLabel>Ad Title</FieldLabel>
                            <BoxInput
                                placeholder="Enter ad title"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        {/* Description */}
                        <View className="mt-6">
                            <FieldLabel>Description</FieldLabel>
                            <BoxInput
                                placeholder="Enter ad description"
                                multiline
                                value={desc}
                                onChangeText={setDesc}
                            />
                        </View>

                        {/* Target Section */}
                        <View className="mt-6">
                            <FieldLabel>Target Section</FieldLabel>
                            <SelectBox
                                placeholder="Select a city"
                                onPress={() => { }}
                                rightIcon={<Ionicons name="chevron-down" size={20} color="#6B7280" />}
                            />
                        </View>

                        {/* Target URL */}
                        <View className="mt-6">
                            <FieldLabel>Target URL</FieldLabel>
                            <BoxInput
                                placeholder="https://dealnux.com/summ......"
                                value={url}
                                onChangeText={setUrl}
                            />
                        </View>

                        {/* Total Budget */}
                        <View className="mt-6">
                            <FieldLabel>Total Budget</FieldLabel>
                            <BoxInput
                                placeholder="$ 0.00"
                                value={budget}
                                onChangeText={setBudget}
                            />
                        </View>

                        {/* Start / End Date */}
                        <View className="mt-6">
                            <View className="flex-row justify-between">
                                <Text className="text-[16px] font-semibold text-[#6B7280] mb-2">
                                    Start Date
                                </Text>
                                <Text className="text-[16px] font-semibold text-[#6B7280] mb-2">
                                    End Date
                                </Text>
                            </View>

                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <SelectBox
                                        placeholder="mm/dd/yyyy"
                                        onPress={() => { }}
                                        rightIcon={<Ionicons name="calendar-outline" size={20} color="#6B7280" />}
                                    />
                                </View>
                                <View className="flex-1">
                                    <SelectBox
                                        placeholder="mm/dd/yyyy"
                                        onPress={() => { }}
                                        rightIcon={<Ionicons name="calendar-outline" size={20} color="#6B7280" />}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Call to Action */}
                        <View className="mt-6">
                            <FieldLabel>Call to Action</FieldLabel>
                            <SelectBox
                                placeholder="Shop Now"
                                onPress={() => { }}
                                rightIcon={<Ionicons name="chevron-down" size={20} color="#6B7280" />}
                            />
                        </View>

                        {/* Submit Button */}
                        <Pressable
                            className="mt-10 bg-[#1F56D8] rounded-2xl py-5 flex-row items-center justify-center"
                            style={{
                                shadowColor: '#000',
                                shadowOpacity: 0.14,
                                shadowRadius: 14,
                                shadowOffset: { width: 0, height: 10 },
                                elevation: 6,
                            }}
                            onPress={()=> setShowSuccessModal(true)}
                        >
                            <Text className="text-white text-[18px] font-extrabold">
                                Submit for approval
                            </Text>
                            <Ionicons name="arrow-forward" size={22} color="white" style={{ marginLeft: 10 }} />
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
                                        Submit Successful!
                                                </Text>
            
                                                <Text className="text-xl text-[#636F85] text-center mb-8 leading-6">
                                       
                                        
                                        If approved, campaign runs automatically.
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

export default CreateAds
