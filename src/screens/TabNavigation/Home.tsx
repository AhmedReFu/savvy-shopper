import {
    ADD_FAVORITE,
    ALL_PRODUCT,
    CATEGORIES_LIST,
    CATEGORY_PRODUCT,
    IPA_BASE,
    PROFILE,
    REMOVE_FAVORITE,
} from '@env'
import { EvilIcons, Ionicons, MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import axios from 'axios'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
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
import { Toast, useToast } from '../../components/useToost'
import { Images } from '../../constants'

const { width } = Dimensions.get('window')

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

type UserProfile = {
    name: string;
    email: string;
    profile_picture: string;
    address: string;
    interests: string[];
    refaradal_code: string;
    advertiser_status: {
        status: string;
    };
    balance: number;
    has_claimed_referral: boolean;
    referred_by: string | null;
};

type ApiProduct = {
    id: number;
    title: string;
    slug?: string;
    brand?: string;
    category?: number | null;
    category_name?: string | null;
    main_image: string | null;
    lowest_price?: number;
    price?: string;
    original_price?: string | null;
    discount_percentage?: number | null;
    listings_count?: number;
    available_on?: string[];
    seller_shop?: string;
    is_active?: boolean;
    created_at?: string;
    is_favorite?: boolean | string | null;
};

type UiProduct = {
    id: string;
    productId: number;
    name: string;
    price: number;
    originalPrice: number;
    discount: string;
    image: string;
    seller: string;
    isFavorite: boolean;
};

type CategoryItem = {
    id: number;
    name: string;
    slug: string;
};

const API_BASE_URL = IPA_BASE;

// পরে endpoint add করবা
const CATEGORY_ENDPOINT = ''; // example: '/api/categories/parents/'
const CATEGORY_PRODUCT_ENDPOINT = ''; // example: '/api/products/by-category/'

// পরে param key change লাগলে এইটা change করলেই হবে
const CATEGORY_PARAM_KEY = 'category'; // example: 'category', 'category_slug', 'slug'

const Home = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const [premiumModalVisible, setPremiumModalVisible] = useState(false)
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [productLoading, setProductLoading] = useState(false);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
    const [favoriteLoadingIds, setFavoriteLoadingIds] = useState<Set<string>>(new Set());

    const toast = useToast();

    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    const [user, setUser] = useState<UserProfile | null>(null);
    const [products, setProducts] = useState<ApiProduct[]>([]);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(20);
    const [hasNextPage, setHasNextPage] = useState(true);

    const buildImageUrl = (path?: string | null) => {
        if (!path) return 'https://via.placeholder.com/400x400/F1F5F9/94A3B8?text=No+Image';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        return `${API_BASE_URL}${path}`;
    };

    const parseFavoriteValue = (value: boolean | string | null | undefined) => {
        if (value === true) return true;
        if (value === false) return false;
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true';
        }
        return false;
    };

    const syncFavoritesFromProducts = useCallback((items: ApiProduct[], append = false) => {
        setFavorites((prev) => {
            const next = append ? new Set(prev) : new Set<string>();

            items.forEach((item) => {
                const id = String(item.id);
                if (parseFavoriteValue(item.is_favorite)) {
                    next.add(id);
                } else if (!append) {
                    next.delete(id);
                }
            });

            return next;
        });
    }, []);

    const mapProductToUi = useCallback((item: ApiProduct): UiProduct => {
        const finalPrice =
            typeof item.lowest_price === 'number'
                ? item.lowest_price
                : Number(item.price ?? 0);

        const originalPrice =
            item.original_price != null && item.original_price !== ''
                ? Number(item.original_price)
                : finalPrice;

        const discount =
            item.discount_percentage && item.discount_percentage > 0
                ? `-${Math.round(item.discount_percentage)}%`
                : originalPrice > finalPrice && originalPrice > 0
                    ? `-${Math.round(((originalPrice - finalPrice) / originalPrice) * 100)}%`
                    : '';

        return {
            id: String(item.id),
            productId: item.id,
            name: item.title,
            price: finalPrice,
            originalPrice,
            discount,
            image: buildImageUrl(item.main_image),
            seller: item.available_on?.[0] || item.seller_shop || item.brand || 'Unknown',
            isFavorite: favorites.has(String(item.id)) || parseFavoriteValue(item.is_favorite),
        };
    }, [favorites]);

    const uiProducts = useMemo(() => {
        return products.map(mapProductToUi);
    }, [products, mapProductToUi]);

    const displayCategories = useMemo(() => {
        return [
            { id: 0, name: 'All', slug: 'all' },
            ...categories,
        ];
    }, [categories]);

    const todaysDeals = useMemo(() => uiProducts.slice(0, 6), [uiProducts]);
    const recommendedProducts = useMemo(() => uiProducts, [uiProducts]);

    const myAds = () => {
        if (user?.advertiser_status.status == "not_applied") {
            navigation.navigate("AdsApply")
        } else if (user?.advertiser_status.status == "pending") {
            toast.show({
                message: "Your Business Profile Request Is Pending.",
                type: 'error',
                style: 'top',
            });
        }
        else {
            navigation.navigate("MyAds")
        }
    }

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 6 && hour < 12) return "Good Morning,";
        if (hour >= 12 && hour < 16) return "Good Noon,";
        if (hour >= 16 && hour < 18) return "Good Afternoon,";
        if (hour >= 18) return "Good Evening,";

        return "Good Night,";
    };

    const fetchProfile = useCallback(async (token: string) => {
        try {
            setProfileLoading(true);

            const res = await axios.get(`${API_BASE_URL}${PROFILE}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser(res?.data?.data ?? null);
        } catch (error) {
            console.error("Error loading profile:", error);
        } finally {
            setProfileLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async (token: string) => {


        try {
            setCategoryLoading(true);

            const res = await axios.get(`${API_BASE_URL}${CATEGORIES_LIST}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(res.data)
            const categoryList = Array.isArray(res?.data?.data) ? res.data.data : [];

            const reversedCategories = [...categoryList].reverse();
            setCategories(reversedCategories);
        } catch (error) {
            console.error('Error loading categories:', error);
            setCategories([]);
        } finally {
            setCategoryLoading(false);
        }
    }, []);

    const fetchProducts = useCallback(
        async (token: string, page = 1, append = false) => {
            try {
                if (append) {
                    setLoadingMore(true);
                } else {
                    setProductLoading(true);
                }

                const res = await axios.get(`${API_BASE_URL}${ALL_PRODUCT}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        page,
                        page_size: pageSize,
                    },
                });

                const productList = Array.isArray(res?.data?.data?.results)
                    ? res.data.data.results
                    : [];

                const pagination = res?.data?.pagination ?? {};

                setProducts((prev) => {
                    if (!append) return productList;

                    const merged = [...prev, ...productList];
                    return merged.filter(
                        (item, index, arr) =>
                            index === arr.findIndex((p) => p.id === item.id)
                    );
                });

                syncFavoritesFromProducts(productList, append);

                setCurrentPage(pagination?.current_page ?? page);
                setHasNextPage(Boolean(pagination?.has_next));
            } catch (error) {
                console.error("Error loading products:", error);
                if (!append) {
                    setProducts([]);
                    setFavorites(new Set());
                }
            } finally {
                setProductLoading(false);
                setLoadingMore(false);
            }
        },
        [pageSize, syncFavoritesFromProducts]
    );

    const fetchProductsByCategory = useCallback(
        async (token: string, categorySlug: string, page = 1, append = false) => {


            try {
                if (append) {
                    setLoadingMore(true);
                } else {
                    setProductLoading(true);
                }

                const res = await axios.get(`${API_BASE_URL}${CATEGORY_PRODUCT}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        search: categorySlug,
                        page_size: 1000000,
                    },
                });

                const productList = Array.isArray(res?.data?.data?.results)
                    ? res.data.data.results
                    : [];

                const pagination = res?.data?.pagination ?? {};

                setProducts((prev) => {
                    if (!append) return productList;

                    const merged = [...prev, ...productList];
                    return merged.filter(
                        (item, index, arr) =>
                            index === arr.findIndex((p) => p.id === item.id)
                    );
                });

                syncFavoritesFromProducts(productList, append);

                setCurrentPage(pagination?.current_page ?? page);
                setHasNextPage(Boolean(pagination?.has_next));
            } catch (error) {
                console.error("Error loading category products:", error);
                if (!append) {
                    setProducts([]);
                    setFavorites(new Set());
                }
            } finally {
                setProductLoading(false);
                setLoadingMore(false);
            }
        },
        [pageSize, syncFavoritesFromProducts]
    );

    const loadInitialData = useCallback(async () => {
        if (hasLoadedOnce) return;

        setLoading(true);

        const token = await AsyncStorage.getItem("vToken");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            await Promise.all([
                fetchProfile(token),
                fetchProducts(token, 1, false),
                fetchCategories(token),
            ]);
            setHasLoadedOnce(true);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    }, [fetchProfile, fetchProducts, fetchCategories, hasLoadedOnce]);

    const handleCategoryPress = async (slug: string) => {
        const token = await AsyncStorage.getItem("vToken");
        if (!token) return;

        if (slug === selectedCategory) return;

        setSelectedCategory(slug);
        setCurrentPage(1);
        setHasNextPage(true);

        if (slug === 'all') {
            await fetchProducts(token, 1, false);
            return;
        }

        await fetchProductsByCategory(token, slug, 1, false);
    };

    const handleLoadMore = useCallback(async () => {
        if (loadingMore || productLoading || loading || !hasNextPage) return;

        const token = await AsyncStorage.getItem("vToken");
        if (!token) return;

        const nextPage = currentPage + 1;

        if (selectedCategory === 'all') {
            await fetchProducts(token, nextPage, true);
        } else {
            await fetchProductsByCategory(token, selectedCategory, nextPage, true);
        }
    }, [
        currentPage,
        fetchProducts,
        fetchProductsByCategory,
        hasNextPage,
        loading,
        loadingMore,
        productLoading,
        selectedCategory,
    ]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const onRefresh = useCallback(async () => {
        const token = await AsyncStorage.getItem("vToken");
        if (!token) return;

        try {
            setRefreshing(true);
            setCurrentPage(1);
            setHasNextPage(true);

            await Promise.all([
                fetchProfile(token),
                fetchCategories(token),
                selectedCategory === 'all'
                    ? fetchProducts(token, 1, false)
                    : fetchProductsByCategory(token, selectedCategory, 1, false),
            ]);
        } finally {
            setRefreshing(false);
        }
    }, [fetchProfile, fetchCategories, fetchProducts, fetchProductsByCategory, selectedCategory]);

    const toggleFavorite = async (productId: number) => {
        const token = await AsyncStorage.getItem("vToken");

        if (!token) {
            toast.show({
                message: "Token missing",
                type: 'error',
                style: 'top',
            });
            return;
        }

        const id = String(productId);
        const isFavorite = favorites.has(id);

        setFavoriteLoadingIds((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });

        try {
            if (isFavorite) {
                await axios.delete(`${API_BASE_URL}${REMOVE_FAVORITE}`, {
                    product_id: productId,
                },

                    headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },

                );

                setFavorites((prev) => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });

                setProducts((prev) =>
                    prev.map((item) =>
                        item.id === productId
                            ? { ...item, is_favorite: false }
                            : item
                    )
                );

                toast.show({
                    message: "Removed from favorites",
                    type: 'success',
                    style: 'top',
                });
            } else {
                await axios.post(
                    `${API_BASE_URL}${ADD_FAVORITE}`,
                    {
                        product_id: productId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                );

                setFavorites((prev) => {
                    const next = new Set(prev);
                    next.add(id);
                    return next;
                });

                setProducts((prev) =>
                    prev.map((item) =>
                        item.id === productId
                            ? { ...item, is_favorite: true }
                            : item
                    )
                );

                toast.show({
                    message: "Added to favorites",
                    type: 'success',
                    style: 'top',
                });
            }
        } catch (error: any) {
            console.error('Favorite toggle error:', error?.response?.data || error);

            toast.show({
                message:
                    error?.response?.data?.message ||
                    'Favorite update failed',
                type: 'error',
                style: 'top',
            });
        } finally {
            setFavoriteLoadingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    const ProductCard = ({ product, size = 'medium' }: { product: UiProduct; size?: 'medium' | 'small' }) => {
        const cardWidth = size === 'medium' ? (width - 60) / 2 : (width - 50) / 2 - 8
        const isFavorite = product.isFavorite;
        const isFavoriteLoading = favoriteLoadingIds.has(product.id);

        return (
            <Pressable
                onPress={() =>
                    navigation.navigate("ProductDetails", { productId: product.productId } as never)
                }
                style={[styles.productCard, { width: cardWidth }]}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.image }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />

                    {!!product.discount && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{product.discount}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            if (!isFavoriteLoading) {
                                toggleFavorite(product.productId);
                            }
                        }}
                        activeOpacity={0.8}
                    >
                        {isFavoriteLoading ? (
                            <ActivityIndicator size="small" color="#64748B" />
                        ) : (
                                <Ionicons
                                    name={isFavorite ? "heart" : "heart-outline"}
                                    size={20}
                                    color={isFavorite ? "#EF4444" : "#64748B"}
                                />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                        {product.name}
                    </Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>${product.price}</Text>
                        {product.originalPrice > product.price && (
                            <Text style={styles.originalPrice}>${product.originalPrice}</Text>
                        )}
                    </View>

                    <View style={styles.sellerRow}>
                        <MaterialIcons name="storefront" size={16} color="#94A3B8" />
                        <Text style={styles.sellerText} numberOfLines={1}>{product.seller}</Text>
                        <MaterialIcons name="arrow-forward" size={16} color="#94A3B8" />
                    </View>
                </View>
            </Pressable>
        )
    }

    const renderListFooter = () => {
        if (!loadingMore) return <View style={{ height: 30 }} />;

        return (
            <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#2563EB" />
            </View>
        );
    };

    const renderHeader = () => (
        <>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>{getGreeting()}</Text>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                </View>

                <Pressable onPress={() => navigation.navigate("Notification")} >
                    <Ionicons name="notifications" size={24} color="black" />
                </Pressable>
            </View>

            <Pressable style={styles.searchContainer} onPress={() => navigation.navigate("SearchProduct")}>
                <EvilIcons name="search" size={40} color="#94A3B8" />
                <Text style={styles.searchInput}>Search products, brands....</Text>
            </Pressable>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryContainer}
            >
                {displayCategories.map((category) => {
                    const active = selectedCategory === category.slug;

                    return (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryButton,
                                active && styles.categoryButtonActive
                            ]}
                            onPress={() => handleCategoryPress(category.slug)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    active && styles.categoryTextActive
                                ]}
                            >
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <LinearGradient
                colors={['#0057FF', '#61B3FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.premiumCard}
            >
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

            <TouchableOpacity style={styles.advertiseButton} onPress={myAds}>
                <Text style={styles.advertiseButtonText}>Advertise on DealNux</Text>
                <MaterialIcons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
        </>
    );

    if (loading && products.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={recommendedProducts}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.recommendedGrid}
                renderItem={({ item }) => <ProductCard product={item} size="small" />}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderListFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                onRefresh={onRefresh}
                refreshing={refreshing}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListEmptyComponent={
                    !productLoading ? (
                        <Text style={{ textAlign: 'center', color: '#64748B', marginTop: 20 }}>
                            No products found
                        </Text>
                    ) : null
                }
            />

            <PremiumModal
                visible={premiumModalVisible}
                onClose={() => setPremiumModalVisible(false)}
            />

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

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9FB',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 4,
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

    searchContainer: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        flexDirection: 'row',
        paddingVertical: 10,
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

    categoryContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
        marginRight: 16,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D6DB',
    },
    categoryButtonActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    categoryText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    categoryTextActive: {
        color: 'white',
    },

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

    productCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 20,
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

    recommendedGrid: {
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
})