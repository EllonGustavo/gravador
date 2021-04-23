//cSpell: ignore gravacao botao comecar animacao indice
import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, SafeAreaView, View, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const [gravando, setGravando] = useState();
  const [Som, setSom] = useState();
  const [uriSalva, setUriSalva] = useState(null)
  const valorAnimacao = useRef(new Animated.Value(0)).current
  const [indice, setIndice] = useState(0)
  const animação = (valor) => Animated.timing(valorAnimacao, {
    toValue: valor,
    duration: 10000,
    useNativeDriver: false
  })

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
      console.log('--------------------')
      console.log('Requisitando permissão..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const gravar = new Audio.Recording();
      await gravar.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await gravar.startAsync();
      setGravando(gravar);
      console.log(`gravação iniciada`);
      setIndice(indice===1? 0 : 1)
      animação(indice===1? 0 : 1).start()

    } catch (erro) {
      console.error('falha ao começar a gravar', erro);
    }
  }

  async function PararGravacao() {
    console.log('Parando gravação..');
    setGravando(undefined);
    await gravando.stopAndUnloadAsync();
    const uri = gravando.getURI();
    setUriSalva(uri);
    console.log('Gravação parada e armazenada em:')
    console.log(uri);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.texto}>Pressione para {gravando ? "parar a gravação" : "gravar"}</Text>
      </View>
      <Animated.View style={[styles.container, {
        transform: [{
          rotateX: valorAnimacao.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: ['0deg', '-90deg', '-180deg', '-270deg', '0deg']
          })
        }]
      }]}>
        <TouchableOpacity
          style={styles.botaoGravar}
          onPress={gravando ? PararGravacao : ComecarGravacao}>
          <MaterialCommunityIcons name={gravando ? 'stop' : "record-rec"} size={100} color="#0f0f0f" />
        </TouchableOpacity>
      </Animated.View>
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
    width: 100,
    height: 100,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  texto: {
    color: '#fff',
    marginTop: 50,
    fontSize: 25,
  }
})
