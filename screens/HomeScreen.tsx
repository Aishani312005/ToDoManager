import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, TaskType } from '../types.ts';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Pending'>('All');

  const loadTasksFromStorage = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const parsedTasks: TaskType[] = storedTasks ? JSON.parse(storedTasks) : [];
      setTasks(parsedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasksFromStorage();
    }, [])
  );

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'Completed') return task.isCompleted;
    if (filter === 'Pending') return !task.isCompleted;
    return true;
  });

  const markTaskCompleted = async (id: string) => {
    try {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, isCompleted: true } : task
      );
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      console.log(`Task marked as completed: ${id}`);
    } catch (error) {
      console.error('Error marking task completed:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Filter buttons */}
      <View style={styles.filterRow}>
        {['All', 'Completed', 'Pending'].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilter(type as any)}
            style={[
              styles.filterButton,
              filter === type && styles.activeFilterButton,
            ]}
          >
            <Text
              style={{
                fontWeight: filter === type ? 'bold' : 'normal',
              }}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task list */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No tasks found.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddEditTask', { task: item })}
            >
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
              <Text>
                Status: {item.isCompleted ? '✅ Completed' : '⏳ Pending'}
              </Text>
            </TouchableOpacity>

            {!item.isCompleted && (
              <Button
                title="Mark as Completed"
                onPress={() => markTaskCompleted(item.id)}
              />
            )}
          </View>
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title="Add Task"
          onPress={() =>
            navigation.navigate({ name: 'AddEditTask', params: {} })
          }
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeFilterButton: {
    backgroundColor: '#d0f0ff',
  },
  taskItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  taskTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
});
