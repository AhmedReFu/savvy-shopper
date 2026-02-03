import { EvilIcons, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthStackParamList } from '../../Navigation/types'
import PremiumModal from '../../components/PremiumModal'
import { Images } from '../../constants'


const { width } = Dimensions.get('window')

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

const Home = () => {
const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
    
    const [premiumModalVisible, setPremiumModalVisible] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [favorites, setFavorites] = useState<Set<string>>(new Set())

    const categories = ['All', 'Trending', 'Electronics', 'Fashion']

    const todaysDeals = [
        {
            id: '1',
            name: 'Bose QuietComfort',
            price: 252,
            originalPrice: 420,
            discount: '-45%',
            image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
            seller: 'Amazon'
        },
        {
            id: '2',
            name: 'Sony WH-1000XM5',
            price: 299,
            originalPrice: 399,
            discount: '-40%',
            image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
            seller: 'BestBuy'
        }
    ]

    const recommendedProducts = [
        {
            id: '3',
            name: 'MacBook Air M2',
            price: 999,
            originalPrice: 1099,
            discount: '-10%',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
            seller: 'Best Buy'
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
            name: 'iPhone 15 Pro',
            price: 999,
            originalPrice: 1099,
            discount: '-08%',
            image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
            seller: 'Apple'
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

    const ProductCard = ({ product, size = 'medium' }: any) => {
        const cardWidth = size === 'medium' ? (width - 60) / 2 : (width - 50) / 2 - 8
        const isFavorite = favorites.has(product.id)

        return (
            <Pressable onPress={()=>navigation.navigate("ProductDetails")}  style={[styles.productCard, { width: cardWidth }]}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.image }}
                        style={styles.productImage}
                        resizeMode="cover"
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
                    <Text style={styles.productName} numberOfLines={1}>
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
            </Pressable>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Good Morning,</Text>
                        <Text style={styles.userName}>Ahmed ReFat</Text>
                    </View>

                    <Pressable onPress={() => navigation.navigate("Notification")} >
                        <Ionicons 
                            name="notifications" size={24} color="black" />
                    </Pressable>
                    
                </View>

                {/* Search Bar */}
                <Pressable style={styles.searchContainer} onPress={()=> navigation.navigate("SearchProduct")}>
                    <EvilIcons name="search" size={40} color="#94A3B8" />
                    
                    <Text style={styles.searchInput}>Search products, brands...</Text>
                </Pressable>

                {/* Category Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryContainer}
                    
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category && styles.categoryButtonActive
                            ]}
                            className='bg-white border border-[#D1D6DB]'
                            onPress={() => setSelectedCategory(category)}
                        >
                            {category === 'All' && (
                                <MaterialIcons
                                    name="grid-view"
                                    size={18}
                                    color={selectedCategory === 'All' ? 'white' : '#64748B'}
                                />
                            )}
                            {category === 'Trending' && (
                                <Ionicons
                                    name="flame"
                                    size={18}
                                    color={selectedCategory === 'Trending' ? 'white' : '#64748B'}
                                />
                            )}
                            {category === 'Electronics' && (
                                <MaterialIcons
                                    name="devices"
                                    size={18}
                                    color={selectedCategory === 'Electronics' ? 'white' : '#64748B'}
                                />
                            )}
                            {category === 'Fashion' && (
                                <Ionicons
                                    name="shirt"
                                    size={18}
                                    color={selectedCategory === 'Fashion' ? 'white' : '#64748B'}
                                />
                            )}
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === category && styles.categoryTextActive
                            ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Premium Card */}
                <LinearGradient
                    colors={['#0057FF', '#61B3FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.premiumCard}
                >
                    {/* Background Decorations */}
                    <Image
                        source={Images.AngleIcon}
                        style={styles.angleIcon}
                        resizeMode="contain"
                    />
                    <Image
                        source={Images.MoneyStraw}
                        style={styles.moneyStraw}
                        resizeMode="contain"
                    />

                    {/* Premium Content */}
                    <View style={styles.premiumIcon}>
                        <Text style={styles.premiumIconText}>✨</Text>
                        <Text style={styles.premiumTitle}>DEALNUX PREMIUM</Text>
                    </View>

                    <Text style={styles.premiumSubtitle}>
                        Unlock smarter savings and{'\n'}auto-coupons!
                    </Text>
                    <Text style={styles.premiumDescription}>
                        Experience ad-free browsing and exclusive{'\n'}price drop alerts.
                    </Text>
                    <TouchableOpacity style={styles.premiumButton} onPress={() => setPremiumModalVisible(true)}>
                        <Text style={styles.premiumButtonText}>Start Free Trial</Text>
                        <MaterialIcons name="arrow-forward" size={18} color="#0057FF" />
                    </TouchableOpacity>
                </LinearGradient>

                {/* Advertise Button */}
                <TouchableOpacity style={styles.advertiseButton} onPress={() => navigation.navigate("MyAds")}>
                    <Text style={styles.advertiseButtonText}>Advertise on DealNux</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity> 


                {/* Today's Best Deals */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Today's Best Deals</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("TodaysDeals")}>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.dealsContainer}
                >
                    {todaysDeals.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </ScrollView>

                {/* Recommended for You */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recommended for You</Text>
                    <TouchableOpacity >
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.recommendedGrid}>
                    {recommendedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} size="small" />
                    ))}
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>
            <PremiumModal
                visible={premiumModalVisible}
                onClose={() => setPremiumModalVisible(false)}
            />
        </SafeAreaView>
    )
}

export default Home

const styles = StyleSheet.create({
    // Container & Layout
    container: {
        flex: 1,
        backgroundColor: '#F9F9FB',
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 16,
    },
    greeting: {
        fontSize: 16,
        color: '#636F85',
        marginBottom: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
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
        marginHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#636F85',
        paddingHorizontal: 8,
    },

    // Categories
    categoryContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
        marginRight:16,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 20,
        gap: 6,
    },
    categoryButtonActive: {
        backgroundColor: '#2563EB',
    },
    categoryText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    categoryTextActive: {
        color: 'white',
    },

    // Premium Card
    premiumCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
    },
    angleIcon: {
        position: 'absolute',
        top: -100,
        right: -40,
    },
    moneyStraw: {
        position: 'absolute',
        right: 20,
        bottom: 16,
        width: 115,
        height: 115,
    },
   
    premiumIcon: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 20,
        alignItems: 'center',
        marginBottom: 12,
    },
    premiumIconText: {
        padding: 12,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        fontSize: 20,
    },
    premiumTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    premiumSubtitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        lineHeight: 28,
    },
    premiumDescription: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        marginBottom: 16,
        lineHeight: 20,
    },
    premiumButton: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignSelf: 'flex-start',
        gap: 6,
    },
    premiumButtonText: {
        color: '#0057FF',
        fontWeight: '600',
        fontSize: 16,
    },

    // Advertise Button
    advertiseButton: {
        backgroundColor: '#1E40AF',
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        gap: 8,
    },
    advertiseButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },

    // Section Headers
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    seeAllText: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '500',
    },

    // Deals Container
    dealsContainer: {
        paddingLeft: 20,
        paddingRight: 20,
        gap: 16,
        marginBottom: 20,
    },

    // Product Card
    productCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    imageContainer: {
        position: 'relative',
        height: 160,
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
        fontSize: 12,
    },
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
    productInfo: {
        padding: 12,
        backgroundColor: '#FFFFFF',
    },
    productName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 6,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    originalPrice: {
        fontSize: 14,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
    },
    sellerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    sellerText: {
        fontSize: 13,
        color: '#94A3B8',
        flex: 1,
    },

    // Recommended Grid
    recommendedGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        gap: 20,
        marginBottom: 40,
        justifyContent: 'space-between',
    },
})