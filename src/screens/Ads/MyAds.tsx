import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useMemo, useState } from 'react'
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppHeader from '../../components/AppHeader'
import BackButton from '../../components/BackButton'
import { AuthStackParamList } from '../../Navigation/types'

const TABS = ['All', 'Live', 'Pending', 'Rejected']

const ADS = [
    {
        id: '1',
        title: 'Summer Sale – 50% Off\nRunning Gear',
        subtitle: 'Created Oct 24 · ID: #8821',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        statusType: 'live',
    },
    {
        id: '2',
        title: 'Luxury Watch Giveaway\nEvent',
        subtitle: 'Modified 2h ago',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        statusType: 'rejected',
    },
    {
        id: '3',
        title: 'Noise Cancelling Pro\nSeries 5',
        subtitle: 'Submitted Oct 25',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
        statusType: 'pending',
    },
    {
        id: '4',
        title: 'Noise Cancelling Pro\nSeries 5',
        subtitle: 'Submitted Oct 25',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
        statusType: 'live',
    },
]

const badgeConfig = (type: any) => {
    if (type === 'live')
        return { bg: '#EAF7EF', fg: '#2E9B63', text: 'Approved (Live)' }
    if (type === 'rejected')
        return { bg: '#FDECEC', fg: '#E24A4A', text: 'Rejected' }
    return { bg: '#FEF6E7', fg: '#C27A2C', text: 'Pending Review' }
}

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

const MyAds = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const [tab, setTab] = useState('All')

    const list = useMemo(() => {
        if (tab === 'All') return ADS
        if (tab === 'Live') return ADS.filter(x => x.statusType === 'live')
        if (tab === 'Pending') return ADS.filter(x => x.statusType === 'pending')
        return ADS.filter(x => x.statusType === 'rejected')
    }, [tab])

    return (
        <SafeAreaView className="bg-[#F9F9FB] flex-1">
            <View className="px-5 flex-1">
                <View className='flex-row items-center gap-4' >
                    <AppHeader left={() => <BackButton />} />
                    <Text className='text-lg font-bold'>My Ads</Text>

                </View>

                <View className='flex-row justify-between'>
                    {TABS.map((t) => {
                        const active = tab === t
                        return (
                            <Pressable
                                key={t}
                                onPress={() => setTab(t)}
                                className={` px-6  py-3 rounded-full ${active ? 'bg-[#1F56D8]' : 'bg-transparent border border-[#D6DAE2]'
                                    }`}
                            >
                                <Text
                                    className={`text-xl ${active ? 'text-white' : 'text-[#7B8190]'
                                        }`}
                                >
                                    {t}
                                </Text>
                            </Pressable>
                        )
                    })}
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    className="flex-1 mt-4"
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    {list.map((ad) => {
                        const b = badgeConfig(ad.statusType)

                        return (
                            <View
                                key={ad.id}
                                className="bg-white rounded-3xl mb-5 overflow-hidden"
                                style={{

                                    shadowColor: '#000',
                                    shadowOpacity: 0.04,
                                    shadowRadius: 10,
                                    shadowOffset: { width: 0, height: 6 },
                                    elevation: 2,
                                }}
                            >

                                <Pressable className="absolute top-4 right-4 z-10">
                                    <MaterialIcons name="more-horiz" size={24} color="#7A8192" />
                                </Pressable>

                                <View className="p-5">
                                    <View className="flex-row">
                                        <Image
                                            source={{ uri: ad.image }}
                                            className="w-[74px] h-[74px] rounded-2xl"
                                            resizeMode="cover"
                                        />
                                        <View className="flex-1 ml-4 pr-8">
                                            <Text
                                                className="text-[18px] font-semibold text-[#111827] leading-6"
                                                numberOfLines={2}
                                            >
                                                {ad.title}
                                            </Text>
                                            <Text className="text-[13px] text-[#7A8192] mt-2">
                                                {ad.subtitle}
                                            </Text>
                                        </View>
                                    </View>
                                </View>


                                <View className="h-[1px] bg-[#E6E9EF]" />


                                <View className="px-5 py-4 flex-row items-center justify-between">

                                    <View
                                        className="flex-row items-center px-4 py-2 rounded-full"
                                        style={{ backgroundColor: b.bg }}
                                    >
                                        {ad.statusType === 'live' && (
                                            <View
                                                className="w-2 h-2 rounded-full mr-2"
                                                style={{ backgroundColor: b.fg }}
                                            />
                                        )}
                                        {ad.statusType === 'rejected' && (
                                            <Ionicons
                                                name="close-circle"
                                                size={14}
                                                color={b.fg}
                                                style={{ marginRight: 8 }}
                                            />
                                        )}
                                        {ad.statusType === 'pending' && (
                                            <Ionicons
                                                name="hourglass"
                                                size={14}
                                                color={b.fg}
                                                style={{ marginRight: 8 }}
                                            />
                                        )}

                                        <Text className="text-[13px] font-medium" style={{ color: b.fg }}>
                                            {b.text}
                                        </Text>
                                    </View>


                                    <TouchableOpacity disabled={ad.statusType === 'pending'}>
                                        {ad.statusType === 'pending' ? (
                                            <Text className="text-[#9AA1AE] text-[14px] font-medium">
                                                Processing...
                                            </Text>
                                        ) : (
                                            <Pressable className="flex-row items-center"
                                                onPress={() => navigation.navigate("AdsPerformance")}
                                            >
                                                <Text className="text-[#1F56D8] text-[16px] font-semibold mr-2">
                                                    View Details
                                                </Text>
                                                <MaterialIcons name="arrow-forward" size={20} color="#1F56D8" />
                                            </Pressable>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>


                <Pressable
                    className="absolute bottom-8 right-6 w-[62px] h-[62px] rounded-full items-center justify-center bg-[#2F6CF6]"
                    style={{
                        shadowColor: '#000',
                        shadowOpacity: 0.18,
                        shadowRadius: 16,
                        shadowOffset: { width: 0, height: 10 },
                        elevation: 10,
                    }}
                    onPress={() => navigation.navigate("CreateAds")}
                >
                    <Ionicons name="add" size={30} color="#fff" />
                </Pressable>
            </View>

        </SafeAreaView>
    )
}

export default MyAds
