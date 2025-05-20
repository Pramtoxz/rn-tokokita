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

export default function EditDataPelanggan({ route, navigation }) {
    const { kode } = route.params;

    // State untuk data dan status loading/error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [kodepelanggan, setKodePelanggan] = useState('');
    const [namapelanggan, setNamaPelanggan] = useState('');
    const [nohp, setNohp] = useState('');
    const [alamat, setAlamat] = useState('');

    // Fetch data Pelanggan berdasarkan kode
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const token = await AsyncStorage.getItem('userToken');
                const response = await fetch(`${IpPublic}pelanggan/${kode}`,{
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
                setKodePelanggan(data.kodepelanggan || '');
                setNamaPelanggan(data.namapelanggan || '');
                setNohp(data.nohp);
                setAlamat(data.alamat || '');
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
        if (!namapelanggan || !nohp || !alamat) {
            Alert.alert('Error', 'Semua field harus diisi');
            return;
        }

        const kirimData = {
            namapelanggan,
            nohp,
            alamat,
        };

        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${IpPublic}pelanggan/${kode}`, {
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
            {/* Input untuk kode Pelanggan */}
            <Text style={styles.label}>Kode Pelanggan</Text>
            <Input
                value={kodepelanggan}
                onChangeText={setKodePelanggan}
                placeholder="Masukkan Kode Pelanggan"
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                disabled={true}
            />

            {/* Input untuk nama Pelanggan */}
            <Text style={styles.label}>Nama Pelanggan</Text>
            <Input
                value={namapelanggan}
                onChangeText={setNamaPelanggan}
                placeholder="Masukkan Nama Pelanggan"
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
            />

            {/* Input untuk harga */}
            <Text style={styles.label}>Harga</Text>
            <Input
                value={nohp}
                onChangeText={setNohp}
                placeholder="Masukkan No HP"
                keyboardType="numeric"
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
            />

            {/* Input untuk satuan */}
            <Text style={styles.label}>Satuan</Text>
            <Input
                value={alamat}
                onChangeText={setAlamat}
                placeholder="Masukkan Alamat"
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
        padding: 10,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    inputContainer: {
        marginBottom: 5,
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
