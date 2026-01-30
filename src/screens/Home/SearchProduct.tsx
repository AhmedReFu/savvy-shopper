import { AntDesign, EvilIcons, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthStackParamList } from '../../Navigation/types'

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

const { width } = Dimensions.get('window')

const SearchProduct = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const [favorites, setFavorites] = useState<Set<string>>(new Set())

    const recommendedProducts = [
        {
            id: '3',
            name: 'Bose QuietComfort 45 Wireless Noise Cancelling',
            price: 252,
            originalPrice: 420,
            discount: '-45%',
            image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
            seller: 'Amazon'
        },
        {
            id: '4',
            name: 'Sony WH-1000XM5',
            price: 299,
            originalPrice: 399,
            discount: '-40%',
            image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
            seller: 'Best Buy'
        },
        {
            id: '5',
            name: 'Sony WH-1000XM5',
            price: 252,
            originalPrice: 420,
            discount: '-45%',
            image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
            seller: 'Amazon'
        },
        {
            id: '6',
            name: 'Sony Earbuds',
            price: 199,
            originalPrice: 249,
            discount: '-20%',
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
            seller: 'Best Buy'
        }
    ]

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

    const ProductCard = ({ product }: any) => {
        const isFavorite = favorites.has(product.id)

        return (
            <View style={styles.productCard}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.image }}
                        style={styles.productImage}
                        resizeMode="stretch"
                    />
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{product.discount}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => toggleFavorite(product.id)}
                    >
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={20}
                            color={isFavorite ? "#EF4444" : "#64748B"}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                        {product.name}
                    </Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>${product.price}</Text>
                        <Text style={styles.originalPrice}>${product.originalPrice}</Text>
                    </View>
                    <View style={styles.sellerRow}>
                        <MaterialIcons name="storefront" size={16} color="#94A3B8" />
                        <Text style={styles.sellerText}>{product.seller}</Text>
                        <MaterialIcons name="arrow-forward" size={16} color="#94A3B8" />
                    </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.searchContainer}>
                    <EvilIcons name="search" size={40} color="#94A3B8" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Wireless Headphones"
                        placeholderTextColor="#94A3B8"
                    />
                    <TouchableOpacity style={styles.closeButton}>
                        <AntDesign name="close" size={14} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {recommendedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    )
}

export default SearchProduct;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9FB',
        paddingHorizontal: 20,
    },
    headerContainer: {
    },
    scrollContent: {
    },

    // Search
    searchContainer: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginVertical: 20,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        paddingHorizontal: 8,
    },
    closeButton: {
        backgroundColor: '#64748B',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Product Card
    productCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    imageContainer: {
        position: 'relative',
        height: 220,
        backgroundColor: '#E2E8F0',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    discountBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#FCD34D',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    discountText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'white',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productInfo: {
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
        lineHeight: 22,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2563EB',
    },
    originalPrice: {
        fontSize: 16,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
    },
    sellerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    sellerText: {
        fontSize: 14,
        color: '#94A3B8',
        flex: 1,
    },
})