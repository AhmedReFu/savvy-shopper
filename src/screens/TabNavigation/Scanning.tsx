import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { CameraView, useCameraPermissions } from 'expo-camera'
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthStackParamList } from '../../Navigation/types'

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

const Scanning = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)


  useFocusEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("ScanProduct");
    }, 3000);

    return () => clearTimeout(timer);
  });

  // Handle barcode scan
  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true)
    Alert.alert(
      'Product Found!',
      `Barcode: ${data}`,
      [
        {
          text: 'Scan Again',
          onPress: () => setScanned(false)
        },
        {
          text: 'View Product',
          onPress: () => {
            // Navigate to product details
            console.log('Navigate to product:', data)
          }
        }
      ]
    )
  }

  // Request permission if not granted
  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color="#9CA3AF" />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to scan product barcodes
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }



  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <Text style={styles.headerTitle}>Scan Product</Text>
      </SafeAreaView>

      {/* Camera View */}
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code128'],
        }}
      >
        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Top instruction */}
          <View style={styles.topInstruction}>
            <Text style={styles.instructionText}>
              Align barcode within the frame
            </Text>
          </View>

          {/* Scanning Frame */}
          <View style={styles.scanFrame}>
            {/* Corner borders */}
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />

            {/* Scanning line animation */}
            {!scanned && (
              <View style={styles.scanLine} />
            )}
          </View>

          {/* Bottom text */}
          <View style={styles.bottomInstruction}>
            <Text style={styles.scanningText}>
              {scanned ? 'Scanned!' : 'Scanning automatically...'}
            </Text>
          </View>

          {/* Upload from gallery button */}
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload From Gallery</Text>
            <Ionicons name="image-outline" size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  )
}

export default Scanning

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topInstruction: {
    position: 'absolute',
    top: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  instructionText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  scanFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#FFFFFF',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 20,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 20,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 20,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 20,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  bottomInstruction: {
    position: 'absolute',
    bottom: 180,
  },
  scanningText: {
    fontSize: 15,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9F9FB',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})