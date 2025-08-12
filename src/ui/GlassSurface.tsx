import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../providers/ThemeProvider';

type Props = ViewProps & { intensity?: number; border?: boolean; tint?: 'light'|'dark'|'default' };
export const GlassSurface: React.FC<Props> = ({ style, children, intensity=30, border=true, tint='dark', ...rest }) => {
  const t = useTheme();
  return (
    <View style={[styles.container, { borderColor: border ? t.colors.glassBorder : 'transparent' }, style]} {...rest}>
      <BlurView tint={tint} intensity={intensity} style={StyleSheet.absoluteFillObject} />
      <View style={[styles.fill, { backgroundColor: t.colors.glassFill }]} />
      {children}
    </View>
  );
};
const styles = StyleSheet.create({
  container:{ borderWidth:1, overflow:'hidden', borderRadius:20 },
  fill:{ ...StyleSheet.absoluteFillObject },
});