import React, { useState } from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const backgroundImage = require('../assets/images/redchair.jpg');

const LoginScreen = ({ navigation }: any): React.JSX.Element => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (email.trim() === '' || password.trim() === '') {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }
        Alert.alert('Login Successful', `Welcome, ${email}!`);
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            {/* Overlay for better contrast */}
            <View style={styles.overlay} />

            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Login</Text>
                    <Text style={styles.description}>Sign in to your account</Text>

                    {/* Email Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#ccc"
                        keyboardType="email-address" 
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />


                    {/* Password Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#ccc"
                        secureTextEntry
                        autoCapitalize='none'
                        value={password}
                        onChangeText={setPassword}
                    />

                    {/* Forgot Password */}
                    <TouchableOpacity onPress={() => Alert.alert('Reset Password', 'Password reset functionality coming soon!')}>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Login Button with Gradient */}
                    <TouchableOpacity onPress={handleLogin} activeOpacity={0.8}>
                        <LinearGradient colors={['#ff7e00', '#ff5500']} style={styles.button}>
                            <Text style={styles.buttonText}>Login</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Sign Up Button with Gradient */}
                    <TouchableOpacity activeOpacity={0.8}>
                        <LinearGradient colors={['#007bff', '#0056b3']} style={[styles.button, styles.signUpButton]}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Back to Home */}
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.backToHome}>← Back to Home</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // Covers the entire screen
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better contrast
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'orange',
        textShadowColor: 'rgba(0, 0, 0, 0.7)', // Shadow for better readability
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 10,
    },
    description: {
        fontSize: 18,
        marginBottom: 20,
        color: '#fff',
        textAlign: 'center',
    },
    input: {
        width: 350,
        height: 50, // Increased height for better consistency
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent input
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)', // Subtle white border
        color: '#fff', // White text
    },
    forgotPassword: {
        color: '#ffcc00',
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        width: 250,
        paddingVertical: 15,
        borderRadius: 25, // More rounded edges for modern look
        alignItems: 'center',
        shadowColor: '#000', // Adds a slight shadow
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5, // Elevation for Android
        marginBottom: 15,
    },
    signUpButton: {
        marginTop: 10,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    backToHome: {
        fontSize: 16,
        color: '#ddd',
        marginTop: 10,
    },
});

export default LoginScreen;
