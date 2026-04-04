import { CART_PRODUCT, CART_REMOVE, CART_UPDATE, IPA_BASE } from '@env'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native'
import axios from 'axios'
import React, { useCallback, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AuthStackParamList } from '../../Navigation/types'
import CartProductCard from '../../components/CartProductCard'
import { Images } from '../../constants'

const API_BASE_URL = IPA_BASE

const API_ENDPOINTS = {
  CART_UPDATE,
  CART_REMOVE,
}

type CartListing = {
  id: number
  platform_name: string
  platform_code: string
  price: string
  currency: string
  original_price: string | null
  discount_percentage: string | null
  condition: string
  free_shipping: boolean
  shipping_cost: string
  total_price: number
  external_url: string
  is_available: boolean
}

type CartItem = {
  id: number
  product: number
  product_title: string
  product_image: string
  quantity: number
  listing: CartListing
}

type CartSummary = {
  total_platforms: number
  total_items: number
  total_price: number
  currency: string
}

type CartApiData = {
  summary: CartSummary
  platforms: Record<string, CartItem[]>
}

type CartUiItem = CartItem & {
  selectedQty: number
}

type CartPlatformsState = Record<string, CartUiItem[]>

const Cart = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>()

  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [cartData, setCartData] = useState<CartApiData | null>(null)
  const [platformItems, setPlatformItems] = useState<CartPlatformsState>({})
  const [qtyLoadingMap, setQtyLoadingMap] = useState<Record<string, boolean>>({})
  const [deleteLoadingMap, setDeleteLoadingMap] = useState<Record<string, boolean>>({})

  // ✅ swipe চলাকালীন ScrollView disable করার জন্য
  const [scrollEnabled, setScrollEnabled] = useState(true)

  const getPlatformLogo = (platformName?: string) => {
    const name = platformName?.toLowerCase()?.trim() ?? ''

    if (name.includes('amazon')) return Images.Amazon
    if (name.includes('walmart')) return Images.Wallmart
    if (name.includes('aliexpress')) return Images.Aliexpress
    if (name.includes('bestbuy') || name.includes('best buy')) return Images.BestBuy

    return null
  }

  const toNumber = (value: unknown, fallback = 0) => {
    const num = Number(value)
    return Number.isFinite(num) ? num : fallback
  }

  const formatMoney = (amount: number, currency = 'USD') => {
    return `${currency === 'USD' ? '$' : `${currency} `}${amount.toFixed(2)}`
  }

  const getItemKey = (platformName: string, itemId: number, listingId: number) =>
    `${platformName}_${itemId}_${listingId}`

  const buildUiState = (data: CartApiData): CartPlatformsState => {
    const nextState: CartPlatformsState = {}

    Object.entries(data?.platforms ?? {}).forEach(([platformName, items]) => {
      nextState[platformName] = (items ?? []).map(item => ({
        ...item,

        // API quantity diye initial state
        // minimum 1
        selectedQty: Math.max(1, toNumber(item.quantity, 1)),
      }))
    })

    return nextState
  }

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true)

      const token = await AsyncStorage.getItem('vToken')

      if (!token) {
        setCartData(null)
        setPlatformItems({})
        return
      }

      const res = await axios.get(`${API_BASE_URL}${CART_PRODUCT}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      const apiData: CartApiData | null = res?.data?.data ?? null

      setCartData(apiData)
      setPlatformItems(apiData ? buildUiState(apiData) : {})
    } catch (error) {
      console.error('cart fetch error', error)
      setCartData(null)
      setPlatformItems({})
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchCart()
    }, [fetchCart])
  )

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      await fetchCart()
    } catch {
      setRefreshing(false)
    }
  }

  const updateLocalQty = (
    platformName: string,
    itemId: number,
    listingId: number,
    nextQty: number
  ) => {
    setPlatformItems(prev => {
      const platformList = prev[platformName] ?? []

      return {
        ...prev,
        [platformName]: platformList.map(item => {
          if (!(item.id === itemId && item.listing.id === listingId)) return item

          return {
            ...item,
            selectedQty: Math.max(1, nextQty),
          }
        }),
      }
    })
  }

  const cleanEmptyPlatforms = (prev: CartPlatformsState) => {
    const cleaned: CartPlatformsState = {}

    Object.entries(prev).forEach(([platformName, items]) => {
      if (items.length > 0) {
        cleaned[platformName] = items
      }
    })

    return cleaned
  }

  const handleDecreaseQuantity = async (platformName: string, item: CartUiItem) => {
    const itemKey = getItemKey(platformName, item.id, item.listing.id)

    // quantity 1 er niche jabe na
    if (item.selectedQty <= 1) return

    const previousQty = item.selectedQty
    const nextQty = previousQty - 1

    updateLocalQty(platformName, item.id, item.listing.id, nextQty)

    try {
      setQtyLoadingMap(prev => ({ ...prev, [itemKey]: true }))

      const token = await AsyncStorage.getItem('vToken')
      if (!token) return

      // PUT dynamic url with item.id
      // body te jabe:
      // product
      // quantity
      const formData = new FormData()
      formData.append('product', String(item.product))
      formData.append('quantity', String(nextQty))

      await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.CART_UPDATE}${item.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      await fetchCart()
    } catch (error: any) {
      console.error('decrease qty error', error?.response?.data || error)

      // rollback
      updateLocalQty(platformName, item.id, item.listing.id, previousQty)
    } finally {
      setQtyLoadingMap(prev => ({ ...prev, [itemKey]: false }))
    }
  }

  const handleIncreaseQuantity = async (platformName: string, item: CartUiItem) => {
    const itemKey = getItemKey(platformName, item.id, item.listing.id)

    const previousQty = item.selectedQty
    const nextQty = previousQty + 1

    updateLocalQty(platformName, item.id, item.listing.id, nextQty)

    try {
      setQtyLoadingMap(prev => ({ ...prev, [itemKey]: true }))

      const token = await AsyncStorage.getItem('vToken')
      if (!token) return

      // PUT dynamic url with item.id
      // body te jabe:
      // product
      // quantity
      const formData = new FormData()
      formData.append('product', String(item.product))
      formData.append('quantity', String(nextQty))

      await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.CART_UPDATE}${item.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      await fetchCart()
    } catch (error: any) {
      console.error('increase qty error', error?.response?.data || error)

      // rollback
      updateLocalQty(platformName, item.id, item.listing.id, previousQty)
    } finally {
      setQtyLoadingMap(prev => ({ ...prev, [itemKey]: false }))
    }
  }

  const handleDeleteItem = async (platformName: string, item: CartUiItem) => {
    const itemKey = getItemKey(platformName, item.id, item.listing.id)

    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const previousState = platformItems

            // local remove first
            setPlatformItems(prev => {
              const updated = {
                ...prev,
                [platformName]: (prev[platformName] ?? []).filter(
                  cartItem => !(cartItem.id === item.id && cartItem.listing.id === item.listing.id)
                ),
              }

              // platform empty hole remove kore dibe
              return cleanEmptyPlatforms(updated)
            })

            try {
              setDeleteLoadingMap(prev => ({ ...prev, [itemKey]: true }))

              const token = await AsyncStorage.getItem('vToken')
              if (!token) return

              // DELETE dynamic url with item.id
              // no body
              // no params
              await axios.delete(
                `${API_BASE_URL}${API_ENDPOINTS.CART_REMOVE}${item.id}/`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                  },
                }
              )

              await fetchCart()
            } catch (error: any) {
              console.error('delete cart item error', error?.response?.data || error)

              setPlatformItems(previousState)
            } finally {
              setDeleteLoadingMap(prev => ({ ...prev, [itemKey]: false }))
            }
          },
        },
      ]
    )
  }

  const platformEntries = useMemo(() => Object.entries(platformItems ?? {}), [platformItems])

  const totalSelectedItems = useMemo(() => {
    return platformEntries.reduce((sum, [, items]) => {
      return sum + items.reduce((acc, item) => acc + item.selectedQty, 0)
    }, 0)
  }, [platformEntries])

  const currency = cartData?.summary?.currency || 'USD'

  const getPlatformSubtotal = (items: CartUiItem[]) => {
    return items.reduce((sum, item) => {
      const unitPrice = toNumber(item?.listing?.total_price ?? item?.listing?.price, 0)
      return sum + unitPrice * item.selectedQty
    }, 0)
  }

  const grandTotal = useMemo(() => {
    return platformEntries.reduce((sum, [, items]) => sum + getPlatformSubtotal(items), 0)
  }, [platformEntries])

  if (loading && !cartData) {
    return (
      <SafeAreaView className="flex-1 bg-[#F9F9FB] items-center justify-center">
        <ActivityIndicator size="large" color="#2355B6" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]">
      <View className="px-5 mb-20 flex-1">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-xl font-bold">My Cart</Text>
            <Text className="text-[#636F85]">
              ({cartData?.summary?.total_items ?? totalSelectedItems})
            </Text>
          </View>

          <Pressable onPress={onRefresh}>
            <Text className="text-[#2355B6] font-semibold">
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Text>
          </Pressable>
        </View>

        {/* ✅ scrollEnabled — swipe করার সময় false হয়, scroll করার সময় true
            nestedScrollEnabled — Android এ nested scroll এর জন্য দরকার */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="mt-6"
          contentContainerStyle={{ paddingBottom: 24 }}
          scrollEnabled={scrollEnabled}
          nestedScrollEnabled={true}
        >
          {platformEntries.length === 0 ? (
            <View className="bg-white border border-[#E5E7EB] rounded-3xl p-6">
              <Text className="text-xl font-bold text-center">Your cart is empty</Text>
              <Text className="text-[#636F85] text-center mt-2">
                Add products to see them here.
              </Text>
            </View>
          ) : (
            platformEntries.map(([platformName, items], sectionIndex) => {
              const platformLogo = getPlatformLogo(platformName)
              const platformSubtotal = getPlatformSubtotal(items)

              return (
                <View
                  key={platformName}
                  className={`border-2 border-[#E5E7EB] rounded-3xl ${sectionIndex > 0 ? 'mt-5' : ''}`}
                >
                  <View className="flex-row items-center justify-center gap-4 px-4 py-3 border-b-2 border-[#E5E7EB]">
                    {platformLogo ? (
                      <Image
                        source={platformLogo}
                        resizeMode="contain"
                        style={{ width: 34, height: 34 }}
                      />
                    ) : (
                      <MaterialIcons name="storefront" size={30} color="#2355B6" />
                    )}

                    <Text className="text-3xl font-semibold">{platformName}</Text>
                  </View>

                  <View className="p-4">
                    {items.map(item => {
                      const itemKey = getItemKey(platformName, item.id, item.listing.id)

                      return (
                        <CartProductCard
                          key={`${platformName}_${item.product}_${item.id}_${item.listing.id}`}
                          image={item.product_image}
                          name={item.product_title}
                          price={toNumber(item.listing.total_price ?? item.listing.price, 0)}
                          originalPrice={toNumber(item.listing.original_price, 0)}
                          discount={
                            item.listing.discount_percentage
                              ? `-${Math.round(Number(item.listing.discount_percentage))}%`
                              : ''
                          }
                          quantity={item.selectedQty}
                          condition={item.listing.condition}
                          isAvailable={item.listing.is_available}
                          qtyLoading={!!qtyLoadingMap[itemKey]}
                          deleteLoading={!!deleteLoadingMap[itemKey]}
                          onIncrease={() => handleIncreaseQuantity(platformName, item)}
                          onDecrease={() => handleDecreaseQuantity(platformName, item)}
                          onDelete={() => handleDeleteItem(platformName, item)}
                          // ✅ swipe শুরু হলে ScrollView disable, শেষ হলে enable
                          onSwipeStart={() => setScrollEnabled(false)}
                          onSwipeEnd={() => setScrollEnabled(true)}
                        />
                      )
                    })}
                  </View>

                  <View className="bg-[#36405305] flex-row items-center justify-between px-6 py-4 rounded-b-3xl">
                    <Text className="text-[#636F85] text-xl">
                      {platformName.toUpperCase()} SUBTOTAL
                    </Text>
                    <Text className="text-3xl font-bold">
                      {formatMoney(platformSubtotal, currency)}
                    </Text>
                  </View>
                </View>
              )
            })
          )}

          {platformEntries.length > 0 && (
            <View className="bg-white border-2 border-[#E5E7EB] rounded-3xl p-5 mt-5">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-[#636F85] text-lg">Platforms</Text>
                <Text className="text-lg font-semibold">
                  {cartData?.summary?.total_platforms ?? platformEntries.length}
                </Text>
              </View>

              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-[#636F85] text-lg">Items</Text>
                <Text className="text-lg font-semibold">
                  {cartData?.summary?.total_items ?? totalSelectedItems}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-bold">Total</Text>
                <Text className="text-3xl font-bold text-[#2355B6]">
                  {formatMoney(
                    toNumber(cartData?.summary?.total_price, grandTotal),
                    currency
                  )}
                </Text>
              </View>
            </View>
          )}

          <Pressable
            className="p-5 bg-[#2355B6] rounded-xl mt-5 mb-6"
            onPress={() => navigation.navigate('CheckoutOptions')}
            disabled={platformEntries.length === 0}
            style={{ opacity: platformEntries.length === 0 ? 0.5 : 1 }}
          >
            <Text className="text-white text-xl font-bold text-center">
              See Best Checkout Option
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Cart