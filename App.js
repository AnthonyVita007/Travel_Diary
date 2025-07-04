import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/homeScreen';
import TripDetailsScreen from './screens/tripDetailsScreen';
import CreateTripScreen from './screens/createTripScreen';
import ModifyTripScreen from './screens/modifyTripScreen';
import SettingsScreen from './screens/settingsScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
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
              title: 'My Trips',
              headerLeft: null,
            }} 
          />

          <Stack.Screen 
            name="TripDetailsScreen" 
            component={TripDetailsScreen} 
            options={{ 
              title: 'Trip Details',
            }} 
          />

          <Stack.Screen 
            name="CreateTripScreen" 
            component={CreateTripScreen} 
            options={{ 
              title: 'Add new Trip',
              headerLeft: null,
            }} 
          />

          <Stack.Screen 
            name="ModifyTripScreen" 
            component={ModifyTripScreen} 
            options={{ 
              title: 'Edit Trip',
            }} 
          />

          <Stack.Screen 
            name="SettingsScreen" 
            component={SettingsScreen} 
            options={{ 
              title: 'Settings',
            }} 
          />

        </Stack.Navigator>
      </NavigationContainer>
     </SafeAreaProvider>
  );
}