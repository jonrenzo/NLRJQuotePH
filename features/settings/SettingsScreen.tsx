import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';

import { appThemeStyles, themeOptions } from '../../config/theme';
import { type QuoteTheme, type Settings } from '../../data';
import { Field } from '../../components/ui/Field';
import { RoundButton } from '../../components/ui/RoundButton';
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { SectionCard } from '../../components/ui/SectionCard';

const appIcon = require('../../assets/icon.png');

export function SettingsScreen({
  settings,
  theme,
  onChange,
  onBack,
}: {
  settings: Settings;
  theme: QuoteTheme;
  onChange: (settings: Settings) => void;
  onBack: () => void;
}) {
  const palette = appThemeStyles[theme];

  const pickLogo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to choose a business logo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });

    if (!result.canceled) {
      onChange({ ...settings, logoUri: result.assets[0].uri });
    }
  };

  return (
    <ScreenFrame>
      <View className="mb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-semibold uppercase tracking-wide text-[#64748b]">
            Settings
          </Text>
          <Text className="mt-1 text-4xl font-black text-[#111827]">Business profile</Text>
        </View>
        <RoundButton icon="check" onPress={onBack} />
      </View>

      <SectionCard title="Quotation identity" icon="user" theme={theme}>
        <View className="mb-5 items-center">
          <Image
            source={settings.logoUri ? { uri: settings.logoUri } : appIcon}
            className="h-32 w-32 rounded-[28px] bg-[#f8fafc]"
            resizeMode="contain"
          />
          <Pressable
            onPress={pickLogo}
            className="mt-4 rounded-full px-5 py-3"
            style={{ backgroundColor: palette.primaryBtnBg }}>
            <Text className="font-bold text-white">Choose Logo</Text>
          </Pressable>
        </View>
        <Field
          label="Business name"
          value={settings.businessName}
          onChangeText={(value) => onChange({ ...settings, businessName: value })}
        />
        <Field
          label="Contact number"
          placeholder="Optional"
          value={settings.contactNumber}
          onChangeText={(value) => onChange({ ...settings, contactNumber: value })}
        />
        <Field
          label="Default diesel price per liter"
          keyboardType="decimal-pad"
          value={settings.defaultDieselPrice}
          onChangeText={(value) => onChange({ ...settings, defaultDieselPrice: value })}
        />
        <View className="mb-3">
          <Text className="mb-2 text-xs font-bold uppercase tracking-wide text-[#64748b]">
            Theme
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {themeOptions.map((nextTheme) => {
              const active = settings.theme === nextTheme;
              return (
                <Pressable
                  key={nextTheme}
                  onPress={() => onChange({ ...settings, theme: nextTheme })}
                  className={`w-[31.8%] rounded-2xl border px-3 py-3 ${
                    active ? 'border-[#111827] bg-[#111827]' : 'border-[#d1d5db] bg-white'
                  }`}>
                  <Text
                    className={`text-center text-xs font-black ${active ? 'text-white' : 'text-[#111827]'}`}>
                    {nextTheme}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </SectionCard>
    </ScreenFrame>
  );
}
