import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TaskType } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEditTask'>;

const AddEditTaskScreen = ({ navigation, route }: Props) => {
  const editingTask = route.params?.task;
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');

  const saveTask = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required');
      return;
    }

    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const parsedTasks: TaskType[] = storedTasks ? JSON.parse(storedTasks) : [];

      let updatedTasks: TaskType[];

      if (editingTask) {
        // Update existing task
        updatedTasks = parsedTasks.map((t) =>
          t.id === editingTask.id ? { ...editingTask, title, description } : t
        );
      } else {
        // Add new task
        const newTask: TaskType = {
          id: Date.now().toString(),
          title,
          description,
          isCompleted: false,
        };
        updatedTasks = [...parsedTasks, newTask];
      }

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      console.log('Saved tasks:', updatedTasks);
      navigation.goBack(); // 👈 This is important
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Task title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Task description"
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title={editingTask ? 'Update Task' : 'Add Task'} onPress={saveTask} />
    </View>
  );
};

export default AddEditTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
});
