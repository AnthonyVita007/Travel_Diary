import React, { useState, useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, SafeAreaView, ScrollView, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Markdown from 'react-native-markdown-display'; // <-- NUOVO IMPORT
import tripCollectorA from '../data/tripsDataManagment';
import categories from '../models/categories';

// Ottiene la larghezza dello schermo e definisce la dimensione dell'immagine
const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.42;

export default function TripDetailsScreen({ route, navigation }) {
  
  //---------------------------------------------------------------------------------------------------
  // INDIVIDUAZIONE DEL VIAGGIO DA MOSTRARE E GESTIONE ERRORE
  const { tripId } = route.params; 
  const initialTrip = tripCollectorA.getTrip(tripId); 

  // --- Gestione caso di errore: viaggio non trovato ---
  if (!initialTrip) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Trip not found.</Text>
      </SafeAreaView>
    );
  }

  //---------------------------------------------------------------------------------------------------
  // STATE E FUNZIONI PER LA GESTIONE DELLA UI
  
  // Stato per gestire il viaggio e forzare il re-rendering
  const [trip, setTrip] = useState(initialTrip);
  // Stato per forzare l'aggiornamento quando cambia lo stato di "favorite"
  const [isFavorite, setIsFavorite] = useState(trip.favorite);

  //------------------------------------------------------------------------------------------------------------------------------------
  //FUNZIONI E CALLBACKS

  // Funzione per gestire il toggle dei preferiti
  const handleToggleFavorite = () => {
    // 1. Chiama il metodo sull'istanza originale. Questo modifica l'oggetto
    //    nel tripCollectorA.
    trip.toggleFavorite(); 
    
    // 2. Aggiorna lo stato locale 'isFavorite'. Questo è necessario
    //    per dire a React che deve ri-eseguire l'effetto e quindi ri-renderizzare
    //    l'icona della stella
    setIsFavorite(trip.favorite);

    // 3. Notifica al collector di salvare la modifica dello stato 'favorite'.
    tripCollectorA.updateTrip(trip);
  };

  // Funzione per la gestione del press sull'icona edit di un viaggio
  const handleEditPress = () => {
    navigation.navigate('ModifyTripScreen', { tripId: trip.id });
  };

  // Funzione per ottenere gli oggetti categoria dal loro nome
  const getTripCategories = () => {
    if (!trip.category || trip.category === "" || trip.category.toLowerCase() === "none") {
      return [categories['None']]; 
    }
    
    const categoryNames = trip.category.split(', ');
    
    const validCategories = categoryNames
      .filter(name => name && categories[name])
      .map(name => categories[name]);
    
    if (validCategories.length === 0) {
      return [categories['None']];
    }
    
    return validCategories;
  };

  const tripCategories = getTripCategories();
  
  //---------------------------------------------------------------------------------------------------
  // PERSONALIZZAZIONE DELL'HEADER DELLA PAGINA

  //gestione icona favorites e icona editTrip
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={handleEditPress} style={{ marginRight: 15 }}>
            <Icon name="square-edit-outline" size={28} color="#fff" />
          </Pressable>
          <Pressable onPress={handleToggleFavorite} style={{ marginRight: 15 }}>
            <Icon 
              name={isFavorite ? 'star' : 'star-outline'} 
              size={28} 
              color={isFavorite ? '#FFD700' : '#fff'} 
            />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, isFavorite]);

//----------------------------------------------------------------------------------------------------
//RENDER GRAFICO
return (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scroll}>
      {/* --- Container principale che avvolge l'intera schermata --- */}
      <View style={styles.mainContainer}>
        
        {/* --- Sezione Header: contiene l'immagine principale del viaggio --- */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: trip.imageUri }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          {/* --- Overlay sull'immagine: contiene titolo e località del viaggio --- */}
          <View style={styles.titleOverlay}>
            <Text style={styles.titleHeader}>{trip.title}</Text>
            <Text style={styles.locationText}>{trip.Location}</Text>
          </View>
        </View>

        {/* --- Card informativa: raggruppa tutti i dettagli testuali del viaggio --- */}
        <View style={styles.infoCard}>

          {/* --- Sotto-sezione: Date del Viaggio --- */}
          <View style={styles.datesContainer}>
            <Text style={styles.sectionTitle}>Trip Dates</Text>
            
            {/* Riga per la data di partenza */}
            <View style={styles.dateRow}>
              <View style={styles.dateIconContainer}>
                <Icon name="airplane-takeoff" size={22} color="#4CAF50" />
              </View>
              <View style={styles.dateTextContainer}>
                <Text style={styles.dateLabel}>Departure</Text>
                <Text style={styles.dateValue}>{trip.departureDate}</Text>
              </View>
            </View>
            
            {/* Divisore visuale tra le due date */}
            <View style={styles.dateDivider}>
              <View style={styles.dateDividerLine} />
              <Icon name="dots-vertical" size={20} color="#ddd" />
              <View style={styles.dateDividerLine} />
            </View>
            
            {/* Riga per la data di ritorno */}
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

          {/* --- Sotto-sezione: Categorie associate al viaggio --- */}
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoriesList}>
              {/* Mappa le categorie del viaggio e le mostra come blocchetti colorati */}
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

          {/* --- Sotto-sezione: Descrizione dettagliata del viaggio con supporto Markdown --- */}
          <View style={styles.descContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            {/* Rendering della descrizione con supporto markdown */}
            <Markdown style={markdownStyles}>
              {trip.description || 'No description available'}
            </Markdown>
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
  // Stili per la sezione date
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
  errorText: {
    color: 'red',
    fontSize: 17,
    alignSelf: 'center',
    marginTop: 50,
  },
});

//-------------------------------------------------------------------------------------------------------------
// STILI PER IL MARKDOWN
const markdownStyles = {
  // Stile per il testo normale
  body: {
    fontSize: 15,
    color: '#222',
    lineHeight: 22,
  },
  // Stile per il testo in grassetto
  strong: {
    fontWeight: 'bold',
    color: '#333',
  },
  // Stile per il testo in corsivo
  em: {
    fontStyle: 'italic',
    color: '#444',
  },
  // Stile per le liste bullet
  bullet_list: {
    marginVertical: 8,
  },
  list_item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet_list_icon: {
    fontSize: 15,
    color: '#666',
    marginRight: 8,
    marginTop: 2,
  },
  bullet_list_content: {
    flex: 1,
  },
};