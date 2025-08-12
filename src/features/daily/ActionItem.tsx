import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CheckCircle, Circle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { GlassSurface } from '../../ui/GlassSurface';
import { useStore } from '../../state/rootStore';

export const ActionItem: React.FC<{ id:string; title:string; goalTitle?:string; done?:boolean; streak:number; }> = ({ id, title, goalTitle, done, streak }) => {
  const toggle = useStore(s=>s.toggleAction);
  return (
    <GlassSurface style={styles.card}>
      <Pressable onPress={() => { toggle(id); Haptics.selectionAsync(); }} style={styles.row}>
        {done ? <CheckCircle color="#FFFFFF" /> : <Circle color="rgba(255,255,255,0.5)"/>}
        <View style={{ flex:1, marginLeft:12 }}>
          <Text style={styles.title}>{title}</Text>
          {goalTitle ? <Text style={styles.meta}>{goalTitle} • 🔥 {streak}</Text> : <Text style={styles.meta}>🔥 {streak}</Text>}
        </View>
        <Text style={styles.done}>{done ? 'Done' : ''}</Text>
      </Pressable>
    </GlassSurface>
  );
};
const styles = StyleSheet.create({
  card:{ marginBottom:12, padding:14 },
  row:{ flexDirection:'row', alignItems:'center' },
  title:{ color:'#FFF', fontWeight:'700' },
  meta:{ color:'rgba(255,255,255,0.6)', marginTop:2 },
  done:{ color:'#8A8F99' }
});