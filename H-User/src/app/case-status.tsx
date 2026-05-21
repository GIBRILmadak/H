import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Linking, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';

export default function CaseStatusScreen() {
  const router = useRouter();
  const { risk } = useLocalSearchParams();
  const { updateUser } = useAppStore();

  useEffect(() => {
    if (risk) {
      updateUser({ status: risk as any });
    }
  }, [risk]);

  const getRiskContent = () => {
    switch (risk) {
      case 'danger':
        return {
          title: 'ALERTE : Risque Élevé',
          subtitle: 'Vos symptômes et contacts suggèrent une probabilité élevée de virus Ebola.',
          color: '#EF4444',
          icon: 'alert-circle',
          recommendations: [
            'Isolez-vous immédiatement de votre entourage.',
            'Ne touchez personne et ne partagez aucun objet.',
            'Appelez d\'urgence le 151 pour une prise en charge.'
          ]
        };
      case 'warning':
        return {
          title: 'Attention : Risque Modéré',
          subtitle: 'Certains de vos symptômes nécessitent une surveillance étroite.',
          color: '#F59E0B',
          icon: 'warning',
          recommendations: [
            'Restez chez vous et surveillez votre température.',
            'Évitez les lieux publics.',
            'Si les symptômes s\'aggravent, contactez le 151.'
          ]
        };
      default:
        return {
          title: 'Risque Faible',
          subtitle: 'Votre état actuel ne présente pas de signes alarmants d\'Ebola.',
          color: '#10B981',
          icon: 'shield-checkmark',
          recommendations: [
            'Continuez à respecter les gestes barrières.',
            'Lavez-vous les mains régulièrement.',
            'Signalez toute nouvelle évolution de votre état.'
          ]
        };
    }
  };

  const content = getRiskContent();

  const handleCallSOS = () => {
    const phoneNumber = 'tel:151';
    Linking.openURL(phoneNumber);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.resultHeader}>
          <View style={[styles.iconContainer, { backgroundColor: content.color + '15' }]}>
            <Ionicons name={content.icon as any} color={content.color} size={64} />
          </View>
          <Typography variant="h1" align="center" style={{ color: content.color }}>{content.title}</Typography>
          <Typography variant="body" align="center" color={Theme.colors.textSecondary}>
            {content.subtitle}
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>Directives de sécurité</Typography>
          <Card style={styles.recommendationCard}>
            {content.recommendations.map((text, index) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={styles.recIcon}>
                   <Ionicons name="ellipse" size={8} color={content.color} />
                </View>
                <Typography variant="body" style={styles.recText}>{text}</Typography>
              </View>
            ))}
          </Card>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>Assistance Immédiate</Typography>
          <Button
            label={risk === 'danger' ? "APPELER LE 151 MAINTENANT" : "Appeler le numéro vert (151)"}
            variant={risk === 'danger' ? "primary" : "outline"}
            size="lg"
            icon={<Ionicons name="call" size={20} color={risk === 'danger' ? "#FFFFFF" : Theme.colors.primary} />}
            onPress={handleCallSOS}
            style={[styles.actionButton, risk === 'danger' && { backgroundColor: '#EF4444' }]}
          />
          <Button
            label="Trouver le centre de santé le plus proche"
            variant="ghost"
            size="md"
            onPress={() => router.replace('/(tabs)/map')}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Retour à l'accueil"
          variant="primary"
          size="lg"
          onPress={() => router.replace('/(tabs)')}
          style={{ backgroundColor: '#000000' }}
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
  scrollContent: {
    padding: Theme.spacing.lg,
  },
  resultHeader: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
    gap: 16,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
  },
  recommendationCard: {
    padding: 20,
    gap: 16,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 0,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recIcon: {
    marginRight: 12,
  },
  recText: {
    flex: 1,
    color: '#374151',
    fontSize: 15,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
