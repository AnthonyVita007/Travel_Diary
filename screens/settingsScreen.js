import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar from '../components/navBar';
import tripCollectorA from '../data/tripsDataManagment';

export default function SettingsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Callback per le impostazioni
  const handleAbout = () => {
    Alert.alert(
      'About Travel Diary',
      'Travel Diary App v1.0\n\nCreated by:\n• Anthony Vita - 612707588\n• Simone Visconti - 0612707795\n• Vincenzo Goffredo - 0612708207\n• Antonio Radesca - 0612708145\n\nMobile Programming - Gruppo 15',
      [{ text: 'OK' }]
    );
  };

  const handleBackup = () => {
    const tripCount = tripCollectorA.count();
    Alert.alert(
      'Backup Data',
      `Found ${tripCount} trips to backup.\n\nThis feature will export your trip data for backup purposes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          Alert.alert('Success', 'Trip data exported successfully!');
        }}
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your trips. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: () => {
            // Clear all trips (we won't actually implement this destructively)
            Alert.alert('Notice', 'This demo does not actually delete the sample data.');
          }
        }
      ]
    );
  };

  const handleSupport = () => {
    Alert.alert(
      'Support',
      'Need help with Travel Diary?\n\nFor technical support, please contact:\nsupport@traveldiaryapp.com\n\nOr visit our FAQ section online.',
      [{ text: 'OK' }]
    );
  };

  const renderSettingItem = (icon, title, subtitle, onPress, rightComponent = null) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color="#007AFF" style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Icon name="chevron-right" size={20} color="#ccc" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.mainContainer}>
          
          {/* App Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Information</Text>
            {renderSettingItem(
              'information-outline',
              'About Travel Diary',
              'Version 1.0 - Mobile Programming Project',
              handleAbout
            )}
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            {renderSettingItem(
              'bell-outline',
              'Notifications',
              'Receive trip reminders and updates',
              () => setNotifications(!notifications),
              <Switch 
                value={notifications} 
                onValueChange={setNotifications}
                trackColor={{ false: '#ccc', true: '#007AFF' }}
                thumbColor={notifications ? '#fff' : '#f4f3f4'}
              />
            )}
            {renderSettingItem(
              'theme-light-dark',
              'Dark Mode',
              'Switch between light and dark themes',
              () => setDarkMode(!darkMode),
              <Switch 
                value={darkMode} 
                onValueChange={setDarkMode}
                trackColor={{ false: '#ccc', true: '#007AFF' }}
                thumbColor={darkMode ? '#fff' : '#f4f3f4'}
              />
            )}
          </View>

          {/* Data Management Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Management</Text>
            {renderSettingItem(
              'cloud-upload-outline',
              'Backup Data',
              'Export your trips for safekeeping',
              handleBackup
            )}
            {renderSettingItem(
              'delete-outline',
              'Clear All Data',
              'Permanently delete all trip data',
              handleClearData
            )}
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            {renderSettingItem(
              'help-circle-outline',
              'Help & Support',
              'Get help or contact support',
              handleSupport
            )}
          </View>

          {/* Trip Statistics */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Your Travel Statistics</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{tripCollectorA.count()}</Text>
                <Text style={styles.statLabel}>Total Trips</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {tripCollectorA.getAllTrips().filter(trip => trip.favorite).length}
                </Text>
                <Text style={styles.statLabel}>Favorites</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {new Set(tripCollectorA.getAllTrips().map(trip => trip.category)).size}
                </Text>
                <Text style={styles.statLabel}>Categories</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* NavBar */}
      <NavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  mainContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});