import { Video } from 'expo-av';
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
import { projects } from '../data/projects';

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

export default function ProjectDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const projectId = Array.isArray(id) ? id[0] : id;
  const project = projects.find(p => p.id === projectId);

  const [visible, setVisible] = useState(false);

  if (!project) {
    return (
      <View style={styles.center}>
        <Text>Project not found.</Text>
      </View>
    );
  }

  const openGithub = () => {
    if (project?.github) {
      Linking.openURL(project.github);
    }
  };

  return (
    <View style={{ flex: 1 }}>

      {/* BACK BUTTON */}
        <Pressable onPress={() => router.push('/projects')} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

      <ScrollView style={styles.container}>

      {/* HERO / HEADER */}
      <View style={styles.hero}>

      <Image
        source={projectImages[project.image] ?? require('../../assets/images/portfolio-placeholder.jpg')}
        style={styles.heroImage}
      />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.65)']}
        style={styles.gradient}
      />

        <View style={styles.heroOverlay}>
          <Text style={styles.heroTag}>
            UI/UX DESIGN • {project.year}
          </Text>
          <Text style={styles.heroTitle}>{project.title}</Text>
        </View>
      </View>

      {/* CONTENT CARD */}
      <View style={styles.card}>

        {/* META INFO */}
        <View style={styles.metaRow}>
          <Meta label="Role" value={project.role} />
          <Meta label="Type" value={project.type} />
        </View>

        {/* ABOUT */}
        <Section title="About the Project">
          <Text style={styles.body}>{project.description}</Text>
        </Section>

        {/* FEATURES */}
        <Section title="Key Features">
          {project.features.map(feature => (
            <View key={feature} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </Section>

        {/* GALLERY */}
        <Section title="Project Gallery">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {project.gallery?.map((img, index) => (
    <View key={index} style={styles.galleryWrapper}>
    <Image
      source={img}
      style={styles.galleryImage}
    />
    {/* Inner shadow overlay */}
    <View style={styles.galleryInnerShadowTop} />
    <View style={styles.galleryInnerShadowBottom} />
  </View>
))}
          </ScrollView>
        </Section>
        <View style={styles.buttonRow}>

  {/* Live Demo Button */}
  <Pressable
    style={styles.primaryButton}
    onPress={() => setVisible(true)}
  >
    <Text style={styles.primaryButtonText}>Live Demo</Text>
  </Pressable>

  {/* View Code Button */}
  <Pressable
    style={styles.secondaryButton}
    onPress={openGithub}
  >
    <Text style={styles.secondaryButtonText}>View Code</Text>
  </Pressable>

</View>


        <Modal
          visible={visible}
          animationType="fade"
          transparent={true}
        >
    <View style={styles.modalContainer}>
    
    <Video
      source={
        projectVideos[project.video] ??
        require('../../assets/videos/movie-demo.mp4')
      }
      style={styles.video}
      useNativeControls
      resizeMode="contain"
      shouldPlay
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

function Meta({ label, value }) {
  return (
    <View style={styles.meta}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}
  

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f7', // Apple system background
  },

  hero: {
    height: 360,
    position: 'relative',
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

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

  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
  },

  card: {
    marginTop: -24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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
    width: 160,
    height: 300,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backButton: {
    position: 'absolute',
    top: 52,         // accounts for status bar
    left: 16,
    zIndex: 10,
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
});