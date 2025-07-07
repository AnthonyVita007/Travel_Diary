import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ImageSearchPicker = ({ label, value, onImageChange }) => {

  //------------------------------------------------------------------------------------------------------------------------------------
  //STATI E VARIABILI
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // API key per Pexels (gratuita con 200 richieste/ora)
  const PEXELS_API_KEY = '4Dsi6nEmvCLFkEtwv1uIM3TTqSkOUm0LNs0i3NnGFqE2yMXM6BJ6eeh2';

  //------------------------------------------------------------------------------------------------------------------------------------
  //FUNZIONI E CALLBACKS

  // --- Funzione per cercare immagini su Pexels ---
  const searchImages = async (query) => {
    if (query.length < 3) {
      // Se la query è troppo corta, mostra le immagini di default invece di array vuoto
      setSearchResults(getFallbackImages());
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query + ' travel')}&per_page=20&orientation=landscape`,
        {
          headers: {
            'Authorization': PEXELS_API_KEY
          }
        }
      );
      const data = await response.json();
      
      if (data.photos) {
        const formattedResults = data.photos.map((photo) => ({
          id: photo.id,
          url: photo.src.large,
          thumbnail: photo.src.medium,
          description: photo.alt || 'Travel image',
          photographer: photo.photographer,
          isLocal: false
        }));
        setSearchResults(formattedResults);
      }
    } catch (error) {
      console.error('Errore nella ricerca delle immagini:', error);
      // Fallback con immagini predefinite se l'API non funziona
      setSearchResults(getFallbackImages());
    } finally {
      setLoading(false);
    }
  };

  // --- Funzione di fallback con immagini predefinite ---
  const getFallbackImages = () => {
    const fallbackImages = [
      {
        id: 'local1',
        url: require('../data/defaultImages/Travel_adventure.png'),
        thumbnail: require('../data/defaultImages/Travel_adventure.png'),
        description: 'Travel adventure',
        photographer: 'Default',
        isLocal: true
      },
      {
        id: 'local2',
        url: require('../data/defaultImages/Beautiful_beach.png'),
        thumbnail: require('../data/defaultImages/Beautiful_beach.png'),
        description: 'Beautiful beach',
        photographer: 'Default',
        isLocal: true
      },
      {
        id: 'local3',
        url: require('../data/defaultImages/Mountain_landscape.png'),
        thumbnail: require('../data/defaultImages/Mountain_landscape.png'),
        description: 'Mountain landscape',
        photographer: 'Default',
        isLocal: true
      },
      {
        id: 'local4',
        url: require('../data/defaultImages/City_skyline.png'),
        thumbnail: require('../data/defaultImages/City_skyline.png'),
        description: 'City skyline',
        photographer: 'Default',
        isLocal: true
      },
      {
        id: 'local5',
        url: require('../data/defaultImages/Forest_path.png'),
        thumbnail: require('../data/defaultImages/Forest_path.png'),
        description: 'Forest path',
        photographer: 'Default',
        isLocal: true
      },
      {
        id: 'local6',
        url: require('../data/defaultImages/Desert_landscape.png'),
        thumbnail: require('../data/defaultImages/Desert_landscape.png'),
        description: 'Desert landscape',
        photographer: 'Default',
        isLocal: true
      },
      {
        id: 'local7',
        url: require('../data/defaultImages/Adventure_hiking.png'),
        thumbnail: require('../data/defaultImages/Adventure_hiking.png'),
        description: 'Adventure hiking',
        photographer: 'Default',
        isLocal: true
      },
      {
        id: 'local8',
        url: require('../data/defaultImages/Museum.png'),
        thumbnail: require('../data/defaultImages/Museum.png'),
        description: 'Cultural architecture',
        photographer: 'Default',
        isLocal: true
      }
    ];

    return fallbackImages;
  };

  // --- Funzione per gestire la selezione di un'immagine ---
  const handleImageSelect = (image) => {
    onImageChange(image.url);
    setShowPicker(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // --- Funzione per aprire il picker ---
  const openPicker = () => {
    setShowPicker(true);
  };

  // --- Funzione per chiudere il picker ---
  const closePicker = () => {
    setShowPicker(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  //------------------------------------------------------------------------------------------------------------------------------------
  //EFFECTS

  // Effect per gestire la ricerca con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchImages(searchQuery);
      } else {
        // Se non c'è query di ricerca, mostra sempre le immagini di default
        setSearchResults(getFallbackImages());
      }
    }, 800); // Attesa di 800ms prima di effettuare la ricerca

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Effect per mostrare immagini di default all'apertura del picker
  useEffect(() => {
    if (showPicker) {
      // Quando si apre il picker, se non c'è una ricerca attiva, mostra le immagini di default
      if (!searchQuery.trim()) {
        setSearchResults(getFallbackImages());
      }
    }
  }, [showPicker]);

  //-------------------------------------------------------------------------------------------------------
  //RENDERING DELLA PAGINA
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {/* --- Pressable per aprire il picker con anteprima dell'immagine selezionata --- */}
      <Pressable style={styles.imagePreviewContainer} onPress={openPicker}>
        {value ? (
          // Mostra l'immagine selezionata (gestisce sia local che remote)
          <Image 
            source={typeof value === 'number' ? value : { uri: value }}
            style={styles.selectedImage} 
            resizeMode="cover" 
          />
        ) : (
          // Mostra placeholder se nessuna immagine è selezionata
          <View style={styles.placeholderContainer}>
            <Icon name="image-search" size={40} color="#999" />
            <Text style={styles.placeholderText}>Tap to search for an image</Text>
          </View>
        )}
        
        {/* --- Icona per indicare che è possibile cambiare --- */}
        <View style={styles.changeIconContainer}>
          <Icon name="magnify" size={16} color="#fff" />
        </View>
      </Pressable>

      {/* --- Modal con il picker delle immagini --- */}
      <Modal
        visible={showPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closePicker}
      >
        <View style={styles.modalContainer}>
          
          {/* --- Header del modal con barra di ricerca --- */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTop}>
              <Text style={styles.modalTitle}>Search Images</Text>
              <Pressable onPress={closePicker} style={styles.closeButton}>
                <Icon name="close" size={24} color="#333" />
              </Pressable>
            </View>
            
            {/* --- Barra di ricerca --- */}
            <View style={styles.searchContainer}>
              <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search for travel images..."
                autoCorrect={false}
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
                  <Icon name="close-circle" size={20} color="#999" />
                </Pressable>
              )}
            </View>
          </View>

          {/* --- Contenuto del modal --- */}
          <View style={styles.modalContent}>
            {loading ? (
              // Indicatore di caricamento
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Searching images...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              // Griglia di risultati di ricerca
              <ScrollView contentContainerStyle={styles.imageGrid} showsVerticalScrollIndicator={false}>
                {searchResults.map((image) => (
                  <Pressable
                    key={image.id}
                    style={[
                      styles.imageOption,
                      value === image.url && styles.selectedImageOption
                    ]}
                    onPress={() => handleImageSelect(image)}
                  >
                    <Image 
                      source={image.isLocal ? image.thumbnail : { uri: image.thumbnail }}
                      style={styles.thumbnailImage} 
                      resizeMode="cover" 
                    />
                    
                    {/* --- Indicatore di selezione --- */}
                    {value === image.url && (
                      <View style={styles.selectedIndicator}>
                        <Icon name="check-circle" size={24} color="#007AFF" />
                      </View>
                    )}
                    
                    {/* --- Info dell'immagine --- */}
                    <View style={styles.imageInfo}>
                      <Text style={styles.imageDescription} numberOfLines={1}>
                        {image.description}
                      </Text>
                      <Text style={styles.photographerText} numberOfLines={1}>
                        by {image.photographer}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              // Messaggio iniziale (questo caso ora non dovrebbe mai verificarsi)
              <View style={styles.initialContainer}>
                <Icon name="image-search-outline" size={48} color="#ccc" />
                <Text style={styles.initialText}>Search for travel images</Text>
                <Text style={styles.initialSubtext}>Try keywords like "beach", "mountain", "city", "food"...</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

//----------------------------------------------------------------------------------------------------------------------------------------
// STILI (rimangono uguali)
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    position: 'relative',
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  changeIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 25,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  imageOption: {
    width: '48%',
    aspectRatio: 1.2,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f8f8f8',
  },
  selectedImageOption: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  thumbnailImage: {
    width: '100%',
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  imageInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 8,
  },
  imageDescription: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  photographerText: {
    color: '#ccc',
    fontSize: 10,
    marginTop: 2,
  },
  initialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  initialText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  initialSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ImageSearchPicker;