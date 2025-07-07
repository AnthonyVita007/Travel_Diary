import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const NoTripsAlert = ({ handlePress }) => {
  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <Text style={styles.emoji}>😢</Text>
      <Text style={styles.text}>No trips available!</Text>
      <Text style={styles.subtext}>Tap here to create your first trip</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    marginHorizontal: 30,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 15,
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default NoTripsAlert;