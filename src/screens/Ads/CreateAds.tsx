import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import BackButton from '../../components/BackButton';
import SuccessModal from '../../components/SuccessModal';
import { AuthStackParamList } from '../../Navigation/types';

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

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [url, setUrl] = useState('')
    const [budget, setBudget] = useState('')



    useEffect(() => {
        if (!showSuccessModal) return;

        const t = setTimeout(() => {
            setShowSuccessModal(false);
            navigation.goBack()
        }, 5000); 

        return () => clearTimeout(t);
    }, [showSuccessModal, navigation]);


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
            <SuccessModal
                visible={showSuccessModal}
                title="Submit Successful!"
                description="If approved, campaign runs automatically."
                onClose={() => setShowSuccessModal(false)}
            />
        </SafeAreaView>
    )
}

export default CreateAds
