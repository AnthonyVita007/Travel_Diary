import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock data for recent trips
const recentTrips = [
  {
    id: 1,
    title: 'Venice Adventure',
    date: '15-20 Jun 2025',
    color: '#4FB0FF', // Sky blue
    favorite: true,
  },
  {
    id: 2,
    title: 'Paris Weekend',
    date: '1-3 Jun 2025',
    color: '#FF9F76', // Peach
    favorite: false,
  },
  {
    id: 3,
    title: 'Rome Holiday',
    date: '10-15 Jul 2025',
    color: '#90EE90', // Light green
    favorite: true,
  },
];

const App = () => {
  // Trip Card Component
  const TripCard = ({ trip, horizontal = true }) => (
    <TouchableOpacity
      style={[
        styles.tripCard,
        horizontal ? styles.horizontalCard : styles.verticalCard,
      ]}>
      <View style={[styles.tripImage, { backgroundColor: trip.color }]} />
      <View style={styles.tripInfo}>
        <Text style={styles.tripTitle}>{trip.title}</Text>
        <Text style={styles.tripDate}>{trip.date}</Text>
        {trip.favorite && (
          <Icon name="heart" size={20} color="#FF6B6B" style={styles.heartIcon} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Travel Diary</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Icon name="account-circle" size={32} color="#555" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Recent Trips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Trips</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </ScrollView>
        </View>

        {/* Favorites Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorites</Text>
          <View style={styles.favoritesList}>
            {recentTrips
              .filter((trip) => trip.favorite)
              .map((trip) => (
                <TripCard key={trip.id} trip={trip} horizontal={false} />
              ))}
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Icon name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  profileButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2D3436',
  },
  tripCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  horizontalCard: {
    width: 200,
    marginRight: 15,
  },
  verticalCard: {
    marginBottom: 15,
    width: '100%',
  },
  tripImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tripInfo: {
    padding: 12,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  tripDate: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
  heartIcon: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
  favoritesList: {
    gap: 15,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#FF6B6B',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default App;