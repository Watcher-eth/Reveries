// screens/ReceiveScreen.tsx
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard';
import {RadialGradient} from "@shopify/react-native-skia"
import QRCode from 'react-native-qrcode-skia';

import { SymbolView, SymbolViewProps } from 'expo-symbols'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')
const QR_SIZE = width * 0.75

type CircleButtonProps = {
  name: SymbolViewProps['name']
  label: string
  onPress: () => void
}

const CircleButton: React.FC<CircleButtonProps> = ({ name, label, onPress }) => (
  <TouchableOpacity style={styles.circleBtn} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.circleIcon}>
      <SymbolView name={name} size={33} tintColor="#fff" weight="bold" />
    </View>
    <Text style={styles.circleLabel}>{label}</Text>
  </TouchableOpacity>
)

export default function ReceiveScreen() {
  const router = useRouter()
  const codeValue = 'Stacy Brown'

  const handleCopy = async () => {
    await Clipboard.setString(codeValue)
    if (Platform.OS === 'android') {
      ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT)
    } else {
      Alert.alert('Copied to clipboard')
    }
  }

  const supportedNetworks = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0wLyLhp35Mx21OjtX3M5A_j3F4kw_7RBTHQ&s',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDsMpHuhiWm99nmXiAsS8HC7nt6rgtyVzUfA&s',
    "https://www.citypng.com/public/uploads/preview/ethereum-eth-round-logo-icon-png-701751694969815akblwl2552.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVkl5dxKFhTXviMza8tVnX_mW6oLbIFqmP8g&s",
    "https://imgs.search.brave.com/8NYhXqk1fx3dnUnHGJsOpkqHbNED7y5Mphrj0q3UQWQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy80/LzRhL0NpcmNsZV9V/U0RDX0xvZ28uc3Zn",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfugF-WFtnIlahQfoIzgfdSUnvOaCb0J5X2g&s"
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Share</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <SymbolView name="xmark" size={20} tintColor="#fff" weight="bold" />
        </TouchableOpacity>
      </View>

      <View style={{ display: "flex", flexDirection: "column", alignItems: 'center'}}>
        <Text style={styles.codeLabel}>{codeValue}</Text>
        <View style={styles.qrCard}>
            <QRCode value={codeValue} size={QR_SIZE}       
                    shapeOptions={{
                    shape: "circle",
                    eyePatternShape: "rounded",
                    eyePatternGap: 0,
                    gap: 0
                }}
                logoAreaSize={70}
                logo={
                    <View style={{
                    height: 50,
                    aspectRatio: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 38 }}>🦊</Text>
                    </View>
                }
            >
                <RadialGradient c={{ x: 100, y: 100 }} r={100} colors={["#212121","#181818"]} />
            </QRCode>
        </View>

        <View style={styles.networkRow}>
            {supportedNetworks.map((uri) => (
            <Image
                key={uri}
                source={{ uri }}
                style={styles.networkIcon}
                resizeMode="contain"
            />
            ))}
        </View>
        <Text style={styles.networksLabel}>Supported Platforms</Text>
    </View>

      <View style={styles.actionsRow}>
        <CircleButton name="paintpalette" label="Customize" onPress={() => {}} />
        <CircleButton name="square.and.arrow.up" label="Share" onPress={handleCopy} />
        <CircleButton name="doc.on.doc" label="Copy" onPress={() => {}} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    display:"flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
paddingVertical:55,
paddingBottom: 70,
borderRadius: 30,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  codeLabel: {
    marginTop: 16,
    color: '#fff',
    fontSize: 22,
    fontFamily: 'SFPro-Bold',
  },
  qrCard: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 22,
    // center it
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  networkIcon: {
    width: 24,
    height: 24,
    marginHorizontal: -3,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#080808',
  },
  networksLabel: {
    color: '#777',
    fontSize: 12,
    marginTop: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 32,
  },
  circleBtn: {
    alignItems: 'center',
  },
  circleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleLabel: {
    marginTop: 8,
    color: '#777',
    fontSize: 14,
  },
})
