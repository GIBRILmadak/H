import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Theme } from '@/constants/theme';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'flat' | 'outline';
  padding?: keyof typeof Theme.spacing;
}

export const Card: React.FC<CardProps> = ({
  variant = 'flat',
  padding = 'md',
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        { padding: Theme.spacing[padding] },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Theme.borderRadius.xl,
    backgroundColor: Theme.colors.card,
    overflow: 'hidden',
  },
  flat: {},
  elevated: {
    backgroundColor: Theme.colors.background,
    ...Theme.shadows.soft,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
});
