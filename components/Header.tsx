import { Link } from 'expo-router';
import { Image, StyleSheet, Text, View } from "react-native";

// return the header that wraps all pages
export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <Image
          source={require('../assets/images/jjricks-logo.png')}
          style={styles.logo}
          accessibilityLabel="Site logo"
        />
        <Text style={styles.siteName}>Welcome to JJRicks.com</Text>
      </View>

      {/* Simple nav bar */}
      <View style={styles.nav}>
        <Link href="/" style={styles.navLink}>Home</Link>
        <Link href="/color_generator" style={styles.navLink}>Color generator</Link>
      </View>
    </View>
  );
}
// Header styles to define the colors and padding of the header, among other things
const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: { width: 120, height: 40, resizeMode: 'cover'},
  siteName: { fontSize: 18, fontWeight: '600', color: 'white' },
  nav: { flexDirection: 'row', gap: 16 },
  navLink: { fontSize: 16, textDecorationLine: 'none', color:"white" },
});