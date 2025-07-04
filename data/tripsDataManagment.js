import Trip from '../models/TripClass';
import TripCollector from '../models/TripCollector';

// Crea un TripCollector associato a un utente fittizio (ad esempio userId = 1)
const tripCollectorA = new TripCollector(1);

// Crea 10 viaggi di esempio
const mockTrips = [
  new Trip(
    1,
    'Vacanza a Parigi',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    '2025-07-10',
    '2025-07-15',
    'Visita alla torre Eiffel e musei.',
    'Europa',
    false
  ),
  new Trip(
    2,
    'Safari in Kenya',
    'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    '2024-12-01',
    '2024-12-10',
    'Alla scoperta della savana e dei leoni.',
    'Africa',
    false
  ),
  new Trip(
    3,
    'Tour in Giappone',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    '2025-04-05',
    '2025-04-20',
    'Hanami e cultura tra Tokyo e Kyoto.',
    'Asia',
    true
  ),
  new Trip(
    4,
    'Vacanza alle Maldive',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    '2025-08-01',
    '2025-08-14',
    'Relax tra spiagge e snorkeling.',
    'Oceania',
    false
  ),
  new Trip(
    5,
    'Weekend a New York',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    '2025-09-18',
    '2025-09-22',
    'Tour tra Manhattan e Brooklyn.',
    'America',
    false
  ),
  new Trip(
    6,
    'Road trip in Islanda',
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1',
    '2025-05-10',
    '2025-05-25',
    'Esplorazione di vulcani e ghiacciai.',
    'Europa',
    false
  ),
  new Trip(
    7,
    'Viaggio in Thailandia',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368',
    '2024-11-10',
    '2024-11-24',
    'Spiagge, templi e street food.',
    'Asia',
    false
  ),
  new Trip(
    8,
    'Tour della Patagonia',
    'https://images.unsplash.com/photo-1464013778555-8e723c2f01f8',
    '2025-03-01',
    '2025-03-20',
    'Trekking e natura selvaggia.',
    'America',
    true
  ),
  new Trip(
    9,
    'Esplorazione in Australia',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    '2025-02-10',
    '2025-02-24',
    'Sydney, barriera corallina e outback.',
    'Oceania',
    false
  ),
  new Trip(
    10,
    'Viaggio in Norvegia',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    '2025-06-01',
    '2025-06-12',
    'Fiordi e aurore boreali.',
    'Europa',
    false
  ),
];

// Inserisci i viaggi nella mappa di tripCollector
mockTrips.forEach(trip => tripCollectorA.addTrip(trip));

// Esporta il tripCollector pronto all'uso
export default tripCollectorA;