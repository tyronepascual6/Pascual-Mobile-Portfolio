// ===== REACT & REACT NATIVE IMPORTS =====
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';

import {
  Animated,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// ===== CONSTANTS =====

// Final name shown after animation completes
const FINAL_NAME = 'TYRONE PASCUAL';

// Characters used during scrambling animation
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// ===== MAIN COMPONENT =====
export default function HomeScreen() {

  // Text currently displayed on screen
  const [displayText, setDisplayText] = useState(FINAL_NAME);

  // Animated value for looping text color
  const colorAnim = useRef(new Animated.Value(0)).current;

  // ===== RUN COLOR LOOP WHEN SCREEN IS FOCUSED =====
  useFocusEffect(
    useCallback(() => {
      const colorLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(colorAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false, // color animations must stay JS-driven
          }),
          Animated.timing(colorAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: false,
          }),
        ])
      );

      colorLoop.start();

      // Stop animation when screen loses focus
      return () => colorLoop.stop();
    }, [])
  );

  // ===== FUNCTION: LETTER COUNT SHRINK → EXPAND EFFECT =====
  const runNameAnimation = useCallback(() => {
    let length = FINAL_NAME.length; // current character count
    let direction = -1;             // start by shrinking
    let ticks = 0;

    const interval = setInterval(() => {
      // Generate scrambled text based on current length
      const scrambled = Array.from({ length })
        .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
        .join('');

      setDisplayText(scrambled);

      // Adjust length
      length += direction;
      ticks++;

      // When text is very short, reverse and start expanding
      if (length <= 2) {
        direction = 1;
      }

      // When full length is restored, finish animation
      if (length >= FINAL_NAME.length && ticks > FINAL_NAME.length) {
        clearInterval(interval);
        setDisplayText(FINAL_NAME);
      }
    }, 60);

    // Cleanup if screen changes quickly
    return () => clearInterval(interval);
  }, []);

  // ===== RUN NAME ANIMATION WHEN HOME TAB IS FOCUSED =====
  useFocusEffect(
    useCallback(() => {
      const cleanup = runNameAnimation();
      return cleanup;
    }, [])
  );

  // ===== INTERPOLATED COLOR =====
  const animatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#4f46e5', '#22c55e'], // Indigo → Green
  });

  // ===== UI =====
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
      <View style={styles.row}>


  {/* Avatar */}
  <View style={styles.avatarWrapper}>
    <Image
      source={require('../assets/images/profile.jpg')}
      style={styles.avatar}
    />
  </View>

  {/* Name + role container */}
  <View style={styles.textContainer}>

  <Animated.Text
  numberOfLines={1}
  ellipsizeMode="tail"
  style={[
    styles.name,
    { color: animatedColor },
  ]}
>
  {displayText}
</Animated.Text>


<View style={styles.roleWrapper}>
  <Text style={styles.role}>IT Student / Developer</Text>
</View>

  </View>

</View>
</View>

      {/* ===== GLASS CONTENT PANEL ===== */}
      <View style={styles.glassWrapper}>

{/* Noise texture layer */}
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
    I’m an IT student from Universidad de Manila focused on web and mobile development, 
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

    </ScrollView>
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
    flex: 1,              // ← KEY FIX
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
  
    // Glass-like border
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  
    // Soft glow / depth
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
    flexShrink: 1,
  },
  role: {
    marginTop: 2,          
    fontSize: 13,          
    fontWeight: '500',     
    letterSpacing: 0.6,    
    color: 'rgba(107,114,128,0.85)',
  },
  roleWrapper: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
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
    color: '#6b7280', // soft gray
    marginBottom: 8,
  },
  
  glassCard: {
    padding: 16,
    borderRadius: 14,
  
    // "Glass" background
    backgroundColor: Platform.OS === 'ios'
      ? 'rgba(255,255,255,0.12)'
      : 'rgba(255,255,255,0.08)',
  
    // Subtle border for glass edge
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  
    // Android shadow
    elevation: 6,
  },
  glassWrapper: {
    flex: 1,
    marginTop: 8,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 12,
    overflow: 'hidden', // IMPORTANT for curved glass
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
    color: '#6b7280',
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
    backgroundColor: '#0b0f1a', // deep dark (futuristic base)
  },
});