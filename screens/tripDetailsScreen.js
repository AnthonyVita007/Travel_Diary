import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import tripCollectorA from '../data/tripsDataManagment';

// Ottiene la larghezza dello schermo e definisce la dimensione dell'immagine
const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.38;

export default function TripDetailsScreen({ route }) {
  // Estrae l'ID del viaggio dai parametri di navigazione
  const { tripId } = route.params;
  // Recupera il trip dal tripCollector usando l'id
  const trip = tripCollectorA.getTrip(tripId);

  // --- Gestione caso di errore: viaggio non trovato ---
  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Viaggio non trovato.</Text>
      </SafeAreaView>
    );
  }

  // --- Layout principale ---
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* --- Container principale che contiene tutte le sezioni --- */}
        <View style={styles.mainContainer}>
          {/* --- Riga superiore con immagine e info principali --- */}
          <View style={styles.topRow}>
            {/* Container immagine viaggio */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: trip.imageUri }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>

            {/* Container informazioni principali */}
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{trip.title}</Text>
              <Text style={styles.infoText}>From: {trip.departureDate}</Text>
              <Text style={styles.infoText}>To: {trip.returnDate}</Text>
              <Text style={styles.infoText}>Category: {trip.category}</Text>
            </View>
          </View>

          {/* --- Sezione descrizione viaggio --- */}
          <View style={styles.descContainer}>
            <Text style={styles.descLabel}>Descrizione</Text>
            <Text style={styles.description}>{trip.description}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Stili del componente ---
const styles = StyleSheet.create({
  // Stile container principale
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  // Stile contenuto scrollabile
  scroll: {
    padding: 20,
    alignItems: 'stretch',
  },
  // Stile container principale che contiene tutte le sezioni
  mainContainer: {
    flex: 1,
    width: '100%',
  },
  // Stile riga superiore (immagine + info)
  topRow: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'flex-start',
  },
  // Stile container immagine
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 18,
    backgroundColor: '#eee',
  },
  // Stile immagine
  image: {
    width: '100%',
    height: '100%',
  },
  // Stile container informazioni
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  // Stile titolo viaggio
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  // Stile testo informazioni
  infoText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 3,
  },
  // Stile container descrizione (rimossi elevation e background)
  descContainer: {
    marginTop: 10,
    borderRadius: 8,
    padding: 18,
  },
  // Stile etichetta descrizione
  descLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  // Stile testo descrizione
  description: {
    fontSize: 15,
    color: '#222',
    lineHeight: 21,
  },
  // Stile messaggio di errore
  errorText: {
    color: 'red',
    fontSize: 17,
    alignSelf: 'center',
    marginTop: 50,
  },
});