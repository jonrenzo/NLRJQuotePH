import React from 'react';
import { Pressable, ScrollView, Text } from 'react-native';

export function ChipRow({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
      {options.map((option) => {
        const active = selected === option;

        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            className={`rounded-full px-4 py-3 ${active ? 'bg-[#111827]' : 'bg-[#f1f5f9]'}`}>
            <Text className={`font-bold ${active ? 'text-white' : 'text-[#334155]'}`}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
