import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DescriptionEditor = ({ label, value, onChangeText, placeholder, maxLength = 3000 }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Funzione per applicare la formattazione del testo
  const applyFormatting = (format) => {
    switch (format) {
      case 'bold':
        onChangeText(value + '**bold text**');
        break;
      case 'italic':
        onChangeText(value + '*italic text*');
        break;
      case 'bullet':
        onChangeText(value + '\n• ');
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {/* Toolbar per la formattazione */}
      <View style={styles.toolbar}>
        <Pressable style={styles.toolbarButton} onPress={() => applyFormatting('bold')}>
          <Icon name="format-bold" size={20} color="#666" />
        </Pressable>
        <Pressable style={styles.toolbarButton} onPress={() => applyFormatting('italic')}>
          <Icon name="format-italic" size={20} color="#666" />
        </Pressable>
        <Pressable style={styles.toolbarButton} onPress={() => applyFormatting('bullet')}>
          <Icon name="format-list-bulleted" size={20} color="#666" />
        </Pressable>
        
        <View style={styles.characterCount}>
          <Text style={[
            styles.countText,
            value.length > maxLength * 0.9 && styles.warningText,
            value.length >= maxLength && styles.errorText
          ]}>
            {value.length}/{maxLength}
          </Text>
        </View>
      </View>

      <TextInput
        style={[
          styles.textInput,
          isFocused && styles.focusedInput,
          value.length >= maxLength && styles.errorInput
        ]}
        value={value}
        onChangeText={(text) => {
          if (text.length <= maxLength) {
            onChangeText(text);
          }
        }}
        placeholder={placeholder}
        multiline={true}
        numberOfLines={6}
        textAlignVertical="top"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      {value.length >= maxLength && (
        <Text style={styles.errorMessage}>
          Maximum character limit reached
        </Text>
      )}
    </View>
  );
};

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
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#ddd',
  },
  toolbarButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
  },
  characterCount: {
    marginLeft: 'auto',
  },
  countText: {
    fontSize: 12,
    color: '#666',
  },
  warningText: {
    color: '#FF9500',
  },
  errorText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#ddd',
    minHeight: 120,
    fontSize: 14,
  },
  focusedInput: {
    borderColor: '#007AFF',
  },
  errorInput: {
    borderColor: '#FF3B30',
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});

export default DescriptionEditor;