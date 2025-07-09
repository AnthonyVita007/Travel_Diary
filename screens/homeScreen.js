import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Alert, View, ScrollView, Text, Dimensions } from 'react-native';
import TripCard from '../components/tripCard';
import SearchBar from '../components/searchBar';
import FilterModal from '../components/filterModal';
import tripCollectorA from '../data/tripsDataManagment';
import NavBar from '../components/navBar';
import CustomHeader from '../components/customHeader';
import NoTripsAlert from '../components/noTripsAlert';

export default function HomeScreen({ navigation, route }) {

  //------------------------------------------------------------------------------------------------------------------------------------
  //STATI E VARIABILI
  
  // Stati per gestire la ricerca e i filtri
  const [search, setSearch] = useState('');
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    showFavoritesOnly: false,
    categories: [],
    // Nuovi filtri per data
    dateFilterType: 'all',
    startDate: '',
    endDate: ''
  });

  //------------------------------------------------------------------------------------------------------------------------------------
  //FUNZIONI E CALLBACKS

  // Funzione per caricare tutti i viaggi
  const loadTrips = useCallback(() => {
    const trips = tripCollectorA.getAllTrips();
    setAllTrips(trips);
  }, []);

  // Funzione per verificare se una data è nel range specificato
  const isDateInRange = (dateToCheck, startDate, endDate) => {
    const checkDate = new Date(dateToCheck);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return checkDate >= start && checkDate <= end;
  };

  // Funzione per applicare il filtro per data
  const applyDateFilter = (trips) => {
    const { dateFilterType, startDate, endDate } = activeFilters;
    
    if (dateFilterType === 'all') {
      return trips;
    }
    
    return trips.filter(trip => {
      switch (dateFilterType) {
        case 'departure':
          // Filtra per data di partenza specifica
          return startDate && trip.departureDate === startDate;
          
        case 'return':
          // Filtra per data di ritorno specifica
          return startDate && trip.returnDate === startDate;
          
        case 'range':
          // Filtra per viaggi che si sovrappongono al range specificato
          if (!startDate || !endDate) return false;
          
          // Un viaggio è incluso se:
          // - La sua data di partenza è nel range, O
          // - La sua data di ritorno è nel range, O  
          // - Il viaggio "avvolge" completamente il range (parte prima e finisce dopo)
          const tripStart = new Date(trip.departureDate);
          const tripEnd = new Date(trip.returnDate);
          const filterStart = new Date(startDate);
          const filterEnd = new Date(endDate);
          
          return (
            isDateInRange(trip.departureDate, startDate, endDate) ||
            isDateInRange(trip.returnDate, startDate, endDate) ||
            (tripStart <= filterStart && tripEnd >= filterEnd)
          );
          
        default:
          return true;
      }
    });
  };

  // Funzione per applicare tutti i filtri (ricerca, favorites, categorie, date)
  const applyAllFilters = useCallback(() => {
    let filtered = [...allTrips];

    // Applica filtro ricerca per titolo
    if (search.trim()) {
      filtered = filtered.filter(trip => 
        trip.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Applica filtro favorites
    if (activeFilters.showFavoritesOnly) {
      filtered = filtered.filter(trip => trip.favorite === true);
    }

    // Applica filtro categorie
    if (activeFilters.categories && activeFilters.categories.length > 0) {
      filtered = filtered.filter(trip => {
        // Se il viaggio non ha categorie, controlla se "None" è selezionato
        if (!trip.category || trip.category === "" || trip.category.toLowerCase() === "none") {
          return activeFilters.categories.includes("None");
        }
        
        // Altrimenti controlla se almeno una delle categorie del viaggio è selezionata
        const tripCategories = trip.category.split(', ').filter(cat => cat.trim());
        return tripCategories.some(category => 
          activeFilters.categories.includes(category)
        );
      });
    }

    // Applica filtro per data
    filtered = applyDateFilter(filtered);

    setFilteredTrips(filtered);
  }, [allTrips, search, activeFilters]);

  // Callback per il pulsante dei filtri
  const handleFilter = () => {
    setShowFilterModal(true);
  };

  // Callback per quando si preme una TripCard
  const handleTripPress = (trip) => {
    navigation.navigate('TripDetailsScreen', { tripId: trip.id });
  };

  // Callback per gestire i cambiamenti dei filtri
  const handleFiltersChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  // Funzione per contare i filtri attivi (per mostrare nell'UI)
  const getActiveFiltersCount = () => {
    let count = 0;
    if (activeFilters.showFavoritesOnly) count++;
    if (activeFilters.categories && activeFilters.categories.length > 0) {
      count += activeFilters.categories.length;
    }
    if (activeFilters.dateFilterType !== 'all') count++;
    return count;
  };

  //------------------------------------------------------------------------------------------------------------------------------------
  //EFFECTS

  // Effect per caricare i viaggi all'avvio e quando si torna dalla creazione/modifica
  useEffect(() => {
    loadTrips();
  }, [loadTrips, route?.params?.refresh]);

  // Effect per applicare i filtri quando cambiano i parametri di ricerca o filtri
  useEffect(() => {
    applyAllFilters();
  }, [applyAllFilters]);

  //--------------------------------------------------------------------------------------------------------------------------
  //RENDERING DELLA PAGINA
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ebf7fa' }}>

      {/* Header personalizzato */}
      <CustomHeader />

      {/* SearchBar nella parte alta (solo se ci sono viaggi) */}
      {allTrips.length > 0 && (
        <View style={{ width: '95%', marginTop: 24 }}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            onFilterPress={handleFilter}
            placeholder="Search trips..."
            activeFiltersCount={getActiveFiltersCount()}
          />
        </View>
      )}

      {/* Lista di TripCard oppure messaggio/card se non ci sono viaggi */}
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 30, width: '100%' }}>
        {allTrips.length === 0 ? (
          // Mostra NoTripsAlert se non ci sono viaggi disponibili
          <View style={{flex: 1, width: '100%', height: Dimensions.get('window').height * 0.6, justifyContent: 'center', alignItems: 'center'}}>
            <NoTripsAlert handlePress={() => navigation.navigate('CreateTripScreen')} />
          </View>
        ) : (
          // Altrimenti deve mostrare tutte le tripCard filtrate
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
            // Messaggio quando non ci sono risultati per i filtri applicati
            <View style={{ marginTop: 50, alignItems: 'center', paddingHorizontal: 20 }}>
              <Text style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 8 }}>
                No trips match your filters
              </Text>
              <Text style={{ fontSize: 14, color: '#888', textAlign: 'center' }}>
                Try adjusting your search or filter settings
              </Text>
            </View>
          )
        )}
      </ScrollView>

      {/* Modale per i filtri */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        selectedFilters={activeFilters}
        onFiltersChange={handleFiltersChange}
      />

      {/* NavBar nella parte in basso */}
      <NavBar/>

    </SafeAreaView>
  );
}