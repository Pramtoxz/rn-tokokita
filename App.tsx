import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './src/HomeStack';
import ProfilePage from './src/ProfilePage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TabApp = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <TabApp.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}>
        <TabApp.Screen name="Home" component={HomePage} />
        <TabApp.Screen name="Profile" component={ProfilePage} />
      </TabApp.Navigator>
    </NavigationContainer>
  );
}
