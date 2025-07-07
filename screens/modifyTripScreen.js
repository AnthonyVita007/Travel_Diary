import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Alert
} from 'react-native';
import tripCollectorA from '../data/tripsDataManagment';
import InputBox from '../components/inputBox';
import CategoryBox from '../components/categoryBox';
import categories from '../models/categories';
import Button from '../components/button';
import DatePickerInput from '../components/datePickerInput';
import LocationInput from '../components/locationInput';
import DescriptionEditor from '../components/descriptionEditor';

// URL dell'immagine di default
const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

//---------------------------------------------------------------------------------------------------
// COMPONENTE PRINCIPALE
export default function ModifyTripScreen({ route, navigation }) {

  //---------------------------------------------------------------------------------------------------
  // INDIVIDUAZIONE DEL VIAGGIO DA MODIFICARE E GESTIONE ERRORE
  const { tripId } = route.params;
  const tripToModify = tripCollectorA.getTrip(tripId);

  // --- Gestione caso di errore: viaggio non trovato ---
  if (!tripToModify) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Trip not found. Cannot edit.</Text>
      </SafeAreaView>
    );
  }

  //---------------------------------------------------------------------------------------------------
  // STATE E FUNZIONI PER LA GESTIONE DEL FORM
  
  // --- Stati per gestire i valori dei campi del form ---
  const [title, setTitle] = useState(tripToModify.title);
  const [imageUri, setImageUri] = useState(tripToModify.imageUri);
  const [departureDate, setDepartureDate] = useState(tripToModify.departureDate);
  const [returnDate, setReturnDate] = useState(tripToModify.returnDate);
  const [description, setDescription] = useState(tripToModify.description);
  const [location, setLocation] = useState(tripToModify.Location);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // --- Stati per la gestione degli errori ---
  const [errors, setErrors] = useState({});

  // --- Effetto per inizializzare le categorie selezionate ---
  useEffect(() => {
    const currentCategoryNames = tripToModify.category.split(', ').filter(name => name);
    const categoryObjects = currentCategoryNames
      .map(name => categories[name])
      .filter(cat => cat);
    setSelectedCategories(categoryObjects);
  }, [tripId]);

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

  // --- Funzione per gestire il salvataggio delle modifiche ---
  const handleSaveChanges = () => {
    // Valida il form prima di procedere
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving');
      return;
    }

    // Usa l'immagine di default se l'URL è vuoto
    const finalImageUri = imageUri.trim() || DEFAULT_IMAGE_URL;

    // Aggiorna le proprietà dell'oggetto 'tripToModify' con i nuovi valori dallo stato.
    tripToModify.title = title.trim();
    tripToModify.imageUri = finalImageUri;
    tripToModify.Location = location.trim();
    tripToModify.departureDate = departureDate;
    tripToModify.returnDate = returnDate;
    tripToModify.description = description;
    tripToModify.category = selectedCategories.length > 0 
      ? selectedCategories.map(cat => cat.name).join(', ')
      : "None";

    tripCollectorA.updateTrip(tripToModify);

    // Mostra un messaggio di conferma
    Alert.alert('Success', 'Trip updated successfully!');
    navigation.navigate('HomeScreen', { refresh: Date.now() });
  };

  // --- Funzione per gestire l'eliminazione del un viaggio ---
  const handleDeleteTrip = () => {
    Alert.alert(
    "Are you sure?",
    "The trip will be gone forever!",
    [
      {
        text: "No",
        onPress: () => console.log("Operazione annullata"),
        style: "cancel"
      },
      {
        text: "Yes",
        onPress: () => {
                          tripCollectorA.removeTrip(tripToModify.id);
                          navigation.navigate('HomeScreen', { refresh: Date.now() });
                       },
        style: "destructive"
      }
    ]
  );
  }

  //----------------------------------------------------------------------------------------------------
  //RENDER GRAFICO
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* --- Container principale che avvolge l'intero form --- */}
        <View style={styles.mainContainer}>
          
          {/* --- Sezione per gli input di testo (titolo, date, ecc.) --- */}
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

          {/* --- Sezione per la selezione delle categorie --- */}
          <CategoryBox 
            selectedCategories={selectedCategories} 
            onToggleCategory={handleCategoryToggle} 
          />

          {/* --- Pulsante di salvataggio --- */}
          <Button 
            handleButtonPress={handleSaveChanges}
            buttonColor={'#007AFF'}
            text={'Update Trip'}            
          />

          {/* --- Pulsante per l'eliminazione del viaggio --- */}
          <Button
            handleButtonPress={handleDeleteTrip}
            buttonColor={'red'}
            text={'Delete Trip'}
          />
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
  errorText: {
    color: 'red',
    fontSize: 17,
    alignSelf: 'center',
    marginTop: 50,
  },
});