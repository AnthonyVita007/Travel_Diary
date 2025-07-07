import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DescriptionEditor = ({ label, value, onChangeText, placeholder, maxLength = 3000 }) => {

  //------------------------------------------------------------------------------------------------------------------------------------
  //STATI E VARIABILI
  const [isFocused, setIsFocused] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [errorMessage, setErrorMessage] = useState('');

  //------------------------------------------------------------------------------------------------------------------------------------
  //FUNZIONI E CALLBACKS

  // --- Funzione per controllare se il testo selezionato è già formattato ---
  const checkExistingFormatting = (format, start, end) => {
    const selectedText = value.substring(start, end);
    
    switch (format) {
      case 'bold':
        // Controlla se il testo è già avvolto da **
        const beforeBold = value.substring(Math.max(0, start - 2), start);
        const afterBold = value.substring(end, Math.min(value.length, end + 2));
        return beforeBold === '**' && afterBold === '**';
        
      case 'italic':
        // Controlla se il testo è già avvolto da * (ma non **)
        const beforeItalic = value.substring(Math.max(0, start - 1), start);
        const afterItalic = value.substring(end, Math.min(value.length, end + 1));
        const beforeBoldCheck = value.substring(Math.max(0, start - 2), start);
        const afterBoldCheck = value.substring(end, Math.min(value.length, end + 2));
        
        // È corsivo se ha * ma non ** (per evitare conflitto con grassetto)
        return beforeItalic === '*' && afterItalic === '*' && 
               !(beforeBoldCheck === '**' && afterBoldCheck === '**');
               
      default:
        return false;
    }
  };

  // --- Funzione per applicare la formattazione del testo ---
  const applyFormatting = (format) => {
    const { start, end } = selection;
    const selectedText = value.substring(start, end);

    // Controlla se c'è del testo selezionato per bold e italic
    if ((format === 'bold' || format === 'italic') && (!selectedText || start === end)) {
      setErrorMessage('You must first select some text');
      // Rimuovi il messaggio di errore dopo 3 secondi
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    // Pulisce eventuali messaggi di errore precedenti
    setErrorMessage('');

    let newText = '';
    let newCursorPos = end;

    switch (format) {
      case 'bold':
        // Controlla se il testo è già in grassetto
        if (checkExistingFormatting('bold', start, end)) {
          // Rimuove la formattazione grassetto
          newText = value.substring(0, start - 2) + selectedText + value.substring(end + 2);
          newCursorPos = end - 4; // Aggiusta la posizione del cursore
        } else {
          // Applica la formattazione grassetto
          newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
          newCursorPos = end + 4; // Posiziona il cursore dopo **testo**
        }
        break;
        
      case 'italic':
        // Controlla se il testo è già in corsivo
        if (checkExistingFormatting('italic', start, end)) {
          // Rimuove la formattazione corsivo
          newText = value.substring(0, start - 1) + selectedText + value.substring(end + 1);
          newCursorPos = end - 2; // Aggiusta la posizione del cursore
        } else {
          // Applica la formattazione corsivo
          newText = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
          newCursorPos = end + 2; // Posiziona il cursore dopo *testo*
        }
        break;
        
      case 'bullet':
        // Per i bullet points, aggiunge sempre alla fine come prima
        newText = value + '\n• ';
        newCursorPos = newText.length;
        break;
    }

    onChangeText(newText);
    
    // Aggiorna la selezione per posizionare il cursore
    // Assicurati che la posizione non sia negativa
    const finalCursorPos = Math.max(0, newCursorPos);
    setSelection({ start: finalCursorPos, end: finalCursorPos });
  };

  // --- Funzione per gestire il cambio di selezione del testo ---
  const handleSelectionChange = (event) => {
    setSelection(event.nativeEvent.selection);
    // Pulisce il messaggio di errore quando l'utente seleziona del testo
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // --- Funzione per determinare se un pulsante dovrebbe apparire attivo ---
  const isFormatActive = (format) => {
    const { start, end } = selection;
    if (start === end) return false; // Nessuna selezione
    
    return checkExistingFormatting(format, start, end);
  };

  //-------------------------------------------------------------------------------------------------------
  //RENDERING DELLA PAGINA
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {/* --- Toolbar per la formattazione --- */}
      <View style={styles.toolbar}>
        <Pressable 
          style={[
            styles.toolbarButton, 
            isFormatActive('bold') && styles.activeToolbarButton
          ]} 
          onPress={() => applyFormatting('bold')}
        >
          <Icon 
            name="format-bold" 
            size={20} 
            color={isFormatActive('bold') ? "#007AFF" : "#666"} 
          />
        </Pressable>
        
        <Pressable 
          style={[
            styles.toolbarButton, 
            isFormatActive('italic') && styles.activeToolbarButton
          ]} 
          onPress={() => applyFormatting('italic')}
        >
          <Icon 
            name="format-italic" 
            size={20} 
            color={isFormatActive('italic') ? "#007AFF" : "#666"} 
          />
        </Pressable>
        
        <Pressable style={styles.toolbarButton} onPress={() => applyFormatting('bullet')}>
          <Icon name="format-list-bulleted" size={20} color="#666" />
        </Pressable>
        
        {/* --- Contatore caratteri --- */}
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

      {/* --- Input di testo principale --- */}
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
        onSelectionChange={handleSelectionChange}
        selection={selection}
        placeholder={placeholder}
        multiline={true}
        numberOfLines={6}
        textAlignVertical="top"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      {/* --- Messaggio di errore per la selezione del testo --- */}
      {errorMessage && (
        <Text style={styles.selectionErrorMessage}>
          {errorMessage}
        </Text>
      )}
      
      {/* --- Messaggio di errore per il limite di caratteri --- */}
      {value.length >= maxLength && (
        <Text style={styles.errorMessage}>
          Maximum character limit reached
        </Text>
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
  activeToolbarButton: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#007AFF',
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
  selectionErrorMessage: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
    fontStyle: 'italic',
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});

export default DescriptionEditor;