import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppHeader from '../../components/AppHeader'
import BackButton from '../../components/BackButton'

const ProductDetails = () => {

    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    

    const toggleFavorite = (id: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev)
            if (newFavorites.has(id)) {
                newFavorites.delete(id)
            } else {
                newFavorites.add(id)
            }
            return newFavorites
        })
    }
    return (
        <SafeAreaView className="flex-1 bg-[#F9F9FB]">
            <View className="px-5 pb-3">
                <View className="flex-row items-center gap-4 mb-4">
                    <AppHeader left={() => <BackButton />} />
                    <Text className="text-lg font-bold text-gray-900">Product Detail</Text>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                    >
                        <Ionicons
                            name={ "heart" }
                            size={20}
                            color={ "#EF4444" }
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'}}/>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ProductDetails


const styles = StyleSheet.create({
    favoriteButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'white',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
})