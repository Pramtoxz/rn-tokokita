import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ToastAndroid,
    Image
} from 'react-native';
import React, { useState, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Input, Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { IpPublic } from './IpPublic';
import * as Animatable from 'react-native-animatable';
import { NavigationProp } from '@react-navigation/native';

interface RegisterPageProps {
    navigation: NavigationProp<any>;
}

export default function RegisterPage({ navigation }: RegisterPageProps) {
    const [name, setNamaUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorName, setErrorName] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const formRef = useRef<Animatable.View & View>(null);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async () => {
        setErrorName('');
        setErrorEmail('');
        setErrorPassword('');

        if (!name || !email || !password) {
            formRef.current?.shake(800);
            if (!name) setErrorName('Nama harus diisi');
            if (!email) setErrorEmail('Email harus diisi');
            if (!password) setErrorPassword('Password harus diisi');
            return;
        }

        if (!validateEmail(email)) {
            setErrorEmail('Format email tidak valid');
            formRef.current?.shake(800);
            return;
        }

        try {
            const response = await fetch(`${IpPublic}register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                formRef.current?.fadeOutDown(800).then(() => {
                    navigation.navigate('LoginPage');
                    ToastAndroid.show('Registrasi berhasil!', ToastAndroid.SHORT);
                });
            } else {
                if (data.errors) {
                    setErrorName(data.errors.name ? data.errors.name[0] : '');
                    setErrorEmail(data.errors.email ? data.errors.email[0] : '');
                    setErrorPassword(data.errors.password ? data.errors.password[0] : '');
                    formRef.current?.shake(800);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            ToastAndroid.show('Terjadi kesalahan pada server', ToastAndroid.SHORT);
            formRef.current?.shake(800);
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
                                <Text style={styles.title}>Daftar Akun</Text>
                                <Text style={styles.subtitle}>Silakan lengkapi data Anda</Text>
                            </View>

                            <View style={styles.inputsContainer}>
                                <View style={styles.inputWrapper}>
                                    <Icon name="person-outline" size={20} color="#2D5A27" style={styles.inputIcon} />
                                    <Input
                                        placeholder="Nama Lengkap"
                                        containerStyle={styles.inputContainerStyle}
                                        inputContainerStyle={{ borderBottomWidth: 0 }}
                                        inputStyle={styles.input}
                                        value={name}
                                        onChangeText={setNamaUser}
                                        errorMessage={errorName}
                                    />
                                </View>

                                <View style={styles.inputWrapper}>
                                    <Icon name="mail-outline" size={20} color="#2D5A27" style={styles.inputIcon} />
                                    <Input
                                        placeholder="Email"
                                        containerStyle={styles.inputContainerStyle}
                                        inputContainerStyle={{ borderBottomWidth: 0 }}
                                        inputStyle={styles.input}
                                        value={email}
                                        onChangeText={setEmail}
                                        errorMessage={errorEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>

                                <View style={styles.inputWrapper}>
                                    <Icon name="key-outline" size={20} color="#2D5A27" style={styles.inputIcon} />
                                    <Input
                                        placeholder="Password"
                                        secureTextEntry
                                        containerStyle={styles.inputContainerStyle}
                                        inputContainerStyle={{ borderBottomWidth: 0 }}
                                        inputStyle={styles.input}
                                        value={password}
                                        onChangeText={setPassword}
                                        errorMessage={errorPassword}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.registerButton}
                                    onPress={handleSubmit}
                                >
                                    <LinearGradient
                                        colors={['#2D5A27', '#4A8B3B']}
                                        style={styles.registerGradient}
                                    >
                                        <Text style={styles.buttonText}>DAFTAR</Text>
                                        <Icon name="arrow-forward" size={20} color="#FFF" style={styles.buttonIcon} />
                                    </LinearGradient>
                                </TouchableOpacity>

                                <View style={styles.loginContainer}>
                                    <Text style={styles.loginText}>Sudah punya akun? </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('LoginPage')}>
                                        <Text style={styles.loginLink}>Masuk</Text>
                                    </TouchableOpacity>
                                </View>
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
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 75,
    },
    image: {
        width: '150%',
        height: '150%',
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    formGradient: {
        padding: 25,
    },
    titleContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#111B35',
        marginBottom: 15,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#111B35',
        textAlign: 'center',
        lineHeight: 22,
    },
    inputsContainer: {
        gap: 15,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FF',
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
        color: '#333',
    },
    registerButton: {
        borderRadius: 25,
        overflow: 'hidden',
        elevation: 3,
        marginTop: 10,
    },
    registerGradient: {
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    loginText: {
        color: '#2D5A27',
        fontSize: 14,
    },
    loginLink: {
        color: '#2D5A27',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
