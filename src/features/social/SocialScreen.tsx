import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useStore } from '../../state/rootStore';
import { PostCard } from './PostCard';

export const SocialScreen = () => {
  const feedView = useStore(s=>s.feedView);
  const setFeedView = useStore(s=>s.setFeedView);
  const circle = useStore(s=>s.circleFeed);
  const follow = useStore(s=>s.followFeed);
  const posts = feedView==='circle'?circle:follow;

  return (
    <ScrollView style={{ flex:1, backgroundColor:'#000' }} contentContainerStyle={{ padding:16, paddingBottom:100 }}>
      <View style={styles.switch}>
        <Pressable onPress={()=>setFeedView('circle')} style={[styles.tab, feedView==='circle'&&styles.active]}><Text style={styles.tabText}>Circle</Text></Pressable>
        <Pressable onPress={()=>setFeedView('follow')} style={[styles.tab, feedView==='follow'&&styles.active]}><Text style={styles.tabText}>Follow</Text></Pressable>
      </View>
      {posts.map(p => <PostCard key={p.id} id={p.id} user={p.user} content={p.content} reactions={p.reactions} when={p.time} which={feedView}/>)}
    </ScrollView>
  );
};

const styles=StyleSheet.create({
  switch:{ flexDirection:'row', gap:8, marginBottom:16 },
  tab:{ flex:1, borderWidth:1, borderColor:'rgba(255,255,255,0.08)', borderRadius:16, paddingVertical:12, alignItems:'center' },
  active:{ backgroundColor:'rgba(255,255,255,0.06)' },
  tabText:{ color:'#FFFFFF', fontWeight:'700' },
});