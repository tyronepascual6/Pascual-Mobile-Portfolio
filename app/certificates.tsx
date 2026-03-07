// ===== REACT NATIVE CORE COMPONENTS =====
// StyleSheet -> organizes styles
// Text       -> displays text
// View       -> basic layout container
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ImageBackground, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

// ===== CERTIFICATES DATA =====
// List of certificates to display
// Each item has a title and an image source
const certificates = [
  {
    id: 1,
    title: 'Big Data and Privacy',
    type: 'image',
    source: require('../assets/images/certificate1.jpg'),
  },
  {
    id: 2,
    title: 'Generative Artificial Intelligence',
    type: 'image',
    source: require('../assets/images/certificate2.jpg'),
  },
  {
    id: 3,
    title: '2021 - 2022 With High Honors',
    type: 'image',
    source: require('../assets/images/certificate3.jpg'),
  },
  {
    id: 4,
    title: 'Published Journal Internationally',
    type: 'image',
    source: require('../assets/images/certificate4.jpg'),
  },
  {
    id: 5,
    title: 'Azure Open AI Assistant',
    type: 'image',
    source: require('../assets/images/certificate5.jpg'),
  },
];


// ===== CERTIFICATES SCREEN =====
// This screen is shown when the "Certificates" tab is selected
export default function CertificatesScreen() {
   // Controls whether the modal is visible or not
  const [modalVisible, setModalVisible] = useState(false);

  // Stores the certificate that was clicked
  const [activeCertificate, setActiveCertificate] = useState(null);
  return (
    // Main wrapper that fills the entire screen
    <View style={styles.container}>

    {/* Glass-style wrapper */}
  <View style={styles.glassWrapper}>
    
    {/* Noise texture to simulate glass effect */}
    <ImageBackground
      source={require('../assets/images/noise.png')}
      resizeMode="repeat"
      style={styles.glassNoise}
      imageStyle={{ opacity: 0.15 }}
    >

      {/* Content inside the glass container */}
      <View style={styles.glassContent}>
   
    {/* Render one button per certificate */}
    {certificates.map(cert => (
    <Pressable
      key={cert.id}
      style={styles.button}
      onPress={() => {
        // Save which certificate was clicked
        setActiveCertificate(cert);

        // Open the modal
        setModalVisible(true);
      }}
    >
      {/* Certificate title */}
      <Text style={styles.buttonText}>{cert.title}</Text>

      {/* Right arrow icon */}
      <Ionicons name="chevron-forward" size={30} color="#7AB8FF" />
    </Pressable>
  ))}
</View>
    </ImageBackground>
  </View>
  
  {/* ===== MODAL ===== */}
  <Modal
  transparent
  animationType="fade"
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  {/* Dark overlay behind the modal */}
  <View style={styles.modalOverlay}>
    
    {/* Modal card */}
    <View style={styles.modalContent}>

    {/* Area where the certificate image is shown */}
    <View style={{ flex: 1, marginTop: 8 }}>
  {activeCertificate?.type === 'image' && (
    <Image
      source={activeCertificate.source}
      style={styles.certificateImage}
      resizeMode="contain"
    />
  )}
  </View>

{/* Close button */}
<Pressable
  style={({ pressed }) => [
    styles.modalCloseButton,
    pressed && { opacity: 0.85 }
  ]}
  onPress={() => {
    // Close modal
    setModalVisible(false);

    // Clear selected certificate
    setActiveCertificate(null);
  }}
>
  <Text style={styles.closeText}>Close</Text>
</Pressable>


    </View>

  </View>
</Modal>
</View>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  // Container that centers content vertically and horizontally
  container: {
    flex: 1,                 // Makes the view fill the screen
    alignItems: 'center',    // Centers content horizontally
    paddingTop: 60, 
  },

  // Title styling
  title: {
    fontSize: 22,            // Large heading text
    fontWeight: 'bold'       // Emphasized text
  },

  glassWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
  
    borderRadius: 24,
    overflow: 'hidden',
  
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  
  glassNoise: {
    width: '100%',
    flex: 1,
  },
  
  glassContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    marginVertical: 12,
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: '#0B1C2D',
    borderWidth: 1,
    borderColor: 'rgba(120,180,255,0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    maxWidth: 320,
  },
  
  buttonText: {
    color: '#E6F0FF',
    fontWeight: '600',
    fontSize: 15,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    width: '88%',          // margin from screen sides
    maxWidth: 420,
  
    height: '80%',         // 🔑 taller modal
    maxHeight: 600,
  
    borderRadius: 24,
    padding: 20,
  
    backgroundColor: '#ffffff',
  },
  
  certificateImage: {
    width: '100%',
    flex: 1,               // 🔑 fill available height
  },
  
  closeButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  
  closeText: {
    fontWeight: '600',
    color: '#E6F0FF',
  },
  subText: {
    marginTop: 4,
    fontSize: 13,
    color: '#9ca3af',
  },
  fullscreenClose: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  
    backgroundColor: '#0B1C2D',
    borderWidth: 1,
    borderColor: 'rgba(120,180,255,0.25)',
  },
  modalCloseButton: {
    marginTop: 16,
    alignSelf: 'center',
  
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
  
    backgroundColor: '#0B1C2D',
    borderWidth: 1,
    borderColor: 'rgba(120,180,255,0.25)',
  },  
});
