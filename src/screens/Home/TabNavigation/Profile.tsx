import {
    AntDesign,
    Feather,
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthStackParamList } from "../../../Navigation/types";

const Card = ({ children, className = "" }: any) => (
    <View className={`bg-white rounded-2xl shadow-sm shadow-black/10 ${className}`}>
        {children}
    </View>
);

const PaymentMethodModal = ({
    visible,
    onClose,
    onAddCard,
    onConfirm,
}: {
    visible: boolean;
    onClose: () => void;
    onAddCard: () => void;
    onConfirm: () => void;
}) => {
    return (
        <Modal transparent visible={visible} animationType="fade">

            <Pressable onPress={onClose} className="flex-1 bg-black/40" />


            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[28px] px-6 pt-4 pb-7 items-center justify-center">
                

                <View className="bg-[#2354b62a] rounded-full p-4 items-center justify-center mx-auto mb-4">
                    <View className="bg-[#2354b62a] rounded-full p-5 items-center justify-center">
                        <Ionicons name="help-circle" size={40} color="#2355B6" />
                  </View>
                </View>
                <Text className="text-3xl font-bold text-[#2D2D2D] text-center mb-4">
                    Logout
                </Text>
                <Text className="text-xl text-center mb-5">
                    Are you sure you want
                    to log out?
                </Text>

                <View className="flex-row gap-5 items-center justify-center my-5">
                    <TouchableOpacity onPress={onClose} className="bg-[#2354b623] rounded-2xl px-6 py-3 mt-5">
                        <Text className="text-black font-bold text-xl">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  className="bg-[#2355B6] rounded-2xl px-6 py-3 mt-5" >
                        <Text className="text-white font-bold text-xl">Yes, Logout </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const QuickCard = ({ icon, title, iconBg = "#EEF2FF", onPress }: any) => (
    <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        className="flex-1 bg-white rounded-2xl py-5 items-center justify-center shadow-sm shadow-black/10"
    >
        <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: iconBg }}>
            {icon}
        </View>
        <Text className="mt-3 text-base font-bold text-[#2D2D2D]">{title}</Text>
    </TouchableOpacity>
);

const RowItem = ({ leftIcon, title, rightIcon = true, onPress }: any) => (
    <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        className="flex-row items-center justify-between py-4"
    >
        <View className="flex-row items-center gap-3">
            <View className="w-9 h-9 rounded-full bg-[#F3F4F6] items-center justify-center">
                {leftIcon}
            </View>
            <Text className="text-[15px] text-[#2D2D2D] font-semibold">{title}</Text>
        </View>

        {rightIcon ? (
            <Feather name="external-link" size={18} color="#636F85" />
        ) : null}
    </TouchableOpacity>
);

const Divider = () => <View className="h-[1px] bg-[#EEF0F3]" />;

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

