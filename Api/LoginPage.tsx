import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import React, { useState, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Input, Button, CheckBox } from '@rneui/themed';
import { IpPublic } from './IpPublic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface LoginPageProps {
    navigation: NavigationProp<any>;
}

export default function LoginPage({ navigation }: LoginPageProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorUsername, setErrorUsername] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const formRef = useRef<Animatable.View & View>(null);

    const handleLogin = async () => {
        setErrorUsername('');
        setErrorPassword('');
        try {
            console.log('Mencoba login ke:', `${IpPublic}login`);

            // Perbaiki data yang dikirim ke backend
            const loginData = {
                email: username,  // username di sini sebenarnya adalah email
                password: password
            };
            console.log('Data login:', loginData);

            const response = await fetch(`${IpPublic}login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            console.log('Status response:', response.status);
            const res = await response.json();
            console.log('Response data:', res);

            if (response.ok) {
                console.log('Login berhasil, menyimpan token...');
                await AsyncStorage.setItem('userToken', res.token);
                await AsyncStorage.setItem('userName', res.user.name);

                console.log('Token tersimpan, navigasi ke HomePage...');

                if (formRef.current) {
                    formRef.current.fadeOutDown(800).then(() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'HomePage' }]
                        });
                    });
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'HomePage' }]
                    });
                }
            } else {
                console.log('Login gagal:', res);
                if (res.message) {
                    setErrorPassword(res.message);
                } else if (res.error) {
                    setErrorPassword(res.error);
                }
                if (formRef.current) {
                    formRef.current.shake(800);
                }
            }
        } catch (err) {
            console.log('Error saat login:', err);
            setErrorPassword('Terjadi kesalahan saat login. Silakan coba lagi.');
            if (formRef.current) {
                formRef.current.shake(800);
            }
        }
    };

    return (
        <LinearGradient
            colors={['#E8F3E8', '#C5E6C6', '#97D098']}
            style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <Animatable.View
                    animation="fadeIn"
                    duration={2000}
                    style={styles.contentContainer}>

                    <Animatable.View
                        animation="fadeInDown"
                        duration={1500}
                        delay={500}
                        style={styles.imageContainer}>
                        <Image
                            source={require('./assets/tokokita.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </Animatable.View>

                    <Animatable.View
                        ref={formRef}
                        animation="fadeInUp"
                        duration={1500}
                        delay={1000}
                        style={styles.formContainer}>
                        <LinearGradient
                            colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                            style={styles.formGradient}
                        >
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>Selamat Datang</Text>
                                <Text style={styles.subtitle}>Silakan masuk ke akun Anda</Text>
                            </View>

                            <View style={styles.inputsContainer}>
                                <View style={styles.inputWrapper}>
                                    <Icon name="email" size={20} color="#2D5A27" style={styles.inputIcon} />
                                    <Input
                                        placeholder="Email"
                                        containerStyle={styles.inputContainerStyle}
                                        inputContainerStyle={{ borderBottomWidth: 0 }}
                                        inputStyle={styles.input}
                                        onChangeText={setUsername}
                                        value={username}
                                        errorMessage={errorUsername}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>

                                <View style={styles.inputWrapper}>
                                    <Icon name="lock-outline" size={20} color="#2D5A27" style={styles.inputIcon} />
                                    <Input
                                        placeholder="Password"
                                        secureTextEntry
                                        containerStyle={styles.inputContainerStyle}
                                        inputContainerStyle={{ borderBottomWidth: 0 }}
                                        inputStyle={styles.input}
                                        onChangeText={setPassword}
                                        value={password}
                                        errorMessage={errorPassword}
                                    />
                                </View>

                                <View style={styles.actionContainer}>
                                    <TouchableOpacity 
                                        style={styles.forgotContainer}
                                        onPress={() => navigation.navigate('ForgotPassword')}
                                    >
                                        <Text style={styles.actionText}>Lupa Password?</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity 
                                        style={styles.registerContainer}
                                        onPress={() => navigation.navigate('RegisterPage')}
                                    >
                                        <Text style={styles.actionText}>Daftar</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={styles.loginButton}
                                    onPress={handleLogin}
                                >
                                    <LinearGradient
                                        colors={['#2D5A27', '#4A8B3B']}
                                        style={styles.loginGradient}
                                    >
                                        <Text style={styles.buttonText}>MASUK</Text>
                                        <Icon name="arrow-forward" size={20} color="#FFF" style={styles.buttonIcon} />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </Animatable.View>
                </Animatable.View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    imageContainer: {
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    formContainer: {
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    formGradient: {
        padding: 25,
    },
    titleContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2D5A27',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#4A8B3B',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    inputsContainer: {
        gap: 15,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(45, 90, 39, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 5,
    },
    inputIcon: {
        marginRight: 10,
    },
    inputContainerStyle: {
        flex: 1,
        height: 50,
        paddingHorizontal: 0,
    },
    input: {
        fontSize: 16,
        color: '#2D5A27',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    forgotContainer: {
        // remove alignItems: 'flex-end'
    },
    registerContainer: {
        // style for register container
    },
    actionText: {
        color: '#2D5A27',
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        borderRadius: 25,
        overflow: 'hidden',
        elevation: 3,
        marginTop: 10,
    },
    loginGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 1,
    },
    buttonIcon: {
        marginLeft: 8,
    },
});
