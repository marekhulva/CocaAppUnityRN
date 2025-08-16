import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LuxuryTheme } from '../../../design/luxuryTheme';

const { width } = Dimensions.get('window');
const TAB_WIDTH = (width - 48) / 2;

interface LiquidGlassTabsProps {
  activeTab: 'circle' | 'follow';
  onTabChange: (tab: 'circle' | 'follow') => void;
}

export const LiquidGlassTabs: React.FC<LiquidGlassTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const slideAnim = useSharedValue(activeTab === 'circle' ? 0 : 1);
  const glowAnim = useSharedValue(0);

  React.useEffect(() => {
    slideAnim.value = withSpring(activeTab === 'circle' ? 0 : 1, {
      damping: 20,
      stiffness: 200,
    });
    
    // Pulse glow on change
    glowAnim.value = withTiming(1, { duration: 200 }, () => {
      glowAnim.value = withTiming(0, { duration: 400 });
    });
  }, [activeTab]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: interpolate(slideAnim.value, [0, 1], [0, TAB_WIDTH]),
    }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowAnim.value, [0, 1], [0.5, 1]),
  }));

  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
        <LinearGradient
          colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Active indicator with liquid animation */}
        <Animated.View style={[styles.indicator, indicatorStyle]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.08)']}
            style={styles.indicatorGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Animated.View style={[styles.indicatorGlow, glowStyle]} />
        </Animated.View>
        
        {/* Tab buttons */}
        <View style={styles.tabsRow}>
          <Pressable
            style={styles.tab}
            onPress={() => onTabChange('circle')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'circle' && styles.tabTextActive
            ]}>
              👥 Circle
            </Text>
            {activeTab === 'circle' && (
              <Animated.View style={[styles.underline, glowStyle]}>
                <LinearGradient
                  colors={[LuxuryTheme.colors.primary.gold, LuxuryTheme.colors.primary.champagne]}
                  style={styles.underlineGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            )}
          </Pressable>
          
          <Pressable
            style={styles.tab}
            onPress={() => onTabChange('follow')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'follow' && styles.tabTextActive
            ]}>
              🌍 Following
            </Text>
            {activeTab === 'follow' && (
              <Animated.View style={[styles.underline, glowStyle]}>
                <LinearGradient
                  colors={[LuxuryTheme.colors.primary.silver, LuxuryTheme.colors.primary.platinum]}
                  style={styles.underlineGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            )}
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 16,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  indicator: {
    position: 'absolute',
    width: TAB_WIDTH,
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  indicatorGradient: {
    flex: 1,
    borderRadius: 24,
  },
  indicatorGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  tabsRow: {
    flexDirection: 'row',
    flex: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  underline: {
    position: 'absolute',
    bottom: 8,
    width: '60%',
    height: 2,
    borderRadius: 1,
    overflow: 'hidden',
  },
  underlineGradient: {
    flex: 1,
  },
});