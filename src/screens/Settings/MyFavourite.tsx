import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../components/AppHeader";
import BackButton from "../../components/BackButton";
import { AuthStackParamList } from "../../Navigation/types";

const { width } = Dimensions.get("window");

const MyFavourite = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const recommendedProducts = useMemo(
        () => [
            {
                id: "3",
                name: "MacBook Air M2",
                price: 999,
                originalPrice: 1099,
                discount: "-10%",
                image:
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
                seller: "Amazon",
            },
            {
                id: "4",
                name: "Sony WH-1000XM5",
                price: 299,
                originalPrice: 399,
                discount: "-40%",
                image:
                    "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800",
                seller: "Best Buy",
            },
            {
                id: "5",
                name: "iPhone 18 Case",
                price: 25,
                originalPrice: 28,
                discount: "-08%",
                image:
                    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
                seller: "Amazon",
            },
            {
                id: "6",
                name: "Wireless Buds",
                price: 55,
                originalPrice: null,
                discount: "",
                image:
                    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
                seller: "Amazon",
            },
            {
                id: "7",
                name: "Air Zoom Pegasus 39",
                price: 299,
                originalPrice: 399,
                discount: "-40%",
                image:
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
                seller: "Amazon",
            },
            {
                id: "8",
                name: "Sony Earbuds",
                price: 999,
                originalPrice: 1099,
                discount: "-10%",
                image:
                    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
                seller: "BestBuy",
            },
        ],
        []
    );

    // ✅ default all fav
    const [favorites, setFavorites] = useState<Set<string>>(
        () => new Set(recommendedProducts.map((p) => p.id))
    );

    // ✅ filter chips
    const [tab, setTab] = useState<"all" | "price" | "stock">("all");

    const toggleFavorite = (id: string) => {
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const allFav = favorites.size === recommendedProducts.length;

    const toggleAllFavorites = () => {
        setFavorites(() => {
            if (allFav) return new Set();
            return new Set(recommendedProducts.map((p) => p.id));
        });
    };

    const Chip = ({ label, value }: { label: string; value: any }) => {
        const active = tab === value;
        return (
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setTab(value)}
                style={[
                    styles.chip,
                    active ? styles.chipActive : styles.chipInactive,
                ]}
            >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    const ProductCard = ({ product }: any) => {
        const cardWidth = (width - 50) / 2 - 6;
        const isFavorite = favorites.has(product.id);

        return (
            <Pressable
                onPress={() => navigation.navigate("ProductDetails")}
                style={[styles.productCard, { width: cardWidth }]}
            >
                {/* image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product.image }} style={styles.productImage} />

                    {/* discount */}
                    {!!product.discount && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{product.discount}</Text>
                        </View>
                    )}

                    {/* fav */}
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        activeOpacity={0.85}
                        onPress={(e: any) => {
                            e.stopPropagation?.();
                            toggleFavorite(product.id);
                        }}
                    >
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={18}
                            color={isFavorite ? "#EF4444" : "#64748B"}
                        />
                    </TouchableOpacity>
                </View>

                {/* info */}
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                        {product.name}
                    </Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>${product.price}</Text>
                        {product.originalPrice ? (
                            <Text style={styles.originalPrice}>${product.originalPrice}</Text>
                        ) : null}
                    </View>

                    <View style={styles.sellerRow}>
                        <View style={styles.storeIconBox}>
                            <MaterialIcons name="storefront" size={16} color="#94A3B8" />
                        </View>

                        <Text style={styles.sellerText}>{product.seller}</Text>

                        <Ionicons name="arrow-forward" size={18} color="#94A3B8" />
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F9F9FB" }}>
            <View style={{ paddingHorizontal: 20 }}>
                {/* Header row */}
                <View style={styles.headerRow}>
                    <AppHeader left={() => <BackButton />} />

                    <Text style={styles.headerTitle}>My Favourite</Text>

                    {/* right heart icon */}
                    <TouchableOpacity
                        onPress={toggleAllFavorites}
                        activeOpacity={0.85}
                        style={styles.headerHeart}
                    >
                        <Ionicons
                            name={allFav ? "heart" : "heart-outline"}
                            size={20}
                            color="#EF4444"
                        />
                    </TouchableOpacity>
                </View>

                {/* Filter chips */}
                <View style={styles.chipRow}>
                    <Chip label="All Items" value="all" />
                    <Chip label="Price Change" value="price" />
                    <Chip label="In Stock" value="stock" />
                </View>

                {/* Grid */}
                <ScrollView showsVerticalScrollIndicator={false} className="mb-20">
                    <View style={styles.recommendedGrid}>
                        {recommendedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default MyFavourite;

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#2D2D2D",
        flex: 1,
    },
    headerHeart: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    chipRow: {
        flexDirection: "row",
        gap: 14,
        marginTop: 4,
        marginBottom: 12,
    },
    chip: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 999,
        borderWidth: 1.5,
    },
    chipActive: {
        backgroundColor: "#2355B6",
        borderColor: "#2355B6",
    },
    chipInactive: {
        backgroundColor: "#fff",
        borderColor: "#D1D6DB",
    },
    chipText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#636F85",
    },
    chipTextActive: {
        color: "#fff",
    },

    recommendedGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 20,
        marginBottom:60
    },

    productCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#EEF0F3",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    imageContainer: {
        position: "relative",
        height: 180,
        backgroundColor: "#E2E8F0",
    },
    productImage: {
        width: "100%",
        height: "100%",
    },
    discountBadge: {
        position: "absolute",
        top: 14,
        left: 14,
        backgroundColor: "#FCD34D",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    discountText: {
        color: "#000",
        fontWeight: "800",
        fontSize: 14,
    },
    favoriteButton: {
        position: "absolute",
        top: 14,
        right: 14,
        backgroundColor: "white",
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },

    productInfo: {
        padding: 14,
        backgroundColor: "#FFFFFF",
    },
    productName: {
        fontSize: 18,
        fontWeight: "800",
        color: "#1F2937",
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
    },
    price: {
        fontSize: 22,
        fontWeight: "900",
        color: "#1D4ED8",
    },
    originalPrice: {
        fontSize: 18,
        color: "#94A3B8",
        textDecorationLine: "line-through",
        fontWeight: "700",
    },
    sellerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    storeIconBox: {
        width: 26,
        height: 26,
        borderRadius: 6,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    sellerText: {
        fontSize: 16,
        color: "#64748B",
        flex: 1,
        fontWeight: "700",
    },
});
