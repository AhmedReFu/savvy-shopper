import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

interface BuyCardProps {
    logo: any // Image source
    title: string
    subtitle: string
    price: string
    buy:string,
}

const BuyCard = ({
    logo,
    title,
    subtitle,
    price,
    buy,
}: BuyCardProps) => {
    return (
        <View style={styles.card} className={`${buy === 'true' && 'border-l-8 border-[#2355B6]' }`}>
            {/* Left side - Logo & Info */}
            <View style={styles.leftSection}>
                <Image source={logo} style={styles.logo} resizeMode="stretch" />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
            </View>

            {/* Right side - Price & Button */}
            <View style={styles.rightSection}>
                <Text style={styles.price}>{price}</Text>
                <Pressable>
                    {buy === 'true' ? (
                        <View style={[styles.button, styles.primaryButton]}>
                            <Text style={[styles.buttonText, styles.primaryButtonText]}>Buy Now</Text>
                        </View>
                    ) : (
                            <View style={[styles.button, styles.secondaryButton]}>  
                                <Text style={[styles.buttonText, styles.secondaryButtonText]}>View</Text>
                            </View>
                    )}
                </Pressable>
            </View>
        </View>
    )
}

export default BuyCard

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    logo: {
        width: 56,
        height: 56,
        borderRadius: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    rightSection: {
        alignItems: 'flex-end',
        gap: 8,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 12,
        minWidth: 100,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#2563EB',
    },
    secondaryButton: {
        backgroundColor: '#F3F4F6',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
    },
    primaryButtonText: {
        color: '#FFFFFF',
    },
    secondaryButtonText: {
        color: '#374151',
    },
})