import React from 'react';
import { Text, TextInput, View } from 'react-native';

export function Field({
  label,
  ...inputProps
}: React.ComponentProps<typeof TextInput> & {
  label: string;
}) {
  return (
    <View className="mb-3">
      <Text className="mb-2 text-xs font-bold uppercase tracking-wide text-[#64748b]">{label}</Text>
      <TextInput
        {...inputProps}
        className="h-14 rounded-2xl bg-[#f8fafc] px-4 text-base font-semibold text-[#111827]"
        placeholderTextColor="#94a3b8"
      />
    </View>
  );
}
