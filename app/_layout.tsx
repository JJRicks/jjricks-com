// import React components
import { Slot } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Header from '../components/Header';

// The root layout returns the header with the regular content slotted in
export default function RootLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.pageFrame}>
        <Header />
        <View style={styles.pageBody}>
          {/* Show the header on every page and insert the main content with Slot */}
          <Slot />
        </View>
      </View>
    </SafeAreaView>
  );
}
// define the style of each component
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0d0d0dff' },
  pageFrame: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 960,
  },
  pageBody: {
    padding: 16,
  },
});
