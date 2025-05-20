/* eslint-disable @typescript-eslint/no-require-imports */
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    Alert,
    ImageBackground,
    Platform,
} from 'react-native';
import { Input, Card, Button, Badge } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IpPublic, IpAddress } from './IpPublic';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

export default function HomePenjualan({ navigation }) {
    const [dataBarang, setDataBarang] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const [totalItems, setTotalItems] = useState(0);

    //menambahkan icon keranjang
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('KeranjangBelanja')}
                    style={styles.cartButton}>
                    <LinearGradient
                        colors={['#6E8E59', '#B1C29E']}
                        style={styles.cartGradient}
                    >
                        <Icon
                            name="cart-outline"
                            size={24}
                            color='#FFF'
                        />
                        {totalItems > 0 && (
                            <Badge
                                value={totalItems}
                                status="error"
                                containerStyle={styles.badge}
                            />
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: '#6E8E59',
            },
            headerTintColor: '#fff',
            headerTitle: 'Toko Kita',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        });
    }, [navigation, totalItems]);

    const fetchTotalItems = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const userId = await AsyncStorage.getItem('userName');

            const response = await fetch(`${IpPublic}total-items/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTotalItems(data.totalItems);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchData = async (page = 1, append = false) => {
        try {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }
            const token = await AsyncStorage.getItem('userToken');

            const response = await fetch(`${IpPublic}barang?search=${search}&page=${page}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.ok) {
                const data = await response.json();

                if (append) {
                    setDataBarang(prevData => [...prevData, ...data.data]);
                } else {
                    setDataBarang(data.data);
                }
                setTotalPages(data.last_page);
            } else {
                navigation.navigate('FormLogin');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            if (append) {
                setLoadingMore(false);
            } else {
                setLoading(false);
            }
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setDataBarang([]);
            setPage(1);
            setLoading(true);
            fetchData(1, false);
            fetchTotalItems();
        }, [search]),
    );

    const onRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        setDataBarang([]);
        setSearch('');
        setSearchInput('');
        await fetchData(1, false);
        setRefreshing(false);
    };

    const loadMoreData = () => {
        if (!loadingMore && page < totalPages) {
            setPage(prevPage => prevPage + 1);
            fetchData(page + 1, true);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6E8E59" />
                <Text style={styles.loadingText}>Memuat Data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Icon name="alert-circle-outline" size={60} color="#6E8E59" />
                <Text style={styles.errorText}>Error: {error}</Text>
                <Button
                    title="Coba Lagi"
                    onPress={() => fetchData(1, false)}
                    buttonStyle={styles.retryButton}
                />
            </View>
        );
    }

    const formatRupiah = value => {
        if (!value) return '';
        return 'Rp' + parseInt(value, 10).toLocaleString('id-ID');
    };

    const addToCart = async item => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const userId = await AsyncStorage.getItem('userName');
            const response = await fetch(`${IpPublic}insert-temp/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    kodebarang: item.kodebarang,
                    qty: 1,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('Sukses', data.message);
                fetchTotalItems();
            } else {
                Alert.alert('Gagal', 'Terjadi kesalahan saat menambahkan ke keranjang');
            }
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

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
                    style={styles.searchContainer}
                >
                    <Input
                        placeholder='Cari Barang...'
                        value={searchInput}
                        onChangeText={text => setSearchInput(text)}
                        onSubmitEditing={() => {
                            setSearch(searchInput);
                            setPage(1);
                            setDataBarang([]);
                            fetchData(1, false);
                        }}
                        returnKeyType='search'
                        containerStyle={styles.inputContainer}
                        inputContainerStyle={styles.inputInnerContainer}
                        leftIcon={
                            <Icon name="search-outline" size={24} color="#2D5A27" />
                        }
                        rightIcon={
                            searchInput ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSearchInput('');
                                        setSearch('');
                                        setPage(1);
                                        setDataBarang([]);
                                        fetchData(1, false);
                                    }}>
                                    <Icon name='close-circle' size={24} color="#2D5A27" />
                                </TouchableOpacity>
                            ) : null
                        }
                    />
                </Animatable.View>

                <FlatList
                    data={dataBarang}
                    keyExtractor={item => item.kodebarang}
                    renderItem={({ item, index }) => (
                        <Animatable.View
                            animation="fadeInUp"
                            delay={index * 100}
                            style={styles.cardContainer}
                        >
                            <LinearGradient
                                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                                style={styles.card}
                            >
                                <ImageBackground
                                    source={
                                        item.gambar
                                            ? { uri: IpAddress + item.gambarthumb }
                                            : require('./assets/avatar.png')
                                    }
                                    style={styles.cardImage}
                                    imageStyle={styles.cardImageStyle}
                                >
                                    <LinearGradient
                                        colors={['transparent', 'rgba(45, 90, 39, 0.8)']}
                                        style={styles.imageOverlay}
                                    >
                                        <Text style={styles.priceText}>
                                            {formatRupiah(item.harga)}
                                        </Text>
                                    </LinearGradient>
                                </ImageBackground>
                                <View style={styles.cardContent}>
                                    <Text style={styles.productName} numberOfLines={2}>
                                        {item.namabarang}
                                    </Text>
                                    
                                    <TouchableOpacity
                                        style={styles.addButton}
                                        onPress={() => addToCart(item)}
                                    >
                                        <LinearGradient
                                            colors={['#2D5A27', '#4A8B3B']}
                                            style={styles.addButtonGradient}
                                        >
                                            <Icon name="cart-outline" size={18} color="#FFF" />
                                            <Text style={styles.addButtonText}>
                                                Tambah ke Keranjang
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </Animatable.View>
                    )}
                    numColumns={2}
                    ListEmptyComponent={
                        <Animatable.View 
                            animation="fadeIn" 
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
                            <Text style={styles.emptyText}>Tidak ada Barang ditemukan</Text>
                            <Text style={styles.emptySubText}>Coba kata kunci lain</Text>
                        </Animatable.View>
                    }
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#2D5A27']}
                        />
                    }
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loadingMore && (
                            <ActivityIndicator size="large" color="#2D5A27" style={styles.loadMoreSpinner} />
                        )
                    }
                />
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
    searchContainer: {
        padding: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    inputContainer: {
        paddingHorizontal: 0,
        marginBottom: 0,
    },
    inputInnerContainer: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#A7D7C5',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 15,
        height: 50,
        elevation: 3,
    },
    cardContainer: {
        width: '48%',
        margin: '1%',
    },
    card: {
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardImage: {
        height: 160,
        width: '100%',
    },
    cardImageStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
    },
    cardContent: {
        padding: 16,
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 3,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D5A27',
        marginBottom: 8,
        height: 40,
    },
    stockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(45, 90, 39, 0.1)',
        padding: 6,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    stockText: {
        fontSize: 14,
        color: '#2D5A27',
        marginLeft: 6,
        fontWeight: '500',
    },
    addButton: {
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
    },
    addButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 40,
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
        fontSize: 20,
        color: '#2D5A27',
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 16,
        color: '#4A8B3B',
        opacity: 0.8,
    },
    loadMoreSpinner: {
        marginVertical: 20,
    },
    cartButton: {
        marginRight: 12,
    },
    cartGradient: {
        padding: 8,
        borderRadius: 12,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4F9F4',
    },
    loadingText: {
        marginTop: 12,
        color: '#2D5A27',
        fontSize: 16,
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F4F9F4',
    },
    errorText: {
        marginTop: 12,
        marginBottom: 20,
        color: '#2D5A27',
        fontSize: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#2D5A27',
        paddingHorizontal: 30,
        borderRadius: 12,
    },
    listContent: {
        padding: 8,
        paddingBottom: 20,
    },
});