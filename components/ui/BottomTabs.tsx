import React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { appThemeStyles } from '../../config/theme';
import { type QuoteTheme, type Screen } from '../../data';
import { Icon, type AppIconName } from './Icon';

export function BottomTabs({
  activeScreen,
  theme,
  onHome,
  onNewQuote,
  onPreview,
  onSettings,
}: {
  activeScreen: Screen;
  theme: QuoteTheme;
  onHome: () => void;
  onNewQuote: () => void;
  onPreview: () => void;
  onSettings: () => void;
}) {
  const palette = appThemeStyles[theme];
  return (
    <SafeAreaView edges={['bottom']} className="bg-transparent">
      <View
        className="mx-5 mb-2 flex-row items-center justify-between rounded-full p-2"
        style={{ backgroundColor: palette.tabBg }}>
        <TabButton
          active={activeScreen === 'home'}
          icon="home"
          label="Quotes"
          onPress={onHome}
          theme={theme}
        />
        <TabButton
          active={activeScreen === 'quote'}
          icon="plus"
          label="New"
          onPress={onNewQuote}
          theme={theme}
        />
        <TabButton
          active={activeScreen === 'preview'}
          icon="file-text"
          label="Preview"
          onPress={onPreview}
          theme={theme}
        />
        <TabButton
          active={activeScreen === 'settings'}
          icon="settings"
          label="Settings"
          onPress={onSettings}
          theme={theme}
        />
      </View>
    </SafeAreaView>
  );
}

function TabButton({
  active,
  icon,
  label,
  theme,
  onPress,
}: {
  active: boolean;
  icon: AppIconName;
  label: string;
  theme: QuoteTheme;
  onPress: () => void;
}) {
  const palette = appThemeStyles[theme];
  return (
    <Pressable
      onPress={onPress}
      className={`h-14 min-w-[70px] flex-1 flex-row items-center justify-center rounded-full ${
        active ? '' : 'bg-transparent'
      }`}
      style={active ? { backgroundColor: palette.tabActiveBg } : undefined}>
      <Icon
        name={icon}
        size={25}
        color={active ? palette.tabActiveText : palette.tabInactiveIcon}
      />
      {/*{active ? (
        <Text className="ml-2 text-xs font-black" style={{ color: palette.tabActiveText }}>
          {label}
        </Text>
      ) : null}*/}
    </Pressable>
  );
}
