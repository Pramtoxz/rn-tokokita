import { StyleSheet, Text, View, ActivityIndicator, Alert, Modal, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import {IpPublic, IpAddress} from '../IpPublic';
import { Button, Card, withBadge } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tambahkan interface untuk props
interface DetailDataBarangProps {
  route: {
    params: {
      kode: string;
    };
  };
  navigation: any; // Idealnya gunakan tipe yang lebih spesifik dari @react-navigation/native
}

export default function DetailDataBarang({ route, navigation }: DetailDataBarangProps) {
  const { kode } = route.params;

  const [barangDetail, setBarangDetail] = useState({
    gambar: null,
    gambarthumb: null,
    namabarang: '',
    kodebarang: '',
    harga: '',
    satuan: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [pic, setPic] = useState<string | null>(null);
  const [uriImage, setUriImage] = useState<string | undefined>();
  const [typeImage, setTypeImage] = useState<string | undefined>();
  const [fileNameImage, setFileNameImage] = useState<string | undefined>();


  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    fetch(`${IpPublic}barang/${kode}`,{
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          setBarangDetail(data);
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
        <ActivityIndicator size="large" color="#FF1493" />
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

  const hapusDataBarang = async (kode: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${IpPublic}barang/${kode}`, {
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

  const openModalUpload = () => {
    setModalVisible(true);
  };

  const setToastPesan = (pesan: string) => {
    ToastAndroid.show(pesan, ToastAndroid.SHORT);
  }

  const chooseImageFromGallery = async () => {
    const result = await launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          setToastPesan('Gambar Batal Dipilih');
          setModalVisible(false);
        } else if (response.errorCode === 'permission') {
          setToastPesan('Tidak Ada Izin');
          setModalVisible(false);
        } else if (response.errorCode === 'others') {
          setToastPesan(response.errorMessage || 'Error tidak diketahui');
          setModalVisible(false);
        } else if (response.assets?.[0]?.fileSize > 5242880) {
          setToastPesan('Ukuran Gambar Terlalu Besar');
          setModalVisible(false);
        } else if (response.assets?.[0]) {
          const asset = response.assets[0];
          setPic(asset.uri || null);
          setUriImage(asset.uri);
          setTypeImage(asset.type);
          setFileNameImage(asset.fileName);
          setModalVisible(false);
        }
      },
    );
  };

  const takePhotoWithCamera = async () => {
    const result = await launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          setToastPesan('Gambar Batal Dipilih');
          setModalVisible(false);
        } else if (response.errorCode === 'permission') {
          setToastPesan('Tidak Ada Izin');
          setModalVisible(false);
        } else if (response.errorCode === 'others') {
          setToastPesan(response.errorMessage || 'Error tidak diketahui');
          setModalVisible(false);
        } else if (response.assets?.[0]?.fileSize > 5242880) {
          setToastPesan('Ukuran Gambar Terlalu Besar');
          setModalVisible(false);
        } else if (response.assets?.[0]) {
          const asset = response.assets[0];
          setPic(asset.uri || null);
          setUriImage(asset.uri);
          setTypeImage(asset.type);
          setFileNameImage(asset.fileName);
          setModalVisible(false);
        }
      }
    );
  };

  const uploadImageToApi = async () => {
    if (pic == null || pic == '') {
      setToastPesan('Pilih Gambar Terlebih Dahulu');
    } else {
      setLoadingButton(true);
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('gambar',{
        uri: uriImage,
        type: typeImage,
        name: fileNameImage,
      });
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${IpPublic}barang/upload/${kode}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      let res = await response.json();
      setToastPesan(`${res.message}`);
      setLoadingButton(false);
      setPic(null);
      fetchData();
    }
  };
  return (
    <View style={styles.container}>
      <Card>
        <Card.Image
          source={
            barangDetail?.gambar
              ? { 
                uri: IpAddress + barangDetail.gambar,
               }
              : require('../assets/avatar.png')
          }
          style={styles.image}
          onPress={openModalUpload}
        />
        <Card.Title style={styles.cardTitle}>
          {barangDetail?.namabarang || 'Nama Barang Tidak Tersedia'}
        </Card.Title>
        <Card.Divider />
        <Text style={styles.text}>
          Kode Barang: {barangDetail?.kodebarang || '-'}
        </Text>
        <Text style={styles.text}>
          Harga: {barangDetail?.harga || '-'}
        </Text>
        <Text style={styles.text}>
          Satuan: {barangDetail?.satuan || '-'}
        </Text>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          title="Edit"
          icon={<Icon name="pencil" size={20} color="white" />}
          iconPosition="left"
          buttonStyle={styles.editButton}
          titleStyle={styles.buttonTitle}
          onPress={() => navigation.navigate('EditDataBarang', {kode: barangDetail.kodebarang})}
        />

        <Button
          title={
            loadingButton ? (
              <ActivityIndicator size= "small" color= "#0000ff" />
            ) : (
              'Upload Image'
            )
          }
          onPress={uploadImageToApi}
          buttonStyle={{ 
            backgroundColor: '#03ac3b',
            borderRadius: 10,
           }}
          titleStyle={{ 
            fontSize:15,
            fontWeight: 'bold',
            color: 'white',
            paddingLeft: 5,
           }}
           disabled={loadingButton ? true : false}
           onPressIn={uploadImageToApi}
        />

        <Button
          title="Hapus"
          icon={<Icon name="close" size={20} color="white" />}
          iconPosition="left"
          buttonStyle={styles.deleteButton}
          titleStyle={styles.buttonTitle}
          onPress={() => hapusDataBarang(kode)}
        />
      </View>
      <Modal 
      animationType = "slide"
      transparent = {true}
      visible = {modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
        <View style={styles.overlay}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Ganti Gambar</Text>
              <View
              style={{ 
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
                marginHorizontal: 30,
               }}>
              <TouchableOpacity
              style={{ 
                backgroundColor: '#001A6E',
                borderRadius: 10,
                width: 50,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
               }}
               onPress={chooseImageFromGallery}>
              <Icon size={30} name="image" color="white"/>
              </TouchableOpacity>
              <TouchableOpacity
              style={{ 
                backgroundColor: '#001A6E',
                borderRadius: 10,
                width: 50,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
               }}
               onPress={takePhotoWithCamera}>
                <Icon size={30} name="camera" color="white"/>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    flex: 1,
    marginHorizontal: 5, // Tambahkan jarak antar tombol
    backgroundColor: '#0368ac',
    borderRadius: 10,
    height: 50, // Tinggi tombol konsisten
  },
  uploadButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#03ac3b',
    borderRadius: 10,
    height: 50,
  },
  deleteButton: {
    flex: 1,
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
