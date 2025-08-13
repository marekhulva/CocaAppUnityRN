import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useStore } from '../../state/rootStore';
import { ShareComposer } from './ShareComposer';
import { PostCardEnhanced } from './components/PostCardEnhanced';
import { Post } from '../../state/slices/socialSlice';
import { PromptChips } from './components/PromptChips';
import { ComposerRow } from './components/ComposerRow';
import { AnimatedGradientBackground } from '../../ui/AnimatedGradientBackground';
import { FloatingParticles } from '../../ui/FloatingParticles';
import { VibrantTheme } from '../../design/vibrantTheme';

export const SocialScreen = () => {
  const feedView = useStore(s=>s.feedView);
  const setFeedView = useStore(s=>s.setFeedView);
  const circle = useStore(s=>s.circleFeed);
  const follow = useStore(s=>s.followFeed);
  const posts: Post[] = feedView==='circle'?circle:follow;
  const openShare = useStore(s=>s.openShare);
  const react = useStore(s=>s.react);

  return (
    <View style={styles.container}>
      <AnimatedGradientBackground
        colors={VibrantTheme.gradients.social.colors}
        speed={7000}
      >
        <FloatingParticles
          colors={['#FF006E', '#C77DFF', '#7209B7', '#560BAD']}
          particleCount={12}
        />
        
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Segment tabs (non-sticky, scrolls with content) */}
        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => setFeedView('circle')}
            style={[
              styles.tab,
              feedView === 'circle' && styles.tabActive
            ]}
          >
            <Text style={[
              styles.tabText,
              feedView === 'circle' && styles.tabTextActive
            ]}>Circle</Text>
          </Pressable>
          <Pressable
            onPress={() => setFeedView('follow')}
            style={[
              styles.tab,
              feedView === 'follow' && styles.tabActive
            ]}
          >
            <Text style={[
              styles.tabText,
              feedView === 'follow' && styles.tabTextActive
            ]}>Follow</Text>
          </Pressable>
        </View>

        {/* Header: Share something (scrolls with feed) */}
        <BlurView intensity={20} tint="dark" style={styles.shareCard}>
          <LinearGradient
            colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.shareCardContent}>
            <Text style={styles.shareTitle}>Share something</Text>
            <View style={styles.promptSection}>
              <PromptChips
                onPick={(text) => {
                  openShare({ 
                    type: 'status', 
                    visibility: feedView, 
                    promptSeed: text 
                  });
                }}
              />
            </View>
            <ComposerRow
              onStatus={() => openShare({ type: 'status', visibility: feedView })}
              onPhoto={() => openShare({ type: 'photo', visibility: feedView })}
              onAudio={() => openShare({ type: 'audio', visibility: feedView })}
            />
          </View>
        </BlurView>

        {/* Posts */}
        <View style={styles.postsContainer}>
          {posts.map(p => (
            <PostCardEnhanced
              key={p.id}
              post={p}
              onReact={(emoji) => react(p.id, emoji, feedView)}
            />
          ))}
        </View>
        </ScrollView>

        <ShareComposer />
      </AnimatedGradientBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    shadowColor: '#C77DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  tabActive: {
    borderColor: 'rgba(199,125,255,0.5)',
    backgroundColor: 'rgba(199,125,255,0.2)',
  },
  tabText: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '700',
    fontSize: 15,
  },
  tabTextActive: {
    color: '#FFFFFF',
    textShadowColor: '#C77DFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  shareCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,0,110,0.2)',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#FF006E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  shareCardContent: {
    padding: 16,
    gap: 12,
  },
  shareTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    fontSize: 16,
  },
  promptSection: {
    marginVertical: 4,
  },
  postsContainer: {
    gap: 4,
  },
});