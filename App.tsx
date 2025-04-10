// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen.tsx';
import HomeScreen from './screens/HomeScreen';
import AddEditTaskScreen from './screens/AddEditTaskScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  AddEditTask: { task?: any } | undefined; // optional param
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddEditTask" component={AddEditTaskScreen} options={{ title: 'Add / Edit Task' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
