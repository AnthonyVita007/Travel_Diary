import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LocationInput = ({ label, value, onLocationChange, placeholder }) => {

  //------------------------------------------------------------------------------------------------------------------------------------
  //STATI E VARIABILI
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // API key per OpenCage
  const GEOCODING_API_KEY = '31119a4918f8431c95786c225f787420';

  //------------------------------------------------------------------------------------------------------------------------------------
  //FUNZIONI E CALLBACKS

  // --- Funzione per cercare le località utilizzando l'API di geocoding ---
  const searchLocations = async (text) => {
    if (text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(text)}&key=${GEOCODING_API_KEY}&language=en&limit=5&no_annotations=1`
      );
      const data = await response.json();
      
      if (data.results) {
        const formattedSuggestions = data.results.map((result, index) => ({
          id: index,
          name: result.formatted,
          components: result.components
        }));
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Errore nella ricerca delle località:', error);
    }
  };

  // --- Funzione per gestire la selezione di una località ---
  const handleLocationSelect = (location) => {
    setQuery(location.name);
    onLocationChange(location.name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // --- Funzione per gestire il cambio di testo ---
  const handleTextChange = (text) => {
    setQuery(text);
    if (text.length === 0) {
      onLocationChange('');
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  //------------------------------------------------------------------------------------------------------------------------------------
  //EFFECTS

  // Effect per gestire la ricerca con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== value) {
        searchLocations(query);
      }
    }, 500); // Attesa di 500ms prima di effettuare la ricerca

    return () => clearTimeout(timer);
  }, [query]);

  //-------------------------------------------------------------------------------------------------------
  //RENDERING DELLA PAGINA
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {/* --- Container dell'input con icona posizione --- */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          autoCorrect={false}
        />
        <Icon name="map-marker" size={24} color="#666" style={styles.icon} />
      </View>
      
      {/* --- Lista suggerimenti senza FlatList (FlatList aveva problemi) --- */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <View style={styles.suggestionsList}>
            {suggestions.slice(0, 4).map((item) => (
              <Pressable
                key={item.id}
                style={styles.suggestionItem}
                onPress={() => handleLocationSelect(item)}
              >
                <Icon name="map-marker-outline" size={16} color="#666" />
                <Text style={styles.suggestionText} numberOfLines={2}>
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

//----------------------------------------------------------------------------------------------------------------------------------------
// STILI
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    zIndex: 1000,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 12,
    color: '#333',
  },
  icon: {
    marginRight: 12,
  },
  suggestionsContainer: {
    position: 'relative',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 180,
    overflow: 'hidden',
  },
  suggestionsList: {
    maxHeight: 180,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});

export default LocationInput;