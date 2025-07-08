import AsyncStorage from '@react-native-async-storage/async-storage';
import Trip from './TripClass';
import TripDiary from './TripDiary';
import DiaryNote from './DiaryNote';

// Questa è l'etichetta con cui salveremo i dati.
const TRIPS_KEY = 'trip_collector_data';
const DIARIES_KEY = 'trip_diaries_data';

/**
 * Classe TripCollector
 * Gestisce la collezione di viaggi in memoria e si sincronizza con AsyncStorage.
 */
export default class TripCollector {
  constructor(userId) {
    this.userId = userId;
    this.trips = new Map(); // La mappa dei viaggi in memoria, inizialmente vuota.
    this.diaries = new Map(); // La mappa dei diari in memoria, inizialmente vuota.
    this.nextId = 1;
    this.nextDiaryId = 1;
  }

  //------------------------------------------------------------------------------------------------
  //METODI CHE COMPRENDONO L'USO DI ASYNC-STORAGE PER IL SALVATAGGIO DATI
  /**
   * Salva la mappa dei viaggi in modo persistente su AsyncStorage.
   * È un'operazione asincrona (non blocca l'app).
   */
  async saveTripsPersistent() {
    try {
      // 1. Converte la Mappa in un Array di oggetti semplici.
      const tripsArray = Array.from(this.trips.values());
      // 2. Converte l'array in una stringa di testo in formato JSON.
      const jsonValue = JSON.stringify(tripsArray);
      // 3. Salva la stringa nel telefono usando la nostra etichetta.
      await AsyncStorage.setItem(TRIPS_KEY, jsonValue);
    } catch (e) {
      console.error("Errore nel salvare i viaggi:", e);
    }
  }

  /**
   * Salva la mappa dei diari in modo persistente su AsyncStorage.
   * È un'operazione asincrona (non blocca l'app).
   */
  async saveDiariesPersistent() {
    try {
      // Converte i diari in un formato serializzabile
      const diariesArray = Array.from(this.diaries.values()).map(diary => {
        return {
          id: diary.id,
          tripId: diary.tripId,
          notes: diary.notes,
          nextNoteId: diary.nextNoteId
        };
      });
      
      const jsonValue = JSON.stringify(diariesArray);
      await AsyncStorage.setItem(DIARIES_KEY, jsonValue);
    } catch (e) {
      console.error("Errore nel salvare i diari:", e);
    }
  }

  /**
   * Inizializza il TripCollector: carica i viaggi da AsyncStorage e popola la mappa.
   * Chiamata all'avvio dell'app.
   */
  async initializeTripCollector() {
    try {
      // Carica i viaggi
      const jsonValue = await AsyncStorage.getItem(TRIPS_KEY);
      if (jsonValue !== null) {
        const tripsArray = JSON.parse(jsonValue);
        tripsArray.forEach(obj => {
          const trip = new Trip(obj.id, obj.title, obj.imageUri, obj.departureDate, obj.returnDate, obj.Location, obj.description, obj.category, obj.favorite);
          this.trips.set(trip.id, trip);
        });
        
        if (tripsArray.length > 0) {
            // Trova il massimo id per il prossimo auto-increment
            const maxId = tripsArray.reduce((max, obj) => Math.max(max, obj.id), 0);
            this.nextId = maxId + 1;
        }
      }

      // Carica i diari
      const diariesJson = await AsyncStorage.getItem(DIARIES_KEY);
      if (diariesJson !== null) {
        const diariesArray = JSON.parse(diariesJson);
        diariesArray.forEach(obj => {
          const diary = new TripDiary(obj.id, obj.tripId);
          
          // Ricostruisci ogni nota
          if (obj.notes && obj.notes.length > 0) {
            obj.notes.forEach(noteObj => {
              const note = new DiaryNote(
                noteObj.id,
                noteObj.diaryId,
                noteObj.title,
                noteObj.date,
                noteObj.content,
                noteObj.images
              );
              diary.notes.push(note);
            });
          }
          
          diary.nextNoteId = obj.nextNoteId || 1;
          this.diaries.set(diary.id, diary);
        });
        
        if (diariesArray.length > 0) {
          const maxDiaryId = diariesArray.reduce((max, obj) => Math.max(max, obj.id), 0);
          this.nextDiaryId = maxDiaryId + 1;
        }
      }
    } catch (e) {
      console.error("Errore nel caricare i dati:", e);
    }
  }

