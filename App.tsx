import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StatusBar } from 'expo-status-bar';
import "./global.css";
import { AuthStackParamList } from './src/Navigation/types';
import AuthScreen from './src/screens/Auth_Screen/AuthScreen';
import CreateNewPassword from './src/screens/Auth_Screen/CreateNewPassword';
import OtpAuth from './src/screens/Auth_Screen/OtpAuth';
import OtpResetPassword from './src/screens/Auth_Screen/OtpResetPassword';
import ProfileSetup from './src/screens/Auth_Screen/ProfileSetup';
import ResetPassword from './src/screens/Auth_Screen/ResetPassword';
import SignIn from './src/screens/Auth_Screen/SignIn';
import SignUp from './src/screens/Auth_Screen/SignUp';
import AdsPerformance from './src/screens/Home/AdsPerformance';
import CheckoutOptions from './src/screens/Home/CheckoutOptions';
import CreateAds from './src/screens/Home/CreateAds';
import EditProfile from './src/screens/Home/EditProfile';
import MyAds from './src/screens/Home/MyAds';
import MyFavourite from './src/screens/Home/MyFavourite';
import Notification from './src/screens/Home/Notification';
import NotificationSettings from './src/screens/Home/NotificationSettings';
import PrivacyPolicy from './src/screens/Home/PrivacyPolicy';
import ProductDetails from './src/screens/Home/ProductDetails';
import ReFarAndEarn from './src/screens/Home/ReFarAndEarn';
import SavingsSummary from './src/screens/Home/SavingsSummary';
import ScanProduct from './src/screens/Home/ScanProduct';
import SearchProduct from './src/screens/Home/SearchProduct';
import SubscriptionPlans from './src/screens/Home/Subscription';
import MainTabs from './src/screens/Home/TabNavigation/TabNavigation';
import TodaysDeals from './src/screens/Home/TodaysDeals';
import UpdatePassword from './src/screens/Home/UpdatePassword';
import WelcomeScreen from './src/screens/Home/WelcomeScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Welcome'>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="AuthScreen" component={AuthScreen} />
      <Stack.Screen name="SignIn" component={SignIn} options={{ animation: "slide_from_left" }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="TodaysDeals" component={TodaysDeals} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="CreateAds" component={CreateAds} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="ReFarAndEarn" component={ReFarAndEarn} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="MyAds" component={MyAds} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="AdsPerformance" component={AdsPerformance} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettings} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="MyFavourite" component={MyFavourite} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="UpdatePassword" component={UpdatePassword} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="Subscription" component={SubscriptionPlans} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="ScanProduct" component={ScanProduct} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="CheckoutOptions" component={CheckoutOptions} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="SavingsSummary" component={SavingsSummary} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="Notification" component={Notification} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="SearchProduct" component={SearchProduct} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="OtpResetPassword" component={OtpResetPassword} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="OtpAuth" component={OtpAuth} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetup} options={{ animation: "slide_from_right" }} />
    </Stack.Navigator>
  );
} 


export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style='auto' />
      <AuthStack />
    </NavigationContainer>
  );
}

