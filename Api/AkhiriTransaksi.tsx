import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IpPublic } from './IpPublic';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { generatePDF } from './FakturPDF';
import RNFS from 'react-native-fs';

interface Pelanggan {
  kodepelanggan: string;
  namapelanggan: string;
}

export default function AkhiriTransaksi({ navigation }: { navigation: any }) {
  const [pelanggan, setPelanggan] = useState<Pelanggan[]>([]);
  const [selectedPelanggan, setSelectedPelanggan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalPembayaran, setTotalPembayaran] = useState<number>(0);
  const [fakturItems, setFakturItems] = useState([]);
  const [selectedPelangganName, setSelectedPelangganName] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const fetchTotalPembayaran = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userName');

      const response = await fetch(`${IpPublic}total-pembayaran/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTotalPembayaran(data.total);
      } else {
        Alert.alert('Gagal', 'Tidak dapat menghitung total pembayaran');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const fetchPelanggan = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch(`${IpPublic}pelanggan`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPelanggan(data.data);
      } else {
        Alert.alert('Gagal', 'Tidak dapat memuat data pelanggan');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFakturItems = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userName');

      const response = await fetch(`${IpPublic}get-keranjang/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFakturItems(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPelanggan();
    fetchTotalPembayaran();
    fetchFakturItems();
  }, []);

  const handleSubmit = async () => {
    if (!selectedPelanggan) {
      Alert.alert('Error', 'Silakan pilih pelanggan terlebih dahulu');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userName');

      const response = await fetch(`${IpPublic}simpan-transaksi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          iduser: userId,
          kodepelanggan: selectedPelanggan,
          totalbayar: totalPembayaran,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const fakturData = {
          faktur: data.faktur,
          tanggal: new Date().toLocaleDateString('id-ID'),
          pelanggan: selectedPelangganName,
          items: fakturItems.map(item => ({
            namabarang: item.namabarang,
            qty: item.qty,
            harga: item.harga,
            subtotal: item.qty * item.harga
          })),
          totalBayar: totalPembayaran
        };

        const pdfPath = await generatePDF(fakturData);
        
        if (pdfPath) {
          Alert.alert(
            'Transaksi Berhasil',
            `Faktur telah disimpan di folder Downloads\nNama file: Faktur_${fakturData.faktur}.pdf`,
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('HomePenjualan')
              }
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            'Transaksi Berhasil',
            'Faktur gagal dibuat, tetapi transaksi telah tersimpan',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('HomePenjualan')
              }
            ]
          );
        }
      } else {
        Alert.alert('Gagal', data.message || 'Terjadi kesalahan saat menyimpan transaksi');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#ffffff', '#CAE0BC', '#CAE0BC']}
          style={styles.gradientBackground}
        >
          <ActivityIndicator size="large" color="black" />
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F4F9F4', '#A7D7C5', '#74B49B']}
        style={styles.gradientBackground}
      >
        <Animatable.View
          animation="fadeInDown"
          style={styles.header}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="chevron-back-circle" size={32} color="#2D5A27" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Akhiri Transaksi</Text>
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          delay={300}
          style={styles.content}
        >
          <View style={styles.card}>
            <Text style={styles.label}>Pilih Pelanggan</Text>
            <View style={styles.pickerContainer}>
              <Icon name="person-circle-outline" size={24} color="#2D5A27" style={styles.pickerIcon} />
              <Picker
                selectedValue={selectedPelanggan}
                onValueChange={(itemValue) => {
                  setSelectedPelanggan(itemValue);
                }}
                style={styles.picker}
              >
                <Picker.Item
                  label="-- Pilih Pelanggan --"
                  value={null}
                  style={styles.pickerItem}
                />
                {pelanggan.map(item => (
                  <Picker.Item
                    key={item.kodepelanggan}
                    label={item.namapelanggan}
                    value={item.kodepelanggan}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.totalContainer}>
              <View style={styles.totalHeader}>
                <Icon name="wallet-outline" size={24} color="#2D5A27" />
                <Text style={styles.totalLabel}>Total Pembayaran</Text>
              </View>
              <Text style={styles.totalAmount}>
                {totalPembayaran ? `Rp ${totalPembayaran.toLocaleString('id-ID')}` : '-'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <LinearGradient
                colors={['#2D5A27', '#4A8B3B']}
                style={styles.submitGradient}
              >
                <Text style={styles.buttonText}>Selesaikan Transaksi</Text>
                <Icon name="checkmark-circle" size={24} color="white" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5A27',
    marginLeft: 16,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D5A27',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F9F4',
    borderRadius: 15,
    marginBottom: 24,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#A7D7C5',
  },
  pickerIcon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  pickerItem: {
    color: '#2D5A27',
    fontSize: 16,
  },
  totalContainer: {
    backgroundColor: '#F4F9F4',
    borderRadius: 15,
    padding: 20,
    marginBottom: 24,
  },
  totalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    color: '#2D5A27',
    marginLeft: 10,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D5A27',
    textAlign: 'center',
  },
  submitButton: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});