const Profile = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();


    const [payOpen, setPayOpen] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    return (
        <SafeAreaView className="flex-1 bg-[#F9F9FB]">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-5 pb-10">
                    {/* Header */}
                    <View className="items-center mt-2 mb-5">
                        <Text className="text-lg font-bold text-[#2D2D2D]">My Profile</Text>
                    </View>

                    {/* Avatar */}
                    <View className="items-center">
                        <View className="w-28 h-28 rounded-full bg-white items-center justify-center shadow-sm shadow-black/10">
                            <MaterialCommunityIcons name="account" size={64} color="#D1D6DB" />
                        </View>

                        <View className="absolute right-[120px] top-[78px]">
                            <View className="bg-white rounded-full p-[2px]">
                                <MaterialIcons name="add-circle" size={26} color="#2355B6" />
                            </View>
                        </View>
                    </View>

                    <Text className="text-2xl font-extrabold text-center mt-4 text-[#2D2D2D]">
                        Ahmed ReFat
                    </Text>
                    <Text className="text-sm text-center mt-1 text-[#636F85] font-semibold">
                        developer.mdnazmul@gmail.com
                    </Text>

                    {/* Quick actions */}
                    <View className="flex-row gap-4 mt-6">
                        <QuickCard
                            title="My Favourite"
                            icon={<Ionicons name="heart" size={20} color="#EF4444" />}
                            iconBg="#FEE2E2"
                            onPress={() => navigation.navigate("MyFavourite")}
                        />
                        <QuickCard
                            title="Subscription"
                            icon={<Ionicons name="diamond" size={20} color="#2563EB" />}
                            iconBg="#DBEAFE"
                            onPress={() => navigation.navigate("Subscription")}
                        />
                    </View>

                    <View className="flex-row gap-4 mt-4">
                        <QuickCard
                            title="Refer & Earn"
                            icon={<Ionicons name="gift" size={20} color="#F59E0B" />}
                            iconBg="#FEF3C7"
                            onPress={() => navigation.navigate("ReFarAndEarn")}
                        />
                        <QuickCard
                            title="Review App"
                            icon={<Ionicons name="star" size={20} color="#F59E0B" />}
                            iconBg="#FEF3C7"
                        />
                    </View>

                    {/* Advertise with us */}
                    <Card className="mt-5 px-4">
                        <RowItem
                            title="Advertise with us"
                            leftIcon={<FontAwesome5 name="paint-brush" size={16} color="#2355B6" />}
                            onPress={()=> navigation.navigate("MyAds")}
                        />
                    </Card>

                    {/* Personal Information */}
                    <Card className="mt-5 px-4 pt-4">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-base font-bold text-[#2D2D2D]">Personal Information</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
                                <MaterialIcons name="edit" size={18} color="#636F85" />
                            </TouchableOpacity>
                        </View>

                        <RowItem
                            title="Ahmed ReFat"
                            rightIcon={false}
                            leftIcon={<Ionicons name="person" size={16} color="#636F85" />}
                        />
                        <Divider />
                        <RowItem
                            title="developer.mdnazmul@gmail.com"
                            rightIcon={false}
                            leftIcon={<MaterialCommunityIcons name="email-outline" size={16} color="#636F85" />}
                        />
                        <Divider />
                        <RowItem
                            title="Gulshan 1, Dhaka, Bangladesh"
                            rightIcon={false}
                            leftIcon={<Ionicons name="location-outline" size={16} color="#636F85" />}
                        />
                        <Divider />
                        <RowItem
                            title="Grocery, Home"
                            rightIcon={false}
                            leftIcon={<MaterialCommunityIcons name="dots-grid" size={16} color="#636F85" />}
                        />
                    </Card>

                    {/* Settings */}
                    <Card className="mt-5 px-4 pt-4">
                        <Text className="text-base font-bold text-[#2D2D2D] mb-2">Settings</Text>

                        <RowItem
                            title="Notifications"
                            leftIcon={<Ionicons name="notifications-outline" size={16} color="#636F85" />}
                            onPress={() => navigation.navigate("NotificationSettings")}
                        />
                        <Divider />

                        <RowItem
                            title="Change Password"
                            leftIcon={<Ionicons name="key-outline" size={16} color="#636F85" />}
                            onPress={() => navigation.navigate("UpdatePassword")}
                        />

                    </Card>

                    {/* Company */}
                    <Card className="mt-5 px-4 pt-4">
                        <Text className="text-base font-bold text-[#2D2D2D] mb-2">Company</Text>

                        <RowItem
                            title="About Us"
                            leftIcon={<Ionicons name="information-circle-outline" size={16} color="#636F85" />}
                        />
                        <Divider />
                        <RowItem
                            title="Contact Us"
                            leftIcon={<Ionicons name="person-circle-outline" size={16} color="#636F85" />}
                        />
                        <Divider />
                        <RowItem
                            title="Video Demo"
                            leftIcon={<Ionicons name="videocam-outline" size={16} color="#636F85" />}
                        />
                        <Divider />
                        <RowItem
                            title="Press"
                            leftIcon={<MaterialCommunityIcons name="newspaper-variant-outline" size={16} color="#636F85" />}
                        />
                        <Divider />
                        <RowItem
                            title="Events"
                            leftIcon={<Ionicons name="calendar-outline" size={16} color="#636F85" />}
                        />
                    </Card>

                    {/* Legal */}
                    <Card className="mt-5 px-4 pt-4">
                        <Text className="text-base font-bold text-[#2D2D2D] mb-2">Legal</Text>

                        <RowItem
                            title="Privacy policy"
                            leftIcon={<MaterialCommunityIcons name="shield-check-outline" size={16} color="#636F85" />}
                            onPress={() => navigation.navigate("PrivacyPolicy")}
                        />
                        <Divider />
                        <RowItem
                            title="Terms of Service"
                            leftIcon={<MaterialCommunityIcons name="music-note-outline" size={16} color="#636F85" />}
                        />
                    </Card>

                    {/* Connect */}
                    <Card className="mt-5 px-4 pt-4">
                        <Text className="text-base font-bold text-[#2D2D2D] mb-3">Connect</Text>

                        <View className="flex-row justify-between px-1 mb-3">
                            <View className="w-10 h-10 rounded-full bg-[#F3F4F6] items-center justify-center">
                                <Ionicons name="logo-whatsapp" size={20} color="#636F85" />
                            </View>
                            <View className="w-10 h-10 rounded-full bg-[#F3F4F6] items-center justify-center">
                                <Ionicons name="logo-tiktok" size={20} color="#636F85" />
                            </View>
                            <View className="w-10 h-10 rounded-full bg-[#F3F4F6] items-center justify-center">
                                <AntDesign name="x" size={18} color="#636F85" />
                            </View>
                            <View className="w-10 h-10 rounded-full bg-[#F3F4F6] items-center justify-center">
                                <Ionicons name="logo-facebook" size={20} color="#636F85" />
                            </View>
                            <View className="w-10 h-10 rounded-full bg-[#F3F4F6] items-center justify-center">
                                <Ionicons name="logo-youtube" size={20} color="#636F85" />
                            </View>
                            <View className="w-10 h-10 rounded-full bg-[#F3F4F6] items-center justify-center">
                                <Ionicons name="logo-instagram" size={20} color="#636F85" />
                            </View>
                        </View>

                        <Divider />

                        <RowItem
                            title="Request Our Services"
                            leftIcon={<MaterialCommunityIcons name="file-document-outline" size={16} color="#636F85" />}
                        />
                    </Card>

                    {/* Logout */}
                    <TouchableOpacity
                        activeOpacity={0.85}
                        className="mt-5 bg-white rounded-2xl px-4 py-4 flex-row items-center gap-3 shadow-sm shadow-black/10 mb-8"
                        onPress={() => setPayOpen(true)}
                    >
                        <View className="w-9 h-9 rounded-full bg-[#FEE2E2] items-center justify-center">
                            <MaterialCommunityIcons name="logout" size={18} color="#EF4444" />
                        </View>
                        <Text className="text-[15px] font-bold text-[#EF4444]">Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <PaymentMethodModal
                visible={payOpen}
                onClose={() => setPayOpen(false)}
                onAddCard={() => {

                    setPayOpen(false);
                }}
                onConfirm={() => {

                    setShowSuccessModal(true);
                    setPayOpen(false);
                }}
            />
        </SafeAreaView>
    );
};

export default Profile;
