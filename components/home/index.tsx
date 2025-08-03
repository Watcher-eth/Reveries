import React from 'react'
import Navbar from '../common/Navbar'
import { ScrollView } from 'react-native'

const HomePage = () => {
  return (
    <ScrollView style={{  backgroundColor: '#F8F8F8', width: '100%' }} stickyHeaderIndices={[0]}>
      <Navbar/>
     
    </ScrollView>
  )
}

export default HomePage 