import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const CustomHeader = () => {
  return (
    <LinearGradient
      colors={['#00c6fb', '#005bea']} // blu e azzurro
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerContainer}
    >
      <Text style={styles.title}>Travelnello</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: width,
    height: height*0.12,
    justifyContent: 'flex-end',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    paddingTop: 10,
    paddingBottom: 0
  },
  title: {
    fontFamily: 'FontdinerSwanky_400Regular',
    fontSize: 40,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.20)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 2,
    paddingBottom:0
  },
});

export default CustomHeader;