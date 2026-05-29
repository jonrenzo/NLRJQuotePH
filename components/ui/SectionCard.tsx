import React from 'react';
import { Text, View } from 'react-native';

import { appThemeStyles } from '../../config/theme';
import { type QuoteTheme } from '../../data';
import { Icon, type AppIconName } from './Icon';

export function SectionCard({
  title,
  icon,
  theme,
  children,
}: {
  title: string;
  icon: AppIconName;
  theme?: QuoteTheme;
  children: React.ReactNode;
}) {
  const palette = appThemeStyles[theme ?? 'Navy'];
  return (
    <View className="mb-4 rounded-[28px] p-5" style={{ backgroundColor: palette.cardBg }}>
      <View className="mb-4 flex-row items-center">
        <View
          className="mr-3 h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: palette.sectionIconBg }}>
          <Icon name={icon} size={18} color={palette.sectionIconColor} />
        </View>
        <Text className="text-xl font-black text-[#111827]">{title}</Text>
      </View>
      {children}
    </View>
  );
}
