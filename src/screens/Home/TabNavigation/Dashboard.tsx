import { Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons'
import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PriceChart from '../../../components/PieChart'

const Dashboard = () => {
    return (
        <SafeAreaView className="flex-1 bg-[#F9F9FB]">
            <View className="px-5 pb-3 mb-4  ">
                <View className="flex-row items-center gap-4">
                    <Text className="text-lg font-bold text-gray-900">Savings</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className=''>
                    <View className='bg-[#111c34] rounded-3xl py-10 px-16 items-center mt-6'>
                        <Text className='text-white text-lg font-semibold tracking-wider'>
                            TOTAL LIFETIME SAVINGS
                        </Text>

                        <Text className='text-white text-5xl font-bold my-6'>
                            $1,240.50
                        </Text>

                        <View className='flex-row items-center gap-2 bg-white/10 border border-[#BFC5CC33] rounded-full px-3 py-2 mt-3'>
                            <Ionicons name="trending-up" size={18} color="#27C840" />
                            <Text className='text-[#27C840] text-lg font-semibold'>
                                +12.4% vs last month
                            </Text>
                        </View>
                    </View>
                    <View className='flex-row justify-between items-center my-4'>
                        <Text className='text-2xl font-bold'>Savings Trends</Text>
                        <View className='flex-row items-center gap-2 justify-center'>
                            <Text className='bg-[#2355B6] text-white text-xl p-2 px-4 rounded-lg'>30d</Text>
                            <Text className='text-xl'>90d</Text>
                        </View>
                    </View>
                    <PriceChart />
                    <Text className='text-3xl font-bold my-4'>Breakdown</Text>
                    <View className='flex-row justify-between items-center p-4 bg-white rounded-xl'>
                        <View className='flex-row items-center gap-4 justify-center'>
                            <MaterialCommunityIcons className='p-4 bg-[#ffc54946] rounded-full' name="ticket-percent" size={30} color="#FFC649" />
                            <Text className='text-xl'>Coupons applied</Text>
                        </View>
                        <Text className='text-xl font-bold'>$82.40</Text>
                    </View>
                    <View className='flex-row justify-between items-center p-4 bg-white rounded-xl my-4'>
                        <View className='flex-row items-center gap-4 justify-center'>
                            <Octicons className='p-4 bg-[#2354b634] rounded-full' name="arrow-switch" size={30} color="#2355B6" />
                            <Text className='text-xl'>Price comparison</Text>
                        </View>
                        <Text className='text-xl font-bold'>$82.40</Text>
                    </View>
                    <View className='flex-row justify-between items-center p-4 bg-white rounded-xl'>
                        <View className='flex-row items-center gap-4 justify-center'>
                            <MaterialCommunityIcons className='p-4 bg-[#ff4d5023] rounded-full' name="bell-ring" size={30} color="#FF4D4F" />
                            <Text className='text-xl'>Price drop alerts</Text>
                        </View>
                        <Text className='text-xl font-bold'>$82.40</Text>
                    </View>
                    <Text className='text-3xl font-bold my-4'>Recent Activity</Text>
                    <View className='flex-row justify-between items-center p-4 bg-white rounded-xl'>
                        <View className='flex-row items-center gap-4 justify-center'>


                            <MaterialIcons className="p-4 bg-[#f3f4f6e1] rounded-full" name="headphones" size={30} color="#667085" />
                            <View>
                                <Text className='text-xl'>Amazon Headphone</Text>
                                <Text className='text-xl text-[#667085]'>Yesterday</Text>
                            </View>
                        </View>
                        <Text className='text-xl font-bold text-[#27C840]'>Saved $18.50</Text>
                    </View>
                    <View className='flex-row justify-between items-center p-4 bg-white rounded-xl mt-2'>
                        <View className='flex-row items-center gap-4 justify-center'>

                            <MaterialIcons className='p-4 bg-[#f3f4f6e1] rounded-full' name="qr-code-scanner" size={30} color="#667085" />
                            <View>
                                <Text className='text-xl'>Price drop alerts</Text>
                                <Text className='text-xl text-[#667085]'>Yesterday</Text>
                            </View>
                        </View>
                        <Text className='text-xl font-bold text-[#27C840]'>Saved $18.50</Text>
                    </View>
                    <Pressable

                        className="mt-4 bg-[#1D4ED8] rounded-2xl py-5 flex-row items-center justify-center gap-3 mb-20"
                    >
                        <Text className="text-white text-xl font-bold">
                            Explore More Deals
                        </Text>
                    </Pressable>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Dashboard