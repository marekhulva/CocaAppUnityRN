import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Pressable,
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
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { ChevronLeft, X } from 'lucide-react-native';
import { useStore } from '../../state/rootStore';

// Import all steps
import { GoalSetupStep } from './steps/GoalSetupStep';
import { PerformanceHabitsStep } from './steps/PerformanceHabitsStep';
import { MilestoneStep } from './steps/MilestoneStep';
import { ActionSetupStep } from './steps/ActionSetupStep';
import { ActionSummaryStep } from './steps/ActionSummaryStep';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STEPS = [
  { component: GoalSetupStep, title: 'Define Your Goal', emoji: '🎯' },
  { component: PerformanceHabitsStep, title: 'Daily Habits', emoji: '💪' },
  { component: MilestoneStep, title: 'Set Milestones', emoji: '🏔️' },
  { component: ActionSetupStep, title: 'Plan Actions', emoji: '⚡' },
  { component: ActionSummaryStep, title: 'Review & Launch', emoji: '🚀' },
];

export const SetupContainer = () => {
  const setupState = useStore(s => s.setupState);
  const updateSetupState = useStore(s => s.updateSetupState);
  const finishSetup = useStore(s => s.finishSetup);
  
  const currentStep = setupState.currentStep;
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  
  const CurrentStepComponent = STEPS[currentStep]?.component;
  
  // Animations
  const progressWidth = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const stepScale = useSharedValue(0.95);
  
  useEffect(() => {
    progressWidth.value = withSpring(progress, {
      damping: 20,
      stiffness: 200,
    });
    
    headerOpacity.value = withTiming(1, { duration: 500 });
    
    // Animate step change
    stepScale.value = withSequence(
      withTiming(0.95, { duration: 150 }),
      withSpring(1, { damping: 15 })
    );
  }, [currentStep]);
  
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));
  
  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));
  
  const stepContentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: stepScale.value }],
    opacity: interpolate(stepScale.value, [0.95, 1], [0.8, 1]),
  }));
  
  const handleSkip = () => {
    finishSetup();
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      updateSetupState({ currentStep: currentStep - 1 });
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#000000', '#0A0A0A', '#000000']}
        style={StyleSheet.absoluteFillObject}
        locations={[0, 0.5, 1]}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          {/* Navigation */}
          <View style={styles.headerNav}>
            {currentStep > 0 ? (
              <Pressable onPress={handleBack} style={styles.backButton}>
                <ChevronLeft size={24} color="rgba(255,255,255,0.6)" />
              </Pressable>
            ) : (
              <View style={{ width: 40 }} />
            )}
            
            <View style={styles.stepIndicator}>
              <Text style={styles.stepEmoji}>{STEPS[currentStep]?.emoji}</Text>
              <Text style={styles.stepNumber}>
                {currentStep + 1} of {STEPS.length}
              </Text>
            </View>
            
            <Pressable onPress={handleSkip} style={styles.skipButton}>
              <X size={20} color="rgba(255,255,255,0.3)" />
            </Pressable>
          </View>
          
          {/* Title */}
          <Text style={styles.stepTitle}>{STEPS[currentStep]?.title}</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressBar, progressBarStyle]}>
                <LinearGradient
                  colors={['#FFD700', '#F4C430', '#E7B43A']}
                  style={StyleSheet.absoluteFillObject}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <View style={styles.progressGlow} />
              </Animated.View>
            </View>
            
            {/* Step Dots */}
            <View style={styles.stepDots}>
              {STEPS.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.stepDot,
                    index === currentStep && styles.stepDotActive,
                    index < currentStep && styles.stepDotCompleted,
                  ]}
                />
              ))}
            </View>
          </View>
        </Animated.View>
        
        {/* Step Content */}
        <Animated.View style={[styles.content, stepContentStyle]}>
          {CurrentStepComponent && <CurrentStepComponent />}
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepEmoji: {
    fontSize: 24,
  },
  stepNumber: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '600',
  },
  stepTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  progressContainer: {
    gap: 12,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  stepDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  stepDotActive: {
    backgroundColor: '#FFD700',
    width: 24,
  },
  stepDotCompleted: {
    backgroundColor: 'rgba(255,215,0,0.5)',
  },
  content: {
    flex: 1,
  },
});