// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ImageBackground, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const backgroundImage = require('../assets/images/redchair.jpg');

function DashboardScreen() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const nameParts = currentUser.displayName ? currentUser.displayName.split(' ') : ["No Name", ""];
      setUser({
        firstName: nameParts[0],
        lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : "Not Available",
        email: currentUser.email || "No Email",
        photoURL: currentUser.photoURL || require('../assets/images/profile.jpg'),
      });
    }
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      Alert.alert("Logout Successful", "You have been logged out successfully.");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <LinearGradient colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']} style={styles.overlay} />
      <View style={styles.container}>
        {/* Profile Picture */}
        <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.profileContainer}>
          <Image
            source={user?.photoURL ? { uri: user.photoURL } : require('../assets/images/profile.jpg')}
            style={styles.profilePic}
          />
        </TouchableOpacity>

        {/* Sidebar Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isSidebarVisible}
          onRequestClose={() => setSidebarVisible(false)}
        >
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Image source={{ uri: user?.photoURL }} style={styles.userImage} />
              <Text style={styles.sidebarTitle}>
                {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
              </Text>
            </View>
            <View style={styles.divider} />
            {user ? (
              <>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>First Name</Text>
                  <Text style={styles.infoText}>{user.firstName}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Last Name</Text>
                  <Text style={styles.infoText}>{user.lastName}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.infoText}>{user.email}</Text>
                </View>
              </>
            ) : (
              <Text style={styles.sidebarText}>No User Logged In</Text>
            )}

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSidebarVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Dashboard Options */}
        <Text style={styles.title}>Choose an Option:</Text>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("SwipingScreen", { mode: "movie" })}
        >
          <Text style={styles.optionText}>Help me decide Movie</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("SwipingScreen", { mode: "food" })}
        >
          <Text style={styles.optionText}>Help me decide Food</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("SwipingScreen", { mode: "both" })}
        >
          <Text style={styles.optionText}>Help me decide Both</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileContainer: {
    position: 'absolute',
    top: 10,
    right: -50,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffcc00',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 10,
  },
  optionButton: {
    backgroundColor: '#ffcc00',
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  optionText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '70%',
    height: '100%',
    backgroundColor: "silver",
    padding: 30,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  sidebarHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  sidebarText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
