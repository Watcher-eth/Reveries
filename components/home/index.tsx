import React from 'react'
import Navbar from '../common/Navbar'
import { View } from 'react-native'
import InfiniteCanvas from '../ui/InfiniteCanvas'
import FloatingActionButton from '../ui/AnimatedFab'

const HomePage = () => {



  return (
    <View style={{ flex: 1 }}>
      <Navbar/>
          <InfiniteCanvas/>
          <FloatingActionButton />

    </View>
  )
}

export default HomePage 