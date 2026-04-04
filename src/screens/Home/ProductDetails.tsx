import { ADD_CART, ADD_FAVORITE, IPA_BASE, PRODUCT_DETAILS, REMOVE_FAVORITE } from '@env'
import { Entypo, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Image, ImageSourcePropType, Linking, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppHeader from '../../components/AppHeader'
import BackButton from '../../components/BackButton'
import ChatModal from '../../components/ChatModal'
import { Toast, useToast } from '../../components/useToost'
import { Images } from '../../constants'
import { AuthStackParamList } from '../../Navigation/types'

const API_BASE_URL = IPA_BASE;
const END_POINTS = { PRODUCT_DETAILS, ADD_CART };
// dynamic url hobe ".../fetch-products/products/:id/detail/" akahne id ta param jabe, token e kaj korbe

type RouteParams = {
    productId: string | number
}

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
    description?: string
    category?: string | null
    brand?: string
    main_image?: string
    images?: string[]
    lowest_price?: number
    listings?: ProductListing[]
    is_active?: boolean
    created_at?: string
    is_favorite?: boolean   // ✅ API থেকে আসে
    is_cart?: boolean       // ✅ API থেকে আসে
}

// ── Platform logo helper ──────────────────────────────────────────────────────
// known platform গুলোর জন্য Images থেকে logo দেখাবে
// বাকি সবার জন্য fallback — shop icon দেখাবে
const getPlatformLogo = (platformName: string): ImageSourcePropType | null => {
    const name = platformName?.toLowerCase() ?? ''
    if (name.includes('amazon')) return Images.Amazon
    if (name.includes('walmart')) return Images.Wallmart
    if (name.includes('aliexpress')) return Images.Aliexpress
    if (name.includes('bestbuy') || name.includes('best buy')) return Images.BestBuy
    return null // null হলে shop icon দেখাবে
}

