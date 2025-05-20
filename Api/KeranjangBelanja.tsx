/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IpAddress, IpPublic } from './IpPublic';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';

interface KeranjangItem {
  kodebarang: string;
  namabarang: string;
  harga: number;
  qty: number;
  gambar: string;
}

interface KeranjangBelanjaProps {
  navigation: any;
}

export default function KeranjangBelanja({ navigation }: KeranjangBelanjaProps) {
  // Menambahkan useLayoutEffect untuk mengatur header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Menyembunyikan header
    });
  }, [navigation]);

  const [items, setItems] = useState<KeranjangItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchKeranjang = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const username = await AsyncStorage.getItem('userName');

      if (!token || !username) {
        Alert.alert('Error', 'Data pengguna tidak ditemukan.');
        return;
      }

      const response = await fetch(`${IpPublic}get-keranjang/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Debugging: Cek data yang diterima
        console.log('Data keranjang dari API:', data.data);

        // Hapus duplikasi dengan Map untuk memastikan kodebarang unik
        const uniqueData = [...new Map(data.data.map(item => [item.kodebarang, item])).values()];

        setItems(uniqueData);
      } else {
        Alert.alert('Error', 'Tidak dapat memuat data keranjang');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat memuat keranjang');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeranjang();
  }, []);

  const formatRupiah = (value: number): string => {
    return value ? 'Rp ' + value.toLocaleString('id-ID') : '';
  };

  const hapusItem = async (kodebarang: string) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const username = await AsyncStorage.getItem('userName');

      if (!token || !username) {
        Alert.alert('Error', 'Data pengguna tidak ditemukan.');
        return;
      }

      const response = await fetch(`${IpPublic}hapus-item-keranjang/${username}/${kodebarang}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Perbarui data `items` secara lokal
        setItems((prevItems) => prevItems.filter((item) => item.kodebarang !== kodebarang));

        Alert.alert('Success', 'Item berhasil dihapus dari keranjang');

        // Panggil ulang API untuk memastikan sinkronisasi penuh
        fetchKeranjang();
      } else {
        Alert.alert('Error', 'Tidak dapat menghapus item dari keranjang');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menghapus item');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#CAE0BC" />
      </View>
    );
  }

  return (
    <Animatable.View 
      animation="fadeIn" 
      duration={1000} 
      style={styles.container}
    >
      <LinearGradient
        colors={['#E8F3E8', '#C5E6C6', '#97D098']}
        style={styles.gradientBackground}
      >
        <Animatable.View 
          animation="fadeInDown" 
          duration={800}
          style={styles.header}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <LinearGradient
              colors={['#2D5A27', '#3B7A33']}
              style={styles.iconContainer}
            >
              <Icon name="chevron-back" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Keranjang Belanja</Text>
        </Animatable.View>

        {items.length === 0 ? (
          <Animatable.View
            animation="fadeIn"
            duration={1000}
            style={styles.emptyContainer}
          >
            <LinearGradient
              colors={['rgba(45, 90, 39, 0.1)', 'rgba(45, 90, 39, 0.05)']}
              style={styles.emptyIconContainer}
            >
              <Animatable.View 
                animation="pulse" 
                iterationCount="infinite" 
                duration={2000}
              >
                <Icon name="leaf" size={80} color="#2D5A27" />
              </Animatable.View>
            </LinearGradient>
            <Text style={styles.emptyText}>Keranjang Anda Masih Kosong</Text>
            <Text style={styles.emptySubText}>Mulai belanja untuk mengisi keranjang Anda</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('HomePenjualan')}
              style={styles.shopNowButton}
            >
              <LinearGradient
                colors={['#2D5A27', '#3B7A33']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.shopNowGradient}
              >
                <Text style={styles.shopNowText}>Mulai Belanja</Text>
                <Icon name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        ) : (
          <Animatable.View 
            animation="fadeIn" 
            duration={1000} 
            style={styles.contentContainer}
          >
            <FlatList
              data={items}
              keyExtractor={(item) => item.kodebarang.toString()}
              renderItem={({ item, index }) => (
                <Animatable.View
                  animation="fadeInUp"
                  delay={index * 100}
                  style={styles.cardWrapper}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                    style={styles.card}
                  >
                    <View style={styles.imageContainer}>
                      <Image
                        source={
                          item.gambar
                            ? { uri: IpAddress + item.gambar }
                            : require('./assets/avatar.png')
                        }
                        style={styles.image}
                      />
                    </View>
                    <View style={styles.info}>
                      <Text style={styles.title}>{item.namabarang}</Text>
                      <Text style={styles.price}>{formatRupiah(item.harga)}</Text>
                      <View style={styles.qtyContainer}>
                        <Icon name="leaf" size={16} color="#2D5A27" />
                        <Text style={styles.qty}>Jumlah: {item.qty}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          'Hapus Item',
                          'Apakah Anda yakin ingin menghapus item ini?',
                          [
                            { text: 'Batal', style: 'cancel' },
                            { 
                              text: 'Hapus',
                              onPress: () => hapusItem(item.kodebarang),
                              style: 'destructive'
                            }
                          ]
                        );
                      }}
                      style={styles.deleteButton}
                    >
                      <LinearGradient
                        colors={['#FF6B6B', '#FF4B4B']}
                        style={styles.deleteGradient}
                      >
                        <Icon name="trash-outline" size={20} color="#fff" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </LinearGradient>
                </Animatable.View>
              )}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
            
            <Animatable.View
              animation="slideInUp"
              duration={800}
              style={styles.checkoutContainer}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                style={styles.checkoutWrapper}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('AkhiriTransaksi')}
                  style={styles.checkoutButton}
                >
                  <LinearGradient
                    colors={['#2D5A27', '#3B7A33']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.checkoutGradient}
                  >
                    <Icon name="leaf" size={24} color="#fff" style={styles.checkoutIcon} />
                    <Text style={styles.buttonText}>Selesaikan Pembelian</Text>
                    <Icon name="arrow-forward" size={20} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </Animatable.View>
          </Animatable.View>
        )}
      </LinearGradient>
    </Animatable.View>
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
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
  },
  backButton: {
    marginRight: 15,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D5A27',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 24,
    color: '#2D5A27',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: '#4A8B3B',
    marginBottom: 32,
    textAlign: 'center',
  },
  shopNowButton: {
    width: '80%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  shopNowGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  shopNowText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 15,
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D5A27',
    marginBottom: 6,
  },
  price: {
    fontSize: 17,
    color: '#4A8B3B',
    fontWeight: '700',
    marginBottom: 8,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 90, 39, 0.1)',
    padding: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  qty: {
    fontSize: 14,
    color: '#2D5A27',
    marginLeft: 6,
    fontWeight: '500',
  },
  deleteButton: {
    alignSelf: 'center',
    marginLeft: 8,
  },
  deleteGradient: {
    padding: 10,
    borderRadius: 12,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  checkoutWrapper: {
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  checkoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  checkoutGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  checkoutIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.5,
  },
});
