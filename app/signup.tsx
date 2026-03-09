import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { auth } from '../firebase';

export default function SignupScreen() {
  // Track what the user types into each field
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState(''); // second password field to catch typos

  // Show a spinner on the button while Firebase is creating the account
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Basic checks before we even bother hitting Firebase
    if (!email || !password || !confirm) {
      Alert.alert('Please fill in all fields');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      // Firebase actually enforces this too, but better to catch it early
      Alert.alert('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Tell Firebase to create a new account with these credentials
      await createUserWithEmailAndPassword(auth, email, password);

      // Account created — send them home and wipe the nav history
      // so they can't press back and land on signup again
      router.replace('/');
    } catch (error: any) {
      // Firebase error messages are pretty readable (e.g. "email already in use")
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      // Always stop the spinner, success or not
      setLoading(false);
    }
  };

  return (
    // Gradient background — same as login, keeps the two screens consistent
    <LinearGradient
        colors={['#ffffff', '#e8e8ed', '#f5f5f7']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}>

      {/* Decorative circles in each corner — purely visual, no interaction */}
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleTopRight]} />
      <View style={[styles.circle, styles.circleBottomLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      {/* Header */}
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Start your journey</Text>

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

      {/* Password field — characters are hidden */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#6b7280"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Confirm password — must match the field above before we proceed */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#6b7280"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />

      {/* Sign up button — disabled and shows spinner while loading */}
      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Sign Up</Text>
        }
      </TouchableOpacity>

      {/* Already have an account? Take them to login */}
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Already have an account? <Text style={styles.linkBold}>Login</Text></Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: '600',
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
  // Base style shared by all four circles
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#000',
  },
  // Large circle peeking in from the top-left
  circleTopLeft: {
    width: 200,
    height: 200,
    top: -80,
    left: -80,
    opacity: 0.04,
  },
  // Smaller circle on the top-right for balance
  circleTopRight: {
    width: 120,
    height: 120,
    top: 60,
    right: -40,
    opacity: 0.06,
  },
  // Tiny accent on the left side
  circleBottomLeft: {
    width: 80,
    height: 80,
    bottom: 140,
    left: -20,
    opacity: 0.05,
  },
  // Big circle anchoring the bottom-right corner
  circleBottomRight: {
    width: 260,
    height: 260,
    bottom: -100,
    right: -80,
    opacity: 0.04,
  },
});