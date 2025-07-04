import Trip from '../models/TripClass';
import TripCollector from '../models/TripCollector';

// Crea un TripCollector associato all'utente effettivo
const tripCollectorA = new TripCollector('AnthonVita0Unisa');

// Crea 10 viaggi di esempio con categorie aggiornate
const mockTrips = [
  new Trip(
    1,
    'Vacanza a Parigi',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    '2025-07-10',
    '2025-07-15',
    'Francia',
    'Visita alla torre Eiffel, Louvre, Montmartre e crociera sulla Senna. Programmate anche degustazioni di vini e pasticceria locale.',
    'City Life, Culture',
    false
  ),
  new Trip(
    2,
    'Safari in Kenya',
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e',
    '2025-12-01',
    '2025-12-10',
    'Kenya',
    'Alla scoperta della savana e dei leoni nel Masai Mara. Safari fotografico allalba e al tramonto con guide locali esperte.',
    "Safari, Nature",
    false
  ),
  new Trip(
    3,
    'Tour in Giappone',
    'https://images.unsplash.com/photo-1528164344705-47542687000d',
    '2026-04-05',
    '2026-04-20',
    'Giappone',
    'Hanami e cultura tra Tokyo e Kyoto. Visite ai templi storici, cerimonia del tè e passeggiata sotto i ciliegi in fiore.',
    'Culture, City Life',
    true
  ),
  new Trip(
    4,
    'Vacanza alle Maldive',
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8',
    '2025-08-01',
    '2025-08-14',
    'Maldive',
    'Relax tra spiagge bianchissime e snorkeling nella barriera corallina. Soggiorno in water villa con accesso diretto alla laguna.',
    'Beach',
    false
  ),
  new Trip(
    5,
    'Weekend a New York',
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    '2025-09-18',
    '2025-09-22',
    'Stati Uniti',
    'Tour tra Manhattan, Brooklyn e Central Park. Shopping sulla Fifth Avenue e spettacolo a Broadway previsti per la sera.',
    'City Life',
    false
  ),
  new Trip(
    6,
    'Road trip in Islanda',
    'https://images.unsplash.com/photo-1529963183134-61a90db47bd8',
    '2025-08-10',
    '2025-08-25',
    'Islanda',
    'Esplorazione di vulcani, cascate e ghiacciai lungo la Ring Road. Bagno nelle sorgenti termali e avvistamento dellaurora boreale.',
    'Nature, Mountain',
    false
  ),
  new Trip(
    7,
    'Viaggio in Thailandia',
    'https://images.unsplash.com/photo-1528181304800-259b08848526',
    '2025-11-10',
    '2025-11-24',
    'Thailandia',
    'Spiagge di Phuket, templi di Bangkok e street food nei mercati notturni. Escursione nella giungla e lezione di cucina thai.',
    'Beach, Culture, Food & Wine',
    false
  ),
  new Trip(
    8,
    'Tour della Patagonia',
    'https://images.unsplash.com/photo-1531176175280-238f067034fc',
    '2026-03-01',
    '2026-03-20',
    'Argentina/Cile',
    'Trekking nel Parco Nazionale Torres del Paine e navigazione tra i ghiacciai. Avvistamento fauna locale e notti in lodge ecosostenibili.',
    'Nature, Mountain',
    true
  ),
  new Trip(
    9,
    'Esplorazione in Australia',
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be',
    '2026-02-10',
    '2026-02-24',
    'Australia',
    'Sydney, Grande Barriera Corallina e outback australiano. Tour guidato di Uluru e possibilità di immersioni tra i coralli.',
    'Beach, Nature',
    false
  ),
  new Trip(
    10,
    'Viaggio in Norvegia',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38',
    '2025-09-01',
    '2025-09-12',
    'Norvegia',
    'Fiordi, villaggi di pescatori e possibilità di vedere laurora boreale. Escursione sui ghiacciai e crociera nello Geirangerfjord.',
    'Nature, Mountain',
    false
  ),
];

// Inserisci i viaggi nella mappa di tripCollector
mockTrips.forEach(trip => tripCollectorA.addTrip(trip));

// Esporta il tripCollector pronto all'uso
export default tripCollectorA;