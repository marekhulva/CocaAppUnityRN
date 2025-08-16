import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  TextInput, 
  ScrollView,
  Dimensions,
  Platform,
  Image,
  Alert
} from 'react-native';
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
  withSpring,
} from 'react-native-reanimated';
import { 
  Type, 
  Camera, 
  Mic, 
  Send, 
  Circle,
  Square,
  Trash2,
  Check,
  Settings
} from 'lucide-react-native';
import { LuxuryTheme } from '../../../design/luxuryTheme';
import { useStore } from '../../../state/rootStore';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

type PostMode = 'text' | 'photo' | 'audio';

interface PostPromptCardProps {
  onOpenComposer: (type: 'status' | 'photo' | 'audio') => void;
}

// PromptStrip component with horizontal scrolling and dots
const PromptStrip: React.FC<{ 
  prompts: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}> = ({ prompts, currentIndex, onIndexChange }) => {
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useSharedValue(1);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % prompts.length;
      
      // Animate fade
      fadeAnim.value = withSequence(
        withTiming(0, { duration: 125 }),
        withTiming(1, { duration: 125 })
      );
      
      setTimeout(() => {
        onIndexChange(nextIndex);
        scrollRef.current?.scrollTo({ 
          x: nextIndex * (SCREEN_WIDTH - 64), 
          animated: true 
        });
      }, 125);
    }, 6000);
    
    return () => clearInterval(timer);
  }, [currentIndex, prompts.length]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  return (
    <View style={promptStyles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 64));
          onIndexChange(newIndex);
        }}
      >
        {prompts.map((prompt, index) => (
          <Animated.View 
            key={index} 
            style={[promptStyles.promptItem, animatedStyle]}
          >
            <Text style={promptStyles.promptText}>{prompt}</Text>
          </Animated.View>
        ))}
      </ScrollView>
      
      <LinearGradient
        colors={['rgba(231,180,58,0.3)', 'rgba(231,180,58,0.1)', 'transparent']}
        style={promptStyles.accentLine}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      
      <View style={promptStyles.indicators}>
        {prompts.map((_, index) => (
          <View
            key={index}
            style={[
              promptStyles.dot,
              index === currentIndex && promptStyles.dotActive
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// TextInputCompact component
const TextInputCompact: React.FC<{
  value: string;
  onChange: (text: string) => void;
}> = ({ value, onChange }) => {
  const [height, setHeight] = useState(40);
  
  return (
    <View style={textInputStyles.container}>
      <TextInput
        style={[textInputStyles.input, { height: Math.min(height, 80) }]}
        placeholder="Type your response..."
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value}
        onChangeText={onChange}
        multiline
        numberOfLines={3}
        onContentSizeChange={(e) => {
          setHeight(Math.max(40, e.nativeEvent.contentSize.height));
        }}
      />
    </View>
  );
};

// PhotoAttachRow component
const PhotoAttachRow: React.FC<{
  photoUri: string | null;
  caption: string;
  onPhotoSelect: () => void;
  onCaptionChange: (text: string) => void;
}> = ({ photoUri, caption, onPhotoSelect, onCaptionChange }) => {
  return (
    <View style={photoStyles.container}>
      <Pressable style={photoStyles.photoArea} onPress={onPhotoSelect}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={photoStyles.thumbnail} />
        ) : (
          <View style={photoStyles.placeholder}>
            <Camera size={24} color="rgba(255,255,255,0.4)" />
            <Text style={photoStyles.placeholderText}>Tap to add photo</Text>
          </View>
        )}
      </Pressable>
      {photoUri && (
        <TextInput
          style={photoStyles.caption}
          placeholder="Add a caption..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={caption}
          onChangeText={onCaptionChange}
        />
      )}
    </View>
  );
};

// AudioRecorderRow component
const AudioRecorderRow: React.FC<{
  isRecording: boolean;
  duration: number;
  onRecord: () => void;
  onStop: () => void;
  onDelete: () => void;
  onAttach: () => void;
  hasRecording: boolean;
}> = ({ isRecording, duration, onRecord, onStop, onDelete, onAttach, hasRecording }) => {
  const pulseAnim = useSharedValue(1);
  
  useEffect(() => {
    if (isRecording) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1
      );
    } else {
      pulseAnim.value = withTiming(1);
    }
  }, [isRecording]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={audioStyles.container}>
      <Animated.View style={pulseStyle}>
        <Pressable
          style={[audioStyles.recordButton, isRecording && audioStyles.recordingActive]}
          onPress={isRecording ? onStop : onRecord}
        >
          {isRecording ? (
            <Square size={20} color="#FFF" fill="#FFF" />
          ) : (
            <Circle size={20} color="#FFF" fill="#FFF" />
          )}
        </Pressable>
      </Animated.View>
      
      <View style={audioStyles.waveform}>
        {[...Array(12)].map((_, i) => (
          <View 
            key={i} 
            style={[
              audioStyles.bar,
              { height: Math.random() * 20 + 10 }
            ]} 
          />
        ))}
      </View>
      
      <Text style={audioStyles.timer}>{formatTime(duration)}</Text>
      
      {hasRecording && !isRecording && (
        <>
          <Pressable style={audioStyles.iconButton} onPress={onDelete}>
            <Trash2 size={18} color="rgba(255,255,255,0.6)" />
          </Pressable>
          <Pressable style={audioStyles.iconButton} onPress={onAttach}>
            <Check size={18} color={LuxuryTheme.colors.primary.gold} />
          </Pressable>
        </>
      )}
    </View>
  );
};

