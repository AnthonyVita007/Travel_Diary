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
import InputBox from '../components/inputBox';
import CategoryBox from '../components/categoryBox';
import Button from '../components/button';

export default function CreateTripScreen({ navigation }) {

  //------------------------------------------------------------------------------------------------------------------------------------
  //FUNZIONI E CALLBACKS
  // --- Stati per gestire i valori dei campi ---
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]); // Array per gestire multiple categorie

  // --- Funzione per gestire la selezione/deselezione di una categoria ---
  const handleCategoryToggle = (category) => {
    // Controlla se la categoria premuta è già selezionata
    const isSelected = selectedCategories.some(cat => cat.id === category.id);
    
    if (isSelected) {
      // Se è selezionata, rimuovila (senza restrizioni)
      setSelectedCategories(selectedCategories.filter(cat => cat.id !== category.id));
    } else {
      // Se non è selezionata, aggiungila all'array
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // --- Funzione per gestire il salvataggio del viaggio ---
  const handleSaveTrip = () => {
    console.log("Saving trip...");

    // Ottieni i nomi delle categorie selezionate o usa "none" se nessuna è selezionata
    const categoryNames = selectedCategories.length > 0 
      ? selectedCategories.map(cat => cat.name).join(', ')
      : "none";
    
    //creazione del viaggio da aggiungere
    const tripToAdd = new Trip(
         16,
        title,           
        imageUri,        
        departureDate,   
        returnDate,
        location, // Aggiunto il nuovo campo location      
        description,     
        categoryNames, // Usa i nomi delle categorie o "none"
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
      setLocation(''); // Reset del campo location
      setSelectedCategories([]); // Reset dell'array di categorie
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
            <InputBox label="Title" value={title} onChangeText={setTitle} placeholder="Enter trip title"/>
            <InputBox label="Image URL" value={imageUri} onChangeText={setImageUri} placeholder="Enter image URL" />
            <InputBox label="Location" value={location} onChangeText={setLocation} placeholder="Enter trip location" />
            <InputBox label="Departure Date" value={departureDate} onChangeText={setDepartureDate} placeholder="YYYY-MM-DD" />
            <InputBox label="Return Date" value={returnDate} onChangeText={setReturnDate} placeholder="YYYY-MM-DD" />
            <InputBox label="Description" value={description} onChangeText={setDescription} placeholder="Enter trip description" multiline={true} numberOfLines={4} />
          </View>

          {/* Sezione categorie */}
          <CategoryBox 
            selectedCategories={selectedCategories} 
            onToggleCategory={handleCategoryToggle} 
          />

          {/* Pulsante salva */}
          <Button 
            handleButtonPress={handleSaveTrip}
            text={'Save Trip'}
            buttonColor={'#007AFF'}
          />
        </View>
      </ScrollView>

      {/*navBar*/}
      <NavBar/>
    </SafeAreaView>
  );
}

//----------------------------------------------------------------------------------------------------------------------------------------
// STILI
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
  infoText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
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
});