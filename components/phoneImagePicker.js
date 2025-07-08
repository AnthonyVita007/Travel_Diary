import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PhoneImagePicker = ({ images = [], onImagesChange, label = "Images" }) => {
  
  //------------------------------------------------------------------------------------------------------------------------------------
  //FUNZIONI E CALLBACKS
  
  // --- Funzione per selezionare immagini dalla galleria ---
  const pickImage = async () => {
    try {
      // Richiede i permessi per accedere alla galleria
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photo library to add images');
        return;
      }
      
      // Apre il selettore di immagini
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage = result.assets[0].uri;
        onImagesChange([...images, newImage]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Could not select image. Please try again.');
    }
  };
  
  // --- Funzione per rimuovere un'immagine ---
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };
  
  //-------------------------------------------------------------------------------------------------------
  //RENDERING DEL COMPONENTE
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {/* Pulsante per aggiungere immagini */}
      <TouchableOpacity 
        style={styles.addImageButton}
        onPress={pickImage}
      >
        <Icon name="image-plus" size={24} color="#007AFF" />
        <Text style={styles.addImageText}>Add Image from Gallery</Text>
      </TouchableOpacity>
      
      {/* Visualizzazione delle immagini selezionate */}
      {images.length > 0 && (
        <View style={styles.imageGrid}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageItem}>
              <Image source={{ uri: image }} style={styles.imageThumbnail} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <Icon name="close-circle" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

//----------------------------------------------------------------------------------------------------
//STILI
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    justifyContent: 'center',
  },
  addImageText: {
    color: '#007AFF',
    marginLeft: 8,
    fontSize: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  imageItem: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    position: 'relative',
  },
  imageThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
});

export default PhoneImagePicker;