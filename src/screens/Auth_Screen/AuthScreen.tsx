import { AntDesign, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Images } from '../../constants';

interface IconProps {
    color?: string;
    size?: number;
}

const { width, height } = Dimensions.get('window');

const AuthScreen = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Signup fields
    const [role, setRole] = useState("User");
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={Images.Logo} // Replace with your logo
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>
            <ScrollView contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                scrollEnabled={activeTab === 'signup' ? true : false}
            >
                {/* Card */}
                <View style={styles.card}>
                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'login' && styles.tabActive]}
                            onPress={() => setActiveTab('login')}
                        >
                            <Text style={activeTab === 'login' ? styles.tabTextActive : styles.tabText}>
                                Log In
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'signup' && styles.tabActive]}
                            onPress={() => setActiveTab('signup')}
                        >
                            <Text style={activeTab === 'signup' ? styles.tabTextActive : styles.tabText}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Login Form */}
                    {activeTab === 'login' && (
                        <View>
                            <Text style={styles.welcomeText}>Hi, Welcome back!</Text>
                            <Text style={styles.subtitleText}>
                                Sign in to continue exploring the best deals
                            </Text>

                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Your email ex: yourmail@gamil.com"
                                placeholderTextColor="#A0A0A0"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="****************"
                                    placeholderTextColor="#A0A0A0"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <Ionicons name="eye-outline" size={24} color="black" /> : <Ionicons name="eye-off-outline" size={24} color="black" />}
                                </TouchableOpacity>
                            </View>

                            <View style={styles.optionsRow}>
                                <TouchableOpacity
                                    style={styles.rememberMeContainer}
                                    onPress={() => setRememberMe(!rememberMe)}
                                >
                                    <View style={styles.checkbox}>
                                        {rememberMe && <View style={styles.checkboxInner} />}
                                    </View>
                                    <Text style={styles.rememberMeText}>Remember Me</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.forgotPassword}>Forgot Password ?</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.mainButton}>
                                <Text style={styles.mainButtonText}>Log In</Text>
                            </TouchableOpacity>

                            <View style={styles.dividerContainer}>
                                <View style={styles.divider} />
                                <Text style={styles.orText}>or</Text>
                                <View style={styles.divider} />
                            </View>

                            <View style={styles.socialContainer}>
                                <TouchableOpacity style={styles.socialButton}>
                                    <AntDesign name="google" size={30} color="#093542" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialButton}>
                                    <AntDesign name="apple" size={30} color="#093542" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Signup Form */}
                    {activeTab === 'signup' && (
                        <View>
                            <Text style={styles.welcomeText}>Create New Account</Text>
                            <Text style={styles.subtitleText}>
                                Please fill your detail information.
                            </Text>

                            <Text style={styles.label}>Select Your Role</Text>
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => setShowRoleDropdown(!showRoleDropdown)}
                            >
                                <Text style={styles.dropdownText}>{role}</Text>
                                <Text style={styles.dropdownIcon}>
                                    {showRoleDropdown ? '︿' : '︾'}
                                </Text>
                            </TouchableOpacity>
                            {showRoleDropdown && (
                                <View>
                                    {role === 'Trainer' && (
                                        <TouchableOpacity
                                            style={styles.dropdownOption}
                                            onPress={() => {
                                                setRole('User');
                                                setShowRoleDropdown(false);
                                            }}
                                        >
                                            <Text style={styles.dropdownText}>User</Text>
                                        </TouchableOpacity>
                                    )}
                                    {role === 'User' && (
                                        <TouchableOpacity
                                            style={styles.dropdownOption}
                                            onPress={() => {
                                                setRole('Trainer');
                                                setShowRoleDropdown(false);
                                            }}
                                        >
                                            <Text style={styles.dropdownText}>Trainer</Text>
                                        </TouchableOpacity>)
                                    }
                                </View>
                            )}

                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your full name"
                                placeholderTextColor="#A0A0A0"
                                value={name}
                                onChangeText={setName}
                            />

                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Your email ex: yourmail@gamil.com"
                                placeholderTextColor="#A0A0A0"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <Text style={styles.label}>Mobile Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Your mobile number"
                                placeholderTextColor="#A0A0A0"
                                value={mobile}
                                onChangeText={setMobile}
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="****************"
                                    placeholderTextColor="#A0A0A0"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <Ionicons name="eye-outline" size={24} color="black" /> : <Ionicons name="eye-off-outline" size={24} color="black" />}
                                   
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="****************"
                                    placeholderTextColor="#A0A0A0"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <Ionicons name="eye-outline" size={24} color="black" /> : <Ionicons name="eye-off-outline" size={24} color="black" />}
                                    
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.termsContainer}
                                onPress={() => setAgreeToTerms(!agreeToTerms)}
                            >
                                <View
                                    style={[
                                        styles.checkboxSquare,
                                        agreeToTerms && styles.checkboxSquareChecked,
                                    ]}
                                >
                                    {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
                                </View>
                                <Text style={styles.termsText}>
                                    I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text>{' '}
                                    and <Text style={styles.termsLink}>Privacy Policy</Text>
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity  style={styles.mainButton}>
                                <Text style={styles.mainButtonText}>Verify Email</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
           </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D8D8D8',
    },
    scrollContent: {
        flexGrow: 1,
    },
    logoContainer: {
        alignItems: 'center',
        paddingTop: height * 0.02,
    },
    logoImage: {
        width: width * 0.6,
        height: height * 0.2,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 24,
        
        paddingTop: 20,
        paddingBottom: 40,
        minHeight: height * 0.75,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 18,
        padding: 2,
        borderRadius: 12,
        borderColor: '#0000001A',
        borderWidth: 1.5,
        gap: 12,
        backgroundColor: '#F5F5F5'
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
    },
    tabActive: {
        backgroundColor: '#1A4D5C',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666666',
    },
    tabTextActive: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 6,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: '#000000',
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 25,
        height: 25,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#D0D0D0',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxInner: {
        width: 15,
        height: 15,
        borderRadius: 8,
        backgroundColor: '#1A4D5C',
    },
    rememberMeText: {
        fontSize: 16,
        color: '#666666',
    },
    forgotPassword: {
        fontSize: 16,
        color: '#E74C3C',
    },
    mainButton: {
        backgroundColor: '#1A4D5C',
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 8,
    },
    mainButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    orText: {
        fontSize: 16,
        color: '#666666',
        marginHorizontal: 16,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    socialButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialIcon: {
        fontSize: 24,
        fontWeight: '600',
        color: '#666666',
    },
    dropdownButton: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: 16,
        color: '#000000',
    },
    dropdownIcon: {
        fontSize: 16,
        color: '#666666',
    },
    dropdownOption: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginTop: 4,
    },
    passwordContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
        color: '#000000',
    },
    eyeIcon: {
        fontSize: 18,
        opacity: 0.5,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 20,
        marginBottom: 24,
    },
    checkboxSquare: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#1A4D5C',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    checkboxSquareChecked: {
        backgroundColor: '#1A4D5C',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    termsText: {
        flex: 1,
        fontSize: 16,
        color: '#666666',
        lineHeight: 25,
    },
    termsLink: {
        color: '#000000',
        textDecorationLine: 'underline',
    },
});

export default AuthScreen;