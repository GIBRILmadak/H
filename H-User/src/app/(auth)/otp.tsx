import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';

export default function OTPScreen() {
  const router = useRouter();
  const { setAuthenticated } = useAppStore();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setAuthenticated(true);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Typography variant="h2">Verification code</Typography>
            <Typography variant="body" style={styles.subtitle}>
              We've sent a 6-digit code to your phone number.
            </Typography>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="0 0 0 0 0 0"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              autoFocus
              letterSpacing={10}
              textAlign="center"
            />
          </View>

          <View style={styles.footer}>
            <Button
              label="Verify"
              variant="primary"
              size="lg"
              loading={isLoading}
              disabled={otp.length < 6}
              onPress={handleVerify}
            />
            <Button
              label="Resend code"
              variant="ghost"
              size="md"
              onPress={() => {}}
              style={styles.resendButton}
            />
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
    alignItems: 'center',
    marginTop: -Theme.spacing.xxl,
  },
  input: {
    width: '100%',
    fontSize: 32,
    fontWeight: '700',
    color: Theme.colors.text,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
  },
  footer: {
    marginBottom: Theme.spacing.xl,
  },
  resendButton: {
    marginTop: Theme.spacing.md,
  },
});