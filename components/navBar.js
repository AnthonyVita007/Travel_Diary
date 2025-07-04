import React from 'react';
import { View, StyleSheet, Pressable, Dimensions, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const NavBar = () => {
  //inizializzazione di un navigator
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

   //----------------------------------------------------------------------------------------------------------------------
  //CALLBACKS
  // Callback icona Home
  const handleHomePress = () =>{
    navigation.navigate('HomeScreen');
  }
  
  // Callback icona Settings
  const handleSettingsPress = () =>{
    Alert.alert('Settings cliccata');
  }
    
  // Callback icona Add
  const handleAddPress = () => {
    navigation.navigate('CreateTripScreen');
  };

  //----------------------------------------------------------------------------------------------------------------------
  //RENDERING DEL COMPONENT
  return (
    <View style={[
      styles.container,
      {
        paddingBottom: insets.bottom + 5,
      }
    ]}>
      {/* Settings Icon (left) */}
      <Pressable onPress={handleSettingsPress} style={styles.iconContainer}>
        <Icon name="settings" style={styles.icon} />
      </Pressable>

      {/* Home Icon (center) */}
      <Pressable onPress={handleHomePress} style={styles.iconContainer}>
        <Icon name="home" style={styles.icon} />
      </Pressable>

      {/* Add Icon (right) */}
      <Pressable onPress={handleAddPress} style={styles.iconContainer}>
        <Icon name="add-circle" style={styles.icon} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('window').height*0.08,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 35,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    elevation: 10,
    paddingTop: 10,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    fontSize: 30,
    color: '#333',
  },
});

export default NavBar;