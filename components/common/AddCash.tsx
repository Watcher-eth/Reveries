// screens/StripePartnerScreen.tsx
import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { SymbolView, SymbolViewProps } from 'expo-symbols'
import { useRouter } from 'expo-router'

const FEATURES: {
  icon: SymbolViewProps['name']
  title: string
  subtitle: string
}[] = [
  {
    icon: 'building.columns',
    title: 'Multiple payment methods',
    subtitle: 'Choose from a range of different available payment methods.',
  },
  {
    icon: 'touchid',
    title: 'Secure identity verification',
    subtitle: 'Your data is secured by Stripe, a trusted leader in online payments.',
  },
  {
    icon: 'dollarsign.circle',
    title: 'Purchase up to $10,000*',
    subtitle: 'Purchase up to $10,000 worth of crypto after verifying your identity.',
  },
]

export default function AddCash() {
    const router = useRouter()
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Top icons */}
        <View style={styles.topIcons}>
            <Image
              source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7G46uEf5yMO8SgsvklcrIGjWdVDO0QuQaoA&s"}}
              style={styles.logoWrapper}
            />
            <Image
              source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQGluJhW7I1NYU7jF77E-9K9I46_ib_DUNHw&s"}}
              style={styles.logoWrapper}
              resizeMode="contain"
            />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Chronos partners with Stripe{'\n'}for crypto purchases
        </Text>

        {/* Feature list */}
        <View style={styles.features}>
          {FEATURES.map(({ icon, title, subtitle }) => (
            <View key={title} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <SymbolView
                  name={icon}
                  size={35}
                  tintColor="#3791FF"
                  weight="bold"
                />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureSubtitle}>{subtitle}</Text>
              </View>
            </View>
          ))}
          <Text style={styles.footnote}>*Available to US & EU residents only.</Text>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => {}}>
          <Text style={styles.primaryButtonText}>Continue with Stripe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 40,

    flex: 1,
    backgroundColor: '#101010',
  },
  scroll: {
    padding: 24,
    alignItems: 'center',
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
marginTop: 50,    
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#181818',
    marginHorizontal: -5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    tintColor: '#fff',
  },
  stripeLogo: {
    width: 36,
    height: 36,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 28,
    fontFamily: 'SFPro-Bold',
  },
  features: {
    width: '100%',
    marginTop: 30,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  featureIcon: {
    width: 40,
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    paddingLeft: 12,
    fontFamily: 'SFPro-Medium',
  },
  featureTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    fontFamily: 'SFPro-Bold',
  },
  featureSubtitle: {
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'SFPro-Medium',
  },
  footnote: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  actions: {
    padding: 24,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'SFPro-Medium',
  },
})
