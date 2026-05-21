import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';

export default function WelcomeScreen() {
  const router = useRouter();
  const { setAuthenticated } = useAppStore();

  const handleStart = () => {
    setAuthenticated(true);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../medias/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Typography variant="h1" align="center" style={styles.title}>
          Réseau d'Intelligence{"\n"}Sanitaire
        </Typography>

        <Typography variant="body" align="center" style={styles.subtitle}>
          Une réponse épidémique sécurisée, privée et efficace pour tous.
        </Typography>
      </View>

      <View style={styles.footer}>
        <Button
          label="Commencer"
          variant="primary"
          size="lg"
          onPress={handleStart}
          style={styles.button}
        />
        <Typography variant="caption" align="center" color={Theme.colors.textSecondary}>
          En continuant, vous acceptez nos conditions d'utilisation.
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: Theme.spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    marginBottom: Theme.spacing.md,
  },
  subtitle: {
    color: Theme.colors.textSecondary,
    maxWidth: 280,
  },
  footer: {
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  button: {
    width: '100%',
  },
  ghostButton: {
    marginTop: Theme.spacing.sm,
  },
});
