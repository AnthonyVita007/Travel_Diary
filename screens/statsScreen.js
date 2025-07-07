import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import tripCollectorA from '../data/tripsDataManagment';

export default function StatsScreen() {

  //------------------------------------------------------------------------------------------------------------------------------------
  //STATI E VARIABILI
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // API key per OpenCage o altro servizio di geocoding
  const GEOCODING_API_KEY = '31119a4918f8431c95786c225f787420';

  //------------------------------------------------------------------------------------------------------------------------------------
  //FUNZIONI E CALLBACKS

  // --- Funzione per ottenere le coordinate da una località ---
  const fetchCoordinates = async (location) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${GEOCODING_API_KEY}&language=en&limit=1`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { latitude: lat, longitude: lng };
      }
      return null;
    } catch (e) {
      console.error('Errore nella geocodifica:', e);
      return null;
    }
  };

  // --- Funzione per caricare tutte le località dei viaggi ---
  const loadLocations = async () => {
    setLoading(true);
    const trips = tripCollectorA.getAllTrips();
    const uniqueLocations = [...new Set(trips.map(trip => trip.Location).filter(Boolean))];
    const promises = uniqueLocations.map(async (loc) => {
      const coords = await fetchCoordinates(loc);
      return coords ? { ...coords, title: loc } : null;
    });
    const results = await Promise.all(promises);
    setMarkers(results.filter(Boolean));
    setLoading(false);
  };

  //------------------------------------------------------------------------------------------------------------------------------------
  //EFFECTS

  // Effect per caricare le località all'avvio del componente
  useEffect(() => {
    loadLocations();
  }, []);

  //-------------------------------------------------------------------------------------------------------
  //RENDERING DELLA PAGINA

  // --- Schermata di caricamento mentre vengono recuperate le coordinate ---
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16 }}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* --- Mappa con i marker delle località visitate --- */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 20,
          longitude: 0,
          latitudeDelta: 120,
          longitudeDelta: 360,
        }}
      >
        {/* Mappa tutti i marker delle località */}
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
          />
        ))}
      </MapView>
      
      {/* --- Legenda con il conteggio delle località visitate --- */}
      <Text style={styles.legend}>Visited Locations ({markers.length})</Text>
    </View>
  );
}

//----------------------------------------------------------------------------------------------------------------------------------------
// STILI
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  map: { 
    width: width, 
    height: height 
  },
  loader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  legend: {
    position: 'absolute',
    top: 40,
    left: 15,
    fontSize: 16,
    color: '#005bea',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    elevation: 2,
    opacity: 0.85,
  },
});