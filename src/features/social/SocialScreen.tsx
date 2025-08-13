import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useStore } from '../../state/rootStore';
import { ShareComposer } from './ShareComposer';
import { PostCard } from './PostCard';
import { Post } from '../../state/slices/socialSlice';
import { PromptCarousel } from './components/PromptCarousel';

export const SocialScreen = () => {
  const feedView = useStore(s=>s.feedView);
  const setFeedView = useStore(s=>s.setFeedView);
  const circle = useStore(s=>s.circleFeed);
  const follow = useStore(s=>s.followFeed);
  const posts: Post[] = feedView==='circle'?circle:follow;
  const openShare = useStore(s=>s.openShare);

  return (
    <>
      {/* Sticky header with tabs + composer */}
      <View style={styles.stickyHeader}>
        <View style={[styles.switch,{paddingHorizontal:16}]}>
          <Pressable onPress={()=>setFeedView('circle')} style={[styles.tab, feedView==='circle'&&styles.active]}><Text style={styles.tabText}>Circle</Text></Pressable>
          <Pressable onPress={()=>setFeedView('follow')} style={[styles.tab, feedView==='follow'&&styles.active]}><Text style={styles.tabText}>Follow</Text></Pressable>
        </View>
        <View style={{paddingHorizontal:16}}>
          <PromptCarousel
            onSeed={(seed)=>openShare({ type:'status', visibility:feedView, promptSeed:seed })}
            onStatus={()=>openShare({ type:'status', visibility:feedView })}
            onPhoto={()=>openShare({ type:'photo', visibility:feedView })}
            onAudio={()=>openShare({ type:'audio', visibility:feedView })}
          />
        </View>
      </View>

      <ScrollView style={{ flex:1, backgroundColor:'#000' }} contentContainerStyle={{ padding:16, paddingTop:170, paddingBottom:120 }}>
        {/* Feed */}
        {posts.map(p => <PostCard key={p.id} post={p} which={feedView} />)}
      </ScrollView>
      <ShareComposer />
    </>
  );
};

const styles=StyleSheet.create({
  stickyHeader:{ position:'absolute', top:0, left:0, right:0, backgroundColor:'#000', paddingTop:12, zIndex:5 },
  switch:{ flexDirection:'row', gap:8, marginBottom:12 },
  tab:{ flex:1, borderWidth:1, borderColor:'rgba(255,255,255,0.08)', borderRadius:16, paddingVertical:12, alignItems:'center' },
  active:{ backgroundColor:'rgba(255,255,255,0.06)' },
  tabText:{ color:'#FFFFFF', fontWeight:'700' },
});