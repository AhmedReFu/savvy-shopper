import { MaterialIcons } from '@expo/vector-icons'
import React, { useRef } from 'react'
import { Animated, Image, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface CartProductCardProps {
    image: string
    name: string
    price: number
    originalPrice: number
    discount: string
    quantity?: number
}

const CartProductCard = ({
    image,
    name,
    price,
    originalPrice,
    discount,
    quantity = 1
}: CartProductCardProps) => {
    const translateX = useRef(new Animated.Value(0)).current

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 5
            },
            onPanResponderMove: (_, gestureState) => {
                // Only allow left swipe (negative dx)
                if (gestureState.dx < 0) {
                    translateX.setValue(Math.max(gestureState.dx, -80))
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx < -40) {
                    // Swipe left enough, show delete button
                    Animated.spring(translateX, {
                        toValue: -80,
                        useNativeDriver: true,
                    }).start()
                } else {
                    // Return to original position
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start()
                }
            },
        })
    ).current

    return (
        <View style={styles.container}>
            {/* Delete Button (Hidden Behind) */}
            <View style={styles.deleteContainer}>
                <TouchableOpacity style={styles.deleteButton}>
                    <MaterialIcons name="delete" size={36} color="black" />
                </TouchableOpacity>
            </View>

            {/* Swipeable Card */}
            <Animated.View
                style={[
                    styles.card,
                    {
                        transform: [{ translateX }],
                    },
                ]}
                {...panResponder.panHandlers}
            >
                {/* Product Image */}
                <Image
                    source={{ uri: image }}
                    style={styles.productImage}
                    resizeMode="cover"
                />

                {/* Product Info */}
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                        {name}
                    </Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>${price}</Text>
                        <Text style={styles.originalPrice}>${originalPrice}</Text>
                    </View>
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{discount}</Text>
                    </View>
                </View>

                {/* Quantity Controls */}
                <View style={styles.quantityContainer}>
                    <TouchableOpacity style={styles.quantityButton}>
                        <MaterialIcons name="add" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity style={styles.quantityButton}>
                        <MaterialIcons name="remove" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    )
}

export default CartProductCard

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginBottom: 10,
        overflow: 'hidden',
        backgroundColor: '#FFC649',
        borderRadius: 16
    },
    deleteContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#FFC649',
        width: 60,
        height: 100,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
    },
    productInfo: {
        flex: 1,
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
        marginBottom: 6,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2355B6',
    },
    originalPrice: {
        fontSize: 14,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    discountBadge: {
        backgroundColor: '#FEF3C7',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    discountText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#92400E',
    },
    quantityContainer: {
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F3F4F6',
        padding: 6,
        borderRadius: 12,
    },
    quantityButton: {
        width: 30,
        height: 30,
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
})