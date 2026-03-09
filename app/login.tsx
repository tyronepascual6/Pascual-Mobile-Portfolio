import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { auth } from '../firebase';

export default function LoginScreen() {
  // Track what the user types
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Show a spinner on the button while Firebase is doing its thing
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Don't let them submit with empty fields
    if (!email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Ask Firebase to check their credentials
      await signInWithEmailAndPassword(auth, email, password);

      // If it worked, send them home and clear the nav history
      // (so they can't press back and end up on login again)
      router.replace('/');
    } catch (error: any) {
      // Firebase gives pretty readable error messages, so we just show them directly
      Alert.alert('Login Failed', error.message);
    } finally {
      // Always hide the spinner when done, whether it worked or not
      setLoading(false);
    }
  };

  return (
    // Gradient background — goes from white to a soft light grey
    <LinearGradient
        colors={['#ffffff', '#e8e8ed', '#f5f5f7']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}>

      {/* Decorative blurred circles in each corner for a subtle depth effect */}
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleTopRight]} />
      <View style={[styles.circle, styles.circleBottomLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      {/* Header */}
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      {/* Email field */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#6b7280"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"        // emails are lowercase
        keyboardType="email-address" // brings up the @ keyboard on mobile
      />

      {/* Password field — secureTextEntry hides the characters */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#6b7280"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login button — shows a spinner while waiting for Firebase */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Login</Text>
        }
      </TouchableOpacity>

      {/* If they don't have an account yet, send them to signup */}
      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.link}>Don't have an account? <Text style={styles.linkBold}>Sign Up</Text></Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7', // fallback color if gradient doesn't load
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)', // very subtle border
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#000',
    fontSize: 15,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 999, // pill shape
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  link: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 14,
  },
  linkBold: {
    color: '#000',
    fontWeight: 'bold',
  },

  // --- Decorative circles ---
  // Base style shared by all circles
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#000',
  },
  // Big circle peeking in from the top-left
  circleTopLeft: {
    width: 200, height: 200,
    top: -80, left: -80,
    opacity: 0.04,
  },
  // Smaller circle on the top-right for balance
  circleTopRight: {
    width: 120, height: 120,
    top: 60, right: -40,
    opacity: 0.06,
  },
  // Tiny accent circle on the left side
  circleBottomLeft: {
    width: 80, height: 80,
    bottom: 140, left: -20,
    opacity: 0.05,
  },
  // Large circle anchoring the bottom-right corner
  circleBottomRight: {
    width: 260, height: 260,
    bottom: -100, right: -80,
    opacity: 0.04,
  },
});