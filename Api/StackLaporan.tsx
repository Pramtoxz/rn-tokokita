import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import HomeLaporan from './HomeLaporan';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();

const AnimatedHeader = () => (
  <Animatable.View
    animation="fadeIn"
    duration={1000}
    style={{ flex: 1 }}>
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={['#E8F3E8', '#C5E6C6', '#97D098']}
      style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="document-text-outline" size={24} color="#2D5A27" style={{ marginRight: 10 }} />
      <Animatable.Text
        animation="fadeInRight"
        style={{ color: '#2D5A27', fontSize: 20, fontWeight: '600', letterSpacing: 0.5 }}>
        Laporan Penjualan
      </Animatable.Text>
    </LinearGradient>
  </Animatable.View>
);

export default function StackLaporan() {
  return (
    <Stack.Navigator
      initialRouteName="HomeLaporan"
      screenOptions={{
        headerStyle: {
          height: 110,
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}>
      <Stack.Screen
        name="HomeLaporan"
        component={HomeLaporan}
        options={{
          headerBackground: () => <AnimatedHeader />,
          headerTintColor: 'black',
        }}
      />
    </Stack.Navigator>
  );
}