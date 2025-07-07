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
import DatePickerInput from '../components/datePickerInput';
import LocationInput from '../components/locationInput';
import DescriptionEditor from '../components/descriptionEditor';

// URL dell'immagine di default
const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

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
  const [selectedCategories, setSelectedCategories] = useState([]); 

  // --- Stati per la gestione degli errori ---
  const [errors, setErrors] = useState({});

  // --- Funzione per validare tutti i campi ---
  const validateForm = () => {
    const newErrors = {};

    // Validazione titolo (massimo 20 caratteri)
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 20) {
      newErrors.title = 'Title must be 20 characters or less';
    }

    // Validazione location (obbligatoria)
    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }

    // Validazione date
    if (!departureDate) {
      newErrors.departureDate = 'Departure date is required';
    }

    if (!returnDate) {
      newErrors.returnDate = 'Return date is required';
    } else if (departureDate && returnDate && new Date(returnDate) < new Date(departureDate)) {
      newErrors.returnDate = 'Return date cannot be before departure date';
    }

    // Validazione descrizione (massimo 3000 caratteri)
    if (description.length > 3000) {
      newErrors.description = 'Description must be 3000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Funzione per gestire il cambio del titolo con validazione ---
  const handleTitleChange = (text) => {
    setTitle(text);
    if (text.length > 20) {
      setErrors({ ...errors, title: 'Title must be 20 characters or less' });
    } else {
      const newErrors = { ...errors };
      delete newErrors.title;
      setErrors(newErrors);
    }
  };

  // --- Funzione per gestire il cambio della data di ritorno ---
  const handleReturnDateChange = (date) => {
    setReturnDate(date);
    if (departureDate && date && new Date(date) < new Date(departureDate)) {
      setErrors({ ...errors, returnDate: 'Return date cannot be before departure date' });
    } else {
      const newErrors = { ...errors };
      delete newErrors.returnDate;
      setErrors(newErrors);
    }
  };

  // --- Funzione per gestire la selezione/deselezione di una categoria ---
  const handleCategoryToggle = (category) => {
    const isSelected = selectedCategories.some(cat => cat.id === category.id);
    
    if (isSelected) {
      setSelectedCategories(selectedCategories.filter(cat => cat.id !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // --- Funzione per gestire il salvataggio del viaggio ---
  const handleSaveTrip = () => {
    console.log("Saving trip...");

    // Valida il form prima di procedere
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving');
      return;
    }

    // Ottieni i nomi delle categorie selezionate o usa "none" se nessuna è selezionata
    const categoryNames = selectedCategories.length > 0 
      ? selectedCategories.map(cat => cat.name).join(', ')
      : "none";
    
    // Usa l'immagine di default se l'URL è vuoto
    const finalImageUri = imageUri.trim() || DEFAULT_IMAGE_URL;
    
    //creazione del viaggio da aggiungere
    const tripToAdd = new Trip(
        tripCollectorA.getNextId(),
        title.trim(),           
        finalImageUri,        
        departureDate,   
        returnDate,
        location.trim(),      
        description,     
        categoryNames,
        false
      )
    console.log(tripToAdd.id);

    //aggiunta del viaggio alla lista dei viaggi 
    tripCollectorA.addTrip(tripToAdd);
    Alert.alert('Success', 'Trip successfully saved');

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
      setLocation('');
      setSelectedCategories([]);
      setErrors({});
  };

  //-------------------------------------------------------------------------------------------------------
  //RENDERING DELLA PAGINA
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: '#ebf7fa'}]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

         {/* Container principale */}
        <View style={styles.mainContainer}>
          
          {/* Sezione input di testo */}
          <View style={styles.inputSection}>
            
            {/* Input Titolo con validazione */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.title && styles.errorInput
                ]}
                value={title}
                onChangeText={handleTitleChange}
                placeholder="Enter trip title (max 20 characters)"
                maxLength={20}
              />
              <Text style={styles.characterCount}>{title.length}/20</Text>
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            {/* Input URL Immagine */}
            <InputBox 
              label="Image URL (optional)" 
              value={imageUri} 
              onChangeText={setImageUri} 
              placeholder="Enter image URL or leave empty for default" 
            />

            {/* Input Location con autocomplete */}
            <View style={styles.inputContainer}>
              <LocationInput
                label="Location *"
                value={location}
                onLocationChange={setLocation}
                placeholder="Search for a location"
              />
              {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
            </View>

            {/* Input Date di partenza */}
            <View style={styles.inputContainer}>
              <DatePickerInput
                label="Departure Date *"
                value={departureDate}
                onDateChange={setDepartureDate}
                placeholder="Select departure date"
                minimumDate={new Date()}
              />
              {errors.departureDate && <Text style={styles.errorText}>{errors.departureDate}</Text>}
            </View>

            {/* Input Data di ritorno */}
            <View style={styles.inputContainer}>
              <DatePickerInput
                label="Return Date *"
                value={returnDate}
                onDateChange={handleReturnDateChange}
                placeholder="Select return date"
                minimumDate={departureDate ? new Date(departureDate) : new Date()}
              />
              {errors.returnDate && <Text style={styles.errorText}>{errors.returnDate}</Text>}
            </View>

            {/* Editor per la descrizione */}
            <View style={styles.inputContainer}>
              <DescriptionEditor
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="Enter trip description (max 3000 characters)"
                maxLength={3000}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>
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
  inputContainer: {
    marginBottom: 16,
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
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorInput: {
    borderColor: '#FF3B30',
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});