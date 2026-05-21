import React from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';

export default function ExposureScreen() {
  const { contacts, user } = useAppStore();

  const formatDate = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h1">Historique d'exposition</Typography>
        <View style={styles.idBadge}>
          <Typography variant="caption" color="#6B7280">VOTRE ID : </Typography>
          <Typography variant="label" color={Theme.colors.primary}>{user?.id || '...'}</Typography>
        </View>
      </View>

      {contacts.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="shield-checkmark-outline" size={48} color={Theme.colors.success} />
          </View>
          <Typography variant="h3" align="center">Aucun contact à risque</Typography>
          <Typography variant="body" align="center" color={Theme.colors.textSecondary} style={{ marginTop: 8 }}>
            L'application analyse vos mouvements et les appareils à proximité pour vous protéger.
          </Typography>
        </View>
      ) : (
        <FlatList
          data={[...contacts].reverse()} // Plus récent en premier
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card style={styles.contactCard}>
              <View style={styles.contactIcon}>
                <Ionicons name="bluetooth" size={20} color="#3B82F6" />
              </View>
              <View style={styles.contactInfo}>
                <Typography variant="bodyMedium">Appareil {item.id}</Typography>
                <Typography variant="caption">{formatDate(item.timestamp)}</Typography>
              </View>
              <View style={styles.durationBadge}>
                <Typography variant="caption" color="#6B7280">{item.duration} min</Typography>
              </View>
            </Card>
          )}
        />
      )}

      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
        <Typography variant="caption" style={styles.infoText}>
          Les identifiants sont stockés 24 jours puis supprimés automatiquement pour garantir votre vie privée.
        </Typography>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 24, paddingTop: 40 },
  idBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: '#F3F4F6', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  listContent: { padding: 20, gap: 12 },
  contactCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  contactIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  contactInfo: { flex: 1 },
  durationBadge: { backgroundColor: '#F9FAFB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  infoCard: { margin: 24, padding: 16, backgroundColor: '#F9FAFB', borderRadius: 16, flexDirection: 'row', gap: 12, marginBottom: 120 },
  infoText: { flex: 1, color: '#6B7280', lineHeight: 18 }
});
