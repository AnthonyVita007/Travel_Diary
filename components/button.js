import { Text, StyleSheet, TouchableOpacity } from 'react-native';

const Button = ({handleButtonPress, buttonColor, text}) => {
    return(
        <TouchableOpacity 
        style={[styles.button, {backgroundColor: buttonColor }]}  onPress={handleButtonPress}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default Button;
