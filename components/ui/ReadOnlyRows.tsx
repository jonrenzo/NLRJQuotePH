import React from 'react';
import { Text, View } from 'react-native';

export function ReadOnlyRows({ rows }: { rows: [string, string][] }) {
  return (
    <View className="gap-2">
      {rows.map(([label, value]) => (
        <View
          key={label}
          className="flex-row items-center justify-between rounded-2xl bg-[#f8fafc] p-4">
          <Text className="font-semibold text-[#64748b]">{label}</Text>
          <Text className="text-lg font-black text-[#111827]">{value}</Text>
        </View>
      ))}
    </View>
  );
}
