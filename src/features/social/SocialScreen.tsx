import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useStore } from '../../state/rootStore';
import { ShareComposer } from './ShareComposer';
import { PostCard } from './PostCard';
import { Post } from '../../state/slices/socialSlice';

export const SocialScreen = () => {
  const feedView = useStore(s=>s.feedView);
  const setFeedView = useStore(s=>s.setFeedView);
  const circle = useStore(s=>s.circleFeed);
  const follow = useStore(s=>s.followFeed);
  const posts: Post[] = feedView==='circle'?circle:follow;
  const openShare = useStore(s=>s.openShare);

  return (
    <>
      <ScrollView style={{ flex:1, backgroundColor:'#000' }} contentContainerStyle={{ padding:16, paddingBottom:120 }}>
        {/* Tabs */}
        <View style={styles.switch}>
          <Pressable onPress={()=>setFeedView('circle')} style={[styles.tab, feedView==='circle'&&styles.active]}><Text style={styles.tabText}>Circle</Text></Pressable>
          <Pressable onPress={()=>setFeedView('follow')} style={[styles.tab, feedView==='follow'&&styles.active]}><Text style={styles.tabText}>Follow</Text></Pressable>
        </View>

        {/* Always-on prompt with suggestions */}
        <View style={styles.promptCard}>
          <Text style={styles.promptTitle}>Share something</Text>
          <View style={styles.promptChips}>
            {["What's your biggest insight today?","The hardest thing about today was...","A small win I'm proud of..."].map(seed => (
              <Pressable key={seed} onPress={()=>openShare({ type:'status', visibility:feedView, promptSeed:seed })} style={styles.chip}>
                <Text style={styles.chipText}>{seed}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.quickRow}>
            <Pressable onPress={()=>openShare({ type:'status', visibility:feedView })} style={styles.quickBtn}><Text style={styles.quickText}>✍️ Status</Text></Pressable>
            <Pressable onPress={()=>openShare({ type:'photo', visibility:feedView })} style={styles.quickBtn}><Text style={styles.quickText}>🖼️ Photo</Text></Pressable>
            <Pressable onPress={()=>openShare({ type:'audio', visibility:feedView })} style={styles.quickBtn}><Text style={styles.quickText}>🎙️ Audio</Text></Pressable>
          </View>
        </View>

        {/* Feed */}
        {posts.map(p => <PostCard key={p.id} post={p} which={feedView} />)}
      </ScrollView>
      <ShareComposer />
    </>
  );
};

const styles=StyleSheet.create({
  switch:{ flexDirection:'row', gap:8, marginBottom:16 },
  tab:{ flex:1, borderWidth:1, borderColor:'rgba(255,255,255,0.08)', borderRadius:16, paddingVertical:12, alignItems:'center' },
  active:{ backgroundColor:'rgba(255,255,255,0.06)' },
  tabText:{ color:'#FFFFFF', fontWeight:'700' },
  promptCard:{ borderWidth:1, borderColor:'rgba(255,255,255,0.1)', backgroundColor:'rgba(255,255,255,0.04)', borderRadius:16, padding:14, marginBottom:16 },
  promptTitle:{ color:'#FFF', fontWeight:'800', marginBottom:8 },
  promptChips:{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:10 },
  chip:{ borderWidth:1, borderColor:'rgba(255,255,255,0.12)', backgroundColor:'rgba(255,255,255,0.06)', borderRadius:999, paddingVertical:8, paddingHorizontal:12 },
  chipText:{ color:'#ECEDEF' },
  quickRow:{ flexDirection:'row', gap:8 },
  quickBtn:{ flex:1, alignItems:'center', paddingVertical:10, borderRadius:12, borderWidth:1, borderColor:'rgba(255,255,255,0.12)', backgroundColor:'rgba(255,255,255,0.06)' },
  quickText:{ color:'#FFF', fontWeight:'700' },
});