import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import HomePenjualan from './HomePenjualan';
import KeranjangBelanja from './KeranjangBelanja';
import AkhiriTransaksi from './AkhiriTransaksi';
import * as Animatable from 'react-native-animatable';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();

const AnimatedHeader = ({ colors, title }) => (
  <Animatable.View
    animation="fadeIn"
    duration={1000}
    style={{ flex: 1 }}>
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={colors}
      style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="cart" size={24} color="#fff" style={{ marginRight: 10 }} />
      <Animatable.Text
        animation="fadeInRight"
        style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
        {title}
      </Animatable.Text>
    </LinearGradient>
  </Animatable.View>
);

const StackPenjualan = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomePenjualan"
      screenOptions={{
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          letterSpacing: 0.5,
        },
        headerTitleAlign: 'center',
        headerTintColor: 'black',
        animation: 'slide_from_right',
        headerStyle: {
          height: 110, // Meningkatkan tinggi header
        }
      }}>
      <Stack.Screen
        name="HomePenjualan"
        component={HomePenjualan}
        options={{
          headerBackground: () => (
            <AnimatedHeader
              colors={['#CAE0BC', '#CAE0BC']}
              title="Transaksi Penjualan"
            />
          ),
        }}
      />
      <Stack.Screen
        name="KeranjangBelanja"
        component={KeranjangBelanja}

      />
      <Stack.Screen
        name="AkhiriTransaksi"
        component={AkhiriTransaksi}
        options={{
          headerBackground: () => (
            <AnimatedHeader
              colors={['#CAE0BC', '#CAE0BC']}
              title="Pembayaran"
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default StackPenjualan;