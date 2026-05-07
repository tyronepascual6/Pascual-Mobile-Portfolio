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
// Update this whenever your info changes
const PORTFOLIO_CONTEXT = `
You are Tyrone Pascual's friendly wife/assistant. Your name is "Tyrone's Wife."
Keep all answers SHORT (2-4 sentences max) and conversational.
No bullet lists unless the user specifically asks.
Only answer questions about Tyrone. If asked something unrelated, say: "I only know about Tyrone and his work!"

TYRONE'S INFO:
- Full Name: Tyrone Pascual
- Role: IT Graduate / Developer
- School: Universidad de Manila — BS Information Technology (2022–Present)
- Results-driven IT graduate with hands-on experience in full-stack web development, mobile app development, and IT leadership.
- Built and deployed production-ready apps using Flask, React Native, Firebase, and SQLite.
- Experienced in team leadership through an OJT role managing and evaluating multiple IT interns.

SKILLS:
Core: HTML, CSS, JavaScript, React Native, Python (Flask), Tailwind CSS, Responsive UI Design, Data Visualization, VENV Virtualization, Object-Oriented Programming
Tools: Microsoft Office, Google Workspace, PostgreSQL Supabase, MySQLite, Visual Studio Code, Claude AI (Anthropic), Stitch (Google)
Technical: Cisco Basic Networking, Computer Troubleshooting, Documentation, International Publication

PROJECTS:
1. Movie App (2025) — React Native app using REST API. github.com/tyronepascual6/Movie-App-Pascual
2. Personal Portfolio App (2026) — React Native with glassmorphism UI + Firebase. github.com/tyronepascual6/Pascual-Mobile-Portfolio
3. Vitalis AI Health Assistant (2025) — Capstone. NLP chatbot for symptom analysis, Firebase + Firestore. github.com/tyronepascual6/vitalis-chatbot

ACHIEVEMENTS:
Academic: Senior High Graduate with High Honors (2022), Junior High Graduate with Honors (2020), Best in TLE ICT Section 1 (2020)
Competitions: 3rd Place Collaborative Desktop Publishing — Division Level (2019), 4th Place Tarpaulin Making Contest — Division Level (2019)
Experience: Piso WiFi Business Startup, GCash Business, Siomai Business, Gym System Deployment (client work), Trained BPO Student, Capstone Leader, OJT Team Leader
Publication: Corresponding Author in Capstone Study published on Google Scholar

EDUCATION:
- BS Information Technology — Universidad de Manila (2022–Present)
- ICT TVL Senior High School — Universidad de Manila (2020–2022)
- Junior High School — Pres. Corazon C. Aquino High School (2016–2020)

PERSONAL:
Languages: English, Filipino
Interests: Gym, Singing, Travelling, Reading, Brainstorming, Studying, Business, Web & Mobile Development, Video Games

Tone: Friendly, brief, confident. Like a helpful friend who knows Tyrone well.
`;

// ===== GROQ API CALL =====
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant'; // 14,400 free requests/day

const fetchGroqReply = async (conversationHistory: Message[]): Promise<string> => {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.EXPO_PUBLIC_GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: 300,
      temperature: 0.7,
      messages: [
        // System prompt first
        { role: 'system', content: PORTFOLIO_CONTEXT },
        // Then full conversation history (skip the initial bot greeting at index 0)
        ...conversationHistory.slice(1).map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
      ],
    }),
  });

  const data = await response.json();

  // Surface any API errors clearly
  if (data?.error) {
    console.error('Groq API Error:', data.error);
    throw new Error(data.error.message ?? 'Unknown API error');
  }

  const raw = data?.choices?.[0]?.message?.content ?? '';

  // Strip markdown formatting since this is a mobile chat UI
  return raw
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/`/g, '')
    .trim();
};

// ===== CHAT SCREEN =====
export default function ChatScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: "Hi! I'm Tyrone's wife and assistant. Ask me anything about his skills, projects, or background! 👋",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    const newMessages: Message[] = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await fetchGroqReply(newMessages);
      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    } catch (e: any) {
      console.error('sendMessage error:', e);
      const errMsg = e?.message ?? 'Something went wrong.';
      setError(errMsg);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Sorry, something went wrong. Please try again.' },
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
        <View style={styles.onlineDot} />
      </View>

      {/* ERROR BANNER */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* MESSAGES */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.bubbleWrapper,
              msg.role === 'user' ? styles.bubbleRight : styles.bubbleLeft,
            ]}
          >
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

        {/* Typing indicator */}
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
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          multiline
        />
        <Pressable
          style={[
            styles.sendBtn,
            (!input.trim() || loading) && styles.sendBtnDisabled,
          ]}
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
  headerInfo: { flex: 1 },
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
  errorBanner: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#fecaca',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
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
  bubbleLeft: { justifyContent: 'flex-start' },
  bubbleRight: { justifyContent: 'flex-end' },
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
  userText: { color: '#fff' },
  botText: { color: '#111827' },
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
  sendBtnDisabled: { backgroundColor: '#d1d5db' },
});