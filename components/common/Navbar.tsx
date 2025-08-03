import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'

import { SymbolView, SymbolViewProps, SFSymbol } from 'expo-symbols';
import { useRouter } from 'expo-router'
import { AnimatedPressable } from '../ui/AnimatedPressable'
const Navbar = () => {
  const router = useRouter()

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, width: '100%', backgroundColor: '#F8F8F8', paddingTop: 60 }}>
        <AnimatedPressable contentStyle={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {}}>
            <Image source={{uri: 'https://pbs.twimg.com/profile_images/1749354610261979136/44nFYEPi_400x400.jpg'}} style={{ width: 28, height: 28, borderRadius: 14, marginRight: 10 }} />
            <Text style={{ fontFamily: 'SFPro-Bold', fontSize: 20, color: '#808080' }}>Watchereth_</Text>
        </AnimatedPressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <AnimatedPressable onPress={() => {}}>
        <SymbolView name="qrcode" size={24} tintColor={"#808080"} weight="bold"/>
        </AnimatedPressable>
        <SymbolView name="magnifyingglass" size={24} tintColor={"#808080"} weight="bold"/>
        </View>    
    </View>
  )
}

export default Navbar