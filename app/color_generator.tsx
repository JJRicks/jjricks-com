import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

// define the RGB input type for help with error checking
type RGB = { r: string; g: string; b: string };

export default function ColorGeneratorPage() {
  // outside state "variable" to keep track of program-wide states 
  const [hex, setHex] = useState<string>('');
  const [rgb, setRgb] = useState<RGB>({ r: '', g: '', b: '' });
  const [error, setError] = useState<string | null>(null); // Either a string or a null, initialize null 
  const [preview, setPreview] = useState<string>('#cccccc'); // any valid CSS color value
  const [label, setLabel] = useState<string>('');            // e.g. "#FF8800 | rgb(255, 136, 0)"

  function normalizeHex(input: string): string | null { 
    const raw = input.trim().replace(/^#/, ''); // trim the # 
    if (/^[0-9a-fA-F]{3}$/.test(raw)) { // make sure the input is within hex specs for three character hex
      const [a, b, c] = raw.toUpperCase().split(''); // uppercase the letters and split them, duplicate
      return `#${a}${a}${b}${b}${c}${c}`;
    }
    if (/^[0-9a-fA-F]{6}$/.test(raw)) { // make sure the input is within hex specs for six character hex
      return `#${raw.toUpperCase()}`; // uppercase and return
    }
    return null;
  }

  function hexToRgbTuple(hex6: string): [number, number, number] {
    const r = parseInt(hex6.slice(1, 3), 16); // parse RGB ints
    const g = parseInt(hex6.slice(3, 5), 16);
    const b = parseInt(hex6.slice(5, 7), 16);
    return [r, g, b];
  }
  // various hex functions
  function toHex(n: number) {
    return n.toString(16).padStart(2, '0').toUpperCase();
  }
  function rgbToHexString(r: number, g: number, b: number) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  function hexToRgbString(h: string) {
    const [r, g, b] = hexToRgbTuple(h);
    return `rgb(${r}, ${g}, ${b})`;
  }
  // update the box color with the user choice
  function updateColor() {
    setError(null);

    const hasHex = hex.trim().length > 0;
    const hasAnyRgb = [rgb.r, rgb.g, rgb.b].some((v) => v.trim().length > 0);

    if (hasHex && hasAnyRgb) {
      setError('Enter either a hex value OR RGB values, not both.');
      return;
    }
    if (!hasHex && !hasAnyRgb) {
      setError('Enter a hex value or all three RGB values.');
      return;
    }

    if (hasHex) {
      const h = normalizeHex(hex);
      if (!h) {
        setError('Invalid hex. Use #RGB or #RRGGBB (e.g. #FA3 or #FFAA33).');
        return;
      }
      setPreview(h);
      setLabel(`${h} | ${hexToRgbString(h)}`);
      return;
    }

    // RGB path
    const r = parseInt(rgb.r, 10);
    const g = parseInt(rgb.g, 10);
    const b = parseInt(rgb.b, 10);
    // check if the RGB inputs are numbers
    if ([r, g, b].some((n) => Number.isNaN(n))) {
      setError('RGB must be numbers in all three boxes.');
      return;
    }
    if (![r, g, b].every((n) => n >= 0 && n <= 255)) {
      setError('RGB values must be between 0 and 255.');
      return;
    }
    // make an RGB string
    const rgbStr = `rgb(${r}, ${g}, ${b})`;
    setPreview(rgbStr);
    setLabel(`${rgbToHexString(r, g, b)} | ${rgbStr}`);
  }

  // keep RGB fields numeric 
  function digitsOnly(value: string) {
    return value.replace(/[^0-9]/g, '');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Color Generator</Text>

      {/* Hex input */}
      <View style={styles.group}>
        <Text style={styles.label}>Hex</Text>
        <TextInput
          value={hex}
          onChangeText={(t) => setHex(t)}
          placeholder="#FFAA33 or #FA3"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={7} // e.g. "#A1B2C3"
          style={styles.input}
          accessibilityLabel="Hex color input"
        />
      </View>

      {/* RGB inputs */}
      <View style={styles.group}>
        <Text style={styles.label}>RGB</Text>
        <View style={styles.rgbRow}>
          <TextInput
            value={rgb.r}
            onChangeText={(t) => setRgb({ ...rgb, r: digitsOnly(t) })}
            placeholder="R"
            keyboardType="numeric"
            maxLength={3}
            style={[styles.input, styles.inputRgb]}
            accessibilityLabel="Red value"
          />
          <TextInput
            value={rgb.g}
            onChangeText={(t) => setRgb({ ...rgb, g: digitsOnly(t) })}
            placeholder="G"
            keyboardType="numeric"
            maxLength={3}
            style={[styles.input, styles.inputRgb]}
            accessibilityLabel="Green value"
          />
          <TextInput
            value={rgb.b}
            onChangeText={(t) => setRgb({ ...rgb, b: digitsOnly(t) })}
            placeholder="B"
            keyboardType="numeric"
            maxLength={3}
            style={[styles.input, styles.inputRgb]}
            accessibilityLabel="Blue value"
          />
        </View>
      </View>

      {/* Update button */}
      <Pressable onPress={updateColor} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} accessibilityRole="button" accessibilityLabel="Update color">
        <Text style={styles.buttonText}>Update</Text>
      </Pressable>

      {/* Error message (visible on invalid values) */}
      {error && (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      )}

      {/* Preview */}
      <View style={[styles.preview, { backgroundColor: preview }]} />
      {!!label && <Text style={styles.previewLabel}>{label}</Text>}
    </View>
  );
}
// Styles for page
const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4, color:"white"},
  group: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  input: {
    color: "#818181ff",
    borderWidth: 1,
    borderColor: '#ffffffff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    minWidth: 140,
  },
  rgbRow: { flexDirection: 'row', gap: 8 },
  inputRgb: { width: 70 },
  button: {
    backgroundColor: "white",
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cfcfcf',
  },
  buttonPressed: { opacity: 0.8 },
  buttonText: { fontSize: 16, fontWeight: '600' },
  error: { color: '#c0392b', fontSize: 14 },
  preview: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  previewLabel: { fontFamily: 'System', fontSize: 14, color: '#333' },
});
