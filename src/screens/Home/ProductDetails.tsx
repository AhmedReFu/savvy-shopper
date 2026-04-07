// ProductDetails.tsx
import {
    ADD_CART,
    ADD_FAVORITE,
    COMPARE_PRODUCT,
    IPA_BASE,
    PRODUCT_DETAILS,
    REMOVE_FAVORITE,
} from '@env'
import {
    Entypo,
    Feather,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageSourcePropType,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppHeader from '../../components/AppHeader'
import BackButton from '../../components/BackButton'
import ChatModal from '../../components/ChatModal'
import { Toast, useToast } from '../../components/useToost'
import { Images } from '../../constants'
import { AuthStackParamList } from '../../Navigation/types'

const API_BASE_URL = IPA_BASE

type RouteParams = { productId: string | number }

const KNOWN_PLATFORMS = [
    'amazon',
    'walmart',
    'aliexpress',
    'bestbuy',
    'best buy',
    'sephora',
    'target',
    'ebay',
]

const isKnownPlatform = (name: string) =>
    KNOWN_PLATFORMS.some((p) => name?.toLowerCase().includes(p))

type ProductListing = {
    id: number | string
    platform_name: string
    platform_code?: string
    price: string
    currency?: string
    original_price?: string
    discount_percentage?: string
    condition?: string
    free_shipping?: boolean
    shipping_cost?: string
    total_price?: number
    external_url?: string
    is_available?: boolean
}

type ProductData = {
    id: number | string
    title: string
    slug?: string
    platform_name: string
    description?: string
    category?: string | null
    brand?: string
    main_image?: string
    images?: string[]
    lowest_price?: number
    listings?: ProductListing[]
    is_active?: boolean
    created_at?: string
    is_favorite?: boolean
    is_cart?: boolean
}

type CompareItem = {
    platform: string
    platform_code?: string
    product_id?: number
    listing_id?: string
    clean_title?: string
    price: number
    total_price: number
    url?: string
    main_image?: string
    seller?: string
}

type CompareData = {
    price_comparison: CompareItem[]
    best_deal?: CompareItem
    price_analysis?: {
        lowest_price: number
        highest_price: number
        potential_savings: number
    }
}

const getPlatformLogo = (platformName: string): ImageSourcePropType | null => {
    const name = platformName?.toLowerCase() ?? ''
    if (name.includes('amazon')) return Images.Amazon
    if (name.includes('walmart')) return Images.Wallmart
    if (name.includes('aliexpress')) return Images.Aliexpress
    if (name.includes('bestbuy') || name.includes('best buy')) return Images.BestBuy
    return null
}

const ProductDetails = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
    const route = useRoute()
    const { productId } = route.params as RouteParams
    const toast = useToast()

    const [chatModalVisible, setChatModalVisible] = useState(false)
    const [product, setProduct] = useState<ProductData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [isFavorite, setIsFavorite] = useState(false)
    const [favLoading, setFavLoading] = useState(false)

    const [isInCart, setIsInCart] = useState(false)
    const [cartLoading, setCartLoading] = useState(false)

    const [compareData, setCompareData] = useState<CompareData | null>(null)
    const [compareLoading, setCompareLoading] = useState(false)

    const fetchProductDetails = async () => {
        if (!productId) {
            setError('Product id missing')
            return
        }

        try {
            setLoading(true)
            setError('')

            const token = await AsyncStorage.getItem('vToken')
            const url = `${API_BASE_URL}${PRODUCT_DETAILS}${productId}/detail/`

            const response = await axios.get(url, {
                headers: {
                    Accept: 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            })

            const productData: ProductData = response?.data?.data ?? response?.data
            setProduct(productData)
            setIsFavorite(productData?.is_favorite === true)
            setIsInCart(productData?.is_cart === true)
        } catch (err: any) {
            console.log('product details error', err?.response?.data || err?.message)
            setError('Failed to load product details')
        } finally {
            setLoading(false)
        }
    }

    const fetchCompare = async (slug: string) => {
        if (!slug) return

        try {
            setCompareLoading(true)

            const token = await AsyncStorage.getItem('vToken')
            const url = `${API_BASE_URL}${COMPARE_PRODUCT}${slug}/`

            const response = await axios.get(url, {
                headers: {
                    Accept: 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            })

            const data: CompareData = response?.data?.data ?? response?.data
            setCompareData(data)
        } catch (err: any) {
            console.log('compare error', err?.response?.data || err?.message)
        } finally {
            setCompareLoading(false)
        }
    }

    useEffect(() => {
        fetchProductDetails()
    }, [productId])

    useEffect(() => {
        if (product?.slug) {
            fetchCompare(product.slug)
        }
    }, [product?.slug])

    const toggleFavorite = async () => {
        const token = await AsyncStorage.getItem('vToken')
        if (!token) {
            toast.show({ message: 'Token missing', type: 'error', style: 'top' })
            return
        }

        setFavLoading(true)

        try {
            if (isFavorite) {
                await axios.delete(`${API_BASE_URL}${REMOVE_FAVORITE}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    data: { product_id: Number(productId) },
                })
                setIsFavorite(false)
                toast.show({ message: 'Removed from favorites', type: 'success', style: 'top' })
            } else {
                await axios.post(
                    `${API_BASE_URL}${ADD_FAVORITE}`,
                    { product_id: Number(productId) },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                )
                setIsFavorite(true)
                toast.show({ message: 'Added to favorites', type: 'success', style: 'top' })
            }
        } catch (error: any) {
            const msg: string = error?.response?.data?.message || ''
            const status: number = error?.response?.status

            if (status === 400 && msg.toLowerCase().includes('already in favorites')) {
                setIsFavorite(true)
                return
            }

            toast.show({ message: msg || 'Favorite update failed', type: 'error', style: 'top' })
        } finally {
            setFavLoading(false)
        }
    }

    const handleAddToCart = async () => {
        if (isInCart) return

        const token = await AsyncStorage.getItem('vToken')
        if (!token) {
            toast.show({ message: 'Token missing', type: 'error', style: 'top' })
            return
        }

        if (!mainListing?.id) {
            toast.show({ message: 'No listing available', type: 'error', style: 'top' })
            return
        }

        setCartLoading(true)

        try {
            await axios.post(
                `${API_BASE_URL}${ADD_CART}`,
                { product_id: Number(productId) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            )

            setIsInCart(true)
            toast.show({ message: 'Added to cart successfully', type: 'success', style: 'top' })
        } catch (error: any) {
            const msg: string = error?.response?.data?.message || ''
            toast.show({ message: msg || 'Failed to add to cart', type: 'error', style: 'top' })
        } finally {
            setCartLoading(false)
        }
    }

    const openUrl = async (url?: string) => {
        if (!url) return
        const supported = await Linking.canOpenURL(url)
        if (supported) await Linking.openURL(url)
        else toast.show({ message: 'Cannot open this URL', type: 'error', style: 'top' })
    }

    const mainListing = useMemo(() => product?.listings?.[0], [product])

    const sortedListings = useMemo(() => {
        if (!product?.listings) return []
        return [...product.listings].sort(
            (a, b) => (a.total_price ?? Number(a.price)) - (b.total_price ?? Number(b.price))
        )
    }, [product])

    const sortedCompare = useMemo(() => {
        if (!compareData?.price_comparison) return []
        return [...compareData.price_comparison].sort((a, b) => a.total_price - b.total_price)
    }, [compareData])

    const imageSource = product?.main_image
        ? { uri: product.main_image }
        : { uri: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' }

    const isAvailable = mainListing?.is_available === true

    const getListingAction = (item: ProductListing) => {
        const hasUrl = !!item.external_url
        return hasUrl ? 'view' : 'cart'
    }

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#F9F9FB]">
                <View className="px-5 pb-3 mb-4 border-b-2 border-[#E5E7EB]">
                    <View className="flex-row items-center gap-4">
                        <AppHeader left={() => <BackButton />} />
                        <Text className="text-lg font-bold text-gray-900">Product Detail</Text>
                    </View>
                </View>

                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#2355B6" />
                    <Text className="mt-3 text-[#636F85]">Loading product details...</Text>
                </View>
            </SafeAreaView>
        )
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-[#F9F9FB]">
                <View className="px-5 pb-3 mb-4 border-b-2 border-[#E5E7EB]">
                    <View className="flex-row items-center gap-4">
                        <AppHeader left={() => <BackButton />} />
                        <Text className="text-lg font-bold text-gray-900">Product Detail</Text>
                    </View>
                </View>

                <View className="flex-1 items-center justify-center px-5">
                    <Text className="text-red-500 text-lg font-semibold">{error}</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F9F9FB]">
            <View className="px-5 pb-3 mb-4 border-b-2 border-[#E5E7EB]">
                <View className="flex-row items-center gap-4">
                    <AppHeader left={() => <BackButton />} />
                    <Text className="text-lg font-bold text-gray-900">Product Detail</Text>

                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={toggleFavorite}
                        disabled={favLoading}
                    >
                        {favLoading ? (
                            <ActivityIndicator size="small" color="#EF4444" />
                        ) : (
                            <Ionicons
                                name={isFavorite ? 'heart' : 'heart-outline'}
                                size={20}
                                color="#EF4444"
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                    style={{ width: '100%', height: 300 }}
                    source={imageSource}
                    resizeMode="cover"
                />

                <View className="px-5">
                    <View className="flex-row justify-between items-center mt-4">
                        <View className="w-56">
                            <Text className="text-xl font-bold">
                                {product?.title || 'No title found'}
                            </Text>
                        </View>

                        <View>
                            <View className="items-center">
                                <Entypo name="shop" size={20} color="#2355B6" />
                                <Text className="text-xl text-[#2355B6] font-bold self-end">
                                    {product?.platform_name}
                                </Text>
                            </View>

                            <View className="bg-[#27C8401A] p-2 rounded-full mt-2 flex-row items-center justify-center gap-2">
                                <MaterialIcons name="verified" size={20} color="#137C0A" />
                                <Text className="text-[#137C0A] font-medium">
                                    {mainListing?.condition || 'N/A'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="border-2 border-[#E5E7EB] p-5 rounded-2xl my-5 bg-white">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-[#636F85] text-xl">LOWEST PRICE FOUND</Text>
                            <Text className="bg-[#FFC649] p-2 rounded-xl">BEST DEAL</Text>
                        </View>

                        <View className="flex-row items-end gap-2 my-2">
                            <Text className="text-4xl text-[#2355B6] font-bold">
                                ${product?.lowest_price ?? mainListing?.price ?? '0.00'}
                            </Text>

                            {!!mainListing?.original_price && Number(mainListing.original_price) > 0 && (
                                <Text className="text-[#A1A8B3] text-xl line-through">
                                    ${mainListing.original_price}
                                </Text>
                            )}
                        </View>

                        {!!mainListing?.discount_percentage &&
                            Number(mainListing.discount_percentage) > 0 && (
                                <Text className="text-[#34C759] text-xl">
                                    You save {Math.round(Number(mainListing.discount_percentage))}%
                                </Text>
                            )}

                        <Text className="text-[#34C759] text-xl">
                            {mainListing?.free_shipping
                                ? 'Free Shipping Available'
                                : mainListing?.shipping_cost
                                    ? 'Shipping Cost: ' + mainListing?.shipping_cost
                                    : ''}
                        </Text>

                        <View className="mt-4 flex-row items-center gap-2">
                            <Pressable className="bg-[#e1e6eb] px-6 py-4 rounded-xl">
                                <MaterialCommunityIcons
                                    name="open-in-new"
                                    size={30}
                                    color="#334155"
                                />
                                <Text className="text-[#636F85]">Share</Text>
                            </Pressable>

                            {mainListing?.external_url ? (
                                <Pressable
                                    onPress={() => openUrl(mainListing.external_url)}
                                    className="rounded-xl p-6 flex-row items-center gap-2 ml-auto"
                                    style={{ backgroundColor: '#2355B6' }}
                                >
                                    <MaterialCommunityIcons
                                        name="open-in-new"
                                        size={26}
                                        color="white"
                                    />
                                    <Text className="text-white text-2xl font-bold">View</Text>
                                </Pressable>
                            ) : (
                                <Pressable
                                    onPress={handleAddToCart}
                                    disabled={cartLoading || !isAvailable || isInCart}
                                        className="rounded-xl p-6 flex-row items-center gap-2 ml-auto"
                                        style={{
                                            backgroundColor: isInCart ? '#16A34A' : '#2355B6',
                                            opacity: cartLoading || !isAvailable ? 0.6 : 1,
                                        }}
                                    >
                                        {cartLoading ? (
                                            <ActivityIndicator size="small" color="white" />
                                        ) : (
                                            <Feather
                                                name={isInCart ? 'check-circle' : 'shopping-cart'}
                                                size={26}
                                                color="white"
                                            />
                                        )}
                                        <Text className="text-white text-2xl font-bold">
                                            {cartLoading
                                                ? 'Adding...'
                                                : isInCart
                                                    ? 'Already in Cart'
                                                    : 'Add to Cart'}
                                        </Text>
                                    </Pressable>
                            )}
                        </View>
                    </View>

                    <View className="border-2 border-[#E5E7EB] p-5 rounded-2xl my-5 bg-white">
                        <Text className="text-2xl font-bold mb-3">Description</Text>
                        <Text className="text-[#636F85] text-base leading-6">
                            {product?.description?.trim()
                                ? product.description
                                : 'No description available for this product.'}
                        </Text>
                    </View>

                    {(compareLoading || sortedCompare.length > 0) && (
                        <>
                            <View className="flex-row items-center justify-between my-4">
                                <Text className="text-2xl font-bold">Price Comparison</Text>
                                {sortedCompare.length > 0 && (
                                    <Text className="text-sm text-[#636F85]">
                                        {sortedCompare.length} stores
                                    </Text>
                                )}
                            </View>

                            {compareLoading ? (
                                <View className="items-center py-6">
                                    <ActivityIndicator size="large" color="#2355B6" />
                                    <Text className="mt-2 text-[#636F85]">
                                        Finding best prices...
                                    </Text>
                                </View>
                            ) : (
                                <>
                                    {compareData?.price_analysis &&
                                        compareData.price_analysis.potential_savings > 0 && (
                                            <View style={styles.savingsBanner}>
                                                <MaterialIcons
                                                    name="savings"
                                                    size={20}
                                                    color="#16A34A"
                                                />
                                                <Text style={styles.savingsText}>
                                                    Save up to $
                                                    {compareData.price_analysis.potential_savings.toFixed(
                                                        2
                                                    )}
                                                </Text>
                                                </View>
                                            )}

                                        <FlatList
                                            data={sortedCompare}
                                            keyExtractor={(item, index) =>
                                                String(item.listing_id ?? item.product_id ?? index)
                                            }
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{
                                                paddingBottom: 24,
                                                paddingRight: 8,
                                            }}
                                            ItemSeparatorComponent={() => (
                                                <View style={{ width: 14 }} />
                                            )}
                                            renderItem={({ item }) => {
                                                const displayName =
                                                    item.clean_title ||
                                                    item.seller ||
                                                    item.platform ||
                                                    'Unknown Store'
                                                const storeName =
                                                    item.seller || item.platform || 'Store'

                                                return (
                                                    <Pressable
                                                        onPress={() => openUrl(item.url)}
                                                        style={styles.compareCard}
                                                    >
                                                        <View style={styles.compareHeartBtn}>
                                                            <Ionicons
                                                                name="heart-outline"
                                                                size={18}
                                                                color="#9CA3AF"
                                                            />
                                                        </View>

                                                        <View style={styles.compareImageWrap}>
                                                            {item.main_image ? (
                                                                <Image
                                                                    source={{ uri: item.main_image }}
                                                                    style={styles.compareImage}
                                                                    resizeMode="cover"
                                                                />
                                                            ) : (
                                                                <View style={styles.compareImageFallback}>
                                                                    <MaterialIcons
                                                                        name="image-not-supported"
                                                                        size={28}
                                                                        color="#9CA3AF"
                                                                    />
                                                                </View>
                                                            )}
                                                        </View>

                                                        <View style={styles.compareBody}>
                                                            <Text
                                                                numberOfLines={2}
                                                                style={styles.compareTitle}
                                                            >
                                                                {displayName}
                                                            </Text>

                                                            <Text style={styles.comparePrice}>
                                                                $
                                                                {Number(
                                                                    item.total_price ?? item.price ?? 0
                                                                ).toFixed(2)}
                                                            </Text>

                                                            <View style={styles.compareFooter}>
                                                                <View style={styles.compareStoreWrap}>
                                                                    <MaterialIcons
                                                                        name="storefront"
                                                                        size={14}
                                                                        color="#9CA3AF"
                                                                    />
                                                                    <Text
                                                                        numberOfLines={1}
                                                                        style={styles.compareStoreText}
                                                                    >
                                                                        {storeName}
                                                                    </Text>
                                                                </View>

                                                                <View style={styles.compareArrowWrap}>
                                                                    <MaterialCommunityIcons
                                                                        name="arrow-right"
                                                                        size={18}
                                                                        color="#9CA3AF"
                                                                    />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </Pressable>
                                                )
                                        }}
                                    />
                                </>
                            )}
                        </>
                    )}

                    {/* ok */}
                </View>
            </ScrollView>

            <ChatModal
                visible={chatModalVisible}
                onClose={() => setChatModalVisible(false)}
            />

            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                fadeAnim={toast.fadeAnim}
                buttons={toast.buttons}
                style={toast.style}
                onHide={toast.hide}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    favoriteButton: {
        marginLeft: 'auto',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF1F2',
        alignItems: 'center',
        justifyContent: 'center',
    },

    savingsBanner: {
        backgroundColor: '#ECFDF3',
        borderWidth: 1,
        borderColor: '#BBF7D0',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    savingsText: {
        color: '#15803D',
        fontSize: 14,
        fontWeight: '700',
        flex: 1,
    },

    compareCard: {
        width: 170,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 8,
    },
    compareHeartBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    compareImageWrap: {
        width: '100%',
        height: 138,
        backgroundColor: '#F8FAFC',
    },
    compareImage: {
        width: '100%',
        height: '100%',
    },
    compareImageFallback: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    compareBody: {
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 10,
    },
    compareTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        lineHeight: 20,
        minHeight: 40,
    },
    comparePrice: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        marginTop: 8,
    },
    compareFooter: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    compareStoreWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    compareStoreText: {
        marginLeft: 4,
        fontSize: 13,
        color: '#9CA3AF',
        flexShrink: 1,
    },
    compareArrowWrap: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },

    listingCard: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        position: 'relative',
    },
    listingCardBest: {
        borderColor: '#2355B6',
        shadowColor: '#2355B6',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    bestPriceBadge: {
        position: 'absolute',
        top: -10,
        left: 14,
        backgroundColor: '#2355B6',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        zIndex: 2,
    },
    bestPriceText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    listingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    logoImage: {
        width: 34,
        height: 34,
    },
    listingInfo: {
        flex: 1,
        paddingRight: 8,
    },
    listingPlatformName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    listingShipping: {
        fontSize: 13,
        color: '#64748B',
    },
    listingRight: {
        alignItems: 'flex-end',
    },
    priceCol: {
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    listingPrice: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
    },
    listingPriceBest: {
        color: '#2355B6',
    },
    listingOriginal: {
        fontSize: 12,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
        marginTop: 2,
    },
    listingDiscount: {
        fontSize: 12,
        color: '#16A34A',
        fontWeight: '700',
        marginTop: 2,
    },
    listingBtn: {
        backgroundColor: '#2355B6',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        minWidth: 86,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listingBtnSecondary: {
        backgroundColor: '#EFF6FF',
    },
    listingBtnCart: {
        backgroundColor: '#16A34A',
    },
    listingBtnText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },
    listingBtnTextSecondary: {
        color: '#2355B6',
    },
})

export default ProductDetails