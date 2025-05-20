import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './apiserver/Dashboard';
import BarangList from '../Api/apiserver/BarangList';
import FormTambahBarang from '../Api/apiserver/FormAddBarang';
import DetailDataBarang from './apiserver/DetailDataBarang';
import EditDataBarang from './apiserver/EditDataBarang';
import ListPelanggan from './pelanggan/ListPelanggan';
import FormAddPelanggan from './pelanggan/FormAddPelanggan';
import DetailDataPelanggan from './pelanggan/DetailDataPelanggan';
import EditDataPelanggan from './pelanggan/EditDataPelanggan';
import { NavigationContainer } from '@react-navigation/native';


const HomeStack1 = createNativeStackNavigator();

export default function StackApi() {
  return (
    
    <HomeStack1.Navigator initialRouteName="HomePage">
      <HomeStack1.Screen
        name="HomePage"
        component={HomePage}
        options={{
          headerTitle: 'Dashboard',
          headerStyle: styles.headerStyle,
          headerTitleAlign: 'center',
          headerTintColor: '#fefefe', // Warna teks header
        }}
      />
      <HomeStack1.Screen
        name="pelangganList"
        component={ListPelanggan}
        options={{
          headerTitle: 'List Pelanggan',
          headerStyle: styles.headerStyle,
          headerTitleAlign: 'center',
          headerTintColor: '#fff',
        }}
      />
      <HomeStack1.Screen
        name="DetailDataPelanggan"
        component={DetailDataPelanggan}
        options={{
          headerTitle: 'Detail Data Barang',
          headerStyle: styles.headerStyle1,
          headerTitleAlign: 'center',
          headerTintColor: '#000000',
        }}
      />
      <HomeStack1.Screen
        name="FormAddPelanggan"
        component={FormAddPelanggan}
        options={{
          headerTitle: 'Tambah Pelanggan',
          headerStyle: styles.headerStyle1,
          headerTitleAlign: 'center',
          headerTintColor: '#000000',
        }}
      />
      <HomeStack1.Screen
        name="EditDataBarang"
        component={EditDataBarang}
        options={{
          headerTitle: 'Edit Data Barang',
          headerStyle: styles.headerStyle,
          headerTitleAlign: 'center',
          headerTintColor: '#fff',
        }}
      />
      <HomeStack1.Screen
        name="EditDataPelanggan"
        component={EditDataPelanggan}
        options={{
          headerTitle: 'Edit Data Barang',
          headerStyle: styles.headerStyle,
          headerTitleAlign: 'center',
          headerTintColor: '#fff',
        }}
      />
    </HomeStack1.Navigator>
    
  );
}

const styles = StyleSheet.create({
  headerStyle1: {
    backgroundColor: '#fff', // Warna latar belakang header
  },
  headerStyle: {
    backgroundColor: '#16404D', // Warna latar belakang header
  },
});
