import React, { useState } from 'react';
import { SafeAreaView, Alert, View, ScrollView } from 'react-native';
import TripCard from '../components/tripCard';
import SearchBar from '../components/searchBar';
import tripCollectorA from '../data/mockupTrips'; // importa il tripCollector con i viaggi mock

export default function HomeScreen() {
  const [search, setSearch] = useState('');

  // Ottieni tutti i viaggi dal tripCollector
  const allTrips = tripCollectorA.getAllTrips();

  // Callback per il pulsante di ricerca
  const handleSearch = () => {
    Alert.alert('Ricerca avviata', `Testo: ${search}`);
  };

  // Callback per il pulsante dei filtri
  const handleFilter = () => {
    Alert.alert('Filtri', 'Hai premuto il pulsante filtri');
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#eee' }}>
      {/* --- SearchBar nella parte alta --- */}
      <View style={{ width: '95%', marginTop: 24 }}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onSearchPress={handleSearch}
          onFilterPress={handleFilter}
        />
      </View>

      {/* --- Lista di TripCard --- */}
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 30, width: '100%' }}>
        {allTrips.map(trip => (
          <TripCard
            key={trip.id}
            trip={{
              id: trip.id,
              title: trip.title,
              image: trip.imageUri,
              departureDate: trip.departureDate,
              returnDate: trip.returnDate,
              category: trip.category,
              favorite: trip.favorite
            }}
            onPress={trip => Alert.alert('Cliccato:', trip.title)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}