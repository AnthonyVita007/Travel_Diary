import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getCategoriesArray } from '../models/categories';
import DatePickerInput from './datePickerInput';

const { width, height } = Dimensions.get('window');

const FilterModal = ({ 
  visible, 
  onClose, 
  selectedFilters, 
  onFiltersChange 
}) => {

  //------------------------------------------------------------------------------------------------------------------------------------
  //STATI E VARIABILI
  
  // Stati locali per gestire i filtri temporanei (prima di applicarli)
  const [tempFilters, setTempFilters] = useState({
    showFavoritesOnly: false,
    categories: [],
    // Nuovi filtri per data
    dateFilterType: 'all', // 'all', 'departure', 'return', 'range'
    startDate: '',
    endDate: ''
  });

  // Stato per gestire gli errori di validazione delle date
  const [dateErrors, setDateErrors] = useState({});

  // Ottieni tutte le categorie disponibili escludendo "None"
  const allCategories = getCategoriesArray().filter(category => category.name !== 'None');

  //------------------------------------------------------------------------------------------------------------------------------------
  //FUNZIONI E CALLBACKS

  // Funzione per validare le date
  const validateDates = (startDate, endDate, filterType) => {
    const errors = {};
    
    if (filterType === 'range') {
      if (!startDate) {
        errors.startDate = 'Start date is required';
      }
      if (!endDate) {
        errors.endDate = 'End date is required';
      } else if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        errors.endDate = 'End date cannot be before start date';
      }
    } else if (filterType === 'departure' || filterType === 'return') {
      if (!startDate) {
        errors.startDate = 'Date is required';
      }
    }
    
    setDateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Funzione per gestire il toggle del filtro favorites
  const handleFavoriteToggle = () => {
    setTempFilters({
      ...tempFilters,
      showFavoritesOnly: !tempFilters.showFavoritesOnly
    });
  };

  // Funzione per gestire il toggle di una categoria
  const handleCategoryToggle = (categoryName) => {
    const currentCategories = tempFilters.categories || [];
    const isSelected = currentCategories.includes(categoryName);
    
    let newCategories;
    if (isSelected) {
      // Rimuovi la categoria se già selezionata
      newCategories = currentCategories.filter(cat => cat !== categoryName);
    } else {
      // Aggiungi la categoria se non selezionata
      newCategories = [...currentCategories, categoryName];
    }
    
    setTempFilters({
      ...tempFilters,
      categories: newCategories
    });
  };

  // Funzione per gestire il cambio del tipo di filtro data
  const handleDateFilterTypeChange = (type) => {
    setTempFilters({
      ...tempFilters,
      dateFilterType: type,
      // Reset delle date quando cambia il tipo
      startDate: '',
      endDate: ''
    });
    // Pulisci anche gli errori
    setDateErrors({});
  };

  // Funzione per gestire il cambio della data di inizio
  const handleStartDateChange = (date) => {
    const newTempFilters = {
      ...tempFilters,
      startDate: date
    };
    setTempFilters(newTempFilters);
    
    // Valida le date dopo il cambio
    validateDates(date, newTempFilters.endDate, newTempFilters.dateFilterType);
  };

  // Funzione per gestire il cambio della data di fine
  const handleEndDateChange = (date) => {
    const newTempFilters = {
      ...tempFilters,
      endDate: date
    };
    setTempFilters(newTempFilters);
    
    // Valida le date dopo il cambio
    validateDates(newTempFilters.startDate, date, newTempFilters.dateFilterType);
  };

  // Funzione per azzerare tutti i filtri temporanei
  const handleClearAllFilters = () => {
    setTempFilters({
      showFavoritesOnly: false,
      categories: [],
      dateFilterType: 'all',
      startDate: '',
      endDate: ''
    });
    setDateErrors({});
  };

  // Funzione per applicare i filtri (chiamata quando si preme Apply)
  const handleApplyFilters = () => {
    // Valida le date prima di applicare i filtri
    const isValid = validateDates(
      tempFilters.startDate, 
      tempFilters.endDate, 
      tempFilters.dateFilterType
    );
    
    if (!isValid) {
      return; // Non applicare i filtri se la validazione fallisce
    }
    
    onFiltersChange(tempFilters);
    onClose();
  };

  // Funzione per annullare e chiudere il modale
  const handleCancel = () => {
    // Ripristina i filtri temporanei a quelli attualmente attivi
    setTempFilters(selectedFilters);
    setDateErrors({});
    onClose();
  };

  // Funzione per contare i filtri temporanei attivi
  const getTempFiltersCount = () => {
    let count = 0;
    if (tempFilters.showFavoritesOnly) count++;
    if (tempFilters.categories && tempFilters.categories.length > 0) {
      count += tempFilters.categories.length;
    }
    if (tempFilters.dateFilterType !== 'all') count++;
    return count;
  };

  //------------------------------------------------------------------------------------------------------------------------------------
  //EFFECTS

  // Effect per inizializzare i filtri temporanei quando si apre il modale
  useEffect(() => {
    if (visible) {
      setTempFilters({
        showFavoritesOnly: selectedFilters.showFavoritesOnly || false,
        categories: selectedFilters.categories || [],
        dateFilterType: selectedFilters.dateFilterType || 'all',
        startDate: selectedFilters.startDate || '',
        endDate: selectedFilters.endDate || ''
      });
      setDateErrors({});
    }
  }, [visible, selectedFilters]);

  //-------------------------------------------------------------------------------------------------------
  //RENDERING DELLA PAGINA
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          
          {/* Header del modale */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <Pressable onPress={handleCancel} style={styles.closeButton}>
              <Icon name="close" size={24} color="#333" />
            </Pressable>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            
            {/* Sezione Date Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Date Filter</Text>
              
              {/* Opzioni per il tipo di filtro data */}
              <View style={styles.dateFilterOptions}>
                <Pressable 
                  style={[
                    styles.dateFilterOption,
                    tempFilters.dateFilterType === 'all' && styles.selectedOption
                  ]}
                  onPress={() => handleDateFilterTypeChange('all')}
                >
                  <Text style={[
                    styles.optionText,
                    tempFilters.dateFilterType === 'all' && styles.selectedOptionText
                  ]}>
                    All trips
                  </Text>
                  {tempFilters.dateFilterType === 'all' && (
                    <Icon name="check" size={20} color="#007AFF" />
                  )}
                </Pressable>

                <Pressable 
                  style={[
                    styles.dateFilterOption,
                    tempFilters.dateFilterType === 'departure' && styles.selectedOption
                  ]}
                  onPress={() => handleDateFilterTypeChange('departure')}
                >
                  <Text style={[
                    styles.optionText,
                    tempFilters.dateFilterType === 'departure' && styles.selectedOptionText
                  ]}>
                    Filter by departure date
                  </Text>
                  {tempFilters.dateFilterType === 'departure' && (
                    <Icon name="check" size={20} color="#007AFF" />
                  )}
                </Pressable>

                <Pressable 
                  style={[
                    styles.dateFilterOption,
                    tempFilters.dateFilterType === 'return' && styles.selectedOption
                  ]}
                  onPress={() => handleDateFilterTypeChange('return')}
                >
                  <Text style={[
                    styles.optionText,
                    tempFilters.dateFilterType === 'return' && styles.selectedOptionText
                  ]}>
                    Filter by return date
                  </Text>
                  {tempFilters.dateFilterType === 'return' && (
                    <Icon name="check" size={20} color="#007AFF" />
                  )}
                </Pressable>

                <Pressable 
                  style={[
                    styles.dateFilterOption,
                    tempFilters.dateFilterType === 'range' && styles.selectedOption
                  ]}
                  onPress={() => handleDateFilterTypeChange('range')}
                >
                  <Text style={[
                    styles.optionText,
                    tempFilters.dateFilterType === 'range' && styles.selectedOptionText
                  ]}>
                    Filter by date range
                  </Text>
                  {tempFilters.dateFilterType === 'range' && (
                    <Icon name="check" size={20} color="#007AFF" />
                  )}
                </Pressable>
              </View>

              {/* Campi data basati sul tipo selezionato */}
              {tempFilters.dateFilterType === 'departure' && (
                <View style={styles.dateInputContainer}>
                  <DatePickerInput
                    label="Departure Date"
                    value={tempFilters.startDate}
                    onDateChange={handleStartDateChange}
                    placeholder="Select departure date"
                  />
                  {dateErrors.startDate && (
                    <Text style={styles.errorText}>{dateErrors.startDate}</Text>
                  )}
                </View>
              )}

              {tempFilters.dateFilterType === 'return' && (
                <View style={styles.dateInputContainer}>
                  <DatePickerInput
                    label="Return Date"
                    value={tempFilters.startDate}
                    onDateChange={handleStartDateChange}
                    placeholder="Select return date"
                  />
                  {dateErrors.startDate && (
                    <Text style={styles.errorText}>{dateErrors.startDate}</Text>
                  )}
                </View>
              )}

              {tempFilters.dateFilterType === 'range' && (
                <View style={styles.dateInputContainer}>
                  <DatePickerInput
                    label="From Date"
                    value={tempFilters.startDate}
                    onDateChange={handleStartDateChange}
                    placeholder="Select start date"
                  />
                  {dateErrors.startDate && (
                    <Text style={styles.errorText}>{dateErrors.startDate}</Text>
                  )}
                  
                  <DatePickerInput
                    label="To Date"
                    value={tempFilters.endDate}
                    onDateChange={handleEndDateChange}
                    placeholder="Select end date"
                    minimumDate={tempFilters.startDate ? new Date(tempFilters.startDate + 'T00:00:00') : undefined}
                  />
                  {dateErrors.endDate && (
                    <Text style={styles.errorText}>{dateErrors.endDate}</Text>
                  )}
                </View>
              )}
            </View>
            
            {/* Sezione Favorites */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Favorites</Text>
              <Pressable 
                style={[
                  styles.favoriteOption,
                  tempFilters.showFavoritesOnly && styles.selectedOption
                ]}
                onPress={handleFavoriteToggle}
              >
                <Icon 
                  name={tempFilters.showFavoritesOnly ? "heart" : "heart-outline"} 
                  size={20} 
                  color={tempFilters.showFavoritesOnly ? "#FF3B30" : "#666"} 
                />
                <Text style={[
                  styles.optionText,
                  tempFilters.showFavoritesOnly && styles.selectedOptionText
                ]}>
                  Show only favorites
                </Text>
                {tempFilters.showFavoritesOnly && (
                  <Icon name="check" size={20} color="#007AFF" />
                )}
              </Pressable>
            </View>

            {/* Sezione Categories */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Categories</Text>
              {allCategories.map((category) => {
                const isSelected = tempFilters.categories && 
                                 tempFilters.categories.includes(category.name);
                
                return (
                  <Pressable
                    key={category.id}
                    style={[
                      styles.categoryOption,
                      isSelected && styles.selectedOption
                    ]}
                    onPress={() => handleCategoryToggle(category.name)}
                  >
                    <View style={styles.categoryInfo}>
                      <Icon 
                        name={category.icon} 
                        size={20} 
                        color={category.color} 
                      />
                      <Text style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText
                      ]}>
                        {category.name}
                      </Text>
                    </View>
                    {isSelected && (
                      <Icon name="check" size={20} color="#007AFF" />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Footer con bottoni di azione */}
          <View style={styles.modalFooter}>
            <Pressable 
              style={styles.clearButton} 
              onPress={handleClearAllFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </Pressable>
            
            <Pressable 
              style={styles.applyButton} 
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>
                Apply ({getTempFiltersCount()})
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

//----------------------------------------------------------------------------------------------------------------------------------------
// STILI
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    minHeight: height * 0.6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  // Stili per le opzioni del filtro data
  dateFilterOptions: {
    marginBottom: 15,
  },
  dateFilterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
  },
  dateInputContainer: {
    marginTop: 10,
  },
  favoriteOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterModal;