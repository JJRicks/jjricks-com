import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
// The home page
export default function HomePage() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Image
        // load an image from local folder, style it as hero image
        source={require('../assets/images/train-background.jpg')}
        style={styles.hero}
        resizeMode="cover" // resize mode cover fills the bounding box with the image
        accessibilityLabel="Train background"
      />

      <View style={styles.textBlock}>
        <Text style={styles.title}>Welcome to JJRicks.com</Text>
        <Text style={styles.paragraph}>
          Hello, this is a website! Select a page in the header to get started. 
        </Text>
      </View>
    </ScrollView>
  );
}
// Define the styles for components on the home page
const styles = StyleSheet.create({
  content: { gap: 16 },
  hero: {
    width: '100%',
    height: 440,
    borderRadius: 8,
  },
  textBlock: { 
    gap: 8,
    color: "#ffffff"
  },
  title: { fontSize: 28, fontWeight: '700', color:'white' },
  paragraph: { fontSize: 16, lineHeight: 22, color: '#ffffffff' },
});
