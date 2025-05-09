import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import TaskItem from './components/TaskItem';

const db = SQLite.openDatabase('todo.db');

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT);'
      );
    });
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tasks', [], (_, { rows }) => {
        setTasks(rows._array);
      });
    });
  };

  const addTask = () => {
    if (!task.trim()) return;
    db.transaction(tx => {
      tx.executeSql('INSERT INTO tasks (title) values (?)', [task], () => {
        fetchTasks();
        setTask('');
      });
    });
  };

  const deleteTask = id => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM tasks WHERE id = ?', [id], fetchTasks);
    });
  };

  const updateTask = (id, newTitle) => {
    db.transaction(tx => {
      tx.executeSql('UPDATE tasks SET title = ? WHERE id = ?', [newTitle, id], fetchTasks);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={task}
          onChangeText={setTask}
          placeholder="Enter task"
          style={styles.input}
        />
        <Button title="Add" onPress={addTask} />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#aaa', flex: 1,
    marginRight: 10, padding: 10, borderRadius: 5
  }
});
