import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../../state/rootStore';
import { HapticButton } from '../../../ui/HapticButton';

type ActionType = 'one-time' | 'commitment';
type Frequency = 'daily' | 'weekly' | 'weekdays' | 'custom';

const frequencyLabels: Record<Frequency, string> = {
  daily: 'Every Day',
  weekly: 'Weekly',
  weekdays: 'Weekdays',
  custom: 'Custom',
};

export const ActionSetupStep = () => {
  const updateSetupState = useStore(s => s.updateSetupState);
  const setupState = useStore(s => s.setupState);
  
  const [actionType, setActionType] = useState<ActionType>('commitment');
  const [actionData, setActionData] = useState({
    name: '',
    why: '',
    date: '',
    frequency: 'daily' as Frequency,
    milestoneLink: '',
  });
  
  const handleSaveAction = () => {
    // Validation
    if (actionType === 'one-time') {
      if (!actionData.name || !actionData.date) {
        Alert.alert('Missing Fields', 'Name and Date are required for one-time actions');
        return;
      }
    } else {
      if (!actionData.name || !actionData.frequency) {
        Alert.alert('Missing Fields', 'Name and Frequency are required for commitments');
        return;
      }
    }
    
    // Save action and advance
    const newAction = {
      type: actionType,
      name: actionData.name,
      why: actionData.why,
      ...(actionType === 'one-time' 
        ? { date: actionData.date }
        : { frequency: actionData.frequency }
      ),
      milestoneLink: actionData.milestoneLink || undefined,
    };
    
    updateSetupState({
      actions: [...setupState.actions, newAction],
      currentStep: 4,
    });
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
      
      {/* Heading */}
      <Text style={styles.heading}>How will you get there?</Text>
      <Text style={styles.subheading}>
        Define concrete actions to achieve your goal
      </Text>
      
      {/* Action Type Selector */}
      <View style={styles.typePills}>
        <Pressable
          style={[
            styles.typePill,
            actionType === 'one-time' && styles.typePillActive
          ]}
          onPress={() => setActionType('one-time')}
        >
          {actionType === 'one-time' && (
            <LinearGradient
              colors={['rgba(255,215,0,0.1)', 'rgba(255,215,0,0.05)']}
              style={StyleSheet.absoluteFillObject}
            />
          )}
          <Text style={[
            styles.typePillText,
            actionType === 'one-time' && styles.typePillTextActive
          ]}>
            One-Time Action
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.typePill,
            actionType === 'commitment' && styles.typePillActive
          ]}
          onPress={() => setActionType('commitment')}
        >
          {actionType === 'commitment' && (
            <LinearGradient
              colors={['rgba(255,215,0,0.1)', 'rgba(255,215,0,0.05)']}
              style={StyleSheet.absoluteFillObject}
            />
          )}
          <Text style={[
            styles.typePillText,
            actionType === 'commitment' && styles.typePillTextActive
          ]}>
            Commitment
          </Text>
        </Pressable>
      </View>
      
      {/* Action Form */}
      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="What will you do?"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={actionData.name}
              onChangeText={(text) => setActionData({...actionData, name: text})}
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Why</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Why is this important?"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={actionData.why}
              onChangeText={(text) => setActionData({...actionData, why: text})}
              multiline
              numberOfLines={2}
            />
          </View>
        </View>
        
        {actionType === 'one-time' ? (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={actionData.date}
                onChangeText={(text) => setActionData({...actionData, date: text})}
              />
            </View>
          </View>
        ) : (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyChips}>
              {Object.entries(frequencyLabels).map(([key, label]) => (
                <Pressable
                  key={key}
                  style={[
                    styles.frequencyChip,
                    actionData.frequency === key && styles.frequencyChipActive
                  ]}
                  onPress={() => setActionData({...actionData, frequency: key as Frequency})}
                >
                  {actionData.frequency === key && (
                    <LinearGradient
                      colors={['rgba(255,215,0,0.2)', 'rgba(255,215,0,0.1)']}
                      style={StyleSheet.absoluteFillObject}
                    />
                  )}
                  <Text style={[
                    styles.frequencyChipText,
                    actionData.frequency === key && styles.frequencyChipTextActive
                  ]}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        
        {/* Milestone Link (Optional) */}
        {setupState.milestones.length > 0 && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Link to Milestone (Optional)</Text>
            <View style={styles.milestoneLinks}>
              <Pressable
                style={[
                  styles.milestoneLink,
                  !actionData.milestoneLink && styles.milestoneLinkActive
                ]}
                onPress={() => setActionData({...actionData, milestoneLink: ''})}
              >
                <Text style={styles.milestoneLinkText}>None</Text>
              </Pressable>
              {setupState.milestones.map((milestone, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.milestoneLink,
                    actionData.milestoneLink === milestone.name && styles.milestoneLinkActive
                  ]}
                  onPress={() => setActionData({...actionData, milestoneLink: milestone.name})}
                >
                  <Text style={styles.milestoneLinkText} numberOfLines={1}>
                    {milestone.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>
      
      {/* Save Button */}
      <HapticButton 
        onPress={handleSaveAction}
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
            {actionType === 'one-time' ? 'Save' : 'Save This Commitment'}
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
  heading: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  subheading: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginBottom: 24,
  },
  typePills: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typePill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  typePillActive: {
    borderColor: 'rgba(255,215,0,0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  typePillText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    fontWeight: '600',
  },
  typePillTextActive: {
    color: '#FFD700',
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
    padding: 14,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  frequencyChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  frequencyChipActive: {
    borderColor: 'rgba(255,215,0,0.3)',
  },
  frequencyChipText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '600',
  },
  frequencyChipTextActive: {
    color: '#FFD700',
  },
  milestoneLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  milestoneLink: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    maxWidth: '48%',
  },
  milestoneLinkActive: {
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderColor: 'rgba(255,215,0,0.3)',
  },
  milestoneLinkText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
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