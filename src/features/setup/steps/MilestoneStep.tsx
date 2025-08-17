import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../../state/rootStore';
import { HapticButton } from '../../../ui/HapticButton';

export const MilestoneStep = () => {
  const updateSetupState = useStore(s => s.updateSetupState);
  const setupState = useStore(s => s.setupState);
  
  const [milestones, setMilestones] = useState(setupState.milestones || []);
  const [currentMilestone, setCurrentMilestone] = useState({
    name: '',
    outcome: '',
    date: '',
  });
  
  const handleAddMilestone = () => {
    if (currentMilestone.name && currentMilestone.outcome && currentMilestone.date) {
      setMilestones([...milestones, currentMilestone]);
      setCurrentMilestone({ name: '', outcome: '', date: '' });
    }
  };
  
  const handleContinue = () => {
    updateSetupState({
      milestones,
      currentStep: 3,
    });
  };
  
  const canAddMilestone = currentMilestone.name && currentMilestone.outcome && currentMilestone.date;
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Input Card */}
      <View style={styles.inputCard}>
        <Text style={styles.cardTitle}>Create Milestone Checkpoints</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Milestone name</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="e.g., Reach $100k revenue"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={currentMilestone.name}
              onChangeText={(text) => setCurrentMilestone({...currentMilestone, name: text})}
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Measurable outcome</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="e.g., $100k/year"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={currentMilestone.outcome}
              onChangeText={(text) => setCurrentMilestone({...currentMilestone, outcome: text})}
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={currentMilestone.date}
              onChangeText={(text) => setCurrentMilestone({...currentMilestone, date: text})}
            />
          </View>
        </View>
        
        {/* Add Milestone Button */}
        <HapticButton 
          onPress={handleAddMilestone}
          disabled={!canAddMilestone}
        >
          <View style={[styles.addButton, !canAddMilestone && styles.addButtonDisabled]}>
            {canAddMilestone && (
              <LinearGradient
                colors={['#FFD700', '#F4C430', '#E7B43A']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}
            <Text style={[styles.addButtonText, !canAddMilestone && styles.addButtonTextDisabled]}>
              Add Milestone
            </Text>
          </View>
        </HapticButton>
      </View>
      
      {/* Milestones List */}
      {milestones.length > 0 && (
        <View style={styles.milestonesCard}>
          <Text style={styles.cardTitle}>Your Milestones</Text>
          {milestones.map((milestone, index) => (
            <View key={index} style={styles.milestoneItem}>
              <Text style={styles.milestoneName}>{milestone.name}</Text>
              <View style={styles.milestoneDetails}>
                <Text style={styles.milestoneDetail}>{milestone.outcome}</Text>
                <Text style={styles.milestoneDetail}>• {milestone.date}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      
      {/* Continue Button */}
      <HapticButton 
        onPress={handleContinue}
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
            Continue to Actions
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
  inputCard: {
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
  inputGroup: {
    marginBottom: 16,
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
  addButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginTop: 8,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  addButtonTextDisabled: {
    color: 'rgba(255,255,255,0.3)',
  },
  milestonesCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    marginBottom: 20,
  },
  milestoneItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  milestoneName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  milestoneDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  milestoneDetail: {
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