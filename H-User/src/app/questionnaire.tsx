import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

const QUESTIONS = [
  {
    id: 'fever',
    text: 'Avez-vous une forte fièvre (plus de 38.5°C) ?',
    options: [
      { label: 'Oui, forte fièvre', score: 3 },
      { label: 'Fièvre légère', score: 1 },
      { label: 'Non, pas de fièvre', score: 0 }
    ],
  },
  {
    id: 'bleeding',
    text: 'Avez-vous des saignements inexpliqués (nez, gencives, sang dans les selles) ?',
    options: [
      { label: 'Oui, saignements visibles', score: 5 },
      { label: 'Petites taches de sang/ecchymoses', score: 2 },
      { label: 'Non, aucun saignement', score: 0 }
    ],
  },
  {
    id: 'digestive',
    text: 'Souffrez-vous de diarrhées intenses ou de vomissements ?',
    options: [
      { label: 'Oui, très fréquents', score: 3 },
      { label: 'Légers troubles', score: 1 },
      { label: 'Non', score: 0 }
    ],
  },
  {
    id: 'contact',
    text: 'Avez-vous été en contact avec une personne malade ou décédée récemment ?',
    options: [
      { label: 'Oui, contact direct', score: 10 },
      { label: 'Peut-être / Pas sûr', score: 4 },
      { label: 'Non, aucun contact', score: 0 }
    ],
  },
  {
    id: 'pain',
    text: 'Ressentez-vous des douleurs musculaires, articulaires ou de forts maux de tête ?',
    options: [
      { label: 'Douleurs intenses', score: 2 },
      { label: 'Douleurs modérées', score: 1 },
      { label: 'Non', score: 0 }
    ],
  },
];

export default function QuestionnaireScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const { user, updateUser } = useAppStore();

  const handleSelect = async (score: number) => {
    const newScore = totalScore + score;
    setTotalScore(newScore);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      let riskLevel: 'safe' | 'warning' | 'danger' = 'safe';
      if (newScore >= 10) riskLevel = 'danger';
      else if (newScore >= 4) riskLevel = 'warning';

      // Envoyer le rapport au cloud
      if (user?.id) {
        await supabase.from('reports').insert({
          user_id: user.id,
          score: newScore,
          risk_level: riskLevel,
          created_at: new Date().toISOString()
        });

        // Mettre à jour le statut local et cloud de l'utilisateur
        updateUser({ status: riskLevel });
      }

      router.replace({
        pathname: '/case-status',
        params: { risk: riskLevel, score: newScore }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close-outline" color={Theme.colors.text} size={24} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${((step + 1) / QUESTIONS.length) * 100}%` }]} />
        </View>
        <Typography variant="label">{step + 1}/{QUESTIONS.length}</Typography>
      </View>

      <View style={styles.content}>
        <Typography variant="caption" color={Theme.colors.primary} style={{ marginBottom: 8 }}>
          DÉPISTAGE EBOLA
        </Typography>
        <Typography variant="h2" style={styles.question}>
          {QUESTIONS[step].text}
        </Typography>

        <View style={styles.optionsContainer}>
          {QUESTIONS[step].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleSelect(option.score)}
            >
              <Typography variant="bodyMedium">{option.label}</Typography>
              <Ionicons name="chevron-forward-outline" size={20} color={Theme.colors.border} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Typography variant="caption" align="center">
          En cas d'urgence immédiate, appelez directement le 151.
        </Typography>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  progressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: Theme.spacing.lg,
    paddingTop: Theme.spacing.xl,
  },
  question: {
    marginBottom: Theme.spacing.xxl,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: Theme.spacing.md,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  footer: {
    padding: Theme.spacing.lg,
  },
});
