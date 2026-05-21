import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.mockMap}>
        <View style={[styles.heatCluster, { top: '30%', left: '40%', width: 100, height: 100, opacity: 0.3 }]} />
        <View style={[styles.heatCluster, { top: '35%', left: '45%', width: 60, height: 60, opacity: 0.5 }]} />
        <View style={[styles.heatCluster, { top: '50%', left: '20%', width: 150, height: 150, opacity: 0.2 }]} />

        <View style={[styles.userLocation, { top: '45%', left: '50%' }]}>
          <View style={styles.userPulse} />
          <View style={styles.userDot} />
        </View>
      </View>

      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="close-outline" color={Theme.colors.text} size={24} />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <Typography variant="body">Ratoma, Conakry</Typography>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="layers-outline" color={Theme.colors.text} size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomControls}>
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton}><Ionicons name="add-circle-outline" size={20} color={Theme.colors.text} /></TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.zoomButton}><Ionicons name="remove-circle-outline" size={20} color={Theme.colors.text} /></TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.locationButton}>
            <Ionicons name="navigate-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.legendCard}>
          <Typography variant="label" style={{ marginBottom: 8 }}>INTENSITÉ ÉPIDÉMIQUE</Typography>
          <View style={styles.legendGradient} />
          <View style={styles.legendLabels}>
            <Typography variant="caption">Faible</Typography>
            <Typography variant="caption">Modérée</Typography>
            <Typography variant="caption">Risque Élevé</Typography>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  mockMap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F0F0F0',
  },
  heatCluster: {
    position: 'absolute',
    backgroundColor: Theme.colors.danger,
    borderRadius: 100,
  },
  userLocation: {
    position: 'absolute',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2E90FA',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E90FA',
    opacity: 0.2,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
    alignItems: 'center',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.soft,
  },
  searchBar: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.lg,
    ...Theme.shadows.soft,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 140,
    right: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  zoomControls: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    ...Theme.shadows.soft,
  },
  zoomButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginHorizontal: 8,
  },
  locationButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.medium,
  },
  legendCard: {
    margin: Theme.spacing.lg,
    marginBottom: 40,
    padding: Theme.spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.lg,
    ...Theme.shadows.medium,
  },
  legendGradient: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
  legendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});
