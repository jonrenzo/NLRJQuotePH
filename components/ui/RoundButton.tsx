import React from 'react';
import { Pressable } from 'react-native';
import { Icon, type AppIconName } from './Icon';

export function RoundButton({
  icon,
  onPress,
  small,
}: {
  icon: AppIconName;
  onPress: () => void;
  small?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`${small ? 'h-9 w-9' : 'h-12 w-12'} items-center justify-center rounded-full bg-white`}>
      <Icon name={icon} size={small ? 16 : 20} color="#111827" />
    </Pressable>
  );
}
