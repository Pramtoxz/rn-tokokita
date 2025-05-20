import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { IpPublic } from '../IpPublic';
import { useFocusEffect } from '@react-navigation/native';
import { FAB, ListItem } from '@rneui/base';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import { Input } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListPelanggan({ navigation }) {
  const [dataPelanggan, setDataPelanggan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [loadingMore, setloadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Fungsi untuk mengambil data
  const fetchData = async (page = 1, append = false) => {
    try {

        setLoading(true);

        const token = await AsyncStorage.getItem('userToken');

        const response = await fetch( `${IpPublic}pelanggan?search=${search}&page=${page}`,
            {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        //Penambahan Search
        const data = await response.json();

        if (append) {
            setDataPelanggan(prevData => [...prevData, ...data.data]); //Tambahkan Data
        } else {
            setDataPelanggan(data.data); //Reset Data
        }
        setTotalPages(data.last_page);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
        setloadingMore(false);
    }
};

const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setDataPelanggan([]);
    setSearch('');
    await fetchData(1, false);
    setRefreshing(false);
};

const loadMoreData = () => {
    if (!loadingMore && page < totalPages) {
        setloadingMore(true);
        setPage(prevPage => prevPage + 1);
        fetchData(page + 1, true);
    }
};

// Panggil fetchData saat komponen pertama kali dimuat
useFocusEffect(
    React.useCallback( () => {
    if (dataPelanggan.length === 0) {
        setDataPelanggan([]);
        setPage(1);
        setLoading(true);
        fetchData(1,false);
    }
}, [search]),
);


if (loading) {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7B1FA2" />
            <Text style={styles.loadingText}>Memuat Data...</Text>
        </View>
    );
}

if (error) {
    return (
        <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={50} color="#7B1FA2" />
            <Text style={styles.errorText}>Error: {error}</Text>
        </View>
    );
}

const renderItem = ({ item }) => {
    return (
        <ListItem
            containerStyle={styles.listItemContainer}
            Component={TouchableScale}
            friction={90}
            tension={100}
            activeScale={0.95}
            linearGradientProps={{
                colors: ['#1A237E', '#0D47A1'],
                start: { x: 0, y: 0 },
                end: { x: 1, y: 0 },
            }}
            ViewComponent={LinearGradient}
            onPress={() => navigation.navigate('DetailDataPelanggan', {kode: item.kodepelanggan})}>
            <Icon name="person" size={24} color="white" />
            <ListItem.Content>
                <ListItem.Title style={styles.itemTitle}>
                    {item.kodepelanggan}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.itemSubtitle}>
                    {item.namapelanggan}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron color="white" size={24} />
        </ListItem>
    );
};

  return (
    <View style={styles.container}>
        <LinearGradient
            colors={['#E8F3E8', '#C5E6C6', '#97D098']}
            style={styles.gradientBackground}
        >
            <Input 
                placeholder="Cari Pelanggan..."
                value={searchInput}
                onChangeText={text => setSearchInput(text)}
                onSubmitEditing={() => {
                    setSearch(searchInput);
                    setPage(1);
                    setDataPelanggan([]);
                    fetchData(1, false);
                }}
                returnKeyType="search"
                leftIcon={<Icon name="search-outline" size={24} color="#2D5A27" />}
                inputStyle={styles.searchInput}
                inputContainerStyle={styles.searchInputContainer}
                containerStyle={styles.searchContainer}
                placeholderTextColor="#4A8B3B"
            />
            <FlatList
                data={dataPelanggan}
                keyExtractor={(item) => item.kodepelanggan}
                renderItem={({ item }) => (
                    <ListItem
                        containerStyle={styles.listItemContainer}
                        Component={TouchableScale}
                        friction={90}
                        tension={100}
                        activeScale={0.95}
                        onPress={() => navigation.navigate('DetailDataPelanggan', {kode: item.kodepelanggan})}
                    >
                        <LinearGradient
                            colors={['#2D5A27', '#4A8B3B']}
                            style={styles.iconContainer}
                        >
                            <Icon name="person-outline" size={24} color="white" />
                        </LinearGradient>
                        <ListItem.Content>
                            <ListItem.Title style={styles.itemTitle}>
                                {item.namapelanggan}
                            </ListItem.Title>
                            <ListItem.Subtitle style={styles.itemSubtitle}>
                                Kode: {item.kodepelanggan}
                            </ListItem.Subtitle>
                        </ListItem.Content>
                        <Icon name="chevron-forward-outline" size={24} color="#2D5A27" />
                    </ListItem>
                )}
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
                    loadingMore ? (
                        <ActivityIndicator size="large" color="#2D5A27" style={styles.loadMoreSpinner} />
                    ) : null
                }
                contentContainerStyle={styles.listContainer}
            />
            <FAB
                onPress={() => navigation.navigate('FormAddPelanggan')}
                placement="right"
                icon={
                    <LinearGradient
                        colors={['#2D5A27', '#4A8B3B']}
                        style={styles.fabGradient}
                    >
                        <Icon name="add-outline" size={30} color="white" />
                    </LinearGradient>
                }
                style={styles.fab}
                buttonStyle={styles.fabButton}
            />
        </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientBackground: {
        flex: 1,
    },
    searchContainer: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        paddingHorizontal: 15,
        marginVertical: 10,
    },
    searchInputContainer: { 
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 15,
        borderBottomWidth: 0,
        paddingHorizontal: 15,
        height: 50,
        elevation: 3,
    },
    searchInput: {
        color: '#2D5A27',
        fontSize: 16,
    },
    listContainer: {
        padding: 10,
    },
    listItemContainer: {
        marginVertical: 8,
        borderRadius: 15,
        elevation: 3,
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingVertical: 12,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemTitle: {
        color: '#2D5A27',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    itemSubtitle: {
        color: '#4A8B3B',
        fontSize: 14,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    fabButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        padding: 0,
        backgroundColor: 'transparent',
    },
    fabGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadMoreSpinner: {
        marginVertical: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#111B35',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    errorText: {
        marginTop: 10,
        fontSize: 16,
        color: '#16404D',
    },
});
