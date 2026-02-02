import { Ionicons } from "@expo/vector-icons"
import * as Clipboard from 'expo-clipboard'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppHeader from '../../components/AppHeader'
import BackButton from '../../components/BackButton'

const ReferAndEarn = () => {
    const referralCode = 'SAVE2026'
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await Clipboard.setStringAsync(referralCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const onShare = async () => {
        try {
            await Share.share({
                message: `Use my referral code ${referralCode} and get $10 off!`,
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <AppHeader left={() => <BackButton />} />
                    <Text style={styles.headerTitle}>Refer & Earn</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Hero Card */}
                    <LinearGradient
                        colors={['#3B66B0', '#2952A3']}
                        style={styles.heroCard}
                    >
                        <Text style={styles.heroTitle}>Refer a Friend &</Text>
                        <Text style={styles.heroAmount}>Both Get $10</Text>
                        <Text style={styles.heroDescription}>
                            Give your friends a discount and earn{'\n'}credits for your next smart purchase.
                        </Text>
                    </LinearGradient>

                    {/* Code Card */}
                    <View style={styles.codeCard}>
                        <View style={styles.codeHeader}>
                            <Text style={styles.codeTitle}>Savings Trends</Text>
                            <Pressable onPress={handleCopy} style={styles.copyBadge}>
                                <Text style={styles.copyBadgeText}>
                                    {copied ? 'Copied!' : 'Tap to copy'}
                                </Text>
                            </Pressable>
                        </View>

                        {/* Code Input */}
                        <View style={styles.codeInputContainer}>
                            <View style={styles.codeBox}>
                                <Text style={styles.codeText}>{referralCode}</Text>
                            </View>
                            <Pressable onPress={handleCopy} style={styles.copyButton}>
                                <Ionicons name="copy-outline" size={20} color="#6B7280" />
                            </Pressable>
                        </View>

                        {/* Share Button */}
                        <Pressable onPress={onShare} style={styles.shareButton}>
                            <Ionicons name="share-social-outline" size={20} color="#fff" />
                            <Text style={styles.shareButtonText}>Share Referral Link</Text>
                        </Pressable>
                    </View>

                    {/* How it works */}
                    <View style={styles.howItWorks}>
                        <View style={styles.dividerRow}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>HOW IT WORKS</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Steps */}
                        <View style={styles.stepsContainer}>
                            {/* Step 1 */}
                            <View style={styles.step}>
                                <View style={styles.stepIconContainer}>
                                    <View style={styles.stepIconCircle}>
                                        <Ionicons name="headset-outline" size={24} color="#2563EB" />
                                    </View>
                                    <View style={styles.stepLine} />
                                </View>
                                <View style={styles.stepContent}>
                                    <Text style={styles.stepTitle}>Invite a friend</Text>
                                    <Text style={styles.stepDescription}>
                                        Share your unique link or code via text, email, or social media.
                                    </Text>
                                </View>
                            </View>

                            {/* Step 2 */}
                            <View style={styles.step}>
                                <View style={styles.stepIconContainer}>
                                    <View style={styles.stepIconCircle}>
                                        <Ionicons name="headset-outline" size={24} color="#2563EB" />
                                    </View>
                                    <View style={styles.stepLine} />
                                </View>
                                <View style={styles.stepContent}>
                                    <Text style={styles.stepTitle}>They join & save</Text>
                                    <Text style={styles.stepDescription}>
                                        Your friend signs up and gets a discount their first scan.
                                    </Text>
                                </View>
                            </View>

                            {/* Step 3 */}
                            <View style={styles.step}>
                                <View style={styles.stepIconContainer}>
                                    <View style={styles.stepIconCircle}>
                                        <Ionicons name="headset-outline" size={24} color="#2563EB" />
                                    </View>
                                </View>
                                <View style={styles.stepContent}>
                                    <Text style={styles.stepTitle}>You both earn $10</Text>
                                    <Text style={styles.stepDescription}>
                                        Credits are automatically applied to your wallet instantly.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>    
            </ScrollView>
        </SafeAreaView>
    )
}

export default ReferAndEarn

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9FB',
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 12,
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    content: {
        paddingHorizontal: 20,
    },
    heroCard: {
        borderRadius: 28,
        paddingVertical: 40,
        paddingHorizontal: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    heroAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFC53D',
        textAlign: 'center',
        marginTop: 4,
    },
    heroDescription: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 22,
    },
    codeCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginTop: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    codeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    codeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    copyBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    copyBadgeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2563EB',
    },
    codeInputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F9FAFB',
    },
    codeBox: {
        flex: 1,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    codeText: {
        fontSize: 26,
        fontWeight: 'bold',
        letterSpacing: 2,
        color: '#1F2937',
    },
    copyButton: {
        width: 60,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareButton: {
        backgroundColor: '#2563EB',
        borderRadius: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 20,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    shareButtonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    howItWorks: {
        marginTop: 32,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 13,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 1,
    },
    stepsContainer: {
        paddingBottom: 40,
    },
    step: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    stepIconContainer: {
        alignItems: 'center',
        marginRight: 20,
    },
    stepIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#E5E7EB',
        marginTop: 8,
    },
    stepContent: {
        flex: 1,
        paddingTop: 8,
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 6,
    },
    stepDescription: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 22,
    },
})