import React, { useState, useEffect } from 'react';
import { SafeAreaView, Alert, View, ScrollView, Text, Dimensions } from 'react-native';
import TripCard from '../components/tripCard';
import SearchBar from '../components/searchBar';
import tripCollectorA from '../data/tripsDataManagment'; // importa il tripCollector con i viaggi mock
import NavBar from '../components/navBar';
import CustomHeader from '../components/customHeader';
import NoTripsAlert from '../components/noTripsAlert';

export default function HomeScreen({ navigation }) { // <--- aggiungi navigation qui
  //FUNZIONI E CALLBACKS
  const [search, setSearch] = useState('');
  const [filteredTrips, setFilteredTrips] = useState([]);

  // Ottieni tutti i viaggi dal tripCollector
  const allTrips = tripCollectorA.getAllTrips();

  // Inizializza i viaggi filtrati con tutti i viaggi
  useEffect(() => {
    setFilteredTrips(allTrips);
  }, []);

  // Filtra i viaggi quando cambia il testo di ricerca
  useEffect(() => {
    if (!search.trim()) {
      setFilteredTrips(allTrips);
    } else {
      const filtered = allTrips.filter(trip => trip.title.toLowerCase().includes(search.toLowerCase()));
      setFilteredTrips(filtered);
    }
  }, [search]);

   //CALLBACKS

  // Callback per il pulsante dei filtri
  const handleFilter = () => {
    Alert.alert('Filtri', 'Hai premuto il pulsante filtri');
  };

  // Callback per quando si preme una TripCard
  const handleTripPress = (trip) => {
    navigation.navigate('TripDetailsScreen', { tripId: trip.id });
  };

  //--------------------------------------------------------------------------------------------------------------------------
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ebf7fa' }}>

      {/* Header personalizzato */}
      <CustomHeader />

      {/* --- SearchBar nella parte alta (solo se ci sono viaggi) --- */}
      {allTrips.length > 0 && (
        <View style={{ width: '95%', marginTop: 24 }}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            onFilterPress={handleFilter}
            placeholder="Search trips..."
          />
        </View>
      )}

      {/* --- Lista di TripCard oppure messaggio/card se non ci sono viaggi --- */}
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 30, width: '100%' }}>
        {allTrips.length === 0 ? (
          // --- Mostra NoTripsAlert se non ci sono viaggi disponibili ---
          <View style={{flex: 1, width: '100%', height: Dimensions.get('window').height * 0.6, justifyContent: 'center', alignItems: 'center'}}>
            <NoTripsAlert handlePress={() => navigation.navigate('CreateTripScreen')} />
          </View>
        ) : (
          // --- Altrimenti deve mostrare tutte le tripCard salvate ---
          filteredTrips.length > 0 ? (
            filteredTrips.map(trip => (
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
                handleTripPress={() => handleTripPress(trip)}
              />
            ))
          ) : (
            <Text style={{ marginTop: 30, fontSize: 16, color: '#666' }}>
              No trips match your search
            </Text>
          )
        )}
      </ScrollView>

      {/* --- NavBar nella parte in basso --- */}
      <NavBar/>

    </SafeAreaView>
  );
}