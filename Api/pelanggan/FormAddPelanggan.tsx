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

export default function FormAddPelanggan({ navigation }) {
    const [kodePelanggan, setKodePelanggan] = useState('');
    const [namaPelanggan, setNamaPelanggan] = useState('');
    const [nohp, setNohp] = useState('');
    const [alamat, setAlamat] = useState('');

    const handleSubmit = async () => {
        if (!kodePelanggan || !namaPelanggan || !nohp || !alamat) {
            Alert.alert('Error', 'Semua data harus diisi.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${IpPublic}pelanggan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    kodepelanggan: kodePelanggan,
                    namapelanggan: namaPelanggan,
                    nohp: parseInt(nohp, 10), // Konversi ke integer
                    alamat,
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
                    <Text style={styles.title}>Tambah Pelanggan</Text>
                    <Input
                        label="Kode Pelanggan"
                        placeholder="Masukkan Kode Pelanggan"
                        maxLength={20}
                        value={kodePelanggan}
                        onChangeText={setKodePelanggan}
                        inputContainerStyle={styles.input}
                    />

                    <Input
                        label="Nama Pelanggan"
                        placeholder="Masukkan Nama Pelanggan"
                        value={namaPelanggan}
                        onChangeText={setNamaPelanggan}
                        inputContainerStyle={styles.input}
                    />

                    <Input
                        label="No HP"
                        placeholder="Masukkan No HP"
                        value={nohp}
                        onChangeText={setNohp}
                        keyboardType="numeric"
                        inputContainerStyle={styles.input}
                    />

                    <Input
                        label="Alamat"
                        placeholder="Masukkan Alamat"
                        value={alamat}
                        onChangeText={setAlamat}
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