// ===== REACT & REACT NATIVE IMPORTS =====
import { router, useFocusEffect } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated, Image, ImageBackground, Platform, Modal, Pressable, ScrollView, StyleSheet, Text,
  TouchableOpacity, View
} from 'react-native';
import { auth } from '../firebase';
import { Ionicons } from '@expo/vector-icons';


// ===== CONSTANTS =====

// The real name we want to display once the animation settles
const FINAL_NAME = 'TYRONE PASCUAL';

// Pool of characters used during the scramble effect
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// ===== MAIN COMPONENT =====
export default function HomeScreen() {

  // What's actually shown on screen — starts as the real name,
  // then scrambles around on focus, then snaps back
  const [displayText, setDisplayText] = useState(FINAL_NAME);

  // Drives the indigo ↔ green color pulse on the name
  const colorAnim = useRef(new Animated.Value(0)).current;

  // Keeps track of whether someone is logged in or not
  const [user, setUser] = useState(null);

  // ===== ADDED: controls whether the logout confirmation modal is visible =====
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ===== LISTEN TO LOGIN STATE =====
  useEffect(() => {
    // Firebase will call this whenever the user logs in or out
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe; // stop listening when component unmounts
  }, []);

  // ===== RUN COLOR LOOP WHEN SCREEN IS FOCUSED =====
  useFocusEffect(
    useCallback(() => {
      // Ping-pong between 0 and 1 forever — the interpolation below
      // maps those values to actual colors
      const colorLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(colorAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false, // color animations can't use the native driver
          }),
          Animated.timing(colorAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: false,
          }),
        ])
      );

      colorLoop.start();

      // Clean up when the user navigates away
      return () => colorLoop.stop();
    }, [])
  );

  // ===== FUNCTION: LETTER COUNT SHRINK → EXPAND EFFECT =====
  const runNameAnimation = useCallback(() => {
    let length = FINAL_NAME.length; // how many characters to show right now
    let direction = -1;             // -1 = shrinking, +1 = growing
    let ticks = 0;                  // counts how many frames have passed

    const interval = setInterval(() => {
      // Fill `length` slots with random uppercase letters
      const scrambled = Array.from({ length })
        .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
        .join('');

      setDisplayText(scrambled);

      length += direction;
      ticks++;

      // Once we've shrunk down to almost nothing, start growing back
      if (length <= 2) {
        direction = 1;
      }

      // Once we're back to full length and have gone through enough frames,
      // stop and show the real name
      if (length >= FINAL_NAME.length && ticks > FINAL_NAME.length) {
        clearInterval(interval);
        setDisplayText(FINAL_NAME);
      }
    }, 60); // runs every 60ms — fast enough to look smooth

    // If the screen unmounts mid-animation, this stops the interval
    return () => clearInterval(interval);
  }, []);

  // ===== RUN NAME ANIMATION WHEN HOME TAB IS FOCUSED =====
  useFocusEffect(
    useCallback(() => {
      // Kick off the scramble every time the user comes back to this screen
      const cleanup = runNameAnimation();
      return cleanup;
    }, [])
  );

  // ===== INTERPOLATED COLOR =====
  // Maps the 0–1 animated value to a color — indigo when low, green when high
  const animatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#4f46e5', '#22c55e'],
  });

  // ===== UI =====
  return (
    
    <View style={styles.outerContainer}>

    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >

      {/* ===== HEADER ===== */}
      <View style={styles.header}>

      <TouchableOpacity
        onPress={() => user ? setShowLogoutModal(true) : router.push('/login')}
        style={styles.loginBtn}
      >
        <Text style={styles.loginBtnText}>{user ? 'Logout' : 'Login'}</Text>
      </TouchableOpacity>

        <View style={styles.row}>

          {/* Profile photo */}
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../assets/images/profile.jpg')}
              style={styles.avatar}
            />
          </View>

          {/* Name + role badge */}
          <View style={styles.textContainer}>

            {/* Animated name — color pulses and letters scramble on focus */}
            <Animated.Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.name, { color: animatedColor }]}
            >
              {displayText}
            </Animated.Text>

            {/* Small pill badge below the name */}
            <View style={styles.roleWrapper}>
              <Text style={styles.role}>IT Student / Developer</Text>
            </View>

          </View>

        </View>
      </View>

      {/* ===== GLASS CONTENT PANEL ===== */}
      {/* This is the frosted-glass card that holds all the profile info */}
      <View style={styles.glassWrapper}>

        {/* Subtle noise texture layered on top of the glass for texture */}
        <ImageBackground
          source={require('../assets/images/noise.png')}
          resizeMode="repeat"
          style={styles.glassNoise}
          imageStyle={{ opacity: 0.15 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.glassContent}
          >

            {/* ABOUT */}
            <Text style={styles.panelTitle}>About Me</Text>
            <Text style={styles.panelText}>
              I'm an IT student from Universidad de Manila focused on web and mobile development, 
              with hands-on experience in HTML, CSS, JavaScript, and React Native.
              I value clean design, usability, and continuous learning.
            </Text>

            {/* SKILLS */}
            <Text style={styles.panelTitle}>Skills</Text>
            <Text style={styles.panelText}>
              Core Skills{'\n'}
              • HTML, CSS, JavaScript{'\n'}
              • React Native (Basics){'\n'}
              • Responsive UI Design{'\n'}
              • Data Visualization{'\n'}
              • Object - Oriented Programming{'\n'}
              {'\n'}
              Tools{'\n'}
              • Microsoft Office{'\n'}
              • Google Workspace{'\n'}
              {'\n'}
              Technical Foundations{'\n'}
              • Cisco Basic Networking{'\n'}
              • Computer Troubleshooting{'\n'}
              • Documentation{'\n'}
            </Text>

            {/* ACHIEVEMENTS */}
            <Text style={styles.panelTitle}>Achievements</Text>
            <Text style={styles.panelText}>
              Highlights{'\n'}
              • Senior High School Graduate — With High Honors (2022){'\n'}
              • Junior High School Graduate — With Honors (2020){'\n'}
              • Best in TLE – ICT Section 1 (2020){'\n'}
              {'\n'}
              Competitions & Experience{'\n'}
              • 3rd Place — Collaborative Desktop Publishing (Division Level, 2019){'\n'}
              • 4th Place — Tarpaulin Making Contest (Division Level, 2019){'\n'}
              • Piso WiFi Business Startup (Networking & Operations Experience){'\n'}
              • Capstone Leader{'\n'}
              • Corresponding Author in Publication of Capstone Study (Google Scholar){'\n'}
            </Text>

            {/* EDUCATION */}
            <Text style={styles.panelTitle}>Education</Text>
            <Text style={styles.panelText}>
              Universidad de Manila{'\n'}
              Bachelor of Science in Information Technology{'\n'}
              2022 – Present{'\n'}
              {'\n'}
              Universidad de Manila{'\n'}
              ICT - TVL Senior High School{'\n'}
              2020-2022{'\n'}
              {'\n'}
              Pres. Corazon C. Aquino High School{'\n'}
              Junior High School{'\n'}
              2016-2020{'\n'}
            </Text>

            {/* LANGUAGES */}
            <Text style={styles.panelTitle}>Languages</Text>
            <Text style={styles.panelText}>
              • English{'\n'}
              • Filipino{'\n'}
            </Text>

            {/* INTERESTS */}
            <Text style={styles.panelTitle}>Interests</Text>
            <Text style={styles.panelText}>
              • Gym, Study, Business, Web & Mobile Development, and Video Games{'\n'}
            </Text>

          </ScrollView>
        </ImageBackground>
      </View>

      {/* ===== ADDED: logout confirmation modal ===== */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              {/* Cancel — just closes the modal */}
              <Pressable style={styles.modalCancel} onPress={() => setShowLogoutModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              {/* Confirm — signs out and closes the modal */}
              <Pressable style={styles.modalConfirm} onPress={() => { signOut(auth); setShowLogoutModal(false); }}>
                <Text style={styles.modalConfirmText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
    
    {/* ===== FLOATING CHAT BUTTON ===== */}
<Pressable
  style={styles.floatingChatBtn}
  onPress={() => router.push('/chat')}
>
  <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
</Pressable>

  </View>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 60,
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  header: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    marginBottom: 20,
  },
  textContainer: {
    flex: 1, // lets the name truncate properly instead of overflowing
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingRight: 10,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    // Soft indigo glow behind the avatar
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    flexShrink: 1, // shrinks text instead of pushing other elements off screen
  },
  role: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.6,
    color: 'rgba(107,114,128,0.85)',
  },
  roleWrapper: {
    alignSelf: 'flex-start', // don't stretch to full width
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999, // pill shape
    backgroundColor: 'rgba(79,70,229,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(79,70,229,0.18)',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    color: 'rgba(255,255,255,0.85)',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#6b7280',
    marginBottom: 8,
  },
  glassCard: {
    padding: 16,
    borderRadius: 14,
    // iOS gets a slightly more opaque glass since blur is more visible there
    backgroundColor: Platform.OS === 'ios'
      ? 'rgba(255,255,255,0.12)'
      : 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  glassWrapper: {
    flex: 1,
    marginTop: 8,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32, // rounded top corners like a bottom sheet
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 }, // shadow goes upward
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 12,
    overflow: 'hidden', // required to clip the noise texture to the rounded corners
  },
  glassNoise: {
    flex: 1,
  },
  glassContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  panelTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#6b7280', // muted gray — acts like a section label
    marginBottom: 6,
    marginTop: 20,
  },
  panelText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#111827',
  },
  screen: {
    flex: 1,
    backgroundColor: '#0b0f1a',
  },
  loginBtn: {
    alignSelf: 'flex-end', // sits in the top-right of the header
    marginBottom: 8,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 999, // pill shape
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  loginBtnText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#000',
    fontWeight: '600',
  },
  modalConfirm: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#fff',
    fontWeight: '600',
  },
  floatingChatBtn: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});