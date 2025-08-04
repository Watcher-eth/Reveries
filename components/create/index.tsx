import React from 'react'
import { View, Text } from 'react-native'
import GridMaskedBackground from '../ui/GridBackground'
import { LinearGradient } from 'expo-linear-gradient'
import { AnimatedPressable } from '../ui/AnimatedPressable'
import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
function CreateVideo() {
    const router = useRouter()
  return (
    <View style={{flex: 1, borderRadius: 50}}>
         <LinearGradient colors={["#fefefe", "rgba(255, 255, 255, 0)"]} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, width: '100%', paddingTop: 60, position: "absolute", top: 0, zIndex: 1000, borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
               <AnimatedPressable contentStyle={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {router.navigate("/create")}}>
                   <Text style={{ fontFamily: 'SFPro-Bold', fontSize: 26, color: '#727070' }}>Create Memory</Text>
               </AnimatedPressable>
               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
              
               <AnimatedPressable containerStyle={{ paddingTop: 6 }} onPress={() => {router.back()}}>
               <SymbolView name="xmark" size={20} tintColor={"#727070"} weight="bold"/>
               </AnimatedPressable>
               </View>    
           </LinearGradient>
        <GridMaskedBackground/>
        <AnimatedPressable containerStyle={{ height: "50%", width: "92%", backgroundColor: "#fff", borderRadius: 20, alignSelf: "center", marginTop: 110,  }} contentStyle={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <View style={{ height: "96%", width: "96%", backgroundColor: "#f8f8f8", borderRadius: 15, alignSelf: "center", borderWidth: 3, borderColor: "#EFEFEF", borderStyle: "dashed", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <SymbolView name="photo.badge.plus" size={124} tintColor={"#E9E9E9"} weight="medium" animationSpec={{ effect: { type: "bounce", }, repeating: true, speed: 0.04 }}/>
        </View>
        </AnimatedPressable><Text style={{ fontFamily: 'SFPro-Bold', fontSize: 17, color: '#8a8a8a', marginTop: 15, paddingHorizontal: 20}}>Describe your memory</Text>
        <View style={{ height: "20%", width: "92%", backgroundColor: "#fff", borderRadius: 20, alignSelf: "center", marginTop: 7, borderWidth: 1.5, borderColor: "#EFEFEF", padding: 16 }}>
            <Text style={{ fontFamily: 'SFPro-Bold', fontSize: 17, color: '#bbb' }}>It was a beautiful winter day in the scottish Highlands.
My Grandma took me out to feed the Ducks at the 
nearby pond. She was mildly annoyed because I kept 
getting distracted on the way there...</Text>
        </View>
        <AnimatedPressable containerStyle={{ height: 60, width: "92%", backgroundColor: "#000", borderRadius: 30, alignSelf: "center", marginTop: 20, borderWidth: 1.5, borderColor: "#EFEFEF" }} contentStyle={{ width: "100%", height: "100%", display: "flex", flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center" }} onPress={() => {router.navigate("/create")}}>
            <SymbolView name="sparkles.rectangle.stack.fill" size={24} tintColor={"#fff"} weight="black"/>
            <Text style={{ fontFamily: 'SFPro-Bold', fontSize: 20, color: '#fff' }}>Create Memory</Text>
        </AnimatedPressable>
    </View>
  )
}

export default CreateVideo