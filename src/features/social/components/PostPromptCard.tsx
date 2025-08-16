import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Edit3, Camera, Mic, Sparkles } from 'lucide-react-native';
import { LuxuryTheme } from '../../../design/luxuryTheme';
import { useStore } from '../../../state/rootStore';

const PROMPTS = [
  "What's your biggest insight today? 💡",
  "What challenged you most today? 🎯",
  "Drop a photo from your habit grind 📸",
  "Share a win from today 🏆",
  "What are you grateful for? 🙏",
  "How did you push your limits? 💪",
  "What's keeping you motivated? 🔥",
  "Share your morning routine ☀️",
];

interface PostPromptCardProps {
  onOpenComposer: (type: 'status' | 'photo' | 'audio') => void;
}

export const PostPromptCard: React.FC<PostPromptCardProps> = ({ onOpenComposer }) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const glowAnim = useSharedValue(0);
  const borderAnim = useSharedValue(0);
  const feedView = useStore(s => s.feedView);

  // Rotate prompts every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % PROMPTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Glow animation
  useEffect(() => {
    glowAnim.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Focus animation
  useEffect(() => {
    borderAnim.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused]);

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glowAnim.value, [0, 1], [0.2, 0.4]),
    shadowRadius: interpolate(glowAnim.value, [0, 1], [12, 20]),
  }));

  const borderStyle = useAnimatedStyle(() => ({
    borderWidth: 1,
    borderColor: interpolate(
      borderAnim.value,
      [0, 1],
      ['rgba(255,255,255,0.1)', 'rgba(231,180,58,0.3)']
    ),
  }));

  return (
    <Animated.View 
      style={[styles.container, glowStyle, { shadowColor: LuxuryTheme.colors.primary.gold }]}
      entering={FadeIn.duration(500)}
    >
      <BlurView intensity={25} tint="dark" style={styles.card}>
        <LinearGradient
          colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)']}
          style={StyleSheet.absoluteFillObject}
        />
        
        <Animated.View style={[styles.cardInner, borderStyle]}>
          {/* Sparkles icon */}
          <View style={styles.sparklesContainer}>
            <Sparkles size={20} color={LuxuryTheme.colors.primary.gold} />
          </View>
          
          {/* Input area */}
          <Pressable 
            style={styles.inputContainer}
            onPress={() => onOpenComposer('status')}
          >
            <Animated.Text 
              key={currentPromptIndex}
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(300)}
              style={styles.promptText}
            >
              {PROMPTS[currentPromptIndex]}
            </Animated.Text>
          </Pressable>
          
          {/* Quick actions */}
          <View style={styles.actionsRow}>
            <Pressable 
              style={styles.actionButton}
              onPress={() => onOpenComposer('status')}
            >
              <View style={styles.actionIcon}>
                <Edit3 size={18} color="rgba(255,255,255,0.8)" />
              </View>
              <Text style={styles.actionLabel}>Text</Text>
            </Pressable>
            
            <View style={styles.actionDivider} />
            
            <Pressable 
              style={styles.actionButton}
              onPress={() => onOpenComposer('photo')}
            >
              <View style={styles.actionIcon}>
                <Camera size={18} color="rgba(255,255,255,0.8)" />
              </View>
              <Text style={styles.actionLabel}>Photo</Text>
            </Pressable>
            
            <View style={styles.actionDivider} />
            
            <Pressable 
              style={styles.actionButton}
              onPress={() => onOpenComposer('audio')}
            >
              <View style={styles.actionIcon}>
                <Mic size={18} color="rgba(255,255,255,0.8)" />
              </View>
              <Text style={styles.actionLabel}>Audio</Text>
            </Pressable>
          </View>
        </Animated.View>
      </BlurView>
      
      {/* Neon border glow */}
      <LinearGradient
        colors={['rgba(231,180,58,0.2)', 'rgba(231,180,58,0.05)', 'transparent']}
        style={styles.neonBorder}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardInner: {
    padding: 16,
    borderRadius: 20,
  },
  sparklesContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(231,180,58,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    minHeight: 60,
    justifyContent: 'center',
    marginBottom: 16,
    paddingRight: 48, // Space for sparkles icon
  },
  promptText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  actionDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  neonBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 22,
    pointerEvents: 'none',
  },
});