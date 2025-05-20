import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import {IpPublic} from '../IpPublic';
import { Input } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditDataBarang({ route, navigation }) {
    const { kode } = route.params;

    // State untuk data dan status loading/error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [kodebarang, setKodeBarang] = useState('');
    const [namabarang, setNamaBarang] = useState('');
    const [harga, setHarga] = useState('');
    const [satuan, setSatuan] = useState('');

    // Fetch data barang berdasarkan kode
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const token = await AsyncStorage.getItem('userToken');
            try {
                const response = await fetch(`${IpPublic}barang/${kode}`,{
                    method: 'GET',
                    headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                
                const data = await response.json();
                const hargaString = String(data.harga);
                setKodeBarang(data.kodebarang || '');
                setNamaBarang(data.namabarang || '');
                setHarga(hargaString);
                setSatuan(data.satuan || '');
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Gagal memuat data');
                setLoading(false);
            }
        };

        fetchData();
    }, [kode]);

    // Jika sedang loading
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // Jika terdapat error
    if (error) {
        return (
            <View style={styles.center}>
                <Text>{error}</Text>
            </View>
        );
    }

    // Fungsi untuk submit data
    const handleSubmit = async () => {
        if (!namabarang || !harga || !satuan) {
            Alert.alert('Error', 'Semua field harus diisi');
            return;
        }

        if (isNaN(harga) || harga <= 0) {
            Alert.alert('Error', 'Harga harus berupa angka positif');
            return;
        }

        const kirimData = {
            namabarang,
            harga,
            satuan,
        };

        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${IpPublic}barang/${kode}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(kirimData),
            });

            if (response.ok) {
                Alert.alert('Success', 'Data berhasil diperbarui');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Gagal memperbarui data');
            }
        } catch (err) {
            console.error('Error updating data:', err);
            Alert.alert('Error', 'Terjadi kesalahan jaringan');
        }
    };

    return (
        <View style={styles.container}>
            {/* Input untuk kode barang */}
            <Text style={styles.label}>Kode Barang</Text>
            <Input
                value={kodebarang}
                onChangeText={setKodeBarang}
                placeholder="Masukkan Kode Barang"
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                disabled={true}
            />

            {/* Input untuk nama barang */}
            <Text style={styles.label}>Nama Barang</Text>
            <Input
                value={namabarang}
                onChangeText={setNamaBarang}
                placeholder="Masukkan Nama Barang"
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
            />

            {/* Input untuk harga */}
            <Text style={styles.label}>Harga</Text>
            <Input
                value={harga.toString()}
                onChangeText={(text) => setHarga(Number(text))}
                placeholder="Masukkan Harga"
                keyboardType="numeric"
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
            />

            {/* Input untuk satuan */}
            <Text style={styles.label}>Satuan</Text>
            <Input
                value={satuan}
                onChangeText={setSatuan}
                placeholder="Masukkan Satuan"
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
            />

            {/* Tombol update */}
            <TouchableOpacity onPress={handleSubmit}>
                <LinearGradient
                    colors={['#0308ae', '#0068b9']}
                    style={styles.gradientButton}>
                    <Text style={styles.buttonText}>Update</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputText: {
        fontSize: 16,
    },
    gradientButton: {
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
        marginHorizontal: 15,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
