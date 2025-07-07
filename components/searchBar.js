import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Componente SearchBar
 * Visualizza una barra di ricerca con due icone cliccabili: lente di ingrandimento (ricerca) e filtri.
 */
const SearchBar = ({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Search trips...',
  style,
  activeFiltersCount = 0,
}) => {

  //-------------------------------------------------------------------------------------------------------
  //RENDERING DEL COMPONENTE
  return (
    // Container principale
    <View style={[styles.container, style]}>
      
      {/* Barra di ricerca (input testo) */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        autoCorrect={false}
        returnKeyType="search"
      />

      {/* Icona ricerca (lente d'ingrandimento), premibile */}
      <Pressable style={styles.iconButton}>
        <Icon name="magnify" size={28} color="#333" />
      </Pressable>

      {/* Icona filtri (tipica dei filtri), premibile */}
      <Pressable onPress={onFilterPress} style={styles.iconButton}>
        <View style={styles.filterIconContainer}>
          <Icon 
            name="filter-variant" 
            size={28} 
            color={activeFiltersCount > 0 ? "#007AFF" : "#333"} 
          />
          {/* Badge per mostrare il numero di filtri attivi */}
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Icon name="circle" size={8} color="#FF3B30" />
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

//----------------------------------------------------------------------------------------------------------------------------------------
// STILI
const styles = StyleSheet.create({
  // Stile container principale della searchbar
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
  },
  // Stile per la barra di input testo
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 0,
    paddingHorizontal: 8,
  },
  // Stile per le icone cliccabili (ricerca e filtri)
  iconButton: {
    padding: 6,
    marginLeft: 4,
  },
  // Stile per il container dell'icona filtri
  filterIconContainer: {
    position: 'relative',
  },
  // Stile per il badge dei filtri attivi
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
});

export default SearchBar;