import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppHeader from '../../components/AppHeader'
import BackButton from '../../components/BackButton'

const PrivacyPolicy = () => {
  return (
      <SafeAreaView className="bg-[#F9F9FB] flex-1">
          <View className="px-5 flex-1">
              <View className='flex-row items-center gap-4' >
                  <AppHeader left={() => <BackButton />} />
                  <Text className='text-lg'>Privacy Policy</Text>
                 
              </View>
              <Text className='text-xl font-bold my-3'>Terms of Service</Text>
              <Text className='text-lg my-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.</Text>
              <Text className='text-lg my-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.</Text>
              <Text className='text-xl font-bold my-3'>Cookie Policy</Text>
              <Text className='text-lg my-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.</Text>
              <Text className='text-lg my-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.</Text>
              <Ionicons name="help-circle-outline" size={32} color="#2355B6" />
          </View>
          </SafeAreaView>
  )
}

export default PrivacyPolicy