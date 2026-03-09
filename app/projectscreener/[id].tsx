import { Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image, Linking, Modal, Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { projects } from '../../data/projects';

// ===== STATIC ASSET MAPS =====
// React Native requires images to be required at build time,
// so we map each project's string key to its actual local file here

const projectImages: Record<string, any> = {
  'movie-placeholder': require('../../assets/images/movie-placeholder.jpg'),
  'portfolio-placeholder': require('../../assets/images/portfolio-placeholder.jpg'),
  'vitalis-placeholder': require('../../assets/images/vitalis-placeholder.jpg'),
};

const projectVideos: Record<string, any> = {
  'movie-demo': require('../../assets/videos/movie-demo.mp4'),
  'portfolio-demo': require('../../assets/videos/portfolio-demo.mp4'),
  'vitalis-demo': require('../../assets/videos/vitalis-demo.mp4'),
};

// All gallery images across every project, keyed by a unique string
const galleryImages: Record<string, any> = {
  'movie-1': require('../../assets/images/gallery/movie-1.jpg'),
  'portfolio-1': require('../../assets/images/gallery/portfolio-1.jpg'),
  'portfolio-2': require('../../assets/images/gallery/portfolio-2.jpg'),
  'portfolio-3': require('../../assets/images/gallery/portfolio-3.jpg'),
  'portfolio-4': require('../../assets/images/gallery/portfolio-4.jpg'),
  'portfolio-5': require('../../assets/images/gallery/portfolio-5.jpg'),
  'portfolio-6': require('../../assets/images/gallery/portfolio-6.jpg'),
  'vitalis-1': require('../../assets/images/gallery/vitalis-1.jpg'),
  'vitalis-2': require('../../assets/images/gallery/vitalis-2.jpg'),
  'vitalis-3': require('../../assets/images/gallery/vitalis-3.jpg'),
  'vitalis-4': require('../../assets/images/gallery/vitalis-4.jpg'),
};

export default function ProjectDetails() {
  // Grab the `id` from the URL — e.g. /projects/movie → id = 'movie'
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // useLocalSearchParams can return string | string[], so we normalize it
  const projectId = Array.isArray(id) ? id[0] : id;

  // Find the matching project from our data file
  const project = projects.find(p => p.id === projectId);

  // Controls whether the video demo modal is open
  const [visible, setVisible] = useState(false);

  // If somehow the id doesn't match anything, show a fallback
  if (!project) {
    return (
      <View style={styles.center}>
        <Text>Project not found.</Text>
      </View>
    );
  }

  // Opens the project's GitHub link in the device browser
  const openGithub = () => {
    if (project?.github) {
      Linking.openURL(project.github);
    }
  };

  return (
    <View style={{ flex: 1 }}>

      {/* BACK BUTTON — floats above everything using absolute + zIndex */}
      <Pressable onPress={() => router.push('/projects')} style={styles.backButton}>
        <Text style={styles.backArrow}>‹</Text>
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <ScrollView style={styles.container}>

        {/* ===== HERO IMAGE ===== */}
        {/* Full-bleed image at the top with a gradient fading into the card below */}
        <View style={styles.hero}>

          <Image
            source={projectImages[project.image] ?? require('../../assets/images/portfolio-placeholder.jpg')}
            style={styles.heroImage}
          />

          {/* Dark gradient overlay so the white title text stays readable */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.65)']}
            style={styles.gradient}
          />

          {/* Project tag and title sit at the bottom of the hero image */}
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTag}>
              UI/UX DESIGN • {project.year}
            </Text>
            <Text style={styles.heroTitle}>{project.title}</Text>
          </View>
        </View>

        {/* ===== CONTENT CARD ===== */}
        {/* Slides up over the hero with negative marginTop for that layered look */}
        <View style={styles.card}>

          {/* Role + Type shown side by side */}
          <View style={styles.metaRow}>
            <Meta label="Role" value={project.role} />
            <Meta label="Type" value={project.type} />
          </View>

          {/* ABOUT */}
          <Section title="About the Project">
            <Text style={styles.body}>{project.description}</Text>
          </Section>

          {/* FEATURES — rendered as a bullet list */}
          <Section title="Key Features">
            {project.features.map(feature => (
              <View key={feature} style={styles.featureRow}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </Section>

          {/* GALLERY — horizontal scroll of project screenshots */}
          <Section title="Project Gallery">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {project.gallery?.map((img, index) => (
                <View key={index} style={styles.galleryCard}>

                  <Image
                    source={galleryImages[img]} // img is a key like 'vitalis-1', not a raw path
                    style={styles.galleryImage}
                  />

                  {/* Frosted glass strip at the bottom of each gallery card */}
                  <BlurView
                    intensity={8}
                    tint="extraLight"
                    style={styles.galleryGlass}
                  />

                </View>
              ))}
            </ScrollView>
          </Section>

          {/* ACTION BUTTONS */}
          <View style={styles.buttonRow}>

            {/* Opens the video demo in a fullscreen modal */}
            <Pressable
              style={styles.primaryButton}
              onPress={() => setVisible(true)}
            >
              <Text style={styles.primaryButtonText}>Live Demo</Text>
            </Pressable>

            {/* Opens GitHub in the browser */}
            <Pressable
              style={styles.secondaryButton}
              onPress={openGithub}
            >
              <Text style={styles.secondaryButtonText}>View Code</Text>
            </Pressable>

          </View>

          {/* ===== VIDEO DEMO MODAL ===== */}
          {/* Full screen black overlay with a video player and a close button */}
          <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
          >
            <View style={styles.modalContainer}>

              <Video
                source={
                  projectVideos[project.video] ??
                  require('../../assets/videos/movie-demo.mp4') // fallback if video key is missing
                }
                style={styles.video}
                useNativeControls
                resizeMode="contain"
                shouldPlay // auto-plays when the modal opens
              />

              <Pressable
                style={styles.closeButton}
                onPress={() => setVisible(false)}
              >
                <Text style={{ color: 'white', fontSize: 16 }}>Close</Text>
              </Pressable>

            </View>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
}

// ===== REUSABLE SUB-COMPONENTS =====

// Small label + value pair used in the meta row (Role, Type)
function Meta({ label, value }) {
  return (
    <View style={styles.meta}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

// Generic section wrapper with a bold title above whatever children you pass in
function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}


// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f7', // Apple system background
  },

  // Full-bleed image container at the top of the screen
  hero: {
    height: 360,
    position: 'relative',
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  // Text sits at the bottom-left of the hero image
  heroOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },

  heroTag: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 6,
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.95)',
  },

  // Gradient covers the bottom half of the hero so text stays legible
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
  },

  // White card that slides up over the hero with rounded corners
  card: {
    marginTop: -24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 40,
    marginBottom: 24,
    padding: 24,
    backgroundColor: '#fff',
  },

  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },

  meta: {
    flex: 1,
  },

  metaLabel: {
    fontSize: 12,
    opacity: 0.6,
  },

  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },

  section: {
    marginTop: 28,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  body: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.85,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  // Blue dot acting as a bullet point
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 12,
    backgroundColor: '#007aff',
  },

  featureText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },

  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Fallback screen if the project ID doesn't match anything
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Full-screen black backdrop for the video modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },

  video: {
    width: '100%',
    height: 300,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },

  // Solid blue — primary CTA
  primaryButton: {
    flex: 1,
    backgroundColor: '#007aff',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
  },

  // Outlined blue — secondary CTA
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#007aff',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#007aff',
    fontWeight: '600',
  },

  // Semi-transparent pill inside the modal to close the video
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  // Floating back button — sits above the hero image
  backButton: {
    position: 'absolute',
    top: 52, // pushed down to clear the status bar
    left: 16,
    zIndex: 10, // needs to sit on top of the hero image
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  backArrow: {
    color: '#000',
    fontSize: 22,
    lineHeight: 24,
    marginRight: 2,
  },

  backText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },

  galleryWrapper: {
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },

  // Fake inner shadow at the top edge of each gallery card
  galleryInnerShadowTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  // Fake inner shadow at the bottom edge of each gallery card
  galleryInnerShadowBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  // Each card in the horizontal gallery scroll
  galleryCard: {
    width: 180,
    height: 320,
    borderRadius: 20,
    overflow: 'hidden', // clips the image and blur to the rounded corners
    marginRight: 14,
    backgroundColor: '#f0f0f0', // placeholder color while image loads
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  // Blur strip anchored to the bottom of each gallery card
  galleryGlass: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },

  galleryLabel: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
});