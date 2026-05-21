import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function DailyCheckScreen() {
  const router = useRouter();
  const [temperature, setTemperature] = useState('');
  const [feeling, setFeeling] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (!temperature || !feeling) {
      Alert.alert("Information manquante", "Veuillez renseigner votre température et votre état général.");
      return;
    }

    const temp = parseFloat(temperature.replace(',', '.'));
    if (isNaN(temp) || temp < 34 || temp > 43) {
      Alert.alert("Valeur invalide", "Veuillez entrer une température corporelle valide (ex: 37.5).");
      return;
    }

    setLoading(true);
    // Simulation d'enregistrement local
    setTimeout(() => {
      setLoading(false);
      if (temp >= 38.5) {
        Alert.alert(
          "Alerte Température",
          "Votre température est élevée. Il est recommandé de faire le test complet de signalement des symptômes.",
          [
            { text: "Plus tard", onPress: () => router.replace('/(tabs)') },
            { text: "Faire le test", onPress: () => router.replace('/questionnaire') }
          ]
        );
      } else {
        Alert.alert("Enregistré", "Votre suivi quotidien a été mis à jour. Merci de votre vigilance.", [
          { text: "OK", onPress: () => router.replace('/(tabs)') }
        ]);
      }
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" color={Theme.colors.text} size={24} />
        </TouchableOpacity>
        <Typography variant="h2" style={{ marginLeft: 16 }}>Suivi Quotidien</Typography>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Typography variant="body" color={Theme.colors.textSecondary} style={{ marginBottom: 24 }}>
          Prenez quelques secondes pour enregistrer vos constantes aujourd'hui.
        </Typography>

        <View style={styles.section}>
          <Typography variant="label" style={styles.label}>TEMPÉRATURE CORPORELLE (°C)</Typography>
          <Card style={styles.inputCard}>
            <Ionicons name="thermometer-outline" size={24} color="#6941C6" />
            <TextInput
              style={styles.input}
              placeholder="Ex: 37.2"
              keyboardType="decimal-pad"
              value={temperature}
              onChangeText={setTemperature}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Typography variant="label" style={styles.label}>COMMENT VOUS SENTEZ-VOUS ?</Typography>
          <View style={styles.feelingGrid}>
            {[
              { id: 'good', label: 'Bien', icon: 'happy-outline', color: '#10B981' },
              { id: 'neutral', label: 'Moyen', icon: 'meh-outline', color: '#F59E0B' },
              { id: 'bad', label: 'Mal', icon: 'sad-outline', color: '#EF4444' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.feelingBtn,
                  feeling === item.id && { backgroundColor: item.color + '15', borderColor: item.color }
                ]}
                onPress={() => setFeeling(item.id)}
              >
                <Ionicons
                  name={item.icon as any}
                  size={32}
                  color={feeling === item.id ? item.color : '#9CA3AF'}
                />
                <Typography
                  variant="caption"
                  style={{ marginTop: 8, color: feeling === item.id ? item.color : '#9CA3AF' }}
                >
                  {item.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
          <Typography variant="caption" style={styles.infoText}>
            Ces données sont stockées uniquement sur votre appareil et servent à détecter les changements brusques de santé.
          </Typography>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Enregistrer le suivi"
          variant="primary"
          size="lg"
          onPress={handleSave}
          loading={loading}
          style={{ backgroundColor: '#6941C6' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    marginBottom: 12,
    color: '#6B7280',
    fontSize: 12,
    letterSpacing: 1,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  feelingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  feelingBtn: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 20,
  },
  infoText: {
    flex: 1,
    color: '#6B7280',
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
