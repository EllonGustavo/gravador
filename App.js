//cSpell: ignore gravacao botao comecar
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Button, TouchableOpacity, SafeAreaView, View } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const [gravando, setGravando] = useState();
  const [Som, setSom] = useState();
  const [uriSalva, setUriSalva] = useState(null)

  /*Funções para reproduzir o som
    async function TocarSom() {
    try {
      console.log('Som carregado');
      const { som } = await Audio.Sound.createAsync(uriSalva);
      setSound(som);

      console.log('Reproduzindo Som');
      await som.playAsync();
    } catch (erro) {
      console.log("erro ao reproduzir o audio: ", erro)
    }
  }

  useEffect(() => {
    return Som ? () => {
      console.log('Descarregando som');
      Som.unloadAsync();
    }
      : undefined;
  }, [Som]);*/

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
    setUriSalva(uri)
    console.log('Gravação parada e armazenada em: ', uri);
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.botaoGravar}
        onPressIn={ComecarGravacao}
        onPressOut={PararGravacao}>
        <MaterialCommunityIcons name={gravando? 'stop':"record-rec"} size={100} color="#0f0f0f" />
      </TouchableOpacity>
      {/*
      <TouchableOpacity
        style={styles.botaoGravar}
        disabled={uriSalva ? false : true}
        onPress={TocarSom}>
      </TouchableOpacity>*/}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f'
  },
  botaoGravar: {
    backgroundColor: '#ff0000',
    margin: 10,
    width: 150,
    height: 150,
    borderRadius: 25,
    alignItems:'center',
    justifyContent:'center'
  }
})