  /**
   * Aggiunge un viaggio alla mappa e poi chiama saveTripsPersistent() per salvare.
   */
  addTrip(trip) {
    if (!(trip instanceof Trip)) {
      throw new Error('L\'oggetto deve essere una istanza di Trip');
    }
    this.trips.set(trip.id, trip);
    
    // Crea automaticamente un diario per questo viaggio
    this.createDiaryForTrip(trip.id);
    
    this.saveTripsPersistent(); // <-- SALVATAGGIO AUTOMATICO
  }

  /**
   * Rimuove un viaggio dalla mappa e poi chiama saveTripsPersistent() per salvare.
   */
  removeTrip(tripId) {
    const deleted = this.trips.delete(tripId);
    if (deleted) {
      // Rimuovi anche il diario associato
      const diaryId = this.getDiaryIdForTrip(tripId);
      if (diaryId) {
        this.diaries.delete(diaryId);
        this.saveDiariesPersistent();
      }
      
      this.saveTripsPersistent(); // <-- SALVATAGGIO AUTOMATICO (solo se è stato cancellato qualcosa)
    }
    return deleted;
  }
  
  /**
   * Metodo per forzare il salvataggio dopo una modifica diretta.
   */
  updateTrip(trip) {
    if (this.trips.has(trip.id)) {
        this.trips.set(trip.id, trip); // Ci assicuriamo che l'oggetto in mappa sia quello aggiornato
        this.saveTripsPersistent(); // salvataggio in memoria
    }
  }

  //------------------------------------------------------------------------------------------------------
  //METODI PER LA GESTIONE DEI DIARI
  
  /**
   * Crea un nuovo diario per un viaggio
   */
  createDiaryForTrip(tripId) {
    // Verifica se esiste già un diario per questo viaggio
    const existingDiaryId = this.getDiaryIdForTrip(tripId);
    if (existingDiaryId) {
      return this.diaries.get(existingDiaryId);
    }
    
    // Se non esiste, crea un nuovo diario
    const diary = new TripDiary(this.nextDiaryId++, tripId);
    this.diaries.set(diary.id, diary);
    this.saveDiariesPersistent();
    return diary;
  }
  
  /**
   * Ottiene l'ID del diario associato a un viaggio
   */
  getDiaryIdForTrip(tripId) {
    for (const [id, diary] of this.diaries) {
      if (diary.tripId === tripId) {
        return id;
      }
    }
    return null;
  }
  
  /**
   * Ottiene il diario associato a un viaggio
   */
  getDiaryForTrip(tripId) {
    const diaryId = this.getDiaryIdForTrip(tripId);
    if (diaryId) {
      return this.diaries.get(diaryId);
    }
    return null;
  }
  
  /**
   * Aggiunge una nota a un diario di viaggio
   */
  addNoteToDiary(tripId, title, date, content, images = []) {
    // Ottiene o crea il diario
    let diary = this.getDiaryForTrip(tripId);
    if (!diary) {
      diary = this.createDiaryForTrip(tripId);
    }
    
    // Crea la nota
    const note = diary.createNote(title, date, content, images);
    this.saveDiariesPersistent();
    return note;
  }
  
  /**
   * Aggiorna una nota esistente
   */
  updateNote(tripId, noteId, updatedData) {
    const diary = this.getDiaryForTrip(tripId);
    if (!diary) return false;
    
    const note = diary.getNote(noteId);
    if (!note) return false;
    
    // Aggiorna i campi della nota
    Object.assign(note, updatedData);
    
    // Aggiorna la nota nel diario
    diary.updateNote(note);
    this.saveDiariesPersistent();
    return true;
  }
  
  /**
   * Rimuove una nota da un diario
   */
  removeNote(tripId, noteId) {
    const diary = this.getDiaryForTrip(tripId);
    if (!diary) return false;
    
    const removed = diary.removeNote(noteId);
    if (removed) {
      this.saveDiariesPersistent();
    }
    return removed;
  }

  //------------------------------------------------------------------------------------------------------
  //METODI CHE NON COMPRENDONO ASYNC-STORAGE
  
  //Restituisce un ID unico e incrementa il contatore per il prossimo.
  getNextId() {
    return this.nextId++;
  }

  getTrip(tripId) {
    return this.trips.get(tripId);
  }

  getAllTrips() {
    return Array.from(this.trips.values());
  }

  hasTrip(tripId) {
    return this.trips.has(tripId);
  }

  count() {
    return this.trips.size;
  }
}