// ModePills component
const ModePills: React.FC<{
  activeMode: PostMode;
  onModeChange: (mode: PostMode) => void;
}> = ({ activeMode, onModeChange }) => {
  const scaleAnims = {
    text: useSharedValue(activeMode === 'text' ? 1 : 1),
    photo: useSharedValue(activeMode === 'photo' ? 1 : 1),
    audio: useSharedValue(activeMode === 'audio' ? 1 : 1),
  };

  const handlePress = (mode: PostMode) => {
    scaleAnims[mode].value = withSequence(
      withSpring(0.98),
      withSpring(1)
    );
    onModeChange(mode);
  };

  return (
    <View style={pillStyles.container}>
      {(['text', 'photo', 'audio'] as PostMode[]).map((mode) => (
        <Animated.View
          key={mode}
          style={useAnimatedStyle(() => ({
            transform: [{ scale: scaleAnims[mode].value }],
          }))}
        >
          <Pressable
            style={[
              pillStyles.pill,
              activeMode === mode && pillStyles.pillActive
            ]}
            onPress={() => handlePress(mode)}
          >
            <Text style={[
              pillStyles.pillText,
              activeMode === mode && pillStyles.pillTextActive
            ]}>
              {mode === 'text' && '✍️ Text'}
              {mode === 'photo' && '📷 Photo'}
              {mode === 'audio' && '🎙️ Audio'}
            </Text>
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
};

// SendButton component
const SendButton: React.FC<{
  enabled: boolean;
  onPress: () => void;
}> = ({ enabled, onPress }) => {
  const scaleAnim = useSharedValue(1);
  
  const handlePress = () => {
    if (enabled) {
      scaleAnim.value = withSequence(
        withSpring(0.95),
        withSpring(1)
      );
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
    opacity: withTiming(enabled ? 1 : 0.3, { duration: 200 }),
  }));

  return (
    <Animated.View style={[sendStyles.container, animatedStyle]}>
      <Pressable
        style={[sendStyles.button, enabled && sendStyles.buttonEnabled]}
        onPress={handlePress}
        disabled={!enabled}
      >
        <Send size={18} color={enabled ? LuxuryTheme.colors.primary.gold : 'rgba(255,255,255,0.3)'} />
      </Pressable>
    </Animated.View>
  );
};

// Main PostPromptCard component
export const PostPromptCard: React.FC<PostPromptCardProps> = ({ onOpenComposer }) => {
  const [mode, setMode] = useState<PostMode>('text');
  const [promptIndex, setPromptIndex] = useState(0);
  const [textValue, setTextValue] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoCaption, setPhotoCaption] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const hasContent = 
    (mode === 'text' && textValue.trim().length > 0) ||
    (mode === 'photo' && photoUri !== null) ||
    (mode === 'audio' && hasRecording);

  const handlePhotoSelect = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleRecord = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Enable microphone to record audio');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const handleStopRecording = async () => {
    if (!recording) return;
    
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    setHasRecording(true);
    setRecording(null);
  };

  const handleSend = () => {
    if (hasContent) {
      // Pass data to existing composer/post handler
      if (mode === 'text') {
        onOpenComposer('status');
      } else if (mode === 'photo') {
        onOpenComposer('photo');
      } else {
        onOpenComposer('audio');
      }
      
      // Reset state
      setTextValue('');
      setPhotoUri(null);
      setPhotoCaption('');
      setHasRecording(false);
      setRecordingDuration(0);
    }
  };

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingDuration(d => d + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  return (
    <View style={styles.container}>
      <BlurView intensity={30} tint="dark" style={styles.card}>
        <LinearGradient
          colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
          style={StyleSheet.absoluteFillObject}
        />
        
        <View style={styles.cardInner}>
          {/* Prompt Layer */}
          <View style={styles.promptLayer}>
            <PromptStrip
              prompts={PROMPTS}
              currentIndex={promptIndex}
              onIndexChange={setPromptIndex}
            />
          </View>
          
          {/* Separator */}
          <View style={styles.separator} />
          
          {/* Input Layer (mode-aware) */}
          <View style={styles.inputLayer}>
            {mode === 'text' && (
              <TextInputCompact value={textValue} onChange={setTextValue} />
            )}
            {mode === 'photo' && (
              <PhotoAttachRow
                photoUri={photoUri}
                caption={photoCaption}
                onPhotoSelect={handlePhotoSelect}
                onCaptionChange={setPhotoCaption}
              />
            )}
            {mode === 'audio' && (
              <AudioRecorderRow
                isRecording={isRecording}
                duration={recordingDuration}
                onRecord={handleRecord}
                onStop={handleStopRecording}
                onDelete={() => {
                  setHasRecording(false);
                  setRecordingDuration(0);
                }}
                onAttach={() => {}}
                hasRecording={hasRecording}
              />
            )}
          </View>
          
          {/* Controls Layer */}
          <View style={styles.controlsLayer}>
            <ModePills activeMode={mode} onModeChange={setMode} />
            <SendButton enabled={hasContent} onPress={handleSend} />
          </View>
        </View>
      </BlurView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: 'rgba(255,255,255,0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  cardInner: {
    padding: 16,
  },
  promptLayer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: -16,
    marginTop: -16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 12,
  },
  inputLayer: {
    minHeight: 40,
    marginBottom: 12,
  },
  controlsLayer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const promptStyles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  promptItem: {
    width: SCREEN_WIDTH - 64,
    paddingRight: 32,
  },
  promptText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  accentLine: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 100,
    height: 2,
    borderRadius: 1,
  },
  indicators: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
});

const textInputStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    minHeight: 40,
    maxHeight: 80,
  },
});

const photoStyles = StyleSheet.create({
  container: {
    gap: 8,
  },
  photoArea: {
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
  },
  placeholder: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  caption: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#FFFFFF',
    height: 36,
  },
});

const audioStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  recordButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,71,87,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingActive: {
    backgroundColor: 'rgba(255,71,87,1)',
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  bar: {
    width: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1.5,
  },
  timer: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontVariant: ['tabular-nums'],
    minWidth: 50,
  },
  iconButton: {
    padding: 8,
  },
});

const pillStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  pillActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(231,180,58,0.3)',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

const sendStyles = StyleSheet.create({
  container: {
    marginLeft: 'auto',
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonEnabled: {
    backgroundColor: 'rgba(231,180,58,0.15)',
    borderColor: 'rgba(231,180,58,0.3)',
  },
});