import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, Platform, StatusBar } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um título de filme válido.');
      return;
    }
    try {
      const apiKey = '1993e977'; // Substitua pelo seu próprio API Key
      const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do filme. Tente novamente mais tarde.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.subtitle}>Veja Sua Localização Aqui!</Text>
          <Text style={styles.locationText}>Latitude: {location.coords.latitude}</Text>
          <Text style={styles.locationText}>Longitude: {location.coords.longitude}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Você Está Aqui!"
            />
          </MapView>
        </View>
      )}

      {movieData && (
        <View style={styles.movieDataContainer}>
          <Text style={styles.subtitle}>{movieData.Title}</Text>
          <Text style={styles.movieText}>Ano: {movieData.Year}</Text>
          <Text style={styles.movieText}>Gênero: {movieData.Genre}</Text>
          <Text style={styles.movieText}>Diretor: {movieData.Director}</Text>
          <Text style={styles.movieText}>Prêmios: {movieData.Awards}</Text>
        </View>
      )}

      <Text style={styles.title}>Filmes e Localizações</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do filme"
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)}
      />
      
      <View style={styles.buttonContainer}>
        <Button title="Buscar Filme" onPress={handleSearch} color="#1E90FF"/>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 30 : 30, // Adiciona espaço no topo
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
  buttonContainer: {
    marginBottom: 30,
    width: '100%',
  },
  movieDataContainer: {
    padding: 20,
    backgroundColor: '#4682B4',
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  movieText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 5,
  },
  locationContainer: {
    padding: 20,
    backgroundColor: '#4682B4',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  locationText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
});

export default App;
