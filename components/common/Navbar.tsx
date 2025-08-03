import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'

import { SymbolView, SymbolViewProps, SFSymbol } from 'expo-symbols';
import { useRouter } from 'expo-router'
import { AnimatedPressable } from '../ui/AnimatedPressable'
import { LinearGradient } from 'expo-linear-gradient'
const Navbar = () => {
  const router = useRouter()

  return (
    <LinearGradient colors={["#fefefe", "rgba(255, 255, 255, 0)"]} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, width: '100%', paddingTop: 60, position: "absolute", top: 0, zIndex: 1000 }}>
        <AnimatedPressable contentStyle={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {}}>
            <Text style={{ fontFamily: 'SFPro-Bold', fontSize: 26, color: '#404040' }}>Reveries</Text>
        </AnimatedPressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
        <SymbolView name="qrcode" size={24} tintColor={"#404040"} weight="bold"/>
        <SymbolView name="ellipsis" size={24} tintColor={"#404040"} weight="bold"/>
        </View>    
    </LinearGradient>
  )
}

export default Navbar