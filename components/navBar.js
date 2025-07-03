import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NavBar = ({ handleHomePress, handleSettingsPress, handleAddPress }) => {
  return (
    <View style={styles.container}>
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
    height: Dimensions.get('window').height*0.08,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 35,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    elevation: 10,
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