export const projects = [
    {
      id: 'movieapp',
      title: 'Movie Mobile App',
      shortDescription: 'A modern front-end centric React Native mobile movie app',
      image: 'movie-placeholder',
      role: 'Developer',
      year: '2025',
      type: 'Mobile App',
      tech: ['React Native', 'Expo Router', 'JavaScript', 'REST API'],
      github: 'https://github.com/tyronepascual6/Movie-App-Pascual',
      video: 'movie-demo',
      gallery: [
        'movie-1'
      ],
      description:
        'My first React Native based app utilizing API for movies data and images. Unfortunately, It cannot play a movie and just a UI but it was decent for a first project',
      features: [
        'Dark mode with modern, sleek UI design',
        'Movie cards with high-quality images and rounded corners',
        'Smooth, interactive search bar with live search results',
        'Horizontal and vertical scrolling of movie lists',
        'Responsive layout suitable for different screen sizes',
        'Reusable card components for movies',
        'Clean typography and consistent spacing for readability',
        'Animated touch feedback on movie cards and buttons',
      ],
    },
    {
        id: 'portfolio',
        title: 'Personal Portfolio App',
        shortDescription: 'A modern personal React Native portfolio app',
        image: 'portfolio-placeholder',
        role: 'Full - Stack Developer',
        year: '2026',
        type: 'Mobile App',
        tech: ['React Native', 'Expo Router', 'JavaScript'],
        github: 'https://github.com/tyronepascual6/Pascual-Mobile-Portfolio',
        video: 'portfolio-demo',
        gallery: [
          'portfolio-1',
          'portfolio-2',
          'portfolio-3',
          'portfolio-4',
          'portfolio-5',
          'portfolio-6'
        ],
        description:
          'A personal portfolio app designed to showcase my personal information and projects with clean UI and smooth navigation.',
        features: [
          'Glassmorphism UI',
          'Dynamic routing with Expo Router',
          'Reusable components',
        ],
      },
      {
        id: 'vitalis',
        title: 'AI-Driven Health Assistant and Symptom Analysis aka Vitalis (Capstone Project)',
        shortDescription: 'An AI-powered chatbot for virtual health assistance and symptom analysis',
        image: 'vitalis-placeholder',
        role: 'Developer',
        year: '2025',
        type: 'Mobile App',
        tech: [
          'React Native',
          'Expo Router',
          'JavaScript',
          'Firebase Authentication',
          'Firestore',
          'Natural Language Processing (NLP)',
          'REST API'
        ],
        github: 'https://github.com/tyronepascual6/vitalis-chatbot',
        video: 'vitalis-demo',
        gallery: [
          'vitalis-1',
          'vitalis-2',
          'vitalis-3',
          'vitalis-4'
        ],
        description:
          'Vitalis is an AI-driven virtual health assistant designed to provide preliminary symptom analysis and health guidance for common illnesses. It uses Natural Language Processing (NLP) to understand user-input symptoms and provides evidence-based health suggestions while encouraging professional medical consultation when necessary. The system is created for our capstone project.',
        features: [
          'AI-powered chatbot for real-time symptom analysis',
          'Natural Language Processing (NLP) for understanding user input',
          'Preliminary health guidance for common illnesses',
          'Emergency guidance recommendations for serious symptoms',
          'User authentication with Firebase (Email & Google login)',
          'Chat history storage using Firestore',
          'Customizable user profile with avatar selection',
          'Onboarding screens explaining app features and limitations',
          'Terms of Service and Privacy Policy integration',
          'User-friendly and accessible mobile interface',
          'Data privacy-focused design (no medical diagnosis, no prescription)',
        ],
      },
  ];
  