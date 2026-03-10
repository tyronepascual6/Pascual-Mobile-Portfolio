// ===== IMPORTS =====
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { projects } from '../data/projects';

// ===== IMAGE MAP =====
// React Native can't dynamically require images at runtime,
// so we map each project's image key to its actual file here.
// The key must match project.image exactly in projects.ts
const projectImages: Record<string, any> = {
  'movie-placeholder': require('../assets/images/movie-placeholder.jpg'),
  'portfolio-placeholder': require('../assets/images/portfolio-placeholder.jpg'),
  'vitalis-placeholder': require('../assets/images/vitalis-placeholder.jpg'),
};

// ===== PROJECTS SCREEN =====
// This is the main projects tab — it lists all projects as scrollable cards
export default function ProjectScreen() {
  return (
    // Outer scroll container — lets the list grow as more projects are added
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* Frosted glass card that wraps all the project cards */}
      <View style={styles.glassWrapper}>

        {/* Noise texture layered on top for the glassmorphism grain effect */}
        <ImageBackground
          source={require('../assets/images/noise.png')}
          resizeMode="repeat"
          style={styles.glassNoise}
          imageStyle={{ opacity: 0.15 }}
        >

          <View style={styles.glassContent}>

            {/* Loop through every project and render a tappable card */}
            {projects.map((project) => (
              <Pressable
                key={project.id}
                style={styles.projectCard}
                // Navigate to the detail screen, passing the project id in the URL
                onPress={() =>
                  router.push({
                    pathname: '/projectscreener/[id]' as any,
                    params: { id: project.id },
                  })
                }
              >

                {/* Image + gradient + title all stacked on top of each other */}
                <View style={styles.imageWrapper}>

                  {/* Project thumbnail — falls back to portfolio placeholder if key is missing */}
                  <Image
                    source={
                      projectImages[project.image] ??
                      require('../assets/images/portfolio-placeholder.jpg')
                    }
                    style={styles.projectImage}
                  />

                  {/* Dark gradient so the white text stays readable over the image */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.75)']}
                    style={styles.cardGradient}
                  />

                  {/* Title and subtitle anchored to the bottom of the card */}
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
  container: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
  },

  // Unused but kept here in case you want a screen title later
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  // Outer glass shell — rounded card with a subtle border and shadow
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

  // Padding inside the glass card around all project cards
  glassContent: {
    padding: 20,
  },

  // Each individual project card — rounded corners, clips the image inside
  projectCard: {
    borderRadius: 22,
    overflow: 'hidden', // important: clips image to the rounded corners
    marginBottom: 24,
  },

  projectImage: {
    width: '100%',
    height: 240,
  },

  // Title + subtitle pinned to the bottom-left of the card
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

  // Wraps the image so the gradient and text can be absolutely positioned over it
  imageWrapper: {
    position: 'relative',
  },

  // Gradient anchored to the bottom of the image — fades from clear to dark
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
});