import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import tripCollectorA from '../data/mockupTrips';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.38;

export default function TripDetailsScreen({ route }) {
  const { tripId } = route.params;
  // Recupera il trip dal tripCollector usando l'id
  console.log('TripDetailsScreen tripId:', tripId);
  const trip = tripCollectorA.getTrip(tripId);

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Viaggio non trovato.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topRow}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: trip.imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{trip.title}</Text>
            <Text style={styles.infoText}>From: {trip.departureDate}</Text>
            <Text style={styles.infoText}>To: {trip.returnDate}</Text>
            <Text style={styles.infoText}>Category: {trip.category}</Text>
          </View>
        </View>
        <View style={styles.descContainer}>
          <Text style={styles.descLabel}>Descrizione</Text>
          <Text style={styles.description}>{trip.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scroll: {
    padding: 20,
    alignItems: 'stretch',
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'flex-start',
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 18,
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  infoText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 3,
  },
  descContainer: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  descLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  description: {
    fontSize: 15,
    color: '#222',
    lineHeight: 21,
  },
  errorText: {
    color: 'red',
    fontSize: 17,
    alignSelf: 'center',
    marginTop: 50,
  },
});