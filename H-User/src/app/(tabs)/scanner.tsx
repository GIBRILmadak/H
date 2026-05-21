import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const MOCK_DEVICES = [
  { id: '1', name: 'Appareil Proche', rssi: -45 },
  { id: '2', name: 'Pixel 7 Pro', rssi: -62 },
];

export default function ScannerScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setDevices(MOCK_DEVICES);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h1">Scanner BLE</Typography>
        <Typography variant="body" color={Theme.colors.textSecondary}>
          Détection des appareils environnants.
        </Typography>
      </View>

      <View style={styles.scannerWrapper}>
        <View style={styles.centerCircle}>
          <Ionicons name="radio-outline" color="#FFFFFF" size={40} />
        </View>
        <Typography variant="h3" style={{ marginTop: 20 }}>
          {isScanning ? "Analyse..." : "Prêt"}
        </Typography>
      </View>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <Card style={styles.deviceCard}>
            <Typography variant="bodyMedium">{item.name}</Typography>
            <Typography variant="caption">RSSI: {item.rssi} dBm</Typography>
          </Card>
        )}
      />

      <View style={styles.footer}>
        <Button
          label={isScanning ? "Analyse en cours..." : "Démarrer le Scan"}
          variant="primary"
          size="lg"
          onPress={startScan}
          disabled={isScanning}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { padding: 24, paddingTop: 40 },
  scannerWrapper: { height: 250, justifyContent: 'center', alignItems: 'center' },
  centerCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  deviceCard: { marginBottom: 10, padding: 15, flexDirection: 'row', justifyContent: 'space-between' },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: Theme.colors.border }
});