const ProductDetails = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
    const route = useRoute()

    // error aser type er — fixed kora hoyeche, ekhon RouteParams diye properly type kora
    const { productId } = route.params as RouteParams
    console.log(productId)
    const toast = useToast()

    const [chatModalVisible, setChatModalVisible] = useState(false)
    const [product, setProduct] = useState<ProductData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // ── Favorite state ────────────────────────────────────────────────────────
    const [isFavorite, setIsFavorite] = useState(false)
    const [favLoading, setFavLoading] = useState(false)

    // ── Cart state ────────────────────────────────────────────────────────────
    const [isInCart, setIsInCart] = useState(false)
    const [cartLoading, setCartLoading] = useState(false)

    // ── Fetch product details ─────────────────────────────────────────────────
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

            // ✅ API থেকে আসা is_favorite দিয়ে initial state set করো
            // true হলে heart red, false হলে grey
            setIsFavorite(productData?.is_favorite === true)

            // ✅ API থেকে আসা is_cart দিয়ে initial state set করো
            // true হলে "Already in Cart" দেখাবে, false হলে "Add to Cart"
            setIsInCart(productData?.is_cart === true)

        } catch (err: any) {
            console.log('product details error', err?.response?.data || err?.message || err)
            setError('Failed to load product details')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProductDetails()
    }, [productId])

    // ── Toggle Favorite ───────────────────────────────────────────────────────
    const toggleFavorite = async () => {
        const token = await AsyncStorage.getItem('vToken')
        if (!token) {
            toast.show({ message: 'Token missing', type: 'error', style: 'top' })
            return
        }

        setFavLoading(true)

        try {
            if (isFavorite) {
                // DELETE — axios.delete এ body পাঠাতে data key লাগে
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
                // POST — body তে product_id
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

            // backend bug: already favorite কিন্তু is_favorite:false আসে
            // এই case এ error না দেখিয়ে UI correct করো
            if (status === 400 && msg.toLowerCase().includes('already in favorites')) {
                setIsFavorite(true)
                return
            }

            console.error('fav toggle error', error?.response?.data || error)
            toast.show({ message: msg || 'Favorite update failed', type: 'error', style: 'top' })
        } finally {
            setFavLoading(false)
        }
    }

    // ── Add to Cart ───────────────────────────────────────────────────────────
    // API: POST fetch-products/cart/
    // body: { product_id, selected_listing (listing id), quantity }
    const handleMainAction = async () => {
        // ✅ already cart এ থাকলে আর call করবে না
        if (isInCart) return

        const token = await AsyncStorage.getItem('vToken')
        if (!token) {
            toast.show({ message: 'Token missing', type: 'error', style: 'top' })
            return
        }

        // mainListing না থাকলে cart এ add করা যাবে না
        if (!mainListing?.id) {
            toast.show({ message: 'No listing available', type: 'error', style: 'top' })
            return
        }

        setCartLoading(true)

        try {
            await axios.post(
                `${API_BASE_URL}${ADD_CART}`,
                {
                    product_id: Number(productId),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            )

            // ✅ success হলে isInCart true করো — button "Already in Cart" এ change হবে
            setIsInCart(true)
            toast.show({ message: 'Added to cart successfully', type: 'success', style: 'top' })
        } catch (error: any) {
            const msg: string = error?.response?.data?.message || ''
            console.error('cart error', error?.response?.data || error)
            toast.show({ message: msg || 'Failed to add to cart', type: 'error', style: 'top' })
        } finally {
            setCartLoading(false)
        }
    }

    //pore thik korbo oije product view er
    /* if (mainListing?.external_url) {
        await openUrl(mainListing.external_url)
    } */

    // ── Derived values ────────────────────────────────────────────────────────
    const mainListing = useMemo(() => {
        return product?.listings?.[0]
    }, [product])

    // ✅ listings sort করা — lowest price সবার আগে
    const sortedListings = useMemo(() => {
        if (!product?.listings) return []
        return [...product.listings].sort(
            (a, b) => (a.total_price ?? Number(a.price)) - (b.total_price ?? Number(b.price))
        )
    }, [product])

    const openUrl = async (url?: string) => {
        if (!url) return
        const supported = await Linking.canOpenURL(url)
        if (supported) {
            await Linking.openURL(url)
        }
    }

    const imageSource =
        product?.main_image
            ? { uri: product.main_image }
            : { uri: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' }

    const isAvailable = mainListing?.is_available === true

    return (
        <SafeAreaView className="flex-1 bg-[#F9F9FB]">
            <View className="px-5 pb-3 mb-4 border-b-2 border-[#E5E7EB] ">
                <View className="flex-row items-center gap-4">
                    <AppHeader left={() => <BackButton />} />
                    <Text className="text-lg font-bold text-gray-900">Product Detail</Text>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={toggleFavorite}
                        disabled={favLoading}
                    >
                        {favLoading
                            ? <ActivityIndicator size="small" color="#EF4444" />
                            : <Ionicons
                                // ✅ isFavorite true হলে heart red, false হলে heart-outline grey
                                name={isFavorite ? 'heart' : 'heart-outline'}
                                size={20}
                                color="#EF4444"
                            />
                        }
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#2355B6" />
                    <Text className="mt-3 text-[#636F85]">Loading product details...</Text>
                </View>
            ) : error ? (
                <View className="flex-1 items-center justify-center px-5">
                    <Text className="text-red-500 text-lg font-semibold">{error}</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className='bg-red border'>
                                <Image
                                    style={{ width: '100%', height: 300 }}
                                    source={imageSource}
                                    resizeMode="cover"
                                />
                            </View>

                            {/* <View className='flex-row justify-center items-center my-4'>
                        <View className='w-4 h-4 rounded-full bg-[#2355B6] mr-3' />
                        <View className='w-4 h-4 rounded-full bg-[#b9c8e7] mr-3' />
                        <View className='w-4 h-4 rounded-full bg-[#b9c8e7]' />
                    </View> */}

                            <View className='px-5'>
                                <View className='flex-row justify-between items-center mt-4'>
                                    <View className='w-80'>
                                        <Text className='text-xl font-bold'>
                                            {product?.title || 'No title found'}
                                        </Text>
                                    </View>
                                    <View>
                                        {/* akahne hobe condition vairable ta product condition */}
                                        {/* <View >
                                    <Text className='text-xl font-bold self-end'>
                                        ⭐ 5.5
                                    </Text>
                                </View> */}
                                        <View className='items-center flex-row '>
                                            <Entypo name="shop" className='mr-2' size={20} color="#2355B6" />
                                            <Text className='text-xl font-bold self-end'>
                                                {mainListing?.platform_name}
                                            </Text>
                                        </View>

                                        {/* condition product */}
                                        <View className='bg-[#27C8401A] p-2 rounded-full mt-2 flex-row items-center justify-center gap-2'>
                                            <MaterialIcons name="verified" size={20} color="#137C0A" />
                                            <Text className='text-[#137C0A] font-medium'>
                                                {mainListing?.condition || 'N/A'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View className='border-2 border-[#E5E7EB] p-5 rounded-2xl my-5'>
                                    <View className='flex-row items-center justify-between '>
                                        <Text className='text-[#636F85] text-xl'>LOWEST PRICE FOUND</Text>
                                        <Text className='bg-[#FFC649] p-2 rounded-xl'>BEST DEAL</Text>
                                    </View>

                                    <View className='flex-row items-end gap-2 my-2'>
                                        <Text className='text-4xl text-[#2355B6] font-bold'>
                                            ${product?.lowest_price ?? mainListing?.price ?? '0.00'}
                                        </Text>

                                        {/* original_price শুধু তখনই দেখাবে যখন data আসবে, null হলে কিছুই দেখাবে না */}
                                        {!!mainListing?.original_price && Number(mainListing.original_price) > 0 && (
                                            <Text className='text-[#A1A8B3] text-xl line-through'>
                                                ${mainListing.original_price}
                                            </Text>
                                        )}
                                    </View>

                                    {/* discount_percentage: data আসলে দেখাবে, null/0 হলে কিছুই দেখাবে না */}
                                    {!!mainListing?.discount_percentage && Number(mainListing.discount_percentage) > 0 && (
                                        <Text className='text-[#34C759] text-xl'>
                                            You save {Math.round(Number(mainListing.discount_percentage))}%
                                        </Text>
                                    )}

                                    {/* shipping info সবসময় দেখাবে */}
                                    <Text className='text-[#34C759] text-xl'>
                                        {mainListing?.free_shipping
                                            ? 'Free Shipping Available'
                                            : 'Shipping Cost: ' + mainListing?.shipping_cost}
                                    </Text>

                                    <View className='mt-4 flex-row items-center gap-2'>
                                        {/* <Pressable className='bg-[#e1e6eb] px-6 py-4 rounded-xl'>
                                    <MaterialIcons name="notifications-active" size={30} color="#334155" />
                                    <Text className='text-[#636F85]'>Alert</Text>
                                </Pressable> */}
                                        <Pressable className='bg-[#e1e6eb] px-6 py-4 rounded-xl '>
                                            <MaterialCommunityIcons name="open-in-new" size={30} color="#334155" />
                                            <Text className='text-[#636F85]'>Share</Text>
                                        </Pressable>

                                        {/* ✅ isInCart true হলে "Already in Cart" green button
                                    false হলে "Add to Cart" blue button
                                    cartLoading হলে spinner দেখাবে */}
                                        <Pressable
                                            onPress={handleMainAction}
                                            disabled={cartLoading || !isAvailable || isInCart}
                                            className='rounded-xl p-6 flex-row items-center gap-2 ml-auto'
                                            style={{
                                                backgroundColor: isInCart ? '#16A34A' : '#2355B6',
                                                opacity: cartLoading || !isAvailable ? 0.6 : 1,
                                            }}
                                        >
                                            {cartLoading
                                                ? <ActivityIndicator size="small" color="white" />
                                                : <Feather
                                                    name={isInCart ? 'check-circle' : 'shopping-cart'}
                                                    size={26}
                                                    color="white"
                                                />
                                            }
                                            <Text className='text-white text-2xl font-bold'>
                                                {cartLoading
                                                    ? 'Adding...'
                                                    : isInCart
                                                        ? 'Already in Cart'
                                                        : 'Add to Cart'
                                                }
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>

                                <View className='border-2 border-[#E5E7EB] p-5 rounded-2xl my-5 bg-white'>
                                    <Text className='text-2xl font-bold mb-3'>Description</Text>
                                    <Text className='text-[#636F85] text-base leading-6'>
                                        {product?.description?.trim()
                                            ? product.description
                                            : 'No description available for this product.'}
                                    </Text>
                                </View>

                                {/* <View className='flex-row justify-between items-center'>
                            <Text className='text-2xl font-bold'>Price History</Text>
                            <View className='flex-row items-center gap-2 justify-center'>
                                <Text className='bg-[#2355B6] text-white text-xl p-2 px-4 rounded-lg'>30d</Text>
                                <Text className='text-xl'>90d</Text>
                            </View>
                        </View> */}
                                {/* <PriceChart /> */}

                                <Text className='text-2xl font-bold my-4'>
                                    Compare Retailers
                                </Text>

                                {/* ── Listings: lowest price top, blue border ── */}
                                <View className='mb-20'>
                                    {sortedListings.map((item, index) => {
                                        const cardTitle = item.platform_name || 'Unknown Platform'
                                        const price = item.total_price ?? Number(item.price)
                                        const isLowest = index === 0 // sort করার পর index 0 মানে lowest price

                                        // known platform হলে image logo, না হলে null (shop icon দেখাবে)
                                        const platformLogo = getPlatformLogo(cardTitle)

                                return (
                                    <Pressable
                                        key={item.id ?? index}
                                        onPress={() => openUrl(item.external_url)}
                                        style={[
                                            styles.listingCard,
                                            // ✅ lowest price card এ blue border
                                            isLowest && styles.listingCardBest,
                                        ]}
                                    >
                                        {/* ✅ lowest price badge */}
                                        {isLowest && (
                                            <View style={styles.bestPriceBadge}>
                                                <MaterialIcons name="star" size={12} color="#fff" />
                                                <Text style={styles.bestPriceText}>Best Price</Text>
                                            </View>
                                        )}

                                        <View style={styles.listingRow}>
                                            {/* Logo — known platform হলে image, না হলে shop icon */}
                                            <View style={styles.logoBox}>
                                                {platformLogo
                                                    ? <Image source={platformLogo} style={styles.logoImage} resizeMode="contain" />
                                                    : <MaterialIcons name="storefront" size={28} color="#2355B6" />
                                                }
                                            </View>

                                            {/* Platform name + shipping */}
                                            <View style={styles.listingInfo}>
                                                <Text style={styles.listingPlatformName}>{cardTitle}</Text>
                                                <Text style={styles.listingShipping}>
                                                    {item.free_shipping
                                                        ? 'Free Shipping'
                                                        : `Shipping: $${item.shipping_cost}`}
                                                </Text>
                                            </View>

                                            {/* Price + button */}
                                            <View style={styles.listingRight}>
                                                <View style={styles.priceCol}>
                                                    <Text style={[styles.listingPrice, isLowest && styles.listingPriceBest]}>
                                                        ${price.toFixed(2)}
                                                    </Text>
                                                    {/* original_price শুধু তখনই দেখাবে যখন আসবে */}
                                                    {!!item.original_price && Number(item.original_price) > 0 && (
                                                        <Text style={styles.listingOriginal}>
                                                            ${Number(item.original_price).toFixed(2)}
                                                        </Text>
                                                    )}
                                                    {/* discount শুধু তখনই দেখাবে যখন আসবে */}
                                                    {!!item.discount_percentage && Number(item.discount_percentage) > 0 && (
                                                        <Text style={styles.listingDiscount}>
                                                            -{Math.round(Number(item.discount_percentage))}%
                                                        </Text>
                                                    )}
                                                </View>

                                                {/* ✅ lowest price এ "Buy Now" blue, বাকিগুলো "View" grey */}
                                                <TouchableOpacity
                                                    style={[styles.listingBtn, !isLowest && styles.listingBtnSecondary]}
                                                    onPress={() => openUrl(item.external_url)}
                                                >
                                                    <Text style={[styles.listingBtnText, !isLowest && styles.listingBtnTextSecondary]}>
                                                        {isLowest ? 'Buy Now' : 'View'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Pressable>
                                )
                            })}
                                </View>
                            </View>
                        </ScrollView>
            )}

            <Pressable
                onPress={() => setChatModalVisible(true)}
                className='absolute right-12 bottom-10 bg-white p-2 rounded-full border-2 border-[#FFC64933]'
            >
                <Ionicons name="chatbubble-ellipses" size={40} color="#FFC649" />
            </Pressable>

            {/* Chat Modal */}
            <ChatModal
                visible={chatModalVisible}
                onClose={() => setChatModalVisible(false)}
            />

            {/* Toast for favorite feedback */}
            <Toast
                style={toast.style}
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                fadeAnim={toast.fadeAnim}
                buttons={toast.buttons}
                onHide={toast.hide}
            />
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
        width: 34,
        height: 34,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    // ── Listing cards ─────────────────────────────────────────────────────────
    listingCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        padding: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    listingCardBest: {
        // ✅ lowest price card এ blue border
        borderColor: '#2355B6',
        borderWidth: 2,
    },
    bestPriceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#2355B6',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 10,
    },
    bestPriceText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    listingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoBox: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    logoImage: {
        width: 44,
        height: 44,
    },
    listingInfo: {
        flex: 1,
    },
    listingPlatformName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    listingShipping: {
        fontSize: 13,
        color: '#16A34A',
        fontWeight: '500',
    },
    listingRight: {
        alignItems: 'flex-end',
        gap: 8,
    },
    priceCol: {
        alignItems: 'flex-end',
    },
    listingPrice: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1F2937',
    },
    listingPriceBest: {
        // ✅ lowest price এর দাম blue
        color: '#2355B6',
    },
    listingOriginal: {
        fontSize: 13,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
    },
    listingDiscount: {
        fontSize: 12,
        color: '#16A34A',
        fontWeight: '700',
    },
    listingBtn: {
        // ✅ lowest price এ blue "Buy Now" button
        backgroundColor: '#2355B6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    listingBtnSecondary: {
        // ✅ বাকিগুলোতে grey "View" button
        backgroundColor: '#F3F4F6',
    },
    listingBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    listingBtnTextSecondary: {
        color: '#374151',
    },
})