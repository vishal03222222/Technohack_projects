import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const TaskItem = ({ task, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const handleUpdate = () => {
    onUpdate(task.id, newTitle);
    setIsEditing(false);
  };

  return (
    <View style={styles.item}>
      {isEditing ? (
        <TextInput
          value={newTitle}
          onChangeText={setNewTitle}
          style={styles.input}
        />
      ) : (
        <Text style={styles.text}>{task.title}</Text>
      )}
      <View style={styles.buttons}>
        {isEditing ? (
          <Button title="Save" onPress={handleUpdate} />
        ) : (
          <Button title="Edit" onPress={() => setIsEditing(true)} />
        )}
        <Button title="Delete" color="red" onPress={() => onDelete(task.id)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#eee', padding: 10,
    marginBottom: 10, borderRadius: 5
  },
  text: { fontSize: 18 },
  input: { fontSize: 18, borderBottomWidth: 1 },
  buttons: { flexDirection: 'row', marginTop: 5, justifyContent: 'space-between' }
});

export default TaskItem;
