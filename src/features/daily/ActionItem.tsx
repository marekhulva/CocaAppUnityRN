import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame, Trophy, Zap } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { GlassSurface } from '../../ui/GlassSurface';
import { AnimatedToggle } from '../../ui/AnimatedToggle';
import { useStore } from '../../state/rootStore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface ActionItemProps {
  id: string;
  title: string;
  goalTitle?: string;
  done?: boolean;
  streak: number;
  type?: 'goal' | 'performance' | 'commitment' | 'oneTime';
  goalColor?: string;
}

export const ActionItem: React.FC<ActionItemProps> = ({ 
  id, 
  title, 
  goalTitle, 
  done = false, 
  streak,
  type = 'goal',
  goalColor
}) => {
  const toggle = useStore(s => s.toggleAction);
  const openShare = useStore(s => s.openShare);
  const scaleAnimation = useSharedValue(1);
  const streakGlow = useSharedValue(0);
  
  const getGlowColor = () => {
    const colors = {
      goal: '#00D4FF',
      performance: '#00FF88',
      commitment: '#B366FF',
      oneTime: '#FF006E',
    };
    return colors[type];
  };

  const getNeonGlow = () => {
    const glows = {
      goal: 'blue',
      performance: 'green',
      commitment: 'purple',
      oneTime: 'pink',
    };
    return glows[type] as 'blue' | 'green' | 'purple' | 'pink';
  };

  // Streak glow animation
  useEffect(() => {
    if (streak > 7) {
      streakGlow.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [streak]);

  // Complete animation
  useEffect(() => {
    if (done) {
      scaleAnimation.value = withSpring(0.98, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      scaleAnimation.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [done]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scaleAnimation.value, [0.98, 1], [0.7, 1]),
    transform: [{ scale: scaleAnimation.value }],
  }));

  const streakBadgeStyle = useAnimatedStyle(() => ({
    shadowColor: '#FFD600',
    shadowOpacity: interpolate(streakGlow.value, [0, 1], [0.3, 0.8]),
    shadowRadius: interpolate(streakGlow.value, [0, 1], [5, 15]),
    elevation: interpolate(streakGlow.value, [0, 1], [2, 5]),
  }));

  const getStreakIcon = () => {
    if (streak >= 30) return <Trophy size={14} color="#FFD600" />;
    if (streak >= 7) return <Zap size={14} color="#FFD600" />;
    return <Flame size={14} color="#FFD600" />;
  };

  const getStreakBadgeColor = () => {
    if (streak >= 30) return ['rgba(255,214,0,0.3)', 'rgba(255,214,0,0.1)'];
    if (streak >= 7) return ['rgba(255,214,0,0.25)', 'rgba(255,214,0,0.05)'];
    return ['rgba(255,214,0,0.15)', 'rgba(255,214,0,0.05)'];
  };

  return (
    <Animated.View style={animatedStyle}>
      <GlassSurface style={styles.card} neonGlow={done ? 'none' : getNeonGlow()}>
        <View style={styles.row}>
          <AnimatedToggle
            checked={done}
            onToggle={() => {
              toggle(id);
              Haptics.impactAsync(done ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
              // Offer share after completion
              if (!done) {
                openShare({
                  type:'checkin',
                  visibility:'circle',
                  actionTitle: title,
                  goal: goalTitle,
                  streak: streak + 1,
                  goalColor: goalColor || getGlowColor(),
                });
              }
            }}
            glowColor={getGlowColor()}
            size={40}
          />
          
          <View style={styles.content}>
            <Text style={[styles.title, done && styles.titleDone]}>{title}</Text>
            <View style={styles.metaRow}>
              {goalTitle && (
                <View style={styles.goalBadge}>
                  <Text style={styles.meta}>{goalTitle}</Text>
                </View>
              )}
              {streak > 0 && (
                <Animated.View style={[styles.streakBadge, streak > 7 && streakBadgeStyle]}>
                  <LinearGradient
                    colors={getStreakBadgeColor()}
                    style={StyleSheet.absoluteFillObject}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                  {getStreakIcon()}
                  <Text style={styles.streakText}>{streak}</Text>
                  {streak >= 30 && <Text style={styles.streakLabel}>🔥</Text>}
                </Animated.View>
              )}
            </View>
          </View>

          {done && (
            <Animated.View 
              style={[styles.doneIndicator]}
            >
              <LinearGradient
                colors={['rgba(0,255,136,0.3)', 'rgba(0,255,136,0.1)']}
                style={StyleSheet.absoluteFillObject}
              />
              <Text style={styles.doneText}>✓</Text>
            </Animated.View>
          )}
        </View>
      </GlassSurface>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: { 
    marginBottom: 12, 
    padding: 16,
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  title: { 
    color: '#FFF', 
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
  },
  titleDone: {
    opacity: 0.5,
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  meta: { 
    color: 'rgba(255,255,255,0.6)', 
    fontSize: 12,
    fontWeight: '600',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    overflow: 'hidden',
  },
  streakText: {
    color: '#FFD600',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 5,
  },
  streakLabel: {
    marginLeft: 3,
    fontSize: 11,
  },
  doneIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  doneText: {
    color: '#00FF88',
    fontSize: 16,
    fontWeight: '900',
  },
});