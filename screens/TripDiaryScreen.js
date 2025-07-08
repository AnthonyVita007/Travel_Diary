import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tripCollectorA from '../data/tripsDataManagment';
import NoteCard from '../components/noteCard';

export default function TripDiaryScreen({ route, navigation }) {
  // Ottiene il tripId dai parametri di navigazione
  const { tripId } = route.params;
  const trip = tripCollectorA.getTrip(tripId);
  
  //------------------------------------------------------------------------------------------------------------------------------------
  //STATI E VARIABILI
  
  // Stati per gestire le note
  const [notes, setNotes] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  //------------------------------------------------------------------------------------------------------------------------------------
  //EFFECTS
  
  // Carica le note all'apertura della schermata
  useEffect(() => {
    loadNotes();
  }, [refreshKey]);

  //------------------------------------------------------------------------------------------------------------------------------------
  //FUNZIONI E CALLBACKS
  
  // --- Funzione per caricare le note dal diario ---
  const loadNotes = () => {
    const diary = tripCollectorA.getDiaryForTrip(tripId);
    if (diary) {
      setNotes(diary.getNotes().sort((a, b) => new Date(b.date) - new Date(a.date)));
    } else {
      setNotes([]);
    }
  };

  // --- Funzione per gestire il click su una nota ---
  const handleNotePress = (note) => {
    navigation.navigate('DiaryNoteDetailsScreen', { 
      tripId, 
      noteId: note.id,
      diaryId: note.diaryId
    });
  };

  // --- Funzione per aggiungere una nuova nota ---
  const handleAddNote = () => {
    navigation.navigate('DiaryNoteEditScreen', { 
      tripId,
      isNewNote: true 
    });
  };

  // --- Renderizza un elemento della lista di note usando il componente NoteCard ---
  const renderNoteItem = ({ item }) => (
    <NoteCard note={item} onPress={() => handleNotePress(item)} />
  );

  //-------------------------------------------------------------------------------------------------------
  //RENDERING DELLA PAGINA
  return (
    <SafeAreaView style={styles.container}>
      {/* Header con titolo del diario */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{trip.title}'s Diary</Text>
      </View>

      {/* Lista delle note */}
      {notes.length > 0 ? (
        <FlatList
          data={notes}
          renderItem={renderNoteItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.notesList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="book-open-page-variant" size={80} color="#ddd" />
          <Text style={styles.emptyText}>No notes yet</Text>
          <Text style={styles.emptySubtext}>
            Start writing about your journey by adding a new note.
          </Text>
        </View>
      )}

      {/* Pulsante di aggiunta nota (FAB) */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddNote}
      >
        <Icon name="plus" size={32} color="#fff" />
      </TouchableOpacity>
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
  header: {
    backgroundColor: '#005bea',
    padding: 16,
    paddingTop: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  notesList: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '80%',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});