import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { CheckCircle2, House, BarChart3, User2 } from 'lucide-react-native';
import { DailyScreenVibrant } from './src/features/daily/DailyScreenVibrant';
import { SocialScreen } from './src/features/social/SocialScreen';
import { ProgressScreenVibrant } from './src/features/progress/ProgressScreenVibrant';
import { ProfileScreenVibrant } from './src/features/profile/ProfileScreenVibrant';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent', card: 'transparent', text: '#FFFFFF', border: 'transparent' },
};

export const RootNav = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarBackground: () => (
            <BlurView intensity={80} tint="dark" style={{ flex: 1 }}>
              <LinearGradient
                colors={['rgba(139,92,246,0.15)', 'rgba(255,0,110,0.15)', 'rgba(0,212,255,0.15)']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </BlurView>
          ),
          tabBarStyle: { 
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            height: 70,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen name="Daily" component={DailyScreenVibrant}
          options={{ 
            tabBarIcon: ({color,size,focused}) => (
              <View style={{
                padding: 8,
                borderRadius: 16,
                backgroundColor: focused ? 'rgba(255,0,110,0.2)' : 'transparent',
              }}>
                <CheckCircle2 color={focused ? '#FF006E' : color} size={size}/>
              </View>
            )
          }} />
        <Tab.Screen name="Social" component={SocialScreen}
          options={{ 
            tabBarIcon: ({color,size,focused}) => (
              <View style={{
                padding: 8,
                borderRadius: 16,
                backgroundColor: focused ? 'rgba(139,92,246,0.2)' : 'transparent',
              }}>
                <House color={focused ? '#8B5CF6' : color} size={size}/>
              </View>
            )
          }} />
        <Tab.Screen name="Progress" component={ProgressScreenVibrant}
          options={{ 
            tabBarIcon: ({color,size,focused}) => (
              <View style={{
                padding: 8,
                borderRadius: 16,
                backgroundColor: focused ? 'rgba(0,212,255,0.2)' : 'transparent',
              }}>
                <BarChart3 color={focused ? '#00D4FF' : color} size={size}/>
              </View>
            )
          }} />
        <Tab.Screen name="Profile" component={ProfileScreenVibrant}
          options={{ 
            tabBarIcon: ({color,size,focused}) => (
              <View style={{
                padding: 8,
                borderRadius: 16,
                backgroundColor: focused ? 'rgba(6,255,165,0.2)' : 'transparent',
              }}>
                <User2 color={focused ? '#06FFA5' : color} size={size}/>
              </View>
            )
          }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};