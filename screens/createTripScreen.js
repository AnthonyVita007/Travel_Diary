import React, { useState } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Trip from '../models/TripClass';
import tripCollectorA from '../data/tripsDataManagment';
import NavBar from '../components/navBar';

// --- Definizione delle categorie disponibili ---
const categories = [
  {
    id: 1,
    name: 'Nature',
    icon: 'leaf',
    color: '#4CAF50' // verde
  },
  {
    id: 2,
    name: 'Safari',
    icon: 'elephant',
    color: '#D2B48C' // sabbia
  },
  {
    id: 3,
    name: 'Off Road',
    icon: 'car',
    color: '#8B4513' // marrone
  },
  {
    id: 4,
    name: 'City Life',
    icon: 'city',
    color: '#87CEEB' // celeste
  },
  {
    id: 5,
    name: 'Beach',
    icon: 'beach',
    color: '#1E90FF' // blu intenso
  },
  {
    id: 6,
    name: 'Mountain',
    icon: 'hiking',
    color: '#708090' // grigio ardesia
  },
  {
    id: 7,
    name: 'Culture',
    icon: 'book',
    color: '#9370DB' // viola medio
  },
  {
    id: 8,
    name: 'Food & Wine',
    icon: 'food-fork-drink',
    color: '#FF6347' // rosso pomodoro
  }
];

export default function CreateTripScreen({ navigation }) {

  //FUNZIONI E CALLBACKS
  // --- Stati per gestire i valori dei campi ---
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // --- Funzione per gestire il salvataggio del viaggio ---
  const handleSaveTrip = () => {
    console.log("Saving trip...");

    //creazione del viaggio da aggiungere
    const tripToAdd = new Trip(
         16,
        title,           
        imageUri,        
        departureDate,   
        returnDate,      
        description,     
        selectedCategory?.name || '',
        false
      )
    
    //aggiunta del viaggio alla lista dei viaggi 
    tripCollectorA.addTrip(tripToAdd);
    Alert.alert('Message', 'Trip successfully saved');

    //reset del form
    resetForm();

    //navigazione verso la HomeScreen con refresh per mostrare il nuovo viaggio
    navigation.navigate('HomeScreen', { refresh: Date.now() });
  };

  // --- Funzione per il reset del form
  const resetForm = () => {
      setTitle('');
      setImageUri('');
      setDepartureDate('');
      setReturnDate('');
      setDescription('');
      setSelectedCategory(null);
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

          {/* Pulsante salva */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveTrip}>
            <Text style={styles.saveButtonText}>Save Trip</Text>
          </TouchableOpacity>
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
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});