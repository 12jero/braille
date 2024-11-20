import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Voice from "react-native-voice";
import DocumentPicker from "react-native-document-picker";
import { print } from "react-native-print";

const BrailleApp = () => {
  // Your code implementation here
  const [text, setText] = useState("");
  const [brailleText, setBrailleText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  // Braille Conversion Logic
  const convertToBraille = (input) => {
    const brailleMap = {
      a: "⠁",
      b: "⠃",
      c: "⠉",
      d: "⠙",
      e: "⠑",
      f: "⠋",
      g: "⠛",
      h: "⠓",
      i: "⠊",
      j: "⠚",
      // Add more mappings here...
    };
    return input
      .toLowerCase()
      .split("")
      .map((char) => brailleMap[char] || char)
      .join(" ");
  };

  // Save to Local Storage
  const saveText = async () => {
    try {
      await AsyncStorage.setItem("brailleText", brailleText);
      alert("Braille text saved!");
    } catch (error) {
      console.error("Error saving text: ", error);
    }
  };

  // Upload File
  const uploadFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.text],
      });
      alert(`File selected: ${res.name}`);
    } catch (err) {
      console.error("File selection error: ", err);
    }
  };

  // Print Text
  const printText = async () => {
    try {
      await print({ html: `<h1>${brailleText}</h1>` });
    } catch (error) {
      console.error("Printing error: ", error);
    }
  };

  // Voice Commands
  const startRecording = async () => {
    setIsRecording(true);
    Voice.start("en-US");
    Voice.onSpeechResults = (result) => {
      const spokenText = result.value[0];
      setText(spokenText);
      setBrailleText(convertToBraille(spokenText));
      setIsRecording(false);
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Braille Converter</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter text"
        value={text}
        onChangeText={(value) => {
          setText(value);
          setBrailleText(convertToBraille(value));
        }}
      />
      <Text style={styles.brailleText}>Braille: {brailleText}</Text>
      <TouchableOpacity style={styles.button} onPress={saveText}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={uploadFile}>
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={printText}>
        <Text style={styles.buttonText}>Print</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={startRecording}>
        <Text style={styles.buttonText}>
          {isRecording ? "Recording..." : "Voice Command"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  // Your styles here
  
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
    },
    brailleText: {
      fontSize: 18,
      marginVertical: 10,
    },
    button: {
      backgroundColor: "#007BFF",
      padding: 15,
      borderRadius: 5,
      alignItems: "center",
      marginVertical: 5,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
    },
  });

export default BrailleApp;
