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
import Notification from './src/screens/Home/Notification';
import SearchProduct from './src/screens/Home/SearchProduct';
import MainTabs from './src/screens/Home/TabNavigation/TabNavigation';
import WelcomeScreen from './src/screens/Home/WelcomeScreen';
import ProductDetails from './src/screens/Home/ProductDetails';

const Stack = createNativeStackNavigator<AuthStackParamList>();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Welcome'>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="AuthScreen" component={AuthScreen} />
      <Stack.Screen name="SignIn" component={SignIn} options={{ animation: "slide_from_left" }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ animation: "slide_from_right" }} />
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

