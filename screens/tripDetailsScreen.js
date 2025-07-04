import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tripCollectorA from '../data/tripsDataManagment';
import categories from '../models/categories';

// Ottiene la larghezza dello schermo e definisce la dimensione dell'immagine
const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.42;

export default function TripDetailsScreen({ route }) {
  
  //---------------------------------------------------------------------------------------------------
  //FUNZIONI E CALLBACKS
  const { tripId } = route.params; // Estrae l'ID del viaggio dai parametri di navigazione
  const trip = tripCollectorA.getTrip(tripId); // Recupera il trip dal tripCollector usando l'id

  // --- Gestione caso di errore: viaggio non trovato ---
  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Trip not found.</Text>
      </SafeAreaView>
    );
  }

  // Funzione per ottenere gli oggetti categoria dal loro nome
  const getTripCategories = () => {
    // Se non ci sono categorie o la categoria è vuota, mostra "None"
    if (!trip.category || trip.category === "" || trip.category.toLowerCase() === "none") {
      return [categories['None']]; // Restituisci un array con solo la categoria "None"
    }
    
    const categoryNames = trip.category.split(', ');
    
    // Filtra le categorie valide (esistenti nella mappa delle categorie)
    const validCategories = categoryNames
      .filter(name => name && categories[name])
      .map(name => categories[name]);
    
    // Se dopo il filtraggio non ci sono categorie valide, mostra "None"
    if (validCategories.length === 0) {
      return [categories['None']];
    }
    
    return validCategories;
  };

  // Ottiene le categorie del viaggio come array di oggetti categories
  const tripCategories = getTripCategories();

  //----------------------------------------------------------------------------------------------------
  //RENDER GRAFICO
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* --- Container principale che contiene tutte le sezioni --- */}
        <View style={styles.mainContainer}>
          {/* --- Header con immagine di sfondo --- */}
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: trip.imageUri }}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <View style={styles.titleOverlay}>
              <Text style={styles.titleHeader}>{trip.title}</Text>
              <Text style={styles.locationText}>{trip.Location}</Text>
            </View>
          </View>

          {/* --- Sezione informazioni principali --- */}
          <View style={styles.infoCard}>
            {/* --- Sezione date del viaggio migliorata --- */}
            <View style={styles.datesContainer}>
              <Text style={styles.sectionTitle}>Trip Dates</Text>
              
              <View style={styles.dateRow}>
                <View style={styles.dateIconContainer}>
                  <Icon name="airplane-takeoff" size={22} color="#4CAF50" />
                </View>
                <View style={styles.dateTextContainer}>
                  <Text style={styles.dateLabel}>Departure</Text>
                  <Text style={styles.dateValue}>{trip.departureDate}</Text>
                </View>
              </View>
              
              <View style={styles.dateDivider}>
                <View style={styles.dateDividerLine} />
                <Icon name="dots-vertical" size={20} color="#ddd" />
                <View style={styles.dateDividerLine} />
              </View>
              
              <View style={styles.dateRow}>
                <View style={styles.dateIconContainer}>
                  <Icon name="airplane-landing" size={22} color="#F44336" />
                </View>
                <View style={styles.dateTextContainer}>
                  <Text style={styles.dateLabel}>Return</Text>
                  <Text style={styles.dateValue}>{trip.returnDate}</Text>
                </View>
              </View>
            </View>

            {/* --- Sezione categorie --- */}
            <View style={styles.categoriesContainer}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.categoriesList}>
                {tripCategories.map((category, index) => (
                  <View 
                    key={index} 
                    style={[styles.categoryChip, { backgroundColor: category.color }]}
                  >
                    <Icon name={category.icon} size={16} color="#fff" />
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* --- Sezione descrizione viaggio --- */}
            <View style={styles.descContainer}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{trip.description}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

//-------------------------------------------------------------------------------------------------------------
//STILI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scroll: {
    alignItems: 'stretch',
  },
  mainContainer: {
    flex: 1,
    width: '100%',
  },
  headerContainer: {
    height: 250,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 16,
    color: '#eee',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // Stile titolo sezione
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  // Stili migliorati per la sezione date
  datesContainer: {
    marginBottom: 25,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dateDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    marginVertical: 2,
  },
  dateDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 5,
  },
  // Stili per le categorie
  categoriesContainer: {
    marginBottom: 25,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
  },
  // Stile container descrizione
  descContainer: {
    marginTop: 5,
  },
  description: {
    fontSize: 15,
    color: '#222',
    lineHeight: 22,
  },
  errorText: {
    color: 'red',
    fontSize: 17,
    alignSelf: 'center',
    marginTop: 50,
  },
});