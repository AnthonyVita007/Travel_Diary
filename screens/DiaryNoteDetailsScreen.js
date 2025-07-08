import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tripCollectorA from '../data/tripsDataManagment';

const { width } = Dimensions.get('window');

export default function DiaryNoteDetailsScreen({ route, navigation }) {
  // Ottiene i parametri dalla navigazione
  const { tripId, noteId } = route.params;
  
  // Stati per gestire la nota
  const [note, setNote] = useState(null);
  
  // Carica la nota all'apertura della schermata
  useEffect(() => {
    loadNote();
  }, []);
  
  // Funzione per caricare la nota
  const loadNote = () => {
    const diary = tripCollectorA.getDiaryForTrip(tripId);
    if (diary) {
      const foundNote = diary.getNote(noteId);
      if (foundNote) {
        setNote(foundNote);
      }
    }
  };
  
  // Configurazione della barra di navigazione
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          style={{ marginRight: 15 }}
          onPress={handleEditPress}
        >
          <Icon name="pencil" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, note]);
  
  // Funzione per gestire il pulsante di modifica
  const handleEditPress = () => {
    navigation.navigate('DiaryNoteEditScreen', {
      tripId,
      noteId: note.id,
      isNewNote: false
    });
  };
  
  // Se la nota non esiste, mostra un messaggio di errore
  if (!note) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Note not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Formatta la data per la visualizzazione
  const formattedDate = new Date(note.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Intestazione della nota */}
        <View style={styles.header}>
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        
        {/* Contenuto della nota */}
        <View style={styles.noteContainer}>
          {/* Contenuto testuale con supporto markdown */}
          <View style={styles.contentContainer}>
            <Markdown style={markdownStyles}>
              {note.content}
            </Markdown>
          </View>
          
          {/* Galleria delle immagini */}
          {note.images && note.images.length > 0 && (
            <View style={styles.imagesContainer}>
              {note.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4e5', // Colore carta da diario
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0d9c5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  noteContainer: {
    padding: 20,
    backgroundColor: '#f8f4e5',
  },
  contentContainer: {
    marginBottom: 20,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  image: {
    width: (width - 50) / 2,
    height: (width - 50) / 2,
    margin: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0d9c5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
});

// Stili per il markdown
const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  heading1: {
    fontSize: 24,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  heading2: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  heading3: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  paragraph: {
    marginTop: 8,
    marginBottom: 8,
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  bullet_list: {
    marginVertical: 8,
  },
  ordered_list: {
    marginVertical: 8,
  },
};