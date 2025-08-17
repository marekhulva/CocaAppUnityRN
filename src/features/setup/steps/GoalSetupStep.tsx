import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  FadeIn,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import { useStore } from '../../../state/rootStore';
import { HapticButton } from '../../../ui/HapticButton';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const GoalSetupStep = () => {
  const updateSetupState = useStore(s => s.updateSetupState);
  const setupState = useStore(s => s.setupState);
  
  const [localGoal, setLocalGoal] = useState(setupState.goalData);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Animations
  const titleScale = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0);
  
  useEffect(() => {
    // Entrance animations
    titleScale.value = withSpring(1, { damping: 15 });
    formOpacity.value = withTiming(1, { duration: 600 });
    setTimeout(() => {
      buttonScale.value = withSpring(1, { damping: 12 });
    }, 300);
  }, []);
  
  const handleNext = () => {
    updateSetupState({
      goalData: localGoal,
      currentStep: 1,
    });
  };
  
  const isValid = localGoal.title && localGoal.metric && localGoal.deadline;
  
  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
    opacity: titleScale.value,
  }));
  
  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }));
  
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: buttonScale.value,
  }));
  
  const renderInput = (
    label: string,
    value: string,
    onChange: (text: string) => void,
    placeholder: string,
    fieldKey: string,
    multiline?: boolean
  ) => {
    const isFocused = focusedField === fieldKey;
    
    return (
      <Animated.View 
        entering={FadeInDown.delay(200).springify()}
        style={styles.inputGroup}
      >
        <Text style={[styles.label, isFocused && styles.labelFocused]}>
          {label}
        </Text>
        <View style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused
        ]}>
          {isFocused && (
            <LinearGradient
              colors={['rgba(255,215,0,0.1)', 'rgba(255,215,0,0.05)']}
              style={StyleSheet.absoluteFillObject}
            />
          )}
          <TextInput
            style={[
              styles.input,
              multiline && styles.textArea
            ]}
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={value}
            onChangeText={onChange}
            onFocus={() => setFocusedField(fieldKey)}
            onBlur={() => setFocusedField(null)}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
          />
        </View>
      </Animated.View>
    );
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, titleStyle]}>
          <LinearGradient
            colors={['rgba(255,215,0,0.15)', 'transparent']}
            style={styles.heroGradient}
          />
          <Text style={styles.heroEmoji}>🎯</Text>
          <Text style={styles.heroTitle}>Define Your North Star</Text>
          <Text style={styles.heroSubtitle}>
            What's the one goal that will transform your life?
          </Text>
        </Animated.View>
        
        {/* Form Section */}
        <Animated.View style={[styles.formSection, formStyle]}>
          {renderInput(
            'Goal Title',
            localGoal.title,
            (text) => setLocalGoal({...localGoal, title: text}),
            'e.g., Launch my startup',
            'title'
          )}
          
          {renderInput(
            'Success Metric',
            localGoal.metric,
            (text) => setLocalGoal({...localGoal, metric: text}),
            'e.g., $10k MRR',
            'metric'
          )}
          
          {renderInput(
            'Target Date',
            localGoal.deadline,
            (text) => setLocalGoal({...localGoal, deadline: text}),
            'YYYY-MM-DD',
            'deadline'
          )}
          
          {renderInput(
            'Your Why',
            localGoal.why,
            (text) => setLocalGoal({...localGoal, why: text}),
            'What drives you to achieve this?',
            'why',
            true
          )}
          
          {/* Privacy Choice - Enhanced */}
          <Animated.View 
            entering={FadeInDown.delay(400).springify()}
            style={styles.privacySection}
          >
            <Text style={styles.privacySectionTitle}>Share Your Journey</Text>
            <View style={styles.privacyPills}>
              <AnimatedPressable
                style={[
                  styles.privacyPill,
                  localGoal.privacy === 'public' && styles.privacyPillActive
                ]}
                onPress={() => setLocalGoal({...localGoal, privacy: 'public'})}
              >
                {localGoal.privacy === 'public' && (
                  <LinearGradient
                    colors={['rgba(255,215,0,0.2)', 'rgba(255,215,0,0.1)']}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                <View style={styles.privacyPillContent}>
                  <Text style={styles.privacyEmoji}>🌍</Text>
                  <View>
                    <Text style={[
                      styles.privacyTitle,
                      localGoal.privacy === 'public' && styles.privacyTitleActive
                    ]}>
                      Public
                    </Text>
                    <Text style={[
                      styles.privacySubtext,
                      localGoal.privacy === 'public' && styles.privacySubtextActive
                    ]}>
                      Inspire & get support
                    </Text>
                  </View>
                </View>
              </AnimatedPressable>
              
              <AnimatedPressable
                style={[
                  styles.privacyPill,
                  localGoal.privacy === 'private' && styles.privacyPillActive
                ]}
                onPress={() => setLocalGoal({...localGoal, privacy: 'private'})}
              >
                {localGoal.privacy === 'private' && (
                  <LinearGradient
                    colors={['rgba(255,215,0,0.2)', 'rgba(255,215,0,0.1)']}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                <View style={styles.privacyPillContent}>
                  <Text style={styles.privacyEmoji}>🔒</Text>
                  <View>
                    <Text style={[
                      styles.privacyTitle,
                      localGoal.privacy === 'private' && styles.privacyTitleActive
                    ]}>
                      Private
                    </Text>
                    <Text style={[
                      styles.privacySubtext,
                      localGoal.privacy === 'private' && styles.privacySubtextActive
                    ]}>
                      Personal journey
                    </Text>
                  </View>
                </View>
              </AnimatedPressable>
            </View>
          </Animated.View>
        </Animated.View>
        
        {/* CTA Button - Enhanced */}
        <Animated.View style={[styles.ctaSection, buttonStyle]}>
          <HapticButton 
            onPress={handleNext}
            disabled={!isValid}
            hapticType="medium"
          >
            <View style={[styles.ctaButton, !isValid && styles.ctaDisabled]}>
              {isValid ? (
                <>
                  <LinearGradient
                    colors={['#FFD700', '#F4C430', '#E7B43A']}
                    style={StyleSheet.absoluteFillObject}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                  <View style={styles.ctaGlow} />
                </>
              ) : (
                <View style={styles.ctaDisabledBg} />
              )}
              <Text style={[styles.ctaText, !isValid && styles.ctaTextDisabled]}>
                {isValid ? "🍃 I'm Locked In" : "Complete All Fields"}
              </Text>
            </View>
          </HapticButton>
          
          {!isValid && (
            <Text style={styles.ctaHint}>
              Fill in your goal details to continue
            </Text>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: -20,
    right: -20,
    height: 150,
    opacity: 0.5,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  formSection: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  labelFocused: {
    color: '#FFD700',
  },
  inputWrapper: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  inputWrapperFocused: {
    borderColor: 'rgba(255,215,0,0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 17,
    padding: 16,
    fontWeight: '500',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  privacySection: {
    marginTop: 12,
  },
  privacySectionTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  privacyPills: {
    flexDirection: 'row',
    gap: 12,
  },
  privacyPill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    overflow: 'hidden',
  },
  privacyPillActive: {
    borderColor: 'rgba(255,215,0,0.3)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  privacyPillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  privacyEmoji: {
    fontSize: 24,
  },
  privacyTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  privacyTitleActive: {
    color: '#FFD700',
  },
  privacySubtext: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
  },
  privacySubtextActive: {
    color: 'rgba(255,215,0,0.7)',
  },
  ctaSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  ctaButton: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 48,
    alignItems: 'center',
    overflow: 'hidden',
    minWidth: '100%',
  },
  ctaGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaDisabled: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  ctaDisabledBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  ctaText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ctaTextDisabled: {
    color: 'rgba(255,255,255,0.2)',
  },
  ctaHint: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    marginTop: 12,
  },
});