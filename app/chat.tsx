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
You are Tyrone Pascual's friendly portfolio assistant. Your name is "Ty's Assistant."
Keep all answers SHORT (2-4 sentences max) and conversational — no bullet lists unless the user specifically asks.
Only answer questions about Tyrone. If asked something unrelated, say: "I only know about Tyrone and his work!"

TYRONE'S INFO:
- Full Name: Tyrone Pascual
- Role: IT Student & Developer
- School: Universidad de Manila — BS Information Technology (2022–Present)
- He's currently in his final years and led a capstone project published on Google Scholar.

SKILLS: HTML, CSS, JavaScript, React Native, Responsive UI, Data Visualization, OOP, Cisco Basic Networking, Computer Troubleshooting, Microsoft Office, Google Workspace

PROJECTS:
1. Movie App (2025) — React Native app using REST API. github.com/tyronepascual6/Movie-App-Pascual
2. Personal Portfolio App (2026) — React Native with glassmorphism UI + Firebase. github.com/tyronepascual6/Pascual-Mobile-Portfolio
3. Vitalis AI Health Assistant (2025) — Capstone. NLP chatbot for symptom analysis, Firebase + Firestore. github.com/tyronepascual6/vitalis-chatbot

ACHIEVEMENTS:
- Senior High Graduate with High Honors (2022)
- Junior High Graduate with Honors (2020)
- Best in TLE ICT Section 1 (2020)
- 3rd Place Collaborative Desktop Publishing — Division Level (2019)
- Published Capstone study as Corresponding Author on Google Scholar
- Led a Piso WiFi business startup

EDUCATION:
- BS IT — Universidad de Manila (2022–Present)
- ICT TVL Senior High — Universidad de Manila (2020–2022)
- Junior High — Pres. Corazon C. Aquino High School (2016–2020)

PERSONAL: Speaks English and Filipino. Interests include gym, studying, business, and video games.

Tone: Friendly, brief, and confident. Speak like a helpful friend who knows Tyrone well.
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
      const history = newMessages.slice(1).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));
  
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.EXPO_PUBLIC_GEMINI_KEY_1}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: PORTFOLIO_CONTEXT }],
            },
            contents: history,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 512,
            },
          }),
        }
      );
  
      const data = await response.json();
      console.log('GEMINI RESPONSE:', JSON.stringify(data, null, 2));
  
      // If Gemini returns an error, show it clearly
      if (data?.error) {
        console.log('API ERROR:', data.error.message);
        setMessages((prev) => [...prev, { role: 'bot', text: `API Error: ${data.error.message}` }]);
        return;
      }
  
      const reply = (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "Sorry, I couldn't get a response. Try again!"
      )
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/#{1,6} /g, '')
        .replace(/`/g, '');
  
      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    } catch (e) {
      console.log('FULL ERROR:', e);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: `Error: ${e}` },
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
            {/* Bot avatar dot green */}
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
          onChangeText={setInput}
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