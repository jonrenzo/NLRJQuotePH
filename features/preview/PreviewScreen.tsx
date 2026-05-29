import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import React, { useCallback, useRef } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { appThemeStyles, themeStyles } from '../../config/theme';
import { type CalculatedQuote, type QuoteForm, type QuoteTheme, type Settings } from '../../data';
import { buildQuoteNumber, formatDate, formatPhp, parseMoney } from '../../lib/quote';
import { Icon, type AppIconName } from '../../components/ui/Icon';
import { RoundButton } from '../../components/ui/RoundButton';
import { ScreenFrame } from '../../components/ui/ScreenFrame';

const appIcon = require('../../assets/icon.png');

export function PreviewScreen({
  form,
  calculated,
  settings,
  theme,
  quoteId,
  issuedAt,
  onBackToEdit,
  onSaveQuote,
}: {
  form: QuoteForm;
  calculated: CalculatedQuote;
  settings: Settings;
  theme: QuoteTheme;
  quoteId: string;
  issuedAt: string;
  onBackToEdit: () => void;
  onSaveQuote: () => void;
}) {
  const appPalette = appThemeStyles[theme];
  const quoteCardRef = useRef<View>(null);

  const shareQuoteImage = useCallback(async () => {
    try {
      const uri = await captureRef(quoteCardRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing unavailable', 'This device does not support native sharing.');
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share quotation',
      });
    } catch {
      Alert.alert('Share failed', 'The quotation image could not be generated.');
    }
  }, []);

  const saveQuoteToGallery = useCallback(async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Grant photo library access in Settings to save quotation images.'
        );
        return;
      }

      const uri = await captureRef(quoteCardRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      const asset = await MediaLibrary.createAssetAsync(uri);
      if (asset) {
        Alert.alert('Saved to Gallery', 'The quotation image has been saved to your photo library.');
      }
    } catch {
      Alert.alert('Save failed', 'The quotation image could not be saved to the gallery.');
    }
  }, []);

  const quoteNumber = buildQuoteNumber(quoteId, issuedAt);

  return (
    <ScreenFrame>
      <View className="mb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-semibold uppercase tracking-wide text-[#64748b]">
            Quotation preview
          </Text>
          <Text className="mt-1 text-4xl font-black text-[#111827]">Ready to send</Text>
        </View>
        <RoundButton icon="edit-2" onPress={onBackToEdit} />
      </View>

      <View
        ref={quoteCardRef}
        collapsable={false}
        className="rounded-[20px] p-4"
        style={{ backgroundColor: themeStyles[settings.theme].outerBg }}>
        <View
          className="rounded-[10px] border bg-white px-5 py-6"
          style={{ borderColor: themeStyles[settings.theme].paperBorder }}>
          <QuoteCard
            form={form}
            calculated={calculated}
            settings={settings}
            quoteNumber={quoteNumber}
            issuedAt={issuedAt}
          />
        </View>
      </View>

      <View className="mt-5 gap-3 pb-28">
        <Pressable
          onPress={shareQuoteImage}
          className="flex-row items-center justify-center rounded-2xl py-4"
          style={{ backgroundColor: appPalette.primaryBtnBg }}>
          <Icon name="share-2" size={18} color="#ffffff" />
          <Text className="ml-2 font-black text-white">Share as Image</Text>
        </Pressable>
        <Pressable
          onPress={saveQuoteToGallery}
          className="flex-row items-center justify-center rounded-2xl border border-[#cbd5e1] bg-white py-4">
          <Icon name="download" size={18} color="#111827" />
          <Text className="ml-2 font-black text-[#111827]">Save to Gallery</Text>
        </Pressable>
        <View className="flex-row gap-3">
          <Pressable
            onPress={onBackToEdit}
            className="flex-1 items-center rounded-2xl border border-[#cbd5e1] bg-white py-4">
            <Text className="font-black text-[#111827]">Back to Edit</Text>
          </Pressable>
          <Pressable
            onPress={onSaveQuote}
            className="flex-1 items-center rounded-2xl py-4"
            style={{ backgroundColor: appPalette.primaryBtnBg }}>
            <Text className="font-black text-white">Save Quote</Text>
          </Pressable>
        </View>
      </View>
    </ScreenFrame>
  );
}

