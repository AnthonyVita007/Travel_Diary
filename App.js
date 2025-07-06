import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'; // Componenti per la schermata di caricamento
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/homeScreen';
import TripDetailsScreen from './screens/tripDetailsScreen';
import CreateTripScreen from './screens/createTripScreen';
import ModifyTripScreen from './screens/modifyTripScreen';

// Importiamo la nostra istanza unica di tripCollectorA
import tripCollectorA from './data/tripsDataManagment';

const Stack = createStackNavigator();

export default function App() {
  // 1. Creiamo uno stato per gestire la visualizzazione del caricamento.
  //    Parte da 'true' perché all'inizio stiamo sempre caricando.
  const [isLoading, setIsLoading] = useState(true);

  // 2. Usiamo useEffect per eseguire il caricamento dei dati UNA SOLA VOLTA.
  useEffect(() => {
    // Definiamo una funzione asincrona per poter usare 'await'
    const loadData = async () => {
      try {
        // Chiamiamo il metodo che carica i viaggi da AsyncStorage
        await tripCollectorA.initializeTripCollector();
      } catch (error) {
        console.error("Errore durante l'inizializzazione dell'app:", error);
      } finally {
        // Una volta finito (sia in caso di successo che di errore),
        // smettiamo di mostrare la schermata di caricamento.
        setIsLoading(false);
      }
    };

    loadData(); // Eseguiamo la funzione di caricamento.
  }, []); // L'array vuoto [] assicura che questo codice venga eseguito solo al primo montaggio del componente.

  // 3. Se isLoading è 'true', mostriamo la schermata di caricamento.
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading your trips...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // 4. Se isLoading è 'false', mostriamo la normale navigazione dell'app.
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="HomeScreen"
          screenOptions={{
            headerStyle: { backgroundColor: '#fff' },
            headerTitleStyle: { fontSize: 24, fontWeight: 'bold' },
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen 
            name="HomeScreen" 
            component={HomeScreen} 
            options={{ title: 'My Trips', headerLeft: null }} 
          />
          <Stack.Screen 
            name="TripDetailsScreen" 
            component={TripDetailsScreen} 
            options={{ title: 'Trip Details' }} 
          />
          <Stack.Screen 
            name="CreateTripScreen" 
            component={CreateTripScreen} 
            options={{ title: 'Add new Trip', headerLeft: null }} 
          />
          <Stack.Screen 
            name="ModifyTripScreen" 
            component={ModifyTripScreen} 
            options={{ title: 'Edit Trip' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
     </SafeAreaProvider>
  );
}

// Stili per la schermata di caricamento
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
  }
});