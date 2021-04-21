//cSpell: ignore gravacao botao comecar
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Button, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [gravando, setGravando] = useState();
  const [sound, setSound] = useState();
  const [uriSalva, setUriSalva] = useState(null)

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(uriSalva);
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  useEffect(() => {
    return sound ? () => {
      console.log('Unloading Sound');
      sound.unloadAsync();
    }
      : undefined;
  }, [sound]);

  async function ComecarGravacao() {
    try {
      console.log('Requisitando permissão..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('começou a  gravar');
      const gravar = new Audio.Recording();
      await gravar.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await gravar.startAsync();
      setGravando(gravar);
      console.log('gravação iniciada');
    } catch (erro) {
      console.error('falha ao começar a gravar', erro);
    }
  }

  async function PararGravacao() {
    console.log('Parando gravação..');
    setGravando(undefined);
    await gravando.stopAndUnloadAsync();
    const uri = gravando.getURI();
    setUriSalva(uri.toString())
    console.log('Gravação parada e armazenada em: ', uri);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button
        title={gravando ? 'Parar Gravação' : 'Gravar'}
        onPress={gravando ? PararGravacao : ComecarGravacao}
        style={styles.botao} />
      <Button
        title="Play Sound"
        onPress={playSound}
        style={styles.botao} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#101010',
    padding: 10,
  },
  botao: {
    margin: 10,
    backgroundColor: '#ff0000'
  }
})
