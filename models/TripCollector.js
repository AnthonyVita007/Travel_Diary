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
  }

  //------------------------------------------------------------------------------------------------
  //METODI PER IL SALVATAGGIO DATI CON ASYNC-STORAGE
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
   * Da chiamare all'avvio dell'app.
   */
  async initializeTripCollector() {
    try {
      // 1. Prova a leggere la stringa dal telefono usando la nostra etichetta.
      const jsonValue = await AsyncStorage.getItem(TRIPS_KEY);
      
      // 2. Se la stringa esiste (non è null)...
      if (jsonValue !== null) {
        // ...la riconvertiamo in un Array di oggetti.
        const tripsArray = JSON.parse(jsonValue);
        
        // 3. Per ogni oggetto, creiamo una vera istanza della classe Trip
        //    e la aggiungiamo alla nostra mappa in memoria.
        tripsArray.forEach(obj => {
          const trip = new Trip(obj.id, obj.title, obj.imageUri, obj.departureDate, obj.returnDate, obj.Location, obj.description, obj.category, obj.favorite);
          this.trips.set(trip.id, trip);
        });
      }
      // Se non esiste (primo avvio), la mappa rimane semplicemente vuota.
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
   * (es. quando cambiamo lo stato 'favorite' di un viaggio).
   */
  updateTrip(trip) {
    if (this.trips.has(trip.id)) {
        this.trips.set(trip.id, trip); // Ci assicuriamo che l'oggetto in mappa sia quello aggiornato
        this.saveTripsPersistent(); // <-- SALVATAGGIO AUTOMATICO
    }
  }

//------------------------------------------------------------------------------------------------------
//METODI PER LA GESTIONE DELLA CLASSE TripCollector
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