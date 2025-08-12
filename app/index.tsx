import React from 'react';
import { StatusBar, View, Platform, StyleSheet, Text } from 'react-native';
import { ThemeProvider } from '../providers/ThemeProvider';
import { RootNav } from '../navigation';

export default function Index() {
  // Debug: Show platform
  console.log('Platform.OS:', Platform.OS);
  
  if (Platform.OS === 'web') {
    return (
      <ThemeProvider>
        <View style={styles.webContainer}>
          <Text style={{ color: 'white', position: 'absolute', top: 20, zIndex: 100 }}>
            Web Platform Detected
          </Text>
          <View style={styles.phoneFrame}>
            <StatusBar barStyle="light-content" />
            <RootNav />
          </View>
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <View style={styles.mobileContainer}>
        <StatusBar barStyle="light-content" />
        <RootNav />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    position: 'absolute' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2c2c2c',
    display: 'flex' as any,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: 390,
    height: 844,
    backgroundColor: '#000',
    borderRadius: 40,
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8)' as any,
    border: '8px solid #333' as any,
    position: 'relative' as any,
  },
  mobileContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
});