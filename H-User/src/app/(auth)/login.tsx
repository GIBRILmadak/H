import React, { useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Typography variant="h2">Enter your phone</Typography>
            <Typography variant="body" style={styles.subtitle}>
              We'll send you a verification code to secure your account.
            </Typography>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.prefixContainer}>
              <Typography variant="bodyMedium">+243</Typography>
            </View>
            <TextInput
              style={styles.input}
              placeholder="000 000 000"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              autoFocus
            />
          </View>

          <View style={styles.footer}>
            <Button
              label="Continue"
              variant="primary"
              size="lg"
              disabled={phone.length < 8}
              onPress={() => router.push('/(auth)/otp')}
            />
            <Typography variant="caption" align="center" style={styles.privacyNote}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  inner: {
    flex: 1,
    padding: Theme.spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: Theme.spacing.xxl,
  },
  subtitle: {
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.md,
    height: 60,
    marginTop: -Theme.spacing.xxl,
  },
  prefixContainer: {
    borderRightWidth: 1,
    borderRightColor: Theme.colors.border,
    paddingRight: Theme.spacing.md,
    marginRight: Theme.spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: Theme.colors.text,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  footer: {
    marginBottom: Theme.spacing.xl,
  },
  privacyNote: {
    marginTop: Theme.spacing.lg,
    color: Theme.colors.textSecondary,
  },
});
