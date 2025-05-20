import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PelangganList from './pelanggan/ListPelanggan';
import DetailDataPelanggan from './pelanggan/DetailDataPelanggan';
import FormAddPelanggan from './pelanggan/FormAddPelanggan';
import EditDataPelanggan from './pelanggan/EditDataPelanggan';

const Stack = createNativeStackNavigator();

export default function StackPelanggan({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PelangganList"
        component={PelangganList}
        options={{
          headerTitle: 'Daftar Pelanggan',
          headerStyle: styles.headerStyle,
          headerTintColor: 'black',
          headerTitleStyle: styles.headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="DetailDataPelanggan"
        component={DetailDataPelanggan}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FormAddPelanggan"
        component={FormAddPelanggan}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditDataPelanggan"
        component={EditDataPelanggan}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#CAE0BC', // Mengubah warna header sesuai dengan tema Indigo yang ada di HomePage
    elevation: 5,
  },
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});
