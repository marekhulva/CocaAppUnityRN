import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../../state/rootStore';
import { HapticButton } from '../../../ui/HapticButton';

const suggestedPerformanceHabits = [
  { id: '1', name: 'Morning Meditation', tip: 'Start with clarity' },
  { id: '2', name: 'Cold Shower', tip: 'Build resilience' },
  { id: '3', name: 'Exercise', tip: 'Move your body' },
  { id: '4', name: 'Reading', tip: 'Feed your mind' },
  { id: '5', name: 'Journaling', tip: 'Process thoughts' },
  { id: '6', name: 'Deep Work Block', tip: 'Focus time' },
  { id: '7', name: 'Evening Review', tip: 'Reflect & plan' },
];

export const PerformanceHabitsStep = () => {
  const updateSetupState = useStore(s => s.updateSetupState);
  const setupState = useStore(s => s.setupState);
  
  const [selectedHabits, setSelectedHabits] = useState<Record<string, {
    selected: boolean;
    time?: string;
    reminder?: boolean;
  }>>(
    setupState.performanceHabits.reduce((acc, habit) => ({
      ...acc,
      [habit.id]: {
        selected: true,
        time: habit.time,
        reminder: habit.reminder,
      }
    }), {})
  );
  
  const toggleHabit = (habitId: string) => {
    setSelectedHabits(prev => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        selected: !prev[habitId]?.selected,
      }
    }));
  };
  
  const updateHabitTime = (habitId: string, time: string) => {
    setSelectedHabits(prev => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        time,
      }
    }));
  };
  
  const toggleReminder = (habitId: string) => {
    setSelectedHabits(prev => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        reminder: !prev[habitId]?.reminder,
      }
    }));
  };
  
  const handleNext = () => {
    const habits = suggestedPerformanceHabits
      .filter(h => selectedHabits[h.id]?.selected)
      .map(h => ({
        id: h.id,
        name: h.name,
        time: selectedHabits[h.id]?.time,
        reminder: selectedHabits[h.id]?.reminder,
      }));
    
    updateSetupState({
      performanceHabits: habits,
      currentStep: 2,
    });
  };
  
  const selectedCount = Object.values(selectedHabits).filter(h => h?.selected).length;
  const isValid = selectedCount >= 3 && selectedCount <= 5;
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Unlock Your Baseline Potential</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Pick 3-5 performance habits that will become your foundation
          </Text>
        </View>
      </View>
      
      {/* Habits List */}
      <View style={styles.habitsList}>
        {suggestedPerformanceHabits.map(habit => {
          const isSelected = selectedHabits[habit.id]?.selected;
          
          return (
            <View
              key={habit.id}
              style={[
                styles.habitRow,
                isSelected && styles.habitRowSelected
              ]}
            >
              {isSelected && (
                <LinearGradient
                  colors={['rgba(255,215,0,0.05)', 'rgba(255,215,0,0.02)']}
                  style={StyleSheet.absoluteFillObject}
                />
              )}
              
              <View style={styles.habitMain}>
                <View style={styles.habitInfo}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <Text style={styles.habitTip}>{habit.tip}</Text>
                </View>
                
                <Pressable
                  style={[
                    styles.toggleButton,
                    isSelected && styles.toggleButtonActive
                  ]}
                  onPress={() => toggleHabit(habit.id)}
                >
                  {isSelected && (
                    <LinearGradient
                      colors={['#FFD700', '#F4C430']}
                      style={StyleSheet.absoluteFillObject}
                    />
                  )}
                  <Text style={[
                    styles.toggleText,
                    isSelected && styles.toggleTextActive
                  ]}>
                    {isSelected ? 'Remove' : 'Add'}
                  </Text>
                </Pressable>
              </View>
              
              {isSelected && (
                <View style={styles.habitOptions}>
                  <View style={styles.optionRow}>
                    <Text style={styles.optionLabel}>Time</Text>
                    <TextInput
                      style={styles.timeInput}
                      placeholder="HH:MM"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={selectedHabits[habit.id]?.time || ''}
                      onChangeText={(time) => updateHabitTime(habit.id, time)}
                    />
                  </View>
                  
                  <View style={styles.optionRow}>
                    <Text style={styles.optionLabel}>Remind Me?</Text>
                    <Switch
                      value={selectedHabits[habit.id]?.reminder || false}
                      onValueChange={() => toggleReminder(habit.id)}
                      trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(255,215,0,0.3)' }}
                      thumbColor={selectedHabits[habit.id]?.reminder ? '#FFD700' : '#666'}
                    />
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
      
      {/* Selection Counter */}
      <View style={styles.counter}>
        <Text style={[
          styles.counterText,
          !isValid && styles.counterTextInvalid
        ]}>
          {selectedCount} selected {!isValid && '(pick 3-5)'}
        </Text>
      </View>
      
      {/* CTA Button */}
      <HapticButton 
        onPress={handleNext}
        disabled={!isValid}
        style={styles.ctaContainer}
      >
        <View style={[styles.ctaButton, !isValid && styles.ctaDisabled]}>
          {isValid && (
            <LinearGradient
              colors={['#FFD700', '#F4C430', '#E7B43A']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
          <Text style={[styles.ctaText, !isValid && styles.ctaTextDisabled]}>
            Continue
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
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 16,
  },
  infoText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
  habitsList: {
    gap: 12,
  },
  habitRow: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  habitRowSelected: {
    borderColor: 'rgba(255,215,0,0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  habitMain: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  habitTip: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  toggleButtonActive: {
    borderColor: 'transparent',
  },
  toggleText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#000000',
  },
  habitOptions: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    gap: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  timeInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: '#FFFFFF',
    width: 100,
    textAlign: 'center',
  },
  counter: {
    marginVertical: 20,
    alignItems: 'center',
  },
  counterText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  counterTextInvalid: {
    color: '#FF6B6B',
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
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ctaTextDisabled: {
    color: 'rgba(255,255,255,0.3)',
  },
});