import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import categories from '../models/categories';

const CategoryBox = ({selectedCategories, onToggleCategory }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categories (optional)</Text>
      <View style={styles.categoriesContainer}>
        {categories.filter(category => category.id !== 9).map((category) => {
            // Verifica se la categoria è selezionata
            const isSelected = selectedCategories.some(cat => cat.id === category.id);
            
            return (
                //Box tappabile della categoria
                <Pressable
                    key={category.id}
                    style={[
                    styles.categoryItem,
                    { borderColor: category.color },
                    isSelected && {
                        backgroundColor: category.color
                    }
                    ]}
                    onPress={() => onToggleCategory(category)}
                >
                
                {/**icona della categoria */}
                <Icon 
                  name={category.icon} 
                  size={24} 
                  color={isSelected ? '#fff' : category.color}
                />

                {/**Nome della categoria */}
                <Text 
                  style={[
                    styles.categoryText,
                    { color: isSelected ? '#fff' : category.color }
                  ]}
                >
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
      </View>
      {selectedCategories.length === 0 && (
        <Text style={styles.infoText}>No categories selected, if you leave it empty your trip will have no category</Text>
      )}
    </View>
  );
};

//------------------------------------------------------------------------------------------------------------------------------
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  categoryItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  }
});

export default CategoryBox;