import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './HomePage';
import StackBarang from './StackBarang';
import StackPelanggan from './StackPelanggan';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StackPenjualan from './StackPenjualan';
import StackLaporan from './StackLaporan';
import WelcomePage from './WelcomePage';

const Stack = createNativeStackNavigator();

export default function StackHome() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomePage} />
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="RegisterPage" component={RegisterPage} />
        
        {/* Main Flow */}
        <Stack.Screen name="HomePage" component={HomePage} />
        
        {/* Product Stack */}
        <Stack.Screen 
          name="StackBarang" 
          component={StackBarang}
        />
        
        {/* Cart/Customer Stack */}
        <Stack.Screen 
          name="StackPelanggan" 
          component={StackPelanggan}
        />
        
        {/* Order Stack */}
        <Stack.Screen 
          name="StackPenjualan" 
          component={StackPenjualan}
        />
        
        {/* Report Stack */}
        <Stack.Screen 
          name="StackLaporan" 
          component={StackLaporan}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}