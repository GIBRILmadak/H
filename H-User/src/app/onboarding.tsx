import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';

const { width } = Dimensions.get('window');

const SLIDES = [
  { id: '1', title: 'Détecter plus tôt.', description: 'Une surveillance avancée pour identifier les expositions potentielles.' },
  { id: '2', title: 'Protégez votre communauté.', description: 'Chaque action aide à créer un environnement plus sûr.' },
  { id: '3', title: 'La vie privée d’abord.', description: 'Vos données restent sur votre appareil.' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setHasSeenOnboarding } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/permissions');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.circle} />
            <Typography variant="h1" align="center" style={styles.title}>{item.title}</Typography>
            <Typography variant="body" align="center" style={styles.description}>{item.description}</Typography>
          </View>
        )}
      />
      <View style={styles.footer}>
        <Button label="Suivant" variant="primary" size="lg" onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  slide: { width, alignItems: 'center', justifyContent: 'center', padding: 24 },
  circle: { width: 200, height: 200, borderRadius: 100, backgroundColor: Theme.colors.card, marginBottom: 40 },
  title: { marginBottom: 16 },
  description: { color: Theme.colors.textSecondary },
  footer: { padding: 24, paddingBottom: 40 }
});
