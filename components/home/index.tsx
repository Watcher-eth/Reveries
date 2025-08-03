import React from 'react'
import Navbar from '../common/Navbar'
import { ScrollView, View } from 'react-native'
import InfiniteCanvas from '../ui/InfiniteCanvas'

const HomePage = () => {
  return (
    <View style={{ flex: 1 }}>
          <InfiniteCanvas/>
    </View>
  )
}

export default HomePage 