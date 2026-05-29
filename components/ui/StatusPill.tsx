import React from 'react';
import { Text, View } from 'react-native';

import { type SavedQuote } from '../../data';

export function StatusPill({ label }: { label: SavedQuote['status'] }) {
  const saved = label === 'Saved';

  return (
    <View className={`rounded-full px-3 py-1 ${saved ? 'bg-[#dcfce7]' : 'bg-[#ffedd5]'}`}>
      <Text className={`text-xs font-black ${saved ? 'text-[#166534]' : 'text-[#c2410c]'}`}>
        {label}
      </Text>
    </View>
  );
}
