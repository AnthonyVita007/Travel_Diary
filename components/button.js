import { Text, StyleSheet, TouchableOpacity } from 'react-native';

const Button = ({handleSaveTrip}) => {
    return(
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTrip}>
            <Text style={styles.saveButtonText}>Save Trip</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default Button;
