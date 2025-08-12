import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CheckCircle2, House, BarChart3, User2 } from 'lucide-react-native';
import { DailyScreen } from './src/features/daily/DailyScreen';
import { SocialScreen } from './src/features/social/SocialScreen';
import { ProgressScreen } from './src/features/progress/ProgressScreen';
import { ProfileScreen } from './src/features/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#000000', card: '#000000', text: '#FFFFFF', border: 'rgba(255,255,255,0.08)' },
};

export const RootNav = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#000', borderTopColor: 'rgba(255,255,255,0.08)' },
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#8A8F99',
        }}
      >
        <Tab.Screen name="Daily" component={DailyScreen}
          options={{ tabBarIcon: ({color,size}) => <CheckCircle2 color={color} size={size}/> }} />
        <Tab.Screen name="Social" component={SocialScreen}
          options={{ tabBarIcon: ({color,size}) => <House color={color} size={size}/> }} />
        <Tab.Screen name="Progress" component={ProgressScreen}
          options={{ tabBarIcon: ({color,size}) => <BarChart3 color={color} size={size}/> }} />
        <Tab.Screen name="Profile" component={ProfileScreen}
          options={{ tabBarIcon: ({color,size}) => <User2 color={color} size={size}/> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};