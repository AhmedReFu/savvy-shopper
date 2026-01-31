import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import {
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'

const { height } = Dimensions.get('window')

interface ChatBotModalProps {
    visible: boolean
    onClose: () => void
}

const ChatModal = ({ visible, onClose }: ChatBotModalProps) => {
    const products = [
        {
            id: '1',
            name: 'Bose QuietComfort..',
            price: 252,
            originalPrice: 420,
            discount: '-45%',
            image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
            seller: 'Amazon'
        }
    ]

    const runningShoes = [
        {
            id: '2',
            name: 'Air Zoom Pegasus 39',
            price: 299,
            originalPrice: 399,
            discount: '-40%',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
            seller: 'Amazon'
        },
        {
            id: '3',
            name: 'Air Zoom Pegasus 40',
            price: 99.5,
            originalPrice: 199,
            discount: '-50%',
            image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
            seller: 'Amazon'
        }
    ]

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.botIcon}>
                                <Ionicons name="chatbubbles" size={24} color="#2563EB" />
                            </View>
                            <Text style={styles.headerTitle}>ChatBot Assistant</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Chat Messages */}
                    <ScrollView
                        style={styles.chatContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Time */}
                        <Text style={styles.timeText}>08:15 AM</Text>

                        {/* Assistant Message 1 */}
                        <View style={styles.messageContainer}>
                            <View style={styles.assistantIcon}>
                                <Ionicons name="chatbubbles" size={20} color="#2563EB" />
                            </View>
                            <View style={styles.messageContent}>
                                <Text style={styles.assistantLabel}>Assistant</Text>
                                <Text style={styles.messageText}>
                                    Hi! I found some price drops on items similar to your recent searches.
                                </Text>

                                {/* Product Card */}
                                {products.map((product) => (
                                    <View key={product.id} style={styles.productCard}>
                                        <View style={styles.productImageContainer}>
                                            <Image
                                                source={{ uri: product.image }}
                                                style={styles.productImage}
                                                resizeMode="cover"
                                            />
                                            <View style={styles.discountBadge}>
                                                <Text style={styles.discountText}>{product.discount}</Text>
                                            </View>
                                            <TouchableOpacity style={styles.heartButton}>
                                                <Ionicons name="heart-outline" size={18} color="#64748B" />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productName}>{product.name}</Text>
                                            <View style={styles.priceRow}>
                                                <Text style={styles.price}>${product.price}</Text>
                                                <Text style={styles.originalPrice}>${product.originalPrice}</Text>
                                            </View>
                                            <View style={styles.sellerRow}>
                                                <MaterialIcons name="storefront" size={14} color="#94A3B8" />
                                                <Text style={styles.sellerText}>{product.seller}</Text>
                                                <MaterialIcons name="arrow-forward" size={14} color="#94A3B8" />
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* User Message */}
                        <View style={styles.userMessageContainer}>
                            <View style={styles.userMessage}>
                                <Text style={styles.userMessageText}>
                                    Show me running shoes under $100
                                </Text>
                            </View>
                        </View>

                        {/* Assistant Message 2 */}
                        <View style={styles.messageContainer}>
                            <View style={styles.assistantIcon}>
                                <Ionicons name="chatbubbles" size={20} color="#2563EB" />
                            </View>
                            <View style={styles.messageContent}>
                                <Text style={styles.assistantLabel}>Assistant</Text>
                                <Text style={styles.messageText}>
                                    Here are top-rated running shoes under $100 currently on sale:
                                </Text>

                                {/* Running Shoes - Horizontal Scroll */}
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.horizontalScroll}
                                >
                                    {runningShoes.map((shoe) => (
                                        <View key={shoe.id} style={styles.shoeCard}>
                                            <View style={styles.shoeImageContainer}>
                                                <Image
                                                    source={{ uri: shoe.image }}
                                                    style={styles.shoeImage}
                                                    resizeMode="cover"
                                                />
                                                <View style={styles.discountBadge}>
                                                    <Text style={styles.discountText}>{shoe.discount}</Text>
                                                </View>
                                                <TouchableOpacity style={styles.heartButton}>
                                                    <Ionicons name="heart" size={18} color="#EF4444" />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.shoeInfo}>
                                                <Text style={styles.shoeName} numberOfLines={1}>
                                                    {shoe.name}
                                                </Text>
                                                <View style={styles.priceRow}>
                                                    <Text style={styles.price}>${shoe.price}</Text>
                                                    <Text style={styles.originalPrice}>${shoe.originalPrice}</Text>
                                                </View>
                                                <View style={styles.sellerRow}>
                                                    <MaterialIcons name="storefront" size={12} color="#94A3B8" />
                                                    <Text style={styles.sellerTextSmall}>{shoe.seller}</Text>
                                                    <MaterialIcons name="arrow-forward" size={12} color="#94A3B8" />
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>

                                {/* Action Buttons */}
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity style={styles.actionButton}>
                                        <Text style={styles.actionButtonText}>Compare these 3</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionButton}>
                                        <Text style={styles.actionButtonText}>Show cheaper options</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={{ height: 80 }} />
                    </ScrollView>

                    {/* Input Area */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            placeholderTextColor="#9CA3AF"
                        />
                        <TouchableOpacity style={styles.sendButton}>
                            <Ionicons name="send" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ChatModal

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: height * 0.85,
        paddingBottom: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    botIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2563EB',
    },
    closeButton: {
        padding: 4,
    },
    chatContent: {
        flex: 1,
        padding: 16,
    },
    timeText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 16,
    },
    messageContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    assistantIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },
    messageContent: {
        flex: 1,
    },
    assistantLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 6,
    },
    messageText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
        marginBottom: 12,
    },
    productCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
    },
    productImageContainer: {
        position: 'relative',
        height: 140,
        backgroundColor: '#E5E7EB',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FCD34D',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
    },
    discountText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000',
    },
    heartButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'white',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfo: {
        padding: 10,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2563EB',
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    sellerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    sellerText: {
        fontSize: 12,
        color: '#9CA3AF',
        flex: 1,
    },
    sellerTextSmall: {
        fontSize: 11,
        color: '#9CA3AF',
        flex: 1,
    },
    userMessageContainer: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    userMessage: {
        backgroundColor: '#DBEAFE',
        borderRadius: 16,
        borderTopRightRadius: 4,
        padding: 12,
        maxWidth: '80%',
    },
    userMessageText: {
        fontSize: 14,
        color: '#1F2937',
    },
    horizontalScroll: {
        marginTop: 8,
    },
    shoeCard: {
        width: 160,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginRight: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    shoeImageContainer: {
        position: 'relative',
        height: 120,
        backgroundColor: '#F3F4F6',
    },
    shoeImage: {
        width: '100%',
        height: '100%',
    },
    shoeInfo: {
        padding: 8,
    },
    shoeName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    actionButton: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    actionButtonText: {
        fontSize: 13,
        color: '#2563EB',
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#1F2937',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
})