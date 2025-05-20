import { StyleSheet, Text, View, ActivityIndicator, Alert, Modal, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import {IpPublic, IpAddress} from '../IpPublic';
import { Button, Card, withBadge } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailDataPelanggan({ route, navigation }) {
  const { kode } = route.params;

  const [PelangganDetail, setPelangganDetail] = useState({
    namapelanggan: '',
    kodepelanggan: '',
    nohp: '',
    alamat: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const fetchData = async () => {

    setLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    fetch(`${IpPublic}pelanggan/${kode}`,{
      method: 'GET',
      headers:{
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          setPelangganDetail(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError('Gagal Load Data');
        setLoading(false);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true)
      fetchData();
    }, [kode])
  );

  

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  const hapusDataPelanggan = async (kode) => {
    try {
      const token = await AsyncStorage.getItem('userToken'); 
      const response = await fetch(`${IpPublic}pelanggan/${kode}`, {
        method: 'DELETE',
        headers:{
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      }
      });

      if (response.ok) {
        Alert.alert('Sukses', 'Data berhasil dihapus.');
        navigation.goBack();
      } else {
        Alert.alert('Gagal', 'Tidak dapat menghapus data.');
      }
    } catch (err) {
      console.error('Error deleting data:', err);
      Alert.alert('Error', 'Terjadi kesalahan saat menghapus data.');
    }
  };
  return (
    <View style={styles.container}>
      <Card>
        <Card.Title style={styles.cardTitle}>
          {PelangganDetail?.namapelanggan || 'Nama Pelanggan Tidak Tersedia'}
        </Card.Title>
        <Card.Divider />
        <Text style={styles.text}>
          Kode Pelanggan: {PelangganDetail?.kodepelanggan || '-'}
        </Text>
        <Text style={styles.text}>
          No HP: {PelangganDetail?.nohp || '-'}
        </Text>
        <Text style={styles.text}>
          Alamat: {PelangganDetail?.alamat || '-'}
        </Text>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          title="Edit"
          icon={<Icon name="pencil" size={20} color="white" />}
          iconPosition="left"
          buttonStyle={styles.editButton}
          titleStyle={styles.buttonTitle}
          onPress={() => navigation.navigate('EditDataPelanggan', {kode: PelangganDetail.kodepelanggan})}
        />

        <Button
          title="Hapus"
          icon={<Icon name="close" size={20} color="white" />}
          iconPosition="left"
          buttonStyle={styles.deleteButton}
          titleStyle={styles.buttonTitle}
          onPress={() => hapusDataPelanggan(kode)}
        />
      </View>
    </View>
  );
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f7f7f7',
  },
  image: {
    height: 200,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 15,
  },
  editButton: {
    marginHorizontal: 5, // Tambahkan jarak antar tombol
    backgroundColor: '#0368ac',
    borderRadius: 10,
    height: 50, // Tinggi tombol konsisten
  },
  deleteButton: {
    marginHorizontal: 5,
    backgroundColor: '#ac0309',
    borderRadius: 10,
    height: 50,
  },
  buttonTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  centeredView:{
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    width: width,
    height: height * 0.25,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 15,
    shadowColor : '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 5, 5, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
