import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MessageCircle, MoreVertical } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Post } from '../../../state/slices/socialSlice';
import { ReactionChipAnimated } from '../../../ui/atoms/ReactionChipAnimated';
import { LuxuryTheme } from '../../../design/luxuryTheme';
import { useStore } from '../../../state/rootStore';

interface FeedCardProps {
  post: Post;
  onReact: (emoji: string) => void;
  onComment?: () => void;
  onProfileTap?: () => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({
  post,
  onReact,
  onComment,
  onProfileTap,
}) => {
  const scale = useSharedValue(1);
  const goals = useStore(s => s.goals);
  
  // Get habit color from daily state
  const habitColor = React.useMemo(() => {
    if (post.type === 'checkin' && post.goal) {
      const goal = goals.find(g => g.title === post.goal);
      return goal?.color || LuxuryTheme.colors.primary.gold;
    }
    return null;
  }, [post, goals]);

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BlurView intensity={15} tint="dark" style={styles.card}>
        <LinearGradient
          colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']}
          style={StyleSheet.absoluteFillObject}
        />
        
        {/* Habit color accent for check-ins */}
        {habitColor && (
          <View style={[styles.habitAccent, { backgroundColor: habitColor }]} />
        )}
        
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            style={styles.profileSection}
            onPress={onProfileTap}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            {/* Profile Photo */}
            <View style={styles.avatarContainer}>
              {post.avatar ? (
                <Text style={styles.avatarEmoji}>{post.avatar}</Text>
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>
                    {post.user.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            
            {/* User Info */}
            <View style={styles.userInfo}>
              <Text style={styles.username}>{post.user}</Text>
              <Text style={styles.timestamp}>{post.time}</Text>
            </View>
          </Pressable>
          
          {/* More Options */}
          <Pressable style={styles.moreButton}>
            <MoreVertical size={18} color="rgba(255,255,255,0.5)" />
          </Pressable>
        </View>
        
        {/* Content */}
        <View style={styles.contentSection}>
          {/* Check-in specific */}
          {post.type === 'checkin' && post.actionTitle && (
            <View style={styles.checkinHeader}>
              <Text style={styles.checkinAction}>✅ {post.actionTitle}</Text>
              {post.streak && post.streak > 0 && (
                <View style={styles.streakBadge}>
                  <Text style={styles.streakText}>🔥 {post.streak}</Text>
                </View>
              )}
            </View>
          )}
          
          {/* Main content */}
          {post.content && (
            <Text style={styles.content}>{post.content}</Text>
          )}
          
          {/* Photo */}
          {post.photoUri && (
            <Image source={{ uri: post.photoUri }} style={styles.photo} />
          )}
          
          {/* Audio indicator */}
          {post.audioUri && (
            <View style={styles.audioIndicator}>
              <Text style={styles.audioText}>🎙️ Voice Note</Text>
            </View>
          )}
        </View>
        
        {/* Footer with reactions */}
        <View style={styles.footer}>
          <View style={styles.reactionsRow}>
            {['🔥', '💪', '👏'].map(emoji => (
              <ReactionChipAnimated
                key={emoji}
                emoji={emoji}
                count={post.reactions?.[emoji]}
                active={!!post.reactions?.[emoji]}
                onPress={() => onReact(emoji)}
              />
            ))}
          </View>
          
          {/* Comment button */}
          <Pressable style={styles.commentButton} onPress={onComment}>
            <MessageCircle size={16} color="rgba(255,255,255,0.6)" />
            <Text style={styles.commentText}>Comment</Text>
          </Pressable>
        </View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 4,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  habitAccent: {
    position: 'absolute',
    left: 0,
    top: 20,
    bottom: 20,
    width: 3,
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 12,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  moreButton: {
    padding: 8,
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  checkinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  checkinAction: {
    fontSize: 14,
    fontWeight: '600',
    color: LuxuryTheme.colors.primary.gold,
  },
  streakBadge: {
    backgroundColor: 'rgba(231,180,58,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(231,180,58,0.2)',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    color: LuxuryTheme.colors.primary.gold,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.9)',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 12,
  },
  audioIndicator: {
    backgroundColor: 'rgba(147,112,219,0.1)',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(147,112,219,0.2)',
  },
  audioText: {
    fontSize: 14,
    color: '#9370DB',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  reactionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  commentText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
});