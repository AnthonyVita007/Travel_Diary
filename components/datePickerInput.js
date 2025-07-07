import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DatePickerInput = ({ label, value, onDateChange, minimumDate, placeholder }) => {

  //------------------------------------------------------------------------------------------------------------------------------------
  //STATI E VARIABILI
  const [showPicker, setShowPicker] = useState(false);

  //------------------------------------------------------------------------------------------------------------------------------------
  //FUNZIONI E CALLBACKS

  // --- Funzione per gestire la selezione della data ---
  const handleDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios'); // Su iOS il picker rimane aperto
    if (selectedDate) {
      // Formatta la data nel formato YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];
      onDateChange(formattedDate);
    }
  };

  // --- Converte la stringa della data in oggetto Date per il picker ---
  const getDateFromString = (dateString) => {
    if (!dateString) return new Date();
    return new Date(dateString + 'T00:00:00');
  };

  //-------------------------------------------------------------------------------------------------------
  //RENDERING DELLA PAGINA
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {/* --- Container dell'input con icona calendario --- */}
      <Pressable style={styles.inputContainer} onPress={() => setShowPicker(true)}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          editable={false}
          pointerEvents="none"
        />
        <Icon name="calendar" size={24} color="#666" style={styles.icon} />
      </Pressable>
      
      {/* --- DateTimePicker nativo che appare quando necessario --- */}
      {showPicker && (
        <DateTimePicker
          value={getDateFromString(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
};

//----------------------------------------------------------------------------------------------------------------------------------------
// STILI
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
});

export default DatePickerInput;