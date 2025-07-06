import AsyncStorage from '@react-native-async-storage/async-storage';
import Trip from './TripClass';

// Questa è l'etichetta con cui salveremo i dati.
const TRIPS_KEY = 'trip_collector_data';

/**
 * Classe TripCollector
 * Gestisce la collezione di viaggi in memoria e si sincronizza con AsyncStorage.
 */
export default class TripCollector {
  constructor(userId) {
    this.userId = userId;
    this.trips = new Map(); // La mappa dei viaggi in memoria, inizialmente vuota.
    this.nextId = 1;
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
   * Inizializza il TripCollector: carica i viaggi da AsyncStorage e popola la mappa.
   * Chiamata all'avvio dell'app.
   */
  async initializeTripCollector() {
    try {
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
    } catch (e) {
      console.error("Errore nel caricare i viaggi:", e);
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
    this.saveTripsPersistent(); // <-- SALVATAGGIO AUTOMATICO
  }

  /**
   * Rimuove un viaggio dalla mappa e poi chiama saveTripsPersistent() per salvare.
   */
  removeTrip(tripId) {
    const deleted = this.trips.delete(tripId);
    if (deleted) {
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
//METODI CHE NON COMPRENDONO ASYNC-STORAGE
  
  /**
   * Restituisce un ID unico e incrementa il contatore per il prossimo.
   */
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