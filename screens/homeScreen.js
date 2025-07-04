import React, { useState, useEffect } from 'react';
import { SafeAreaView, Alert, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import TripCard from '../components/tripCard';
import SearchBar from '../components/searchBar';
import tripCollectorA from '../data/tripsDataManagment'; // importa il tripCollector con i viaggi mock
import NavBar from '../components/navBar';
import categories from '../models/categories';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen({ navigation }) { // <--- aggiungi navigation qui
  const [search, setSearch] = useState('');
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Ottieni tutti i viaggi dal tripCollector
  const allTrips = tripCollectorA.getAllTrips();

  // Effetto per filtrare i viaggi quando cambia la ricerca o la categoria
  useEffect(() => {
    let filtered = allTrips;

    // Filtra per testo di ricerca
    if (search.trim()) {
      filtered = filtered.filter(trip => 
        trip.title.toLowerCase().includes(search.toLowerCase().trim()) ||
        trip.description.toLowerCase().includes(search.toLowerCase().trim()) ||
        trip.category.toLowerCase().includes(search.toLowerCase().trim())
      );
    }

    // Filtra per categoria
    if (selectedCategory) {
      filtered = filtered.filter(trip => trip.category === selectedCategory);
    }

    // Filtra per favoriti
    if (showFavoritesOnly) {
      filtered = filtered.filter(trip => trip.favorite);
    }

    setFilteredTrips(filtered);
  }, [search, selectedCategory, showFavoritesOnly, allTrips]);

  // Inizializza con tutti i viaggi
  useEffect(() => {
    setFilteredTrips(allTrips);
  }, []);

   //CALLBACKS
  // Callback per il pulsante di ricerca - ora fa ricerca in tempo reale
  const handleSearch = () => {
    // La ricerca avviene in tempo reale tramite useEffect, 
    // questo callback può essere usato per altri scopi se necessario
    console.log('Search triggered for:', search);
  };

  // Callback per il pulsante dei filtri
  const handleFilter = () => {
    Alert.alert(
      'Filter Options',
      'Choose how to filter your trips',
      [
        { text: 'Show All', onPress: () => {
          setSelectedCategory(null);
          setShowFavoritesOnly(false);
        }},
        { text: 'Favorites Only', onPress: () => setShowFavoritesOnly(!showFavoritesOnly) },
        { text: 'Filter by Category', onPress: () => showCategoryFilter() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Mostra filtro categorie
  const showCategoryFilter = () => {
    Alert.alert(
      'Filter by Category',
      'Select a category to filter trips',
      [
        { text: 'All Categories', onPress: () => setSelectedCategory(null) },
        ...categories.map(category => ({
          text: category.name,
          onPress: () => setSelectedCategory(category.name)
        })),
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Reset filtri
  const resetFilters = () => {
    setSearch('');
    setSelectedCategory(null);
    setShowFavoritesOnly(false);
  };

  // Callback per quando si preme una TripCard
  const handleTripPress = (trip) => {
    navigation.navigate('TripDetailsScreen', { tripId: trip.id });
  };

  // Callback per toggle favorite
  const handleToggleFavorite = (tripId) => {
    const trip = tripCollectorA.getTrip(tripId);
    if (trip) {
      trip.toggleFavorite();
      // Forza il re-render aggiornando i filteredTrips
      setFilteredTrips([...filteredTrips]);
    }
  };

  //--------------------------------------------------------------------------------------------------------------------------
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
        
        {/* --- Indicatore filtri attivi --- */}
        {(search.trim() || selectedCategory || showFavoritesOnly) && (
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: '#fff', 
            padding: 12, 
            borderRadius: 8, 
            marginTop: 8,
            elevation: 1
          }}>
            <Icon name="filter-check" size={20} color="#007AFF" />
            <Text style={{ flex: 1, marginLeft: 8, color: '#333' }}>
              {search.trim() && `Search: "${search}"`}
              {search.trim() && (selectedCategory || showFavoritesOnly) && ' • '}
              {selectedCategory && `Category: ${selectedCategory}`}
              {selectedCategory && showFavoritesOnly && ' • '}
              {showFavoritesOnly && 'Favorites Only'}
            </Text>
            <TouchableOpacity onPress={resetFilters}>
              <Icon name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* --- Lista di TripCard --- */}
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 30, width: '100%' }}>
        {filteredTrips.length > 0 ? (
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
              onToggleFavorite={handleToggleFavorite}
            />
          ))
        ) : (
          <View style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: 40,
            marginTop: 50
          }}>
            <Icon name="map-search-outline" size={60} color="#ccc" />
            <Text style={{ 
              fontSize: 18, 
              color: '#666', 
              textAlign: 'center',
              marginTop: 16
            }}>
              No trips found
            </Text>
            <Text style={{ 
              fontSize: 14, 
              color: '#999', 
              textAlign: 'center',
              marginTop: 8
            }}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}
      </ScrollView>

      {/* --- NavBar nella parte in basso --- */}
      <NavBar/>

    </SafeAreaView>
  );
}