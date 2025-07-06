import TripCollector from '../models/TripCollector';

// Crea e esporta un'unica istanza di TripCollector (una per ogni utente).
// Questa lista sarà usata in tutto il codice come "Lista con tutti i viaggi"
// All'inizio, questa istanza è vuota.
const tripCollectorA = new TripCollector('user');

// Esportiamo questa istanza come "default" in modo che sia facile
// importarla e usarla in tutta l'applicazione.
export default tripCollectorA;