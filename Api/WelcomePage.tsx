import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

interface WelcomePageProps {
    navigation: NavigationProp<any>;
}

export default function WelcomePage({ navigation }: WelcomePageProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleTap = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setTimeout(() => {
                navigation.navigate('LoginPage');
            }, 1000);
        }
    };

    return (
        <LinearGradient
            colors={['#E8F3E8', '#C5E6C6', '#97D098']}
            style={styles.container}
        >
            <Animatable.View
                animation="fadeIn"
                duration={2000}
                style={styles.contentContainer}
                onTouchStart={handleTap}
            >
                <Animatable.View
                    animation={isAnimating ? {
                        0: {
                            scale: 1,
                            translateY: 0,
                        },
                        1: {
                            scale: 0.8,
                            translateY: -800,
                        },
                    } : undefined}
                    duration={1000}
                    style={styles.logoContainer}
                >
                    <LinearGradient
                        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                        style={styles.logoGradient}
                    >
                        <Image
                            source={require('./assets/tokokita.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </LinearGradient>
                </Animatable.View>

                <Animatable.View
                    animation="fadeIn"
                    delay={500}
                    style={styles.welcomeContainer}
                >
                    <Text style={styles.welcomeTitle}>Selamat Datang di Toko Kita</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Kelola bisnis Anda dengan lebih mudah dan efisien
                    </Text>
                </Animatable.View>

                <Animatable.View
                    animation="fadeInUp"
                    delay={1000}
                    style={styles.hintContainer}
                >
                    <Icon name="finger-print-outline" size={24} color="#2D5A27" />
                    <Animatable.Text
                        animation="pulse"
                        easing="ease-out"
                        iterationCount="infinite"
                        style={styles.tapHint}
                    >
                        Tap di mana saja untuk melanjutkan
                    </Animatable.Text>
                </Animatable.View>
            </Animatable.View>
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
        alignItems: 'center',
        padding: 20,
    },
    logoContainer: {
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    logoGradient: {
        width: '80%',
        aspectRatio: 1,
        borderRadius: 40,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    welcomeContainer: {
        alignItems: 'center',
        marginBottom: 40,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 20,
        borderRadius: 20,
        width: '100%',
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2D5A27',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#4A8B3B',
        textAlign: 'center',
        lineHeight: 24,
        letterSpacing: 0.3,
    },
    hintContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 50 : 30,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 12,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tapHint: {
        color: '#2D5A27',
        fontSize: 16,
        marginLeft: 8,
        fontWeight: '500',
    },
}); 