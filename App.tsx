import React from 'react';
import { StatusBar, View } from 'react-native';
import { ThemeProvider } from './providers/ThemeProvider';
import { RootNav } from './navigation';

export default function App() {
  return (
    <ThemeProvider>
      <View style={{ flex:1, backgroundColor:'#000' }}>
        <StatusBar barStyle="light-content" />
        <RootNav />
      </View>
    </ThemeProvider>
  );
}