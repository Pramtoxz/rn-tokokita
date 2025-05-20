import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BarangList from './apiserver/BarangList';
import DetailDataBarang from './apiserver/DetailDataBarang';
import FormAddBarang from './apiserver/FormAddBarang';
import EditDataBarang from './apiserver/EditDataBarang';

const Stack = createNativeStackNavigator();

export default function StackBarang({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BarangList"
        component={BarangList}
        options={{
          headerTitle: 'Daftar Barang',
          headerStyle: styles.headerStyle,
          headerTintColor: 'black',
          headerTitleStyle: styles.headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="DetailDataBarang"
        component={DetailDataBarang}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditDataBarang"
        component={EditDataBarang}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FormAddBarang"
        component={FormAddBarang}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#CAE0BC', // Mengubah warna header
    elevation: 5,
  },
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});
