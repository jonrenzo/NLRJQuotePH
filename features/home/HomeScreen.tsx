import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { appThemeStyles } from '../../config/theme';
import { type QuoteTheme, type SavedQuote, type Settings } from '../../data';
import { formatDate, formatPhp } from '../../lib/quote';
import { RoundButton } from '../../components/ui/RoundButton';
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { StatusPill } from '../../components/ui/StatusPill';
import { Icon } from '../../components/ui/Icon';

const appIcon = require('../../assets/icon.png');

export function HomeScreen({
  settings,
  theme,
  savedQuotes,
  onNewQuote,
  onOpenQuote,
  onDeleteQuote,
  onOpenSettings,
}: {
  settings: Settings;
  theme: QuoteTheme;
  savedQuotes: SavedQuote[];
  onNewQuote: () => void;
  onOpenQuote: (quote: SavedQuote) => void;
  onDeleteQuote: (id: string) => void;
  onOpenSettings: () => void;
}) {
  const totalQuoted = savedQuotes.reduce((sum, quote) => sum + quote.grandTotal, 0);
  const palette = appThemeStyles[theme];

  return (
    <ScreenFrame>
      <View className="mb-5 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image
            source={settings.logoUri ? { uri: settings.logoUri } : appIcon}
            className="mr-3 h-14 w-14 rounded-2xl bg-white"
            resizeMode="contain"
          />
          <View>
            <Text className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
              Trucking quotation
            </Text>
            <Text className="text-2xl font-black text-[#111827]">{settings.businessName}</Text>
          </View>
        </View>
        <RoundButton icon="settings" onPress={onOpenSettings} />
      </View>

      <View className="mb-5 rounded-[28px] p-5" style={{ backgroundColor: palette.primaryBtnBg }}>
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-sm font-semibold text-[#a7f3d0]">Current pipeline</Text>
            <Text className="mt-2 text-4xl font-black text-white">{formatPhp(totalQuoted)}</Text>
            <Text className="mt-1 text-sm text-[#d1d5db]">
              {savedQuotes.length} saved quotations
            </Text>
          </View>
          <Pressable
            onPress={onNewQuote}
            className="h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: palette.tabActiveBg }}>
            <Icon name="plus" size={24} color={palette.primaryBtnBg} />
          </Pressable>
        </View>
      </View>

      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-black text-[#111827]">Saved quotations</Text>
        <Pressable onPress={onNewQuote} className="rounded-full bg-white px-4 py-2">
          <Text className="text-sm font-bold text-[#1d4ed8]">New quote</Text>
        </Pressable>
      </View>

      {savedQuotes.length === 0 ? (
        <EmptyState onNewQuote={onNewQuote} />
      ) : (
        <View className="gap-3 pb-28">
          {savedQuotes.map((quote) => (
            <QuoteListItem
              key={quote.id}
              quote={quote}
              onPress={() => onOpenQuote(quote)}
              onDelete={() => onDeleteQuote(quote.id)}
            />
          ))}
        </View>
      )}
    </ScreenFrame>
  );
}

function QuoteListItem({
  quote,
  onPress,
  onDelete,
}: {
  quote: SavedQuote;
  onPress: () => void;
  onDelete: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="rounded-[28px] bg-white p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <View className="mb-2 flex-row items-center">
            <StatusPill label={quote.status} />
            <Text className="ml-2 text-xs font-semibold text-[#64748b]">
              Updated {formatDate(quote.updatedAt)}
            </Text>
          </View>
          <Text className="text-xl font-black text-[#111827]">{quote.customerName}</Text>
          <Text className="mt-1 text-sm font-semibold text-[#64748b]">
            {quote.pickup} to {quote.dropoff}
          </Text>
          <Text className="mt-3 text-3xl font-black text-[#111827]">
            {formatPhp(quote.grandTotal)}
          </Text>
        </View>
        <Pressable
          onPress={onDelete}
          className="h-10 w-10 items-center justify-center rounded-full bg-[#fee2e2]">
          <Icon name="trash-2" size={17} color="#dc2626" />
        </Pressable>
      </View>
    </Pressable>
  );
}

function EmptyState({ onNewQuote }: { onNewQuote: () => void }) {
  return (
    <View className="items-center rounded-[30px] bg-white p-8">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-[#eff6ff]">
        <Icon name="file-text" size={30} color="#1d4ed8" />
      </View>
      <Text className="mt-5 text-center text-2xl font-black text-[#111827]">No quotations yet</Text>
      <Text className="mt-2 text-center leading-5 text-[#64748b]">
        Start with one route, enter the Google Maps distance, then preview and share the quotation.
      </Text>
      <Pressable onPress={onNewQuote} className="mt-6 rounded-2xl bg-[#16a34a] px-6 py-4">
        <Text className="font-black text-white">Create Quotation</Text>
      </Pressable>
    </View>
  );
}
