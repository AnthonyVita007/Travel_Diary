import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import tripCollectorA from '../data/tripsDataManagment';

// API key per OpenCage o altro servizio di geocoding
const GEOCODING_API_KEY = '31119a4918f8431c95786c225f787420';

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

export default function StatsScreen() {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    loadLocations();
  }, []);

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
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 20,
          longitude: 0,
          latitudeDelta: 120,
          longitudeDelta: 360,
        }}
      >
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
          />
        ))}
      </MapView>
      <Text style={styles.legend}>Visited Locations ({markers.length})</Text>
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: width, height: height },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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