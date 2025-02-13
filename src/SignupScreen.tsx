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

const SignupScreen = ({ navigation }: any): React.JSX.Element => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    Alert.alert('Signup Successful', `Welcome, ${firstName}!`);
    
    navigation.navigate('Login'); // Navigate to Login after signup
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      {/* Overlay for better contrast */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.description}>Create a new account</Text>

          {/* First Name & Last Name Input Fields */}
          <View style={styles.nameContainer}>
            <TextInput
              style={[styles.input, styles.nameInput]}
              placeholder="First Name"
              placeholderTextColor="#ccc"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, styles.nameInput]}
              placeholder="Last Name"
              placeholderTextColor="#ccc"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

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
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />

          {/* Confirm Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Signup Button with Gradient */}
          <TouchableOpacity onPress={handleSignup} activeOpacity={0.8}>
            <LinearGradient colors={['#ff7e00', '#ff5500']} style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Already Have an Account? Log In */}
          <View style={styles.loginRedirect}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}> Log in</Text>
            </TouchableOpacity>
          </View>

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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for contrast
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
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  nameInput: {
    width: '48%', // Each name field takes up half the width
  },
  input: {
    width: 350,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    color: '#fff',
  },
  button: {
    width: 250,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  loginRedirect: {
    flexDirection: 'row',
    marginTop: 10,
  },
  loginText: {
    fontSize: 16,
    color: '#ddd',
  },
  loginLink: {
    fontSize: 16,
    color: '#ffcc00',
    fontWeight: 'bold',
  },
  backToHome: {
    fontSize: 16,
    color: '#ddd',
    marginTop: 10,
  },
});

export default SignupScreen;
