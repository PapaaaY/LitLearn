// src/components/Modal.js
import React from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';

const CustomModal = ({ visible, onClose, title, children }) => (
  <Modal visible={visible} transparent={true} animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>{title}</Text>
        {children}
        <Button title="Close" onPress={onClose} />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default CustomModal;
