import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import { Typography } from './ui/Typography';
import { Card } from './ui/Card';

interface HealthStatusCardProps {
  status: 'safe' | 'warning' | 'danger';
  lastSync: string;
}

export const HealthStatusCard: React.FC<HealthStatusCardProps> = ({ status, lastSync }) => {
  const getStatusData = () => {
    switch (status) {
      case 'safe':
        return {
          title: 'Vous êtes en sécurité',
          description: 'Aucune exposition détectée dans votre zone.',
          syncText: 'Dernière mise à jour il y a ' + lastSync,
          color: '#10B981',
          icon: <Ionicons name="checkmark-circle" color="#10B981" size={48} />,
        };
      case 'warning':
        return {
          title: 'Restez vigilant',
          description: 'Exposition potentielle détectée à proximité.',
          syncText: 'Dernière mise à jour il y a ' + lastSync,
          color: '#F59E0B',
          icon: <Ionicons name="alert-circle" color="#F59E0B" size={48} />,
        };
      case 'danger':
        return {
          title: 'Risque Élevé',
          description: 'Exposition directe confirmée. Suivez le protocole.',
          syncText: 'Dernière mise à jour il y a ' + lastSync,
          color: '#EF4444',
          icon: <Ionicons name="close-circle" color="#EF4444" size={48} />,
        };
    }
  };

  const data = getStatusData();

  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {data.icon}
        </View>
        <View style={styles.textContainer}>
          <Typography variant="h2" style={{ color: data.color }}>{data.title}</Typography>
          <Typography variant="caption" style={styles.syncText}>{data.syncText}</Typography>
        </View>
      </View>

      <Typography variant="body" style={styles.description}>
        {data.description}
      </Typography>

      <View style={styles.footer}>
        <View style={styles.syncIndicator}>
          <View style={[styles.dot, { backgroundColor: data.color }]} />
          <Typography variant="label">Surveillance en direct active</Typography>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.lg,
    borderRadius: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  syncText: {
    color: '#6B7280',
    marginTop: 2,
  },
  description: {
    color: '#374151',
    marginBottom: 20,
    fontSize: 15,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
});
