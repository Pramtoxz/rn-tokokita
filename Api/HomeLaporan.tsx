import React, { useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    FlatList,
    PermissionsAndroid,
    Platform,
    ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IpPublic } from './IpPublic'; // Ensure IpPublic contains the base API URL
import RNFS from 'react-native-fs';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';

export default function HomeLaporan({ navigation }) {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [dataLaporan, setDataLaporan] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchLaporan = async () => {
        if (!startDate || !endDate) {
            Alert.alert('Error', 'Silakan pilih periode tanggal awal dan akhir');
            console.error('Error: Tanggal awal atau akhir belum dipilih');
            return;
        }

        if (startDate > endDate) {
            Alert.alert(
                'Error',
                'Tanggal awal tidak boleh lebih besar dari tanggal akhir',
            );
            console.error('Error: Tanggal awal lebih besar dari tanggal akhir');
            return;
        }
        try {
            setLoading(true);

            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert('Error', 'Token tidak ditemukan');
                console.error('Error: Token tidak ditemukan');
                return;
            }

            const response = await fetch(
                `${IpPublic}laporan-penjualan?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setDataLaporan(data.laporan);
            } else {
                console.error('Error: Gagal mengambil data laporan', response.status, response.statusText);
                Alert.alert('Gagal', 'Tidak dapat mengambil data laporan');
            }
        } catch (err) {
            console.error('Error:', err);
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    const requestStoragePermission = async () => {
        try {
            if (Platform.OS === 'android') {
                if (Platform.Version >= 33) {
                    // Untuk Android 13+
                    const permissions = [
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
                    ];

                    const granted = await PermissionsAndroid.requestMultiple(permissions);
                    return Object.values(granted).every(
                        permission => permission === PermissionsAndroid.RESULTS.GRANTED
                    );
                } else if (Platform.Version >= 29) {
                    // Untuk Android 10-12
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        {
                            title: "Izin Penyimpanan",
                            message: "Aplikasi membutuhkan izin untuk menyimpan file",
                            buttonNeutral: "Tanya Nanti",
                            buttonNegative: "Batal",
                            buttonPositive: "OK"
                        }
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                } else {
                    // Untuk Android 9 ke bawah
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                }
            }
            return true;
        } catch (err) {
            console.error('Error requesting permission:', err);
            return false;
        }
    };

    const downloadPDF = async () => {
        if (Platform.OS === 'android') {
            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
                Alert.alert('Error', 'Izin penyimpanan diperlukan untuk mengunduh file');
                return;
            }
        }

        if (!startDate || !endDate) {
            Alert.alert('Error', 'Silakan pilih periode tanggal awal dan akhir');
            console.error('Error: Tanggal awal atau akhir belum dipilih');
            return;
        }

        if (startDate > endDate) {
            Alert.alert(
                'Error',
                'Tanggal awal tidak boleh lebih besar dari tanggal akhir',
            );
            console.error('Error: Tanggal awal lebih besar dari tanggal akhir');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert('Error', 'Token tidak ditemukan');
                console.error('Error: Token tidak ditemukan');
                return;
            }

            const response = await fetch(
                `${IpPublic}download-laporan-penjualan?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onload = async () => {
                    const base64data = reader.result.split(',')[1];
                    const filepath = `${RNFS.DownloadDirectoryPath}/laporan_penjualan_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.pdf`;

                    try {
                        await RNFS.writeFile(filepath, base64data, 'base64');
                        Alert.alert('Sukses', `PDF berhasil diunduh: ${filepath}`);
                    } catch (error) {
                        console.error('Error menulis file:', error);
                        Alert.alert('Error', 'Gagal menyimpan file PDF');
                    }
                };
                reader.readAsDataURL(blob);
            } else {
                console.error('Error: Gagal mengunduh PDF', response.status, response.statusText);
                Alert.alert('Gagal', 'Tidak dapat mengunduh PDF');
            }
        } catch (err) {
            console.error('Error:', err);
            Alert.alert('Error', err.message);
        }
    };

    const formatRupiah = value => {
        if (!value) return '';
        return 'Rp ' + parseInt(value, 10).toLocaleString('id-ID');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#E8F3E8', '#C5E6C6', '#97D098']}
                style={styles.container}
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
                        <Icon name="chevron-back-circle" size={32} color="#2D5A27" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Laporan Penjualan</Text>
                </Animatable.View>

                <Animatable.View 
                    animation="fadeIn" 
                    duration={1000} 
                    style={styles.content}
                >
                    <View style={styles.dateContainer}>
                        <TouchableOpacity
                            style={styles.datePickerButton}
                            onPress={() => setShowStartDatePicker(true)}
                        >
                            <LinearGradient
                                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                                style={styles.dateGradient}
                            >
                                <Icon name="calendar-outline" size={20} color="#2D5A27" />
                                <Text style={styles.dateText}>
                                    {startDate.toLocaleDateString('id-ID')}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <Text style={styles.dateSeparator}>sampai</Text>

                        <TouchableOpacity
                            style={styles.datePickerButton}
                            onPress={() => setShowEndDatePicker(true)}
                        >
                            <LinearGradient
                                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                                style={styles.dateGradient}
                            >
                                <Icon name="calendar-outline" size={20} color="#2D5A27" />
                                <Text style={styles.dateText}>
                                    {endDate.toLocaleDateString('id-ID')}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={fetchLaporan}
                        >
                            <LinearGradient
                                colors={['#2D5A27', '#4A8B3B']}
                                style={styles.gradientButton}
                            >
                                <Icon name="search-outline" size={20} color="#FFF" />
                                <Text style={styles.buttonText}>Lihat Laporan</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={downloadPDF}
                        >
                            <LinearGradient
                                colors={['#2D5A27', '#4A8B3B']}
                                style={styles.gradientButton}
                            >
                                <Icon name="download-outline" size={20} color="#FFF" />
                                <Text style={styles.buttonText}>Download PDF</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#2D5A27" />
                            <Text style={styles.loadingText}>Memuat laporan...</Text>
                        </View>
                    ) : (
                        <Animatable.View
                            animation="fadeInUp"
                            duration={800}
                            style={styles.listContainer}
                        >
                            <FlatList
                                data={dataLaporan}
                                keyExtractor={item => item.faktur.toString()}
                                renderItem={({ item, index }) => (
                                    <Animatable.View
                                        animation="fadeInUp"
                                        delay={index * 100}
                                        style={styles.laporanItem}
                                    >
                                        <LinearGradient
                                            colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                                            style={styles.itemGradient}
                                        >
                                            <View style={styles.itemHeader}>
                                                <Icon name="receipt-outline" size={24} color="#2D5A27" />
                                                <Text style={styles.itemTitle}>Faktur #{item.faktur}</Text>
                                            </View>
                                            <View style={styles.itemContent}>
                                                <View style={styles.itemInfo}>
                                                    <Icon name="person-outline" size={16} color="#4A8B3B" />
                                                    <Text style={styles.itemText}>{item.namapelanggan}</Text>
                                                </View>
                                                <View style={styles.itemInfo}>
                                                    <Icon name="calendar-outline" size={16} color="#4A8B3B" />
                                                    <Text style={styles.itemText}>
                                                        {new Date(item.tanggal).toLocaleDateString('id-ID')}
                                                    </Text>
                                                </View>
                                                <View style={styles.totalContainer}>
                                                    <Text style={styles.itemTotal}>
                                                        {formatRupiah(item.totalbayar)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </LinearGradient>
                                    </Animatable.View>
                                )}
                                showsVerticalScrollIndicator={false}
                            />
                        </Animatable.View>
                    )}
                </Animatable.View>

                {showStartDatePicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowStartDatePicker(false);
                            if (selectedDate) {
                                setStartDate(selectedDate);
                            }
                        }}
                    />
                )}
                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowEndDatePicker(false);
                            if (selectedDate) {
                                setEndDate(selectedDate);
                            }
                        }}
                    />
                )}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
        padding: 16,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    datePickerButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
    },
    dateGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    dateSeparator: {
        marginHorizontal: 12,
        color: '#2D5A27',
        fontWeight: '600',
    },
    dateText: {
        marginLeft: 8,
        color: '#2D5A27',
        fontSize: 14,
        fontWeight: '500',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 6,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
    },
    buttonText: {
        color: '#FFF',
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#2D5A27',
        fontSize: 16,
    },
    listContainer: {
        flex: 1,
    },
    laporanItem: {
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
    },
    itemGradient: {
        padding: 16,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemTitle: {
        color: '#2D5A27',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    itemContent: {
        marginLeft: 32,
    },
    itemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    itemText: {
        color: '#4A8B3B',
        fontSize: 14,
        marginLeft: 8,
    },
    totalContainer: {
        backgroundColor: 'rgba(45, 90, 39, 0.1)',
        padding: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    itemTotal: {
        color: '#2D5A27',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
