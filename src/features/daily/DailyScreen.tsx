import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useStore } from '../../state/rootStore';
import { GlassSurface } from '../../ui/GlassSurface';
import { ProgressRing } from '../../ui/ProgressRing';
import * as Haptics from 'expo-haptics';
import { DailyReviewModal } from './DailyReviewModal';
import { ActionItem } from './ActionItem';

export const DailyScreen = () => {
  const actions = useStore(s=>s.actions);
  const completed = actions.filter(a=>a.done).length;
  const progress = actions.length ? (completed/actions.length)*100 : 0;
  const openReview = useStore(s=>s.openDailyReview);

  return (
    <>
      <ScrollView style={{ flex:1, backgroundColor:'#000' }} contentContainerStyle={{ padding:16, paddingBottom:140 }}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Today</Text>
          <ProgressRing progress={progress} />
        </View>

        <GlassSurface style={{ padding:16, marginBottom:16 }}>
          <Text style={styles.subtle}>Complete your actions to keep the streak alive.</Text>
        </GlassSurface>

        {actions.map(a => (
          <ActionItem key={a.id} id={a.id} title={a.title} goalTitle={a.goalTitle} done={a.done} streak={a.streak}/>
        ))}

        {/* Review Day CTA */}
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(()=>{}); openReview(); }}
          style={styles.reviewCta}
        >
          <Text style={styles.reviewText}>Review Day</Text>
        </Pressable>
      </ScrollView>

      {/* Modal lives at screen root; stays decoupled */}
      <DailyReviewModal />
    </>
  );
};

const styles = StyleSheet.create({
  title:{ color:'#FFF', fontSize:28, fontWeight:'800' },
  headerRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  subtle:{ color:'rgba(255,255,255,0.7)' },
  reviewCta:{
    marginTop:16,
    borderRadius:16,
    borderColor:'rgba(255,255,255,0.08)',
    borderWidth:1,
    paddingVertical:14,
    alignItems:'center',
    backgroundColor:'rgba(255,255,255,0.06)'
  },
  reviewText:{ color:'#FFF', fontWeight:'800', fontSize:16 }
});