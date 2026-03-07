// ===== REACT NATIVE CORE COMPONENTS =====
// StyleSheet -> handles component styles
// Text       -> displays text content
// View       -> basic layout container
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { projects } from '../data/projects';

// ===== IMAGE MAP =====
// This connects image "keys" from projects.ts to actual image files
// The key must match project.image exactly
const projectImages: Record<string, any> = {
  'movie-placeholder': require('../assets/images/movie-placeholder.jpg'),
  'portfolio-placeholder': require('../assets/images/portfolio-placeholder.jpg'),
};

// ===== PROJECTS SCREEN =====
// This screen appears when the "Projects" tab is selected
export default function ProjectScreen() {
  return (
    // Main wrapper that fills the entire screen
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

    {/* Glass-style wrapper (card-like container) */}
  <View style={styles.glassWrapper}>

    {/* Noise background for glassmorphism effect */}
    <ImageBackground
      source={require('../assets/images/noise.png')}
      resizeMode="repeat"
      style={styles.glassNoise}
      imageStyle={{ opacity: 0.15 }}
    >
      
      {/* Inner content of the glass container */}
      <View style={styles.glassContent}>

       {/* Loop through projects and render each one */}
      {projects.map((project) => (
    <Pressable
    key={project.id}
    style={styles.projectCard}
    onPress={() =>
      router.push({
        pathname: '/projectscreener/[id]' as any,
        params: { id: project.id },
      })
    }
  >
  
    <View style={styles.imageWrapper}>
  
      <Image
        source={
          projectImages[project.image] ??
          require('../assets/images/portfolio-placeholder.jpg')
        }
        style={styles.projectImage}
      />
  
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.75)']}
        style={styles.cardGradient}
      />
  
      <View style={styles.projectInfo}>
        <Text style={styles.projectTitle}>{project.title}</Text>
        <Text style={styles.projectSubtitle}>
          {project.shortDescription}
        </Text>
      </View>
  
    </View>
  
  </Pressable>
))}

</View>


    </ImageBackground>

  </View>

</ScrollView>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  // Container that centers content vertically and horizontally
  container: {
    alignItems: 'center',    // Centers content horizontally
    paddingTop: 50, 
    paddingBottom: 10,
  },

  // Title styling
  title: {
    fontSize: 22,            // Large heading text
    fontWeight: 'bold'       // Emphasized text
  },

  glassWrapper: {
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
    padding: 20,
  },
  projectCard: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 24,
  },  
  
  projectImage: {
    width: '100%',
    height: 240,
  },
  
  projectInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  
  projectSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  imageWrapper: {
    position: 'relative',
  },
  
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
});
