import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GlassSurface } from '../../ui/GlassSurface';
import { useStore } from '../../state/rootStore';

export const PostCard: React.FC<{ id:string; user:string; content:string; reactions:Record<string,number>; when:string; which:'circle'|'follow'}> = ({id,user,content,reactions,when,which})=>{
  const react = useStore(s=>s.react);
  return (
    <GlassSurface style={styles.card}>
      <Text style={styles.user}>{user} • <Text style={styles.when}>{when}</Text></Text>
      <Text style={styles.content}>{content}</Text>
      <View style={styles.row}>
        {['👏','💪','🔥'].map(e=>(
          <Pressable key={e} onPress={()=>react(id,e,which)} style={styles.pill}>
            <Text style={styles.pillText}>{e} {(reactions[e]||0)}</Text>
          </Pressable>
        ))}
      </View>
    </GlassSurface>
  );
};
const styles=StyleSheet.create({
  card:{ padding:16, marginBottom:12 },
  user:{ color:'#FFF', fontWeight:'700' },
  when:{ color:'rgba(255,255,255,0.6)' },
  content:{ color:'#ECEDEF', marginTop:8, marginBottom:12 },
  row:{ flexDirection:'row', gap:8 },
  pill:{ borderColor:'rgba(255,255,255,0.08)', borderWidth:1, paddingVertical:6, paddingHorizontal:12, borderRadius:999 },
  pillText:{ color:'#FFFFFF' }
});