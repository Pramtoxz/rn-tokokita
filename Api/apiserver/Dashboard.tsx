import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Dashboard({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonRow}>
        <Button
          title="Data Barang"
          type="solid"
          icon={
            <Icon name="list" size={20} color="white" />
          }
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.titleStyle}
          onPress={() => navigation.navigate('barangList')}
        />
        <Button
          title="Data Pelanggan"
          type="solid"
          icon={
            <Icon name="user" size={20} color="white" />
          }
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.titleStyle}
          onPress={() => navigation.navigate('pelangganList')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Latar belakang untuk tampilan lebih segar
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Agar tombol tidak keluar layar jika terlalu banyak
    justifyContent: 'center', // Pusatkan tombol
    alignItems: 'center',
    marginVertical: 10, // Jarak antar kelompok tombol
  },
  buttonStyle: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF1493',
    margin: 10, // Jarak antar tombol
    minWidth: 100, // Ukuran minimal tombol agar seragam
    height: 70, // Tinggi tombol konsisten
    justifyContent: 'center', // Pusatkan konten tombol
    alignItems: 'center', // Pusatkan ikon dan teks
  },
  titleStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center', // Agar teks tombol rata tengah
    marginTop: 5, // Jarak kecil antara ikon dan teks
  },
});
