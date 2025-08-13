import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useStore } from '../../state/rootStore';
import { GlassSurface } from '../../ui/GlassSurface';
import { RadialProgress } from '../../ui/RadialProgress';
import { HapticButton } from '../../ui/HapticButton';
import { ConfettiView } from '../../ui/ConfettiView';
import { useShimmer } from '../../design/useShimmer';
import { DailyReviewModal } from './DailyReviewModalEnhanced';
import { ActionItem } from './ActionItem';
import { LinearGradient } from 'expo-linear-gradient';
import { SocialSharePrompt } from '../social/SocialSharePrompt';

export const DailyScreen = () => {
  const actions = useStore(s=>s.actions);
  const completed = actions.filter(a=>a.done).length;
  const progress = actions.length ? (completed/actions.length)*100 : 0;
  const openReview = useStore(s=>s.openDailyReview);
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  const allCompleted = actions.length > 0 && completed === actions.length;
  const pulseAnimation = useSharedValue(0);
  const { shimmerStyle, glowStyle } = useShimmer(progress > 90);
  
  // Show share prompt when progress reaches milestones
  useEffect(() => {
    if (progress >= 70 && progress < 100 && !showSharePrompt) {
      setTimeout(() => setShowSharePrompt(true), 2000);
    }
  }, [progress]);

  // Pulse animation for Review Day button in evening
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 18) { // After 6 PM
      pulseAnimation.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, []);

  const reviewButtonStyle = useAnimatedStyle(() => ({
    shadowColor: '#00D4FF',
    shadowOpacity: interpolate(pulseAnimation.value, [0, 1], [0.3, 0.8]),
    shadowRadius: interpolate(pulseAnimation.value, [0, 1], [10, 20]),
    elevation: interpolate(pulseAnimation.value, [0, 1], [5, 10]),
  }));

  return (
    <>
      <ScrollView style={{ flex:1, backgroundColor:'#000' }} contentContainerStyle={{ padding:16, paddingBottom:140 }}>
        {/* Centered radial progress with shimmer */}
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressWrapper, progress > 90 && glowStyle]}>
            <RadialProgress progress={progress} size={180} strokeWidth={12} />
            {progress > 90 && (
              <Animated.View style={[StyleSheet.absoluteFillObject, shimmerStyle]}>
                <LinearGradient
                  colors={['transparent', 'rgba(0,212,255,0.3)', 'transparent']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFillObject}
                />
              </Animated.View>
            )}
          </Animated.View>
          <Text style={styles.progressText}>{completed}/{actions.length} Actions</Text>
          {progress > 90 && <Text style={styles.motivationalText}>Almost there! Keep going! 🔥</Text>}
        </View>
        
        <Text style={styles.title}>Today's Actions</Text>

        <GlassSurface 
          style={{ padding:16, marginBottom:16 }}
          neonGlow={progress > 90 ? 'blue' : 'none'}
        >
          <Text style={styles.subtle}>
            {progress === 100 ? '🎉 Perfect day! Review your wins!' : 
             progress > 90 ? '⚡ Almost there! Finish strong!' :
             'Complete your actions to keep the streak alive.'}
          </Text>
        </GlassSurface>

        {actions.map(a => (
          <ActionItem key={a.id} id={a.id} title={a.title} goalTitle={a.goalTitle} done={a.done} streak={a.streak}/>
        ))}

        {/* Review Day CTA with glow animation */}
        <HapticButton hapticType="medium" onPress={openReview}>
          <Animated.View style={[styles.reviewCta, reviewButtonStyle]}>
            <LinearGradient
              colors={['rgba(0,212,255,0.1)', 'rgba(0,212,255,0.05)', 'transparent']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={styles.reviewText}>Review Day</Text>
          </Animated.View>
        </HapticButton>
      </ScrollView>

      {/* Modal lives at screen root; stays decoupled */}
      <DailyReviewModal />
      
      {/* Social Share Prompt */}
      <SocialSharePrompt
        visible={showSharePrompt}
        onClose={() => setShowSharePrompt(false)}
        progress={progress}
        completedActions={completed}
        totalActions={actions.length}
        streak={7}
      />
      
      {/* Confetti when all actions completed */}
      <ConfettiView active={allCompleted} />
    </>
  );
};

const styles = StyleSheet.create({
  title:{ color:'#FFF', fontSize:28, fontWeight:'800', marginBottom: 16, textAlign: 'center' },
  progressContainer: { 
    alignItems: 'center', 
    marginVertical: 32,
  },
  progressWrapper: {
    marginBottom: 16,
  },
  progressText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  motivationalText: {
    color: '#00D4FF',
    fontSize: 16,
    fontWeight: '600',
  },
  subtle:{ color:'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 20 },
  reviewCta:{
    marginTop:16,
    borderRadius:16,
    borderColor:'rgba(0,212,255,0.3)',
    borderWidth:1,
    paddingVertical:14,
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.6)',
    overflow: 'hidden',
  },
  reviewText:{ color:'#00D4FF', fontWeight:'800', fontSize:16 }
});