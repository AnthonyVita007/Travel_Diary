import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';

import HomeScreen from './screens/homeScreen';
import TripDetailsScreen from './screens/tripDetailsScreen';
import CreateTripScreen from './screens/createTripScreen';
import ModifyTripScreen from './screens/modifyTripScreen';
import StatsScreen from './screens/statsScreen';
import TripDiaryScreen from './screens/TripDiaryScreen';
import DiaryNoteDetailsScreen from './screens/DiaryNoteDetailsScreen';
import DiaryNoteEditScreen from './screens/DiaryNoteEditScreen';

// Importiamo il font dell'header
import { useFonts, FontdinerSwanky_400Regular } from '@expo-google-fonts/fontdiner-swanky';

// Importiamo la nostra istanza unica di tripCollectorA
import tripCollectorA from './data/tripsDataManagment';

const Stack = createStackNavigator();

export default function App() {

  //caricamento del font personalizzato dell'header della home screen
  const [fontsLoaded] = useFonts({
    FontdinerSwanky_400Regular,
  });

//----------------------------------------------------------------------------------------------------------------
//CARICAMENTO DEI DATI SALVATI CON ASYNC-STORAGE E PRELOAD IMMAGINI

  // 1. Creiamo uno stato per gestire la visualizzazione del caricamento.
  //    Parte da 'true' perché all'inizio stiamo sempre caricando.
  const [isLoading, setIsLoading] = useState(true);

  // 2. Funzione per precaricare le immagini locali
  const preloadImages = async () => {
    try {
      const imageAssets = [
        require('./data/defaultImages/Travel_adventure.png'),
        require('./data/defaultImages/Beautiful_beach.png'),
        require('./data/defaultImages/Mountain_landscape.png'),
        require('./data/defaultImages/City_skyline.png'),
        require('./data/defaultImages/Forest_path.png'),
        require('./data/defaultImages/Desert_landscape.png'),
        require('./data/defaultImages/Adventure_hiking.png'),
        require('./data/defaultImages/Museum.png'),
      ];

      await Asset.loadAsync(imageAssets);
      console.log('Immagini precaricate con successo');
    } catch (error) {
      console.error('Errore nel precaricamento delle immagini:', error);
    }
  };

  // 3. Usiamo useEffect per eseguire il caricamento dei dati salvati con AsyncStorage.
  useEffect(() => {
    // Definiamo una funzione asincrona per poter usare 'await'
    const loadData = async () => {
      try {
        // Precarica le immagini
        await preloadImages();
        
        // Chiamiamo il metodo che carica i viaggi da AsyncStorage
        await tripCollectorA.initializeTripCollector();
        
        // Piccolo delay per assicurare che tutto sia caricato
        await new Promise(resolve => setTimeout(resolve, 200));
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

  // 4. Se isLoading è 'true', mostriamo la schermata di caricamento.
  if (isLoading || !fontsLoaded) { // <-- Aggiungi controllo font
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading your trips...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

//----------------------------------------------------------------------------------------------------------------
//NAVIGAZIONE DELL'APP
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="HomeScreen"
          screenOptions={{
            headerStyle: { backgroundColor: '#005bea' },
            headerTitleStyle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen 
            name="HomeScreen" 
            component={HomeScreen} 
            options={{ 
              headerShown: false // Nascondiamo l'header di default per usare il nostro
            }} 
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
          <Stack.Screen 
            name="StatsScreen" 
            component={StatsScreen} 
            options={{ title: 'My World Map' }} 
          />
          {/* Nuove schermate per il diario di viaggio */}
          <Stack.Screen 
            name="TripDiaryScreen" 
            component={TripDiaryScreen} 
            options={{ title: 'Trip Diary' }} 
          />
          <Stack.Screen 
            name="DiaryNoteDetailsScreen" 
            component={DiaryNoteDetailsScreen} 
            options={{ title: 'Diary Note' }} 
          />
          <Stack.Screen 
            name="DiaryNoteEditScreen" 
            component={DiaryNoteEditScreen} 
            options={({ route }) => ({ 
              title: route.params?.isNewNote ? 'New Note' : 'Edit Note' 
            })} 
          />
        </Stack.Navigator>
      </NavigationContainer>
     </SafeAreaProvider>
  );
}

//--------------------------------------------------------------------------------------------------------
//STILI
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