function QuoteCard({
  form,
  calculated,
  settings,
  quoteNumber,
  issuedAt,
}: {
  form: QuoteForm;
  calculated: CalculatedQuote;
  settings: Settings;
  quoteNumber: string;
  issuedAt: string;
}) {
  const palette = themeStyles[settings.theme];
  const activeOtherCosts = form.otherCosts.filter(
    (item) => item.label.trim() || parseMoney(item.amount) > 0
  );
  const dieselPrice = parseMoney(form.dieselPrice);
  const currencyNote = 'All amounts in PHP (₱).';

  return (
    <View className="relative">
      <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
        <Text
          className="-rotate-12 text-center text-8xl font-black"
          style={{ color: palette.watermark }}>
          QUOTE
        </Text>
      </View>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 flex-row items-center">
          <Image
            source={settings.logoUri ? { uri: settings.logoUri } : appIcon}
            className="mr-3 h-20 w-20 rounded-[8px] bg-white"
            resizeMode="contain"
          />
          <View className="flex-1">
            <Text
              className="text-[22px] font-black leading-tight"
              style={{ color: palette.ink }}
              numberOfLines={3}
              adjustsFontSizeToFit
              minimumFontScale={0.82}>
              {settings.businessName}
            </Text>
            <View
              className="mt-2 self-start rounded-md border px-2 py-1"
              style={{
                borderColor: `${palette.accent}22`,
                backgroundColor: `${palette.accent}08`,
              }}>
              <Text
                className="text-[10px] font-black tracking-wide"
                style={{ color: palette.accent }}>
                OFFICIAL QUOTATION
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        className="mt-4 rounded-[10px] border px-4 py-3"
        style={{ borderColor: `${palette.accent}20`, backgroundColor: `${palette.accent}06` }}>
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text
              className="text-[10px] font-bold uppercase tracking-wide"
              style={{ color: '#64748b' }}>
              Quote #
            </Text>
            <Text
              className="mt-1 text-[13px] font-black"
              style={{ color: palette.ink }}
              numberOfLines={1}>
              {quoteNumber}
            </Text>
          </View>
          <View className="items-end">
            <Text
              className="text-[10px] font-bold uppercase tracking-wide"
              style={{ color: '#64748b' }}>
              Issued
            </Text>
            <Text
              className="mt-1 text-[12px] font-bold"
              style={{ color: palette.ink }}
              numberOfLines={1}>
              {formatDate(issuedAt)}
            </Text>
          </View>
        </View>
      </View>
      <View className="mt-5 h-[1px]" style={{ backgroundColor: `${palette.accent}30` }} />
      <View className="mt-5 flex-row gap-4">
        <View className="flex-1">
          <Text className="text-[10px] font-bold uppercase tracking-wide text-[#64748b]">
            Bill To
          </Text>
          <Text className="mt-1 text-[18px] font-black" style={{ color: palette.ink }}>
            {form.customerName || 'Customer name'}
          </Text>
        </View>
        <View className="w-[120px] items-end">
          <Text className="text-[10px] font-bold uppercase tracking-wide text-[#64748b]">
            Distance
          </Text>
          <Text className="mt-1 text-[14px] font-black" style={{ color: palette.ink }}>
            {parseMoney(form.distanceKm).toFixed(1)} km
          </Text>
        </View>
        <View className="w-[90px] items-end">
          <Text className="text-[10px] font-bold uppercase tracking-wide text-[#64748b]">
            Vehicle
          </Text>
          <Text className="mt-1 text-[14px] font-black" style={{ color: palette.ink }}>
            {form.vehicleType || 'L300'}
          </Text>
        </View>
      </View>
      <View
        className="mt-5 rounded-[10px] border bg-white p-4"
        style={{ borderColor: `${palette.accent}25` }}>
        <View className="flex-row">
          <View
            className="mr-3 mt-[2px] h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: `${palette.accent}12` }}>
            <Icon name="map-pin" size={16} color={palette.accent} />
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-bold uppercase tracking-wide text-[#64748b]">
              Origin
            </Text>
            <Text className="mt-1 text-[13px] font-bold" style={{ color: palette.ink }}>
              {form.pickup || 'Pickup location'}
            </Text>
          </View>
        </View>
        <View
          className="ml-4 mt-3 h-5 w-[1px]"
          style={{ backgroundColor: `${palette.accent}30` }}
        />
        <View className="mt-3 flex-row">
          <View
            className="mr-3 mt-[2px] h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: `${palette.accent}12` }}>
            <Icon name="flag" size={16} color={palette.accent} />
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-bold uppercase tracking-wide text-[#64748b]">
              Destination
            </Text>
            <Text className="mt-1 text-[13px] font-bold" style={{ color: palette.ink }}>
              {form.dropoff || 'Dropoff location'}
            </Text>
          </View>
        </View>
      </View>
      <View className="mt-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-[12px] font-black tracking-wide" style={{ color: palette.ink }}>
            COST BREAKDOWN
          </Text>
          <View
            className="ml-3 h-[1px] flex-1"
            style={{ backgroundColor: `${palette.accent}30` }}
          />
        </View>
        <InvoiceRow
          label="Fuel"
          detail={`${calculated.liters.toFixed(2)} L x ${formatPhp(dieselPrice)} (2-way)`}
          amount={formatPhp(calculated.fuelCost)}
          icon="fuel"
          palette={palette}
        />
        <InvoiceRow
          label="Toll"
          detail="2-way"
          amount={formatPhp(calculated.tollTotal)}
          icon="truck"
          palette={palette}
        />
        {calculated.tollTotal > 0
          ? form.tollSegments.map((segment) => (
              <InvoiceRow
                key={segment.id}
                label={`${segment.expressway}`}
                detail={`${segment.entry} → ${segment.exit}`}
                amount={formatPhp(segment.fee)}
                sub
                icon="corner-down-right"
                palette={palette}
              />
            ))
          : null}
        {activeOtherCosts.length > 0 ? (
          activeOtherCosts.map((item) => (
            <InvoiceRow
              key={item.id}
              label={item.label || 'Other cost'}
              amount={formatPhp(parseMoney(item.amount))}
              icon="plus-circle"
              palette={palette}
            />
          ))
        ) : (
          <InvoiceRow
            label="Other costs"
            amount={formatPhp(0)}
            icon="plus-circle"
            palette={palette}
          />
        )}
        <InvoiceRow
          label="Rate"
          detail={[form.rateType, form.ratePeriod].filter(Boolean).join(' · ')}
          amount={formatPhp(calculated.rateAmount)}
          icon="briefcase"
          palette={palette}
        />
      </View>
      <View
        className="mt-6 rounded-[10px] border px-4 py-4"
        style={{ borderColor: `${palette.accent}35`, backgroundColor: palette.accent }}>
        <View className="flex-row items-end justify-between">
          <View className="flex-1 pr-3">
            <Text
              className="text-[11px] font-bold uppercase tracking-wide"
              style={{ color: palette.highlight }}>
              Grand Total
            </Text>
            <Text className="mt-1 text-[11px] font-semibold text-white/80">{currencyNote}</Text>
          </View>
          <Text className="text-[28px] font-black text-white">
            {formatPhp(calculated.grandTotal)}
          </Text>
        </View>
      </View>
      <View className="mt-5 flex-row items-center justify-between">
        <Text className="text-[11px] font-semibold" style={{ color: '#64748b' }}>
          Generated {formatDate(new Date())}
        </Text>
        {settings.contactNumber ? (
          <Text className="text-[11px] font-semibold" style={{ color: '#64748b' }}>
            Contact: {settings.contactNumber}
          </Text>
        ) : (
          <Text className="text-[11px] font-semibold" style={{ color: '#64748b' }}>
            Thank you.
          </Text>
        )}
      </View>
    </View>
  );
}

function InvoiceRow({
  icon,
  label,
  detail,
  amount,
  sub,
  palette,
}: {
  icon?: AppIconName;
  label: string;
  detail?: string;
  amount: string;
  sub?: boolean;
  palette: { accent: string; ink: string };
}) {
  return (
    <View
      className={`border-b py-3 ${sub ? 'pl-4' : ''}`}
      style={{ borderColor: `${palette.accent}20` }}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center">
            {icon ? (
              <View
                className="mr-2 h-5 w-5 items-center justify-center rounded-full"
                style={{ backgroundColor: `${palette.accent}14` }}>
                <Icon name={icon} size={11} color={sub ? '#475569' : palette.accent} />
              </View>
            ) : null}
            <Text
              className="text-[12px] font-bold"
              style={{ color: sub ? '#475569' : palette.ink }}>
              {label}
            </Text>
          </View>
          {detail ? (
            <Text className="mt-1 text-[11px] font-semibold text-[#64748b]">{detail}</Text>
          ) : null}
        </View>
        <Text className="text-[12px] font-black" style={{ color: sub ? '#475569' : palette.ink }}>
          {amount}
        </Text>
      </View>
    </View>
  );
}
