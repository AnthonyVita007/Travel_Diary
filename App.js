import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/homeScreen';
import TripDetailsScreen from './screens/tripDetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Viaggi' }} />
        <Stack.Screen name="TripDetailsScreen" component={TripDetailsScreen} options={{ title: 'Dettagli Viaggio' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}