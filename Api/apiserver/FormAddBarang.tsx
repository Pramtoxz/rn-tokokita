import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, { useState } from 'react';
import { Button, Input } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import {IpPublic} from '../IpPublic';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormAddMataKuliah({ navigation }) {
    const [kodeBarang, setKodeBarang] = useState('');
    const [namaBarang, setNamaBarang] = useState('');
    const [harga, setHarga] = useState('');
    const [satuan, setSatuan] = useState('');

    const handleSubmit = async () => {
        if (!kodeBarang || !namaBarang || !harga || !satuan) {
            Alert.alert('Error', 'Semua data harus diisi.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${IpPublic}barang`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    kodebarang: kodeBarang,
                    namabarang: namaBarang,
                    harga: parseInt(harga, 10), // Konversi ke integer
                    satuan,
                }),
            });

            if (response.status === 201) {
                const res = await response.json();
                Alert.alert('Berhasil', res.message);
                navigation.goBack();
            } else {
                const errorRes = await response.json();
                Alert.alert('Gagal', errorRes.message || 'Gagal menyimpan data.');
            }
        } catch (error) {
            Alert.alert('Error', 'Gagal menyimpan data. Silakan coba lagi.');
            console.log('Error:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <Text style={styles.title}>Tambah Barang</Text>
                    <Input
                        label="Kode Barang"
                        placeholder="Masukkan Kode Barang"
                        maxLength={20}
                        value={kodeBarang}
                        onChangeText={setKodeBarang}
                        inputContainerStyle={styles.input}
                    />

                    <Input
                        label="Nama Barang"
                        placeholder="Masukkan Nama Barang"
                        value={namaBarang}
                        onChangeText={setNamaBarang}
                        inputContainerStyle={styles.input}
                    />

                    <Input
                        label="Harga"
                        placeholder="Masukkan Harga"
                        value={harga}
                        onChangeText={setHarga}
                        keyboardType="numeric"
                        inputContainerStyle={styles.input}
                    />

                    <Input
                        label="Satuan"
                        placeholder="Masukkan Satuan"
                        value={satuan}
                        onChangeText={setSatuan}
                        inputContainerStyle={styles.input}
                    />

                    <Button
                        title="Simpan"
                        onPress={handleSubmit}
                        buttonStyle={styles.button}
                        iconPosition="left"
                        icon={
                            <View style={{ marginRight: 5 }}>
                                <Icon name="save" size={20} color="white" />
                            </View>
                        }
                    />
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: 'black',
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        paddingLeft: 5,
    },
    button: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        borderRadius: 5,
    },
});
