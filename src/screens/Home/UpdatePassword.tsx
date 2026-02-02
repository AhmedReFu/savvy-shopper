import { Entypo, Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppHeader from '../../components/AppHeader'
import BackButton from '../../components/BackButton'
import { AuthStackParamList } from '../../Navigation/types'

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;


const UpdatePassword = () => {
    const navigation = useNavigation<NavigationProp<AuthNavProp>>();
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <SafeAreaView className="bg-[#F9F9FB] flex-1">
            <View className="px-5 flex-1">
                <View className='flex-row items-center gap-4' >
                    <AppHeader left={() => <BackButton />} />
                    <Text className='text-lg'>Change Password</Text>

                </View>

                <Text className='text-[#636F85] font-bold text-xl my-2'>Old Password</Text>
                <View className='border rounded-2xl border-[#D1D6DB] flex-row p-2 items-center gap-4 pl-4 justify-between mb-4'>
                    <View className='flex-row items-center gap-5 justify-center'>
                        <Entypo name="lock" size={24} color="#334155" />
                        <TextInput
                            placeholder="****************"
                            placeholderTextColor="#A0A0A0"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                    </View>
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Ionicons name="eye-outline" size={24} color="black" /> : <Ionicons name="eye-off-outline" size={24} color="black" />}
                    </TouchableOpacity>
                </View>
                <Text className='text-[#636F85] font-bold text-xl my-2'>New Password</Text>
                <View className='border rounded-2xl border-[#D1D6DB] flex-row p-2 items-center gap-4 pl-4 justify-between mb-4'>
                    <View className='flex-row items-center gap-5 justify-center'>
                        <Entypo name="lock" size={24} color="#334155" />
                        <TextInput
                            placeholder="****************"
                            placeholderTextColor="#A0A0A0"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                    </View>
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Ionicons name="eye-outline" size={24} color="black" /> : <Ionicons name="eye-off-outline" size={24} color="black" />}
                    </TouchableOpacity>
                </View>
                <Text className='text-[#636F85] font-bold text-xl my-2'>Confirm Password</Text>
                <View className='border rounded-2xl border-[#D1D6DB] flex-row p-2 items-center gap-4 pl-4 justify-between mb-56'>
                    <View className='flex-row items-center gap-5 justify-center'>
                        <Entypo name="lock" size={24} color="#334155" />
                        <TextInput
                            placeholder="****************"
                            placeholderTextColor="#A0A0A0"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                    </View>
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Ionicons name="eye-outline" size={24} color="black" /> : <Ionicons name="eye-off-outline" size={24} color="black" />}
                    </TouchableOpacity>
                </View>




                <TouchableOpacity style={styles.mainButton} className='flex-row items-center justify-center gap-4'>
                    <Text style={styles.mainButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default UpdatePassword


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