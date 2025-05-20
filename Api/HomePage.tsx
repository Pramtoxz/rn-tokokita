import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { IpPublic } from './IpPublic';
import * as Animatable from 'react-native-animatable';

export default function HomePage({ navigation }) {
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDevInfo, setShowDevInfo] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        if (name) {
          setUserName(name);
          setIsLoggedIn(true);
        } else {
          setUserName('');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log('Gagal mengambil nama user:', error);
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin logout?',
      [
        {
          text: 'Batal',
          onPress: () => console.log('Logout dibatalkan'),
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');

              if (token) {
                const response = await fetch(`${IpPublic}logout`, {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                });

                if (response.ok) {
                  await AsyncStorage.multiRemove(['userName', 'userToken']);
                  setUserName('');
                  setIsLoggedIn(false);

                  ToastAndroid.show('Logout berhasil!', ToastAndroid.SHORT);

                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Welcome' }],
                  });
                } else {
                  console.log('Logout gagal:', response);
                  ToastAndroid.show('Logout gagal, coba lagi!', ToastAndroid.SHORT);
                }
              }
            } catch (error) {
              console.log('Error saat logout:', error);
              await AsyncStorage.multiRemove(['userName', 'userToken']);
              setUserName('');
              setIsLoggedIn(false);

              ToastAndroid.show('Terjadi kesalahan, tetap logout!', ToastAndroid.SHORT);

              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const developers = [
    {
      name: 'Nazhirun Mardhiy',
      nim: '2210059',
      role: 'Mobile Developer',
      gradient: ['#FF6B6B', '#FF8E8E'] // Merah muda
    },
    {
      name: 'Siska Yuli Ningsih',
      nim: '2410001',
      role: 'UI/UX Designer',
      gradient: ['#4ECDC4', '#45B7AF'] // Tosca
    },
    {
      name: 'Idham Khalid',
      nim: '2410017',
      role: 'Backend Developer',
      gradient: ['#FFD93D', '#F6C90E'] // Kuning
    }
  ];

  const menuItems = [
    {
      title: 'Barang', 
      image: require('./assets/Barang.png'),
      route: 'StackBarang',
      animation: 'fadeInRight',
      gradient: ['#4CAF50', '#2E7D32']
    },
    {
      title: 'Pelanggan',
      image: require('./assets/Pelanggan.png'),
      route: 'StackPelanggan',
      animation: 'fadeInRight',
      gradient: ['#FFD700', '#FFA500']
    },
    {
      title: 'Penjualan',
      image: require('./assets/Penjualan.png'), 
      route: 'StackPenjualan',
      animation: 'fadeInLeft',
      gradient: ['#2196F3', '#1565C0']
    },
    {
      title: 'Laporan',
      image: require('./assets/Laporan.png'),
      route: 'StackLaporan', 
      animation: 'fadeInRight',
      gradient: ['#9C27B0', '#6A1B9A']
    }
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E8F3E8', '#C5E6C6', '#97D098']}
        style={styles.background}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Animatable.View
            animation="fadeIn"
            duration={1500}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Animatable.View animation="fadeInDown" delay={300} style={styles.logoContainer}>
                <Image 
                  source={require('./assets/tokokita.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </Animatable.View>
              
              <Animatable.View animation="fadeIn" delay={500} style={styles.greetingContainer}>
                <Text style={styles.welcomeText}>Selamat Datang,</Text>
                <Text style={styles.haloText}>{userName}</Text>
              </Animatable.View>

              {isLoggedIn && (
                <Animatable.View animation="fadeIn" delay={700} style={styles.logoutContainer}>
                  <TouchableOpacity
                    onPress={handleLogout}
                    style={styles.logoutButton}
                  >
                    <Icon name="log-out-outline" size={24} color="#fff" />
                    <Text style={styles.logoutText}>Logout</Text>
                  </TouchableOpacity>
                </Animatable.View>
              )}
            </View>
          </Animatable.View>

          <View style={styles.menuGrid}>
           

            {menuItems.map((item, index) => (
              <Animatable.View
                key={index}
                animation={item.animation}
                delay={800 + (index * 100)}
                style={styles.menuItem}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate(item.route)}
                >
                  <LinearGradient
                    colors={item.gradient}
                    style={styles.menuGradient}
                  >
                    <Image
                      source={item.image}
                      style={styles.menuImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.menuText}>{item.title}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>

          <Animatable.View animation="fadeInUp" delay={1200}>
            <TouchableOpacity 
              style={styles.devInfoButton}
              onPress={() => setShowDevInfo(!showDevInfo)}
            >
              <Text style={styles.devInfoButtonText}>
                {showDevInfo ? 'Scroll ke bawah' : 'Lihat Info Pengembang'}
              </Text>
            </TouchableOpacity>

            {showDevInfo && (
              <View style={styles.devInfoContainer}>
                <Text style={styles.devInfoTitle}>Tim Pengembang</Text>
                {developers.map((dev, index) => (
                  <Animatable.View 
                    key={index}
                    animation="fadeInUp"
                    delay={200 * index}
                    style={styles.devCard}
                  >
                    <LinearGradient
                      colors={dev.gradient}
                      style={styles.devCardGradient}
                    >
                      <Text style={styles.devName}>{dev.name}</Text>
                      <Text style={styles.devNim}>{dev.nim}</Text>
                      <Text style={styles.devRole}>{dev.role}</Text>
                    </LinearGradient>
                  </Animatable.View>
                ))}
              </View>
            )}
          </Animatable.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 15,
  },
  logo: {
    width: 300,
    height: 200,
  },
  greetingContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: '#2D5A27',
    opacity: 0.8,
    textAlign: 'center',
  },
  haloText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5A27',
    textAlign: 'center',
  },
  logoutContainer: {
    width: '100%',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D5A27',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
    padding: 20,
  },
  menuItem: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
  },
  menuGradient: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  menuImage: {
    width: '100%',
    height: 100,
    marginBottom: 8,
    opacity: 0.9,
  },
  devInfoButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  devInfoButtonText: {
    color: '#2D5A27',
    fontSize: 16,
    fontWeight: '500',
  },
  devInfoContainer: {
    padding: 20,
  },
  devInfoTitle: {
    color: '#2D5A27',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  devCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  devCardGradient: {
    padding: 15,
  },
  devName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  devNim: {
    color: '#fff',
    opacity: 0.8,
    marginTop: 5,
  },
  devRole: {
    color: '#fff',
    opacity: 0.7,
    fontStyle: 'italic',
    marginTop: 5,
  },
});
