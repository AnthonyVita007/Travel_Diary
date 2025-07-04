import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Pressable, 
  Alert
} from 'react-native';
import categories from '../models/categories';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Trip from '../models/TripClass';
import tripCollectorA from '../data/tripsDataManagment';
import NavBar from '../components/navBar';

export default function ModifyTripScreen({ route, navigation }) {
  // Estrae l'ID del viaggio dai parametri di navigazione
  const { tripId } = route.params;

  // --- Stati per gestire i valori dei campi ---
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favorite, setFavorite] = useState(false);

  // --- Carica i dati del viaggio esistente ---
  useEffect(() => {
    const trip = tripCollectorA.getTrip(tripId);
    if (trip) {
      setTitle(trip.title);
      setImageUri(trip.imageUri);
      setDepartureDate(trip.departureDate);
      setReturnDate(trip.returnDate);
      setDescription(trip.description);
      setFavorite(trip.favorite);
      
      // Trova la categoria corrispondente
      const category = categories.find(cat => cat.name === trip.category);
      setSelectedCategory(category || null);
    } else {
      Alert.alert('Error', 'Trip not found');
      navigation.goBack();
    }
  }, [tripId]);

  // --- Funzione per gestire l'aggiornamento del viaggio ---
  const handleUpdateTrip = () => {
    console.log("Updating trip...");

    // Validazione base
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a trip title');
      return;
    }

    // Creazione del viaggio aggiornato
    const updatedTrip = new Trip(
      tripId,
      title,           
      imageUri,        
      departureDate,   
      returnDate,      
      description,     
      selectedCategory?.name || '',
      favorite
    );
    
    // Aggiornamento del viaggio nella collezione
    tripCollectorA.addTrip(updatedTrip); // addTrip sostituisce se l'ID esiste già
    Alert.alert('Success', 'Trip successfully updated');

    // Navigazione indietro alla schermata dei dettagli
    navigation.goBack();
  };

  // --- Funzione per eliminare il viaggio ---
  const handleDeleteTrip = () => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            tripCollectorA.removeTrip(tripId);
            Alert.alert('Success', 'Trip deleted successfully');
            navigation.navigate('HomeScreen');
          },
        },
      ],
    );
  };

  //-------------------------------------------------------------------------------------------------------
  //RENDERING DELLA PAGINA
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        {/* Container principale */}
        <View style={styles.mainContainer}>
          
          {/* Sezione input di testo */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter trip title"
            />

            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              value={imageUri}
              onChangeText={setImageUri}
              placeholder="Enter image URL"
            />

            <Text style={styles.label}>Departure Date</Text>
            <TextInput
              style={styles.input}
              value={departureDate}
              onChangeText={setDepartureDate}
              placeholder="YYYY-MM-DD"
            />

            <Text style={styles.label}>Return Date</Text>
            <TextInput
              style={styles.input}
              value={returnDate}
              onChangeText={setReturnDate}
              placeholder="YYYY-MM-DD"
            />
          </View>

          {/* Sezione categorie */}
          <View style={styles.categorySection}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    { borderColor: category.color },
                    selectedCategory?.id === category.id && {
                      backgroundColor: category.color
                    }
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Icon 
                    name={category.icon} 
                    size={24} 
                    color={selectedCategory?.id === category.id ? '#fff' : category.color}
                  />
                  <Text 
                    style={[
                      styles.categoryText,
                      { color: selectedCategory?.id === category.id ? '#fff' : category.color }
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Sezione descrizione */}
          <View style={styles.descriptionSection}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter trip description"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Sezione favorite toggle */}
          <View style={styles.favoriteSection}>
            <Pressable 
              style={styles.favoriteToggle}
              onPress={() => setFavorite(!favorite)}
            >
              <Icon 
                name={favorite ? "heart" : "heart-outline"} 
                size={24} 
                color={favorite ? "#FF6B6B" : "#666"}
              />
              <Text style={styles.favoriteText}>
                {favorite ? "Remove from favorites" : "Add to favorites"}
              </Text>
            </Pressable>
          </View>

          {/* Pulsanti azioni */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateTrip}>
              <Text style={styles.updateButtonText}>Update Trip</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteTrip}>
              <Text style={styles.deleteButtonText}>Delete Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/*navBar*/}
      <NavBar/>
    </SafeAreaView>
  );
}

// --- Stili del componente ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollView: {
    flex: 1,
  },
  mainContainer: {
    padding: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categorySection: {
    marginBottom: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  categoryItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  favoriteSection: {
    marginBottom: 20,
  },
  favoriteToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  favoriteText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
