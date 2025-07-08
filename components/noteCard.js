import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

//-------------------------------------------------------------------------------------------------------
//RENDERING DEL COMPONENTE
const NoteCard = ({ note, onPress }) => {
  // Formatta la data in modo leggibile
  const formattedDate = new Date(note.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <TouchableOpacity 
      style={styles.noteCard}
      onPress={onPress}
    >
      {/* Contenuto testuale della nota */}
      <View style={styles.noteCardContent}>
        <Text style={styles.noteTitle}>{note.title}</Text>
        <Text style={styles.noteDate}>{formattedDate}</Text>
        
        {/* Anteprima del contenuto limitata */}
        <Text style={styles.notePreview} numberOfLines={2}>
          {note.content.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')}
        </Text>
      </View>
      
      {/* Se ci sono immagini, mostra la prima come anteprima */}
      {note.images && note.images.length > 0 && (
        <View style={styles.noteThumbnailContainer}>
          <Image 
            source={{ uri: note.images[0] }} 
            style={styles.noteThumbnail} 
            resizeMode="cover"
          />
          {note.images.length > 1 && (
            <View style={styles.imageCountBadge}>
              <Text style={styles.imageCount}>+{note.images.length - 1}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

//----------------------------------------------------------------------------------------------------
//STILI
const styles = StyleSheet.create({
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    flexDirection: 'row',
  },
  noteCardContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  noteDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notePreview: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
  },
  noteThumbnailContainer: {
    marginLeft: 12,
    position: 'relative',
  },
  noteThumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCount: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default NoteCard;