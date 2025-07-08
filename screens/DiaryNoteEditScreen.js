import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import tripCollectorA from '../data/tripsDataManagment';
import DatePickerInput from '../components/datePickerInput';
import DescriptionEditor from '../components/descriptionEditor';
import Button from '../components/button';
import PhoneImagePicker from '../components/phoneImagePicker';

export default function DiaryNoteEditScreen({ route, navigation }) {
  // Ottiene i parametri dalla navigazione
  const { tripId, noteId, isNewNote = false } = route.params;
  
  //------------------------------------------------------------------------------------------------------------------------------------
  //STATI E VARIABILI
  
  // Stati per gestire i campi del form
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  
  //------------------------------------------------------------------------------------------------------------------------------------
  //EFFECTS
  
  // Carica la nota se si sta modificando una nota esistente
  useEffect(() => {
    if (!isNewNote && noteId) {
      loadExistingNote();
    } else {
      // Se è una nuova nota, imposta la data di oggi
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, [isNewNote, noteId]);
  
  //------------------------------------------------------------------------------------------------------------------------------------
  //FUNZIONI E CALLBACKS
  
  // --- Funzione per caricare una nota esistente ---
  const loadExistingNote = () => {
    const diary = tripCollectorA.getDiaryForTrip(tripId);
    if (diary) {
      const note = diary.getNote(noteId);
      if (note) {
        setTitle(note.title);
        setDate(note.date);
        setContent(note.content);
        setImages(note.images || []);
      }
    }
  };
  
  // --- Funzione per validare il form ---
  const validateForm = () => {
    const newErrors = {};
    
    // Valida il titolo
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 50) {
      newErrors.title = 'Title must be 50 characters or less';
    }
    
    // Valida la data
    if (!date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // --- Funzione per salvare la nota ---
  const handleSaveNote = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving');
      return;
    }
    
    if (isNewNote) {
      // Crea una nuova nota
      tripCollectorA.addNoteToDiary(tripId, title, date, content, images);
      Alert.alert('Success', 'Note successfully added');
    } else {
      // Aggiorna una nota esistente
      tripCollectorA.updateNote(tripId, noteId, {
        title,
        date,
        content,
        images
      });
      Alert.alert('Success', 'Note successfully updated');
    }
    
    // Torna alla schermata del diario con un refresh
    navigation.navigate('TripDiaryScreen', { 
      tripId,
      refresh: Date.now()
    });
  };
  
  // --- Funzione per eliminare la nota ---
  const handleDeleteNote = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this note? This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => {
            tripCollectorA.removeNote(tripId, noteId);
            // Torna alla schermata del diario
            navigation.navigate('TripDiaryScreen', { 
              tripId,
              refresh: Date.now()
            });
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  //-------------------------------------------------------------------------------------------------------
  //RENDERING DELLA PAGINA
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Campo titolo */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter note title"
              maxLength={50}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            <Text style={styles.characterCount}>{title.length}/50</Text>
          </View>
          
          {/* Campo data */}
          <View style={styles.formGroup}>
            <DatePickerInput
              label="Date *"
              value={date}
              onDateChange={setDate}
              placeholder="Select date"
            />
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
          </View>
          
          {/* Editor del contenuto */}
          <View style={styles.formGroup}>
            <DescriptionEditor
              label="Content"
              value={content}
              onChangeText={setContent}
              placeholder="Write your diary entry here..."
              maxLength={5000}
            />
          </View>
          
          {/* Utilizzo del componente PhoneImagePicker */}
          <PhoneImagePicker
            label="Images"
            images={images}
            onImagesChange={setImages}
          />
          
          {/* Pulsanti di azione */}
          <View style={styles.buttonsContainer}>
            <Button
              handleButtonPress={handleSaveNote}
              buttonColor="#007AFF"
              text={isNewNote ? "Add Note" : "Update Note"}
            />
            
            {!isNewNote && (
              <Button
                handleButtonPress={handleDeleteNote}
                buttonColor="#FF3B30"
                text="Delete Note"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

//----------------------------------------------------------------------------------------------------
//STILI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  formGroup: {
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
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  buttonsContainer: {
    marginTop: 20,
  },
});