import React from 'react';
import { ScrollView } from 'react-native';

export function ScreenFrame({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-5 pb-6 pt-3"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}
