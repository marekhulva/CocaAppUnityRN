import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../../state/rootStore';
import { HapticButton } from '../../../ui/HapticButton';

export const ActionSummaryStep = () => {
  const setupState = useStore(s => s.setupState);
  const finishSetup = useStore(s => s.finishSetup);
  const addGoal = useStore(s => s.addGoal);
  const setActions = useStore(s => s.setActions);
  const addPost = useStore(s => s.addPost);
  
  const handleFinish = () => {
    // Build goal data
    const goalData = {
      id: Date.now().toString(),
      title: setupState.goalData.title,
      metric: setupState.goalData.metric,
      deadline: setupState.goalData.deadline,
      why: setupState.goalData.why,
      consistency: 0,
      status: 'On Track' as const,
    };
    
    // Add goal to store
    addGoal(goalData);
    
    // Seed actions
    const seedActions = [];
    
    // Add commitment actions as daily items
    setupState.actions
      .filter(a => a.type === 'commitment')
      .forEach(action => {
        seedActions.push({
          id: `action-${Date.now()}-${Math.random()}`,
          title: action.name,
          goalTitle: setupState.goalData.title,
          type: 'commitment' as const,
          time: 'All day',
          streak: 0,
          done: false,
        });
      });
    
    // Add performance habits
    setupState.performanceHabits.forEach(habit => {
      seedActions.push({
        id: `habit-${habit.id}`,
        title: habit.name,
        goalTitle: 'Core Potential',
        type: 'performance' as const,
        time: habit.time || 'All day',
        streak: 0,
        done: false,
      });
    });
    
    // Set all actions
    setActions(seedActions);
    
    // If public, create goal announcement post
    if (setupState.goalData.privacy === 'public') {
      const goalPost = {
        id: `post-goal-${Date.now()}`,
        user: 'You',
        type: 'goal' as const,
        content: setupState.goalData.title,
        visibility: 'follow' as const,
        goalData: {
          title: setupState.goalData.title,
          deadline: setupState.goalData.deadline,
          why: setupState.goalData.why,
        },
        timestamp: new Date().toISOString(),
        reactions: {
          fire: 0,
          love: 0,
          rocket: 0,
          trophy: 0,
        },
        comments: [],
        momentum: 100,
      };
      
      addPost(goalPost);
    }
    
    // Finish setup and go to main
    finishSetup();
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Goal Recap */}
      <View style={styles.recapCard}>
        <Text style={styles.recapLabel}>Your Goal</Text>
        <Text style={styles.recapTitle}>{setupState.goalData.title}</Text>
        <View style={styles.recapDetails}>
          <Text style={styles.recapDetail}>{setupState.goalData.deadline}</Text>
          {setupState.goalData.why && (
            <Text style={styles.recapDetail} numberOfLines={1}>
              • {setupState.goalData.why}
            </Text>
          )}
        </View>
      </View>
      
      {/* Actions List */}
      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Your Actions</Text>
        
        {setupState.actions.map((action, index) => (
          <View key={index} style={styles.actionItem}>
            <View style={styles.actionHeader}>
              <View style={[
                styles.actionTag,
                action.type === 'one-time' ? styles.oneTimeTag : styles.commitmentTag
              ]}>
                <Text style={styles.actionTagText}>
                  {action.type === 'one-time' ? 'ONE-TIME ACTION' : 'COMMITMENT'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.actionName}>{action.name}</Text>
            
            <View style={styles.actionDetails}>
              {action.type === 'one-time' ? (
                <Text style={styles.actionDetail}>Due: {action.date}</Text>
              ) : (
                <Text style={styles.actionDetail}>Frequency: {action.frequency}</Text>
              )}
              {action.milestoneLink && (
                <Text style={styles.actionDetail}>• {action.milestoneLink}</Text>
              )}
            </View>
          </View>
        ))}
        
        {setupState.performanceHabits.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Performance Habits</Text>
            {setupState.performanceHabits.map((habit, index) => (
              <View key={index} style={styles.habitItem}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <View style={styles.habitDetails}>
                  {habit.time && (
                    <Text style={styles.habitDetail}>⏰ {habit.time}</Text>
                  )}
                  {habit.reminder && (
                    <Text style={styles.habitDetail}>• 🔔 Reminder</Text>
                  )}
                </View>
              </View>
            ))}
          </>
        )}
      </View>
      
      {/* Finish Button */}
      <HapticButton 
        onPress={handleFinish}
        style={styles.ctaContainer}
      >
        <View style={styles.ctaButton}>
          <LinearGradient
            colors={['#FFD700', '#F4C430', '#E7B43A']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Text style={styles.ctaText}>
            Finish Setup
          </Text>
        </View>
      </HapticButton>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  recapCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    marginBottom: 20,
  },
  recapLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  recapTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  recapDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  recapDetail: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  actionsCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  actionItem: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 14,
    marginBottom: 12,
  },
  actionHeader: {
    marginBottom: 8,
  },
  actionTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  oneTimeTag: {
    backgroundColor: 'rgba(76,182,172,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(76,182,172,0.3)',
  },
  commitmentTag: {
    backgroundColor: 'rgba(255,184,77,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,184,77,0.3)',
  },
  actionTagText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  actionDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  actionDetail: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 16,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  habitItem: {
    paddingVertical: 8,
  },
  habitName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  habitDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  habitDetail: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  ctaContainer: {
    marginTop: 'auto',
  },
  ctaButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  ctaText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});