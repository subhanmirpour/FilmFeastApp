// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, ImageBackground, Alert } from 'react-native';
import { Button, Text, Layout, Avatar, useTheme } from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const backgroundImage = require('../assets/images/redchair.jpg');

function DashboardScreen() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const nameParts = currentUser.displayName 
        ? currentUser.displayName.split(' ') 
        : ["No Name", ""];
      
      setUser({
        firstName: nameParts[0],
        lastName: nameParts.length > 1 
          ? nameParts.slice(1).join(' ') 
          : "Not Available",
        email: currentUser.email || "No Email",
        photoURL: currentUser.photoURL 
          || require('../assets/images/profile.jpg'),
      });
    }
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      Alert.alert(
        "Logout Successful", 
        "You have been logged out successfully."
      );
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <LinearGradient 
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']} 
        style={styles.overlay} 
      />
      
      <Layout style={styles.container}>
        {/* Profile Avatar */}
        <Button 
          appearance="ghost" 
          onPress={() => setSidebarVisible(true)}
          style={styles.profileContainer}
          accessoryLeft={() => (
            <Avatar
              source={user?.photoURL 
                ? { uri: user.photoURL } 
                : require('../assets/images/profile.jpg')
              }
              style={styles.profilePic}
            />
          )}
        />

        {/* User Sidebar Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isSidebarVisible}
          onRequestClose={() => setSidebarVisible(false)}
        >
          <Layout style={styles.sidebar}>
            {/* User Profile Section */}
            <Layout style={styles.sidebarHeader}>
              <Avatar
                source={{ uri: user?.photoURL }} 
                style={styles.userImage}
              />
              <Text category="h5" style={styles.sidebarTitle}>
                {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
              </Text>
            </Layout>

            <View 
              style={[
                styles.divider, 
                { backgroundColor: theme['color-basic-500'] }
              ]} 
            />
            
            {/* User Info Section */}
            {user ? (
              <>
                <Layout style={styles.infoContainer}>
                  <Text category="label" style={styles.labelText}>
                    First Name
                  </Text>
                  <Text category="s1" style={styles.valueText}>
                    {user.firstName}
                  </Text>
                </Layout>

                <Layout style={styles.infoContainer}>
                  <Text category="label" style={styles.labelText}>
                    Last Name
                  </Text>
                  <Text category="s1" style={styles.valueText}>
                    {user.lastName}
                  </Text>
                </Layout>

                <Layout style={styles.infoContainer}>
                  <Text category="label" style={styles.labelText}>
                    Email
                  </Text>
                  <Text category="s1" style={styles.valueText}>
                    {user.email}
                  </Text>
                </Layout>
              </>
            ) : (
              <Text category="s1">No User Logged In</Text>
            )}

            {/* Action Buttons */}
            <Button 
              status="danger" 
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </Button>

            <Button 
              appearance="ghost" 
              status="basic"
              onPress={() => setSidebarVisible(false)}
            >
              Close
            </Button>
          </Layout>
        </Modal>
        <Button
            style={styles.howItWorksButton}
            appearance="ghost"
            status="basic"
            onPress={() => navigation.navigate('Instructions')}
          >
            Instructions
        </Button>
        {/* Main Content */}
        <Text category="h4" style={styles.title}>
          Choose an Option:
        </Text>

        <Button
          status="warning"
          style={styles.optionButton}
          onPress={() => navigation.navigate("SwipingScreen", { mode: "movie" })}
        >
          Help me decide Movie
        </Button>

        <Button
          status="warning"
          style={styles.optionButton}
          onPress={() => navigation.navigate("SwipingScreen", { mode: "food" })}
        >
          Help me decide Food
        </Button>

        <Button
          status="warning"
          style={styles.optionButton}
          onPress={() => navigation.navigate("SwipingScreen", { mode: "both" })}
        >
          Help me decide Both
        </Button>
      </Layout>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  profileContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ffcc00',
  },
  title: {
    color: '#ffcc00',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  optionButton: {
    marginVertical: 15,
    width: '85%',
    borderRadius: 15,
    minHeight: 60,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '80%',
    height: '100%',
    padding: 30,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  sidebarHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sidebarTitle: {
    marginTop: 15,
    fontSize: 28,
    fontWeight: 'bold',
  },
  divider: {
    height: 2,
    marginVertical: 25,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ffcc00',
  },
  infoContainer: {
    marginBottom: 25,
  },
  logoutButton: {
    marginVertical: 25,
    minHeight: 50,
    borderRadius: 12,
  },
  labelText: {
    fontSize: 20,
    color: '#666',
    marginBottom: 8,
  },
  valueText: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default DashboardScreen;