import { MaterialIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { Image, Pressable, ScrollView, Switch, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthStackParamList } from '../../Navigation/types'
import CartProductCard from '../../components/CartProductCard'
import { Images } from '../../constants'


type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

const Cart = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const amazonProducts = [
    {
      id: '1',
      name: 'Bose QuietComfort ..',
      price: 252,
      originalPrice: 420,
      discount: '-45%',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
      quantity: 1,
    },
    {
      id: '2',
      name: 'Blender 1200W',
      price: 999,
      originalPrice: 1099,
      discount: '-10%',
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
      quantity: 1,
    },
    {
      id: '3',
      name: 'Air Zoom Pegasus 39',
      price: 299,
      originalPrice: 399,
      discount: '-40%',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      quantity: 1,
    },
  ]

  const walmartProducts = [
    {
      id: '4',
      name: 'Bose QuietComfort ..',
      price: 252,
      originalPrice: 420,
      discount: '-45%',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
      quantity: 1,
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]">
      <View className="px-5">
        <View className="flex-row items-center justify-between">
          <View className='flex-row items-center gap-2'>
            <Text className='text-xl font-bold'>My Cart</Text>
            <Text className='text-[#636F85]'>(4)</Text>
          </View>
          <Text className="text-[#636F85]">Clear All</Text>
        </View>

        <View className="flex-row items-center border-2 border-[#E5E7EB] rounded-2xl px-4 py-2 gap-4 mt-4">

          <View className='bg-[#2355B61A] p-4 rounded-full'>
            <MaterialIcons name="electric-bolt" size={24} color="#2355B6" />
          </View>

          <View className="flex-1">
            <Text className='text-xl font-bold'>
              Optimize Cart
            </Text>
            <Text className='text-gray-500 '>
              Find lowest prices across stores
            </Text>
          </View>

          <Switch
            trackColor={{ false: '#767577', true: '#2355B6' }}
            thumbColor={'#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />

        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="mt-6 mb-48">
          {/* Amazon Section */}
          <View className='border-2 border-[#E5E7EB] rounded-3xl'>
            <View className='flex-row items-center justify-center gap-4 px-4 py-3 border-b-2 border-[#E5E7EB]'>
              <Image source={Images.Amazon} resizeMode='cover' />
              <Text className='text-3xl font-semibold'>Amazon</Text>
              <Text className='bg-[#27C8401A] p-2 rounded-xl text-[#137C0A] font-bold ml-auto'>
                Free Shipping
              </Text>
            </View>

            <View className='p-4'>
              {amazonProducts.map((product) => (
                <CartProductCard
                  key={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  quantity={product.quantity}
                />
              ))}
            </View>

            <View className='bg-[#36405305] flex-row items-center justify-between px-6 py-3 rounded-b-3xl'>
              <Text className='text-[#636F85] text-xl'>AMAZON SUBTOTAL</Text>
              <Text className='text-3xl font-bold'>$1550.00</Text>
            </View>
          </View>

          {/* Walmart Section */}
          <View className='border-2 border-[#E5E7EB] rounded-3xl my-5'>
            <View className='flex-row items-center justify-center gap-4 px-4 py-3 border-b-2 border-[#E5E7EB]'>
              <Image source={Images.Wallmart} resizeMode='cover' />
              <Text className='text-3xl font-semibold'>Walmart</Text>
              <Text className='bg-[#2355B61A] p-2 rounded-xl text-[#2355B6] font-bold ml-auto'>
                Deal Alert!
              </Text>
            </View>

            <View className='p-4'>
              {walmartProducts.map((product) => (
                <CartProductCard
                  key={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  quantity={product.quantity}
                />
              ))}
            </View>

            <View className='bg-[#36405305] flex-row items-center justify-between px-6 py-4 rounded-b-3xl'>
              <Text className='text-[#636F85] text-xl'>WALMART SUBTOTAL</Text>
              <Text className='text-3xl font-bold'>$252.00</Text>
            </View>
          </View>

          <Pressable className='p-5 bg-[#2355B6] rounded-xl mb-6' onPress={() => navigation.navigate("CheckoutOptions")} >
            <Text className='text-white text-xl font-bold text-center'>
              See Best Checkout Option
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Cart