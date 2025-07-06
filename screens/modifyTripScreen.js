import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
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
  // Vengono inizializzati con i valori attuali del viaggio da modificare.
  const [title, setTitle] = useState(tripToModify.title);
  const [imageUri, setImageUri] = useState(tripToModify.imageUri);
  const [departureDate, setDepartureDate] = useState(tripToModify.departureDate);
  const [returnDate, setReturnDate] = useState(tripToModify.returnDate);
  const [description, setDescription] = useState(tripToModify.description);
  const [location, setLocation] = useState(tripToModify.Location);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // --- Effetto per inizializzare le categorie selezionate ---
  // Converte la stringa di categorie del viaggio in un array di oggetti categoria.
  useEffect(() => {
    const currentCategoryNames = tripToModify.category.split(', ').filter(name => name);
    const categoryObjects = currentCategoryNames
      .map(name => categories[name])
      .filter(cat => cat); // Filtra eventuali categorie non trovate
    setSelectedCategories(categoryObjects);
  }, [tripId]);


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
    // Aggiorna le proprietà dell'oggetto 'tripToModify' con i nuovi valori dallo stato.
    // Poiché 'tripToModify' è un riferimento all'oggetto nel tripCollector,
    // le modifiche saranno persistenti all'interno dell'app.
    tripToModify.title = title;
    tripToModify.imageUri = imageUri;
    tripToModify.Location = location;
    tripToModify.departureDate = departureDate;
    tripToModify.returnDate = returnDate;
    tripToModify.description = description;
    tripToModify.category = selectedCategories.length > 0 
      ? selectedCategories.map(cat => cat.name).join(', ')
      : "None";

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
                          tripCollectorA.removeTrip(tripToModify.id);;
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
      <ScrollView style={styles.scrollView}>
        
        {/* --- Container principale che avvolge l'intero form --- */}
        <View style={styles.mainContainer}>
          
          {/* --- Sezione per gli input di testo (titolo, date, ecc.) --- */}
          <View style={styles.inputSection}>
            <InputBox label="Title" value={title} onChangeText={setTitle} placeholder="Enter trip title"/>
            <InputBox label="Image URL" value={imageUri} onChangeText={setImageUri} placeholder="Enter image URL" />
            <InputBox label="Location" value={location} onChangeText={setLocation} placeholder="Enter trip location" />
            <InputBox label="Departure Date" value={departureDate} onChangeText={setDepartureDate} placeholder="YYYY-MM-DD" />
            <InputBox label="Return Date" value={returnDate} onChangeText={setReturnDate} placeholder="YYYY-MM-DD" />
            <InputBox label="Description" value={description} onChangeText={setDescription} placeholder="Enter trip description" multiline={true} />
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
  errorText: {
    color: 'red',
    fontSize: 17,
    alignSelf: 'center',
    marginTop: 50,
  },
});