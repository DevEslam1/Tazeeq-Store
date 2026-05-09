import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { useDispatch, useSelector } from 'react-redux';
import { 
  sendMessage, 
  addUserMessage, 
  selectChatMessages, 
  selectAiLoading, 
  selectAiError 
} from '../../store/slices/aiSlice';
import { AppDispatch } from '../../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRTL } from '../../hooks/useRTL';
import { BlurView } from 'expo-blur';

export function AiAssistantScreen() {
  const { theme, mode } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  
  const messages = useSelector(selectChatMessages);
  const isLoading = useSelector(selectAiLoading);
  const error = useSelector(selectAiError);
  
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Initial greeting if empty
    if (messages.length === 0) {
      // We could dispatch an initial message here if we want it persisted
    }
  }, []);

  const handleSend = () => {
    if (inputText.trim() === '' || isLoading) return;
    
    const message = inputText.trim();
    setInputText('');
    Keyboard.dismiss();
    
    dispatch(addUserMessage(message));
    dispatch(sendMessage(message));
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const suggestions = [
    t('ai.suggest_1'),
    t('ai.suggest_2'),
    t('ai.suggest_3'),
    t('ai.suggest_4'),
    t('ai.suggest_5'),
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header - Fixed at the top */}
      <BlurView intensity={80} tint={mode} style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={[styles.headerContent, { flexDirection: flexRow }]}>
          <View style={[styles.aiBadge, { backgroundColor: theme.colors.primary }]}>
            <MaterialCommunityIcons name="robot" size={24} color="white" />
          </View>
          <View style={styles.headerText}>
            <Text style={[theme.typography.h2, { color: theme.colors.onSurface }]}>
              {t('ai.assistant_name') || 'مساعد طازج الذكي'}
            </Text>
            <Text style={[theme.typography.label, { color: theme.colors.primary }]}>
              {isLoading ? (t('ai.typing') || 'يكتب الآن...') : (t('ai.online') || 'متصل')}
            </Text>
          </View>
        </View>
      </BlurView>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.scrollContent, 
            { 
              paddingTop: insets.top + 80,
              paddingBottom: 40 // Extra space so last message isn't tight against input
            }
          ]}
          onContentSizeChange={scrollToBottom}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <View style={styles.welcomeContainer}>
              <MaterialCommunityIcons name="chat-processing-outline" size={64} color={theme.colors.primary} style={{ opacity: 0.5 }} />
              <Text style={[theme.typography.h1, { textAlign: 'center', marginTop: 16, color: theme.colors.onSurface }]}>
                {t('ai.welcome_title') || 'كيف يمكنني مساعدتك اليوم؟'}
              </Text>
              <Text style={[theme.typography.bodyMain, { textAlign: 'center', color: theme.colors.onSurfaceVariant, marginTop: 8, paddingHorizontal: 40 }]}>
                {t('ai.welcome_subtitle') || 'أنا هنا لمساعدتك في العثور على المنتجات واقتراح الوصفات الصحية.'}
              </Text>
              
              <View style={styles.suggestions}>
                {suggestions.map((s, i) => (
                  <TouchableOpacity 
                    key={i} 
                    onPress={() => {
                      if (isLoading) return;
                      dispatch(addUserMessage(s));
                      dispatch(sendMessage(s));
                    }}
                    style={[styles.suggestionItem, { backgroundColor: theme.colors.surfaceContainerHigh }]}
                  >
                    <Text style={[theme.typography.bodySecondary, { color: theme.colors.primary }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {messages.map((msg, index) => (
            <View 
              key={index} 
              style={[
                styles.messageWrapper, 
                { alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }
              ]}
            >
              <GlassCard 
                style={[
                  styles.messageCard,
                  msg.role === 'user' 
                    ? { backgroundColor: theme.colors.primary, borderBottomRightRadius: 4 } 
                    : { backgroundColor: theme.colors.surfaceContainerLow, borderBottomLeftRadius: 4 }
                ]}
                intensity={mode === 'dark' ? 20 : 10}
              >
                <Text 
                  style={[
                    theme.typography.bodyMain, 
                    { color: msg.role === 'user' ? 'white' : theme.colors.onSurface }
                  ]}
                >
                  {msg.content}
                </Text>
              </GlassCard>
              <Text style={[theme.typography.label, { marginTop: 4, color: theme.colors.onSurfaceVariant, fontSize: 10, alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }]}>
                {msg.role === 'user' ? 'أنت' : 'مساعد طازج'}
              </Text>
            </View>
          ))}

          {isLoading && (
            <View style={[styles.messageWrapper, { alignSelf: 'flex-start' }]}>
              <GlassCard style={styles.loadingCard} intensity={10}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </GlassCard>
            </View>
          )}

          {error && (
            <Text style={[theme.typography.label, { color: theme.colors.error, textAlign: 'center', marginVertical: 10 }]}>
              {error}
            </Text>
          )}
        </ScrollView>

        {/* Input Area - Adjusted for Floating Tab Bar */}
        <BlurView intensity={100} tint={mode} style={[styles.inputArea, { paddingBottom: insets.bottom + 110 }]}>
          <View style={[styles.inputRow, { flexDirection: flexRow }]}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder={t('ai.placeholder') || 'اكتب سؤالك هنا...'}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.colors.surfaceContainerHighest,
                  color: theme.colors.onSurface,
                  textAlign: isRTL ? 'right' : 'left'
                }
              ]}
              multiline
            />
            <TouchableOpacity 
              onPress={handleSend}
              disabled={inputText.trim() === '' || isLoading}
              style={[
                styles.sendButton, 
                { 
                  backgroundColor: inputText.trim() === '' ? theme.colors.surfaceContainerHigh : theme.colors.primary,
                  opacity: isLoading ? 0.6 : 1
                }
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <MaterialCommunityIcons 
                  name={isRTL ? "send" : "send"} 
                  size={24} 
                  color="white" 
                  style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
                />
              )}
            </TouchableOpacity>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    zIndex: 100,
  },
  headerContent: {
    alignItems: 'center',
    gap: 12,
  },
  aiBadge: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerText: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  suggestions: {
    marginTop: 32,
    width: '100%',
    gap: 12,
  },
  suggestionItem: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  messageWrapper: {
    marginBottom: 20,
    maxWidth: '85%',
  },
  messageCard: {
    padding: 16,
    borderRadius: 20,
  },
  loadingCard: {
    padding: 12,
    borderRadius: 20,
    width: 60,
    alignItems: 'center',
  },
  inputArea: {
    padding: 15,
    borderTopWidth: 0, // Removed border for a cleaner glass look
  },
  inputRow: {
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 120,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    fontFamily: 'Cairo_400Regular',
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
});
