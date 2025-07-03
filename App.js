import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/homeScreen';
import TripDetailsScreen from './screens/tripDetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* Aggiungiamo screenOptions per uno stile comune a tutti gli screen */}
      <Stack.Navigator 
        initialRouteName="HomeScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff', // colore sfondo header
            elevation: 0, // rimuove ombra su Android
            shadowOpacity: 0, // rimuove ombra su iOS
          },
          headerTitleStyle: {
            fontSize: 24, // dimensione titolo più grande
            fontWeight: 'bold', // titolo in grassetto
          },
          headerTitleAlign: 'center', // centra il titolo
        }}
      >
        <Stack.Screen 
          name="HomeScreen" 
          component={HomeScreen} 
          options={{ 
            title: 'Viaggi',
          }} 
        />
        <Stack.Screen 
          name="TripDetailsScreen" 
          component={TripDetailsScreen} 
          options={{ 
            title: 'Dettagli Viaggio',
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}