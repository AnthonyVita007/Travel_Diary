import Trip from '../models/TripClass';

/**
 * Classe TripCollector
 * Rappresenta una "mappa" di viaggi di un utente,
 * dove la chiave è l'id del trip e il valore è l'oggetto Trip.
 */
export default class TripCollector {
  constructor(userId) {
    this.userId = userId;
    this.trips = new Map(); // Mappa idTrip => Trip
  }

  // Aggiunge un trip alla mappa
  addTrip(trip) {
    if (!(trip instanceof Trip)) {
      throw new Error('L\'oggetto deve essere una istanza di Trip');
    }
    this.trips.set(trip.id, trip);
  }

  // Restituisce un trip tramite id
  getTrip(tripId) {
    return this.trips.get(tripId);
  }

  // Rimuove un trip tramite id
  removeTrip(tripId) {
    return this.trips.delete(tripId);
  }

  // Restituisce tutti i trip come array
  getAllTrips() {
    return Array.from(this.trips.values());
  }

  // Verifica se esiste un trip per id
  hasTrip(tripId) {
    return this.trips.has(tripId);
  }

  // Ritorna il numero totale di viaggi
  count() {
    return this.trips.size;
  }
}