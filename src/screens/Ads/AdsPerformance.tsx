import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg'

import AppHeader from '../../components/AppHeader'
import BackButton from '../../components/BackButton'



const StatCard = ({ iconBg, icon, iconColor, label, value, delta, deltaPositive }:any) => {
    return (
        <View
            className="bg-white rounded-3xl p-5 flex-1"
            style={{
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 10 },
                elevation: 2,
            }}
        >
            <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: iconBg }}>
                    {icon}
                </View>
                <Text className="ml-3 text-lg font-bold  text-[#6B7280]">
                    {label}
                </Text>
            </View>

            <Text className="mt-3 text-xl font-extrabold text-[#111827]">
                {value}
            </Text>

            <Text className="mt-2 text-[16px] font-semibold" style={{ color: deltaPositive ? '#22C55E' : '#EF4444' }}>
                {delta}
            </Text>
        </View>
    )
}

const Segmented = ({ items, value, onChange }: any) => {
    return (
        <View className="bg-[#EEF0F4] rounded-xl p-1 flex-row">
            {items.map((t:any) => {
                const active = value === t
                return (
                    <Pressable
                        key={t}
                        onPress={() => onChange(t)}
                        className={`flex-1 py-3 rounded-xl items-center justify-center ${active ? 'bg-[#1F56D8]' : 'bg-transparent'
                            }`}
                    >
                        <Text className={`text-lg font-extrabold ${active ? 'text-white' : 'text-[#6B7280]'}`}>
                            {t}
                        </Text>
                    </Pressable>
                )
            })}
        </View>
    )
}

/** Simple SVG line+area chart (same vibe as image) */
const MiniAreaChart = () => {
    // fixed path to look like screenshot trend
    const linePath =
        'M0,120 C40,95 80,110 120,90 C160,70 200,80 240,65 C280,55 320,75 360,60 C400,45 440,55 480,25 C520,10 560,30 600,8'
    const areaPath =
        `${linePath} L600,200 L0,200 Z`

    return (
        <View className="mt-4">
            <View className="h-[150px] rounded-2xl overflow-hidden">
                <Svg width="100%" height="100%" viewBox="0 0 600 200">
                    <Defs>
                        <LinearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#22C55E" stopOpacity="0.25" />
                            <Stop offset="1" stopColor="#22C55E" stopOpacity="0.03" />
                        </LinearGradient>
                    </Defs>

                    {/* dashed grid like image */}
                    <Line x1="0" y1="50" x2="600" y2="50" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="8 8" />
                    <Line x1="0" y1="110" x2="600" y2="110" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="8 8" />
                    <Line x1="0" y1="170" x2="600" y2="170" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="8 8" />

                    {/* area */}
                    <Path d={areaPath} fill="url(#g)" />

                    {/* line */}
                    <Path d={linePath} fill="none" stroke="#22C55E" strokeWidth="4" />
                </Svg>
            </View>

            {/* X labels */}
            <View className="flex-row justify-between px-2 mt-4">
                {['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <Text key={d} className="text-[16px] text-[#6B7280] font-medium">
                        {d}
                    </Text>
                ))}
            </View>
        </View>
    )
}

const RejectNotice = () => {
    return (
        <View className="mt-4 bg-[#FAF1E3] rounded-3xl p-5">
            <View className="flex-row items-start">
                <View className="w-8 h-8 rounded-full bg-[#F59E0B] items-center justify-center">
                    <Ionicons name="information" size={24} color="white" />
                </View>

                <View className="flex-1 ml-4">
                    <Text className="text-lg font-extrabold text-[#F59E0B]">
                        Ad Rejected
                    </Text>
                    <Text className="mt-3 text-sm leading-8 text-[#F59E0B]">
                        Your ad image contains text that covers more than 20% of the image area.
                        Please upload a new image.
                    </Text>
                </View>
            </View>

            <Pressable className="mt-6 bg-[#1F56D8] rounded-2xl py-4 flex-row items-center justify-center">
                <Feather name="edit-2" size={20} color="white" />
                <Text className="text-white text-[18px] font-extrabold ml-3">
                    Edit & Fix
                </Text>
            </Pressable>
        </View>
    )
}

/** ---------- Screen ---------- */

const AdsPerformance = () => {
    const [seg, setSeg] = useState('Clicks')

    const stats = useMemo(() => ([
        {
            label: 'IMPRESSIONS',
            value: '45,201',
            delta: '+ 12%',
            pos: true,
            iconBg: '#FDECEC',
            icon: <Ionicons name="eye" size={20} color="#EF4444" />,
        },
        {
            label: 'CLICKS',
            value: '1,203',
            delta: '−5%',
            pos: false,
            iconBg: '#EAF0FF',
            icon: <MaterialIcons name="ads-click" size={20} color="#1F56D8" />,
        },
        {
           
            label: 'IMPRESSIONS',
            value: '45,201',
            delta: '+ 12%',
            pos: true,
            iconBg: '#EEF2FF',
            icon: <Ionicons name="people" size={20} color="#4F46E5" />,
        },
        {
            label: 'SPEND',
            value: '$450.00',
            delta: '+ 2%',
            pos: true,
            iconBg: '#EAF7EF',
            icon: <Ionicons name="logo-usd" size={20} color="#22C55E" />,
        },
    ]), [])

    return (
        <SafeAreaView className="flex-1 bg-[#F7F7FA]">
          
            <View className="px-5 mb-10">
                
                    {/* Header like image */}
                    <View className="flex-row items-center justify-between ">
                        <View className="flex-row items-center">
                            <AppHeader left={() => <BackButton />} />
                            <Text className="ml-2 text-xl font-extrabold text-[#111827]">
                                Ad Performance
                            </Text>
                        </View>

                        <View className="bg-[#FDECEC] px-4 py-2 rounded-full flex-row items-center">
                            <View className="w-2 h-2 rounded-full bg-[#EF4444] mr-2" />
                            <Text className="text-[#EF4444] text-[16px] font-extrabold">
                                Rejected
                            </Text>
                        </View>
                    </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28,  }}>
                    {/* 2x2 cards */}
                    <View className="mt-4">
                        <View className="flex-row gap-4">
                            <StatCard {...stats[0]} />
                            <StatCard {...stats[1]} />
                        </View>
                        <View className="flex-row gap-4 mt-4">
                            <StatCard {...stats[2]} />
                            <StatCard {...stats[3]} />
                        </View>
                    </View>

                    {/* Price History */}
                    <Text className="mt-2 text-xl font-bold text-[#111827]">
                        Price History
                    </Text>

                    <View className="mt-2">
                        <Segmented
                            items={['Impressions', 'Clicks', 'Reach']}
                            value={seg}
                            onChange={setSeg}
                        />
                    </View>

                    {/* Chart */}
                    <MiniAreaChart />

                    {/* Bottom Reject Notice */}
                    <RejectNotice />
                </ScrollView>
                </View>
            
        </SafeAreaView>
    )
}

export default AdsPerformance
