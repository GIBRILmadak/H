import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Theme } from '@/constants/theme';

interface TypographyProps extends TextProps {
  variant?: keyof typeof Theme.typography;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color,
  align = 'left',
  style,
  children,
  ...props
}) => {
  const textStyle = [
    Theme.typography[variant],
    { color: color || Theme.colors.text },
    { textAlign: align },
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};
