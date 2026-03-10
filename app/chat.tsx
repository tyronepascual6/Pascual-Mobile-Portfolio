// ===== IMPORTS =====
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// ===== TYPES =====
type Message = {
  role: 'user' | 'bot';
  text: string;
};

// ===== PORTFOLIO CONTEXT =====
// This is the info Gemini uses to answer questions about you.
// Update this whenever your info changes.
const PORTFOLIO_CONTEXT = `
You are a portfolio assistant for Tyrone Pascual, an IT student and developer.
Only answer questions related to Tyrone and his portfolio. If the question is unrelated, politely say you can only answer questions about Tyrone.

Here is Tyrone's information:

Name: Tyrone Pascual
Role: IT Student / Developer
School: Universidad de Manila — Bachelor of Science in Information Technology (2022 - Present)

About:
IT student from Universidad de Manila focused on web and mobile development, with hands-on experience in HTML, CSS, JavaScript, and React Native. Values clean design, usability, and continuous learning.

Skills:
- Core: HTML, CSS, JavaScript, React Native, Responsive UI Design, Data Visualization, OOP
- Tools: Microsoft Office, Google Workspace
- Technical: Cisco Basic Networking, Computer Troubleshooting, Documentation

Education:
- BS Information Technology — Universidad de Manila (2022 - Present)
- ICT TVL Senior High School — Universidad de Manila (2020 - 2022)
- Junior High School — Pres. Corazon C. Aquino High School (2016 - 2020)

Achievements:
- Senior High School Graduate with High Honors (2022)
- Junior High School Graduate with Honors (2020)
- Best in TLE ICT Section 1 (2020)
- 3rd Place Collaborative Desktop Publishing Division Level (2019)
- 4th Place Tarpaulin Making Contest Division Level (2019)
- Piso WiFi Business Startup
- Capstone Leader
- Corresponding Author in Publication of Capstone Study on Google Scholar

Projects:
1. Movie Mobile App (2025) — React Native front-end app using REST API for movie data. GitHub: https://github.com/tyronepascual6/Movie-App-Pascual
2. Personal Portfolio App (2026) — React Native portfolio app with glassmorphism UI and Firebase auth. GitHub: https://github.com/tyronepascual6/Pascual-Mobile-Portfolio
3. Vitalis - AI Health Assistant (2025) — Capstone project. AI chatbot using NLP for symptom analysis, Firebase auth, Firestore. GitHub: https://github.com/tyronepascual6/vitalis-chatbot

Languages: English, Filipino
Interests: Gym, Study, Business, Web & Mobile Development, Video Games
`;

// ===== CHAT SCREEN =====
export default function ChatScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: "Hi! I'm Tyrone's portfolio assistant. Ask me anything about his skills, projects, or background! 👋",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Call OpenRouter API
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENROUTER_KEY}`,
          },
          body: JSON.stringify({
            model: 'stepfun/step-3.5-flash:free',
            messages: [
              { role: 'system', content: PORTFOLIO_CONTEXT },
              ...newMessages.map((m) => ({
                role: m.role === 'user' ? 'user' : 'assistant',
                content: m.text,
              })),
            ],
          }),
        }
      );

            const data = await response.json();
        console.log('OpenRouter response:', JSON.stringify(data));
        const reply = (data?.choices?.[0]?.message?.content ?? "Sorry, I couldn't get a response. Try again!")
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6} /g, '')
  . replace(/`/g, '');
        
      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#000" />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Tyrone's Wife</Text>
          <Text style={styles.headerSub}>Cuz I know him better than anyone else!</Text>
        </View>
        {/* Online indicator dot */}
        <View style={styles.onlineDot} />
      </View>

      {/* MESSAGES */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.bubbleWrapper,
              msg.role === 'user' ? styles.bubbleRight : styles.bubbleLeft,
            ]}
          >
            {/* Bot avatar dot */}
            {msg.role === 'bot' && <View style={styles.botDot} />}

            <View
              style={[
                styles.bubble,
                msg.role === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  msg.role === 'user' ? styles.userText : styles.botText,
                ]}
              >
                {msg.text}
              </Text>
            </View>
          </View>
        ))}

        {/* Typing indicator while waiting for Gemini */}
        {loading && (
          <View style={[styles.bubbleWrapper, styles.bubbleLeft]}>
            <View style={styles.botDot} />
            <View style={[styles.bubble, styles.botBubble, styles.typingBubble]}>
              <ActivityIndicator size="small" color="#6b7280" />
            </View>
          </View>
        )}
      </ScrollView>

      {/* INPUT BAR */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Ask about Tyrone..."
          placeholderTextColor="#9ca3af"
          value={input}
          onChangeText={(text) => setInput(text.replace(/[^a-zA-Z0-9 ]/g, ''))}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          multiline
        />
        <Pressable
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  headerSub: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 1,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
  },
  messagesContainer: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  bubbleLeft: {
    justifyContent: 'flex-start',
  },
  bubbleRight: {
    justifyContent: 'flex-end',
  },
  botDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4f46e5',
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#000',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  typingBubble: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#111827',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#d1d5db',
  },
});