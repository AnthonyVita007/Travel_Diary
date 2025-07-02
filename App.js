import React from 'react';
import { SafeAreaView, Alert } from 'react-native';
import TripCard from './components/tripCard';

export default function App() {
  const testTrip = {
    id: 1,
    title: 'Vacanza a Parigi',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    departureDate: '2025-07-10',
    returnDate: '2025-07-15',
    category: 'Europa',
    favorite: false
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }}>
      <TripCard trip={testTrip} onPress={trip => Alert.alert('Cliccato:', trip.title)} />
    </SafeAreaView>
  );
}