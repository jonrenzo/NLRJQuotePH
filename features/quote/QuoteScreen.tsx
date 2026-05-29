import React, { useMemo, useState } from 'react';
import { Alert, Linking, Pressable, Switch, Text, TextInput, View } from 'react-native';

import { tollVehicleClassOptions, appThemeStyles } from '../../config/theme';
import {
  calculateTollRoute,
  calculateTollRouteFromText,
  findMatchingPreset,
  searchTollPoints,
  tollPhSource,
  tollRates,
  type CalculatedQuote,
  type OtherCost,
  type QuoteForm,
  type QuoteTheme,
  type SuggestionStatus,
  type TollPoint,
  type TollRouteCalculation,
  type TollSegment,
  type TollVehicleClass,
} from '../../data';
import { formatPhp } from '../../lib/quote';
import { ChipRow } from '../../components/ui/ChipRow';
import { Field } from '../../components/ui/Field';
import { ReadOnlyRows } from '../../components/ui/ReadOnlyRows';
import { RoundButton } from '../../components/ui/RoundButton';
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { SectionCard } from '../../components/ui/SectionCard';
import { Icon } from '../../components/ui/Icon';

type QuoteScreenProps = {
  form: QuoteForm;
  calculated: CalculatedQuote;
  theme: QuoteTheme;
  onChange: <K extends keyof QuoteForm>(key: K, value: QuoteForm[K]) => void;
  suggestionStatus: SuggestionStatus;
  onSuggestionStatusChange: (status: SuggestionStatus) => void;
  onOpenPreview: () => void;
  onSaveDraft: () => void;
};

export function QuoteScreen({
  form,
  calculated,
  theme,
  onChange,
  suggestionStatus,
  onSuggestionStatusChange,
  onOpenPreview,
  onSaveDraft,
}: QuoteScreenProps) {
  const palette = appThemeStyles[theme];
  const [originPoint, setOriginPoint] = useState<TollPoint | null>(null);
  const [destinationPoint, setDestinationPoint] = useState<TollPoint | null>(null);
  const [originPointQuery, setOriginPointQuery] = useState('');
  const [destinationPointQuery, setDestinationPointQuery] = useState('');
  const [matchedPresetId, setMatchedPresetId] = useState<string | null>(null);
  const selectedTollRoute = useMemo(() => {
    if (!originPoint || !destinationPoint) return null;
    return calculateTollRoute(originPoint.id, destinationPoint.id, form.tollVehicleClass);
  }, [destinationPoint, form.tollVehicleClass, originPoint]);

  const buildTollSegments = (route: TollRouteCalculation): TollSegment[] =>
    route.tollSegments
      .filter((segment) => segment.fee > 0)
      .map((segment, index) => ({
        id: `${Date.now()}-${index}`,
        expressway: segment.networkName,
        entry: `${segment.entryPoint.name} (${segment.entryPoint.expresswayId})`,
        exit: `${segment.exitPoint.name} (${segment.exitPoint.expresswayId})`,
        fee: segment.fee,
        entryPointId: segment.entryPoint.id,
        exitPointId: segment.exitPoint.id,
        rfid: segment.rfid,
      }));

  const applyTollRoute = (
    route: TollRouteCalculation,
    status: SuggestionStatus,
    replaceExisting = false
  ) => {
    const nextSegments = buildTollSegments(route);
    if (nextSegments.length === 0) {
      Alert.alert('No toll fee found', 'Choose a valid entry and exit point.');
      return false;
    }
    onChange(
      'tollSegments',
      replaceExisting ? nextSegments : [...form.tollSegments, ...nextSegments]
    );
    onChange('usesHighway', true);
    onSuggestionStatusChange(status);
    return true;
  };

  const addSelectedTollRoute = () => {
    if (!selectedTollRoute) {
      Alert.alert('Choose toll points', 'Select an entry and exit point first.');
      return;
    }
    applyTollRoute(selectedTollRoute, 'confirmed');
  };

  const removeTollSegment = (id: string) => {
    onChange(
      'tollSegments',
      form.tollSegments.filter((segment) => segment.id !== id)
    );
    onSuggestionStatusChange('confirmed');
  };

  const suggestTollSegments = () => {
    const tollPhRoute = calculateTollRouteFromText(
      form.pickup,
      form.dropoff,
      form.tollVehicleClass
    );

    if (tollPhRoute) {
      const nextSegments = buildTollSegments(tollPhRoute);
      if (nextSegments.length > 0) {
        applyTollRoute(tollPhRoute, 'suggested', true);
        setOriginPoint(tollPhRoute.originMatch.point);
        setDestinationPoint(tollPhRoute.destinationMatch.point);
        setOriginPointQuery(
          `${tollPhRoute.originMatch.point.name} (${tollPhRoute.originMatch.point.expresswayId})`
        );
        setDestinationPointQuery(
          `${tollPhRoute.destinationMatch.point.name} (${tollPhRoute.destinationMatch.point.expresswayId})`
        );
        setMatchedPresetId(null);

        const ambiguityNote =
          tollPhRoute.originMatch.ambiguous || tollPhRoute.destinationMatch.ambiguous
            ? '\n\nOne matched toll point may be ambiguous. Add the expressway name to pickup/dropoff if it chose the wrong point.'
            : '';

        Alert.alert(
          'toll.ph route applied',
          `Matched ${tollPhRoute.originMatch.point.name} (${tollPhRoute.originMatch.point.expresswayId}) to ${tollPhRoute.destinationMatch.point.name} (${tollPhRoute.destinationMatch.point.expresswayId}).\n\nAdded ${nextSegments.length} segment(s): ${formatPhp(tollPhRoute.totalFee)}.${ambiguityNote}`
        );
        return;
      }
    }

    if (form.tollVehicleClass !== 1) {
      setMatchedPresetId(null);
      Alert.alert(
        'No toll.ph route match',
        'The fallback route presets are Class 1 only. Use toll point names or manual toll network segments for Class 2 and Class 3.'
      );
      return;
    }

    const preset = findMatchingPreset(form.pickup, form.dropoff);
    if (!preset) {
      setMatchedPresetId(null);
      Alert.alert(
        'No toll route match',
        'No toll.ph point match or saved preset was found. Use toll point names like Balintawak, Calamba, NAIA Terminal 1, or Batangas.'
      );
      return;
    }

    const missingSegments: string[] = [];
    const nextSegments: TollSegment[] = preset.segments
      .map((segment, index) => {
        const fee = tollRates[segment.expressway]?.[segment.entry]?.[segment.exit] ?? 0;
        if (!fee) {
          missingSegments.push(`${segment.expressway}: ${segment.entry} -> ${segment.exit}`);
          return null;
        }
        return {
          id: `${Date.now()}-${index}`,
          expressway: segment.expressway,
          entry: segment.entry,
          exit: segment.exit,
          fee,
        };
      })
      .filter((segment): segment is TollSegment => Boolean(segment));

    if (nextSegments.length === 0) {
      Alert.alert(
        'No valid segment fees',
        'Matched preset has no valid toll fees in your current table.'
      );
      return;
    }

    onChange('usesHighway', true);
    onChange('tollSegments', nextSegments);
    onSuggestionStatusChange('suggested');
    setMatchedPresetId(preset.id);

    if (missingSegments.length > 0) {
      Alert.alert(
        'Preset applied with warnings',
        `Applied ${nextSegments.length} segment(s). Missing fees:\n${missingSegments.join('\n')}`
      );
      return;
    }

    Alert.alert(
      'Preset applied',
      `Added ${nextSegments.length} toll segment(s). Review then confirm.`
    );
  };

  const confirmSuggestedTolls = () => {
    onSuggestionStatusChange('confirmed');
    Alert.alert('Tolls confirmed', 'Suggested toll segments are now confirmed.');
  };

  const addOtherCost = () => {
    onChange('otherCosts', [...form.otherCosts, { id: `${Date.now()}`, label: '', amount: '' }]);
  };

  const updateOtherCost = (id: string, key: keyof Omit<OtherCost, 'id'>, value: string) => {
    onChange(
      'otherCosts',
      form.otherCosts.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const removeOtherCost = (id: string) => {
    onChange(
      'otherCosts',
      form.otherCosts.filter((item) => item.id !== id)
    );
  };

  const openGoogleMaps = () => {
    const pickup = form.pickup.trim();
    const dropoff = form.dropoff.trim();
    if (pickup && dropoff) {
      const origin = encodeURIComponent(pickup);
      const destination = encodeURIComponent(dropoff);
      void Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`
      );
      return;
    }
    void Linking.openURL('https://www.google.com/maps');
  };

  return (
    <ScreenFrame>
      <View className="mb-5">
        <Text className="text-sm font-semibold uppercase tracking-wide text-[#64748b]">
          New quotation
        </Text>
        <Text className="mt-1 text-4xl font-black text-[#111827]">Compute trip cost</Text>
      </View>
      <SectionCard title="Trip details" icon="map-pin" theme={theme}>
        <Field
          label="Customer name"
          placeholder="e.g. ABC Trading"
          value={form.customerName}
          onChangeText={(value) => onChange('customerName', value)}
        />
        <Field
          label="Pickup location"
          placeholder="e.g. Balintawak, QC"
          value={form.pickup}
          onChangeText={(value) => {
            onChange('pickup', value);
            onSuggestionStatusChange('idle');
            setMatchedPresetId(null);
          }}
        />
        <Field
          label="Dropoff location"
          placeholder="e.g. Calamba, Laguna"
          value={form.dropoff}
          onChangeText={(value) => {
            onChange('dropoff', value);
            onSuggestionStatusChange('idle');
            setMatchedPresetId(null);
          }}
        />
        <Field
          label="Distance in km"
          keyboardType="decimal-pad"
          placeholder="0"
          value={form.distanceKm}
          onChangeText={(value) => onChange('distanceKm', value)}
        />
        <Pressable
          onPress={openGoogleMaps}
          className="mt-2 flex-row items-center justify-center rounded-2xl border border-[#dbe3ee] bg-[#f8fafc] py-4">
          <Icon name="navigation" size={18} color="#1d4ed8" />
          <Text className="ml-2 font-bold text-[#1d4ed8]">Open Google Maps</Text>
        </Pressable>
      </SectionCard>
      <SectionCard title="Fuel cost" icon="droplet" theme={theme}>
        <Field
          label="Diesel price per liter"
          keyboardType="decimal-pad"
          placeholder="0"
          value={form.dieselPrice}
          onChangeText={(value) => onChange('dieselPrice', value)}
        />
        <ReadOnlyRows
          rows={[
            ['Liters consumed', `${calculated.liters.toFixed(2)} L`],
            ['Fuel cost', formatPhp(calculated.fuelCost)],
          ]}
        />
      </SectionCard>
      <SectionCard title="Toll fee" icon="truck" theme={theme}>
        <Text className="mb-2 text-xs font-bold uppercase tracking-wide text-[#64748b]">
          Vehicle class
        </Text>
        <ChipRow
          options={tollVehicleClassOptions}
          selected={`Class ${form.tollVehicleClass}`}
          onSelect={(option) => {
            const nextClass = Number(option.replace('Class ', '')) as TollVehicleClass;
            onChange('tollVehicleClass', nextClass);
            onSuggestionStatusChange('idle');
            setMatchedPresetId(null);
          }}
        />
        <Text className="mb-4 mt-2 text-xs font-semibold text-[#64748b]">
          Uses toll.ph data last updated {tollPhSource.lastUpdated}.
        </Text>
        <View className="mb-4 flex-row items-center justify-between rounded-2xl bg-[#f8fafc] px-4 py-3">
          <View className="flex-1 pr-4">
            <Text className="font-bold text-[#111827]">Uses highway or expressway?</Text>
            <Text className="mt-1 text-xs text-[#64748b]">
              Select toll entry and exit points, then review the breakdown.
            </Text>
          </View>
          <Switch
            value={form.usesHighway}
            onValueChange={(value) => {
              onChange('usesHighway', value);
              if (!value) {
                onSuggestionStatusChange('idle');
                setMatchedPresetId(null);
              }
            }}
            trackColor={{ false: '#cbd5e1', true: '#86efac' }}
            thumbColor={form.usesHighway ? '#16a34a' : '#ffffff'}
          />
        </View>
        <Pressable
          onPress={suggestTollSegments}
          className="mb-3 flex-row items-center justify-center rounded-2xl border border-[#f59e0b] bg-[#fffbeb] py-3">
          <Icon name="zap" size={17} color="#b45309" />
          <Text className="ml-2 font-bold text-[#b45309]">Suggest Toll Segments</Text>
        </Pressable>
        {matchedPresetId ? (
          <Text className="mb-3 text-xs font-semibold text-[#92400e]">
            Matched preset: {matchedPresetId}
          </Text>
        ) : null}
        {suggestionStatus === 'suggested' ? (
          <Pressable
            onPress={confirmSuggestedTolls}
            className="mb-3 flex-row items-center justify-center rounded-2xl bg-[#16a34a] py-3">
            <Icon name="check-circle" size={17} color="#ffffff" />
            <Text className="ml-2 font-bold text-white">Confirm Toll</Text>
          </Pressable>
        ) : null}
        {form.usesHighway ? (
          <>
            <TollPointPicker
              label="Entry point"
              placeholder="Search toll entry"
              query={originPointQuery}
              selectedPoint={originPoint}
              onQueryChange={(value) => {
                setOriginPointQuery(value);
                setOriginPoint(null);
                onSuggestionStatusChange('idle');
              }}
              onSelect={(point) => {
                setOriginPoint(point);
                setOriginPointQuery(`${point.name} (${point.expresswayId})`);
                onSuggestionStatusChange('idle');
              }}
            />
            <TollPointPicker
              label="Exit point"
              placeholder="Search toll exit"
              query={destinationPointQuery}
              selectedPoint={destinationPoint}
              onQueryChange={(value) => {
                setDestinationPointQuery(value);
                setDestinationPoint(null);
                onSuggestionStatusChange('idle');
              }}
              onSelect={(point) => {
                setDestinationPoint(point);
                setDestinationPointQuery(`${point.name} (${point.expresswayId})`);
                onSuggestionStatusChange('idle');
              }}
            />
            {selectedTollRoute ? (
              <TollBreakdown route={selectedTollRoute} onAdd={addSelectedTollRoute} />
            ) : null}
            <View className="mt-4 gap-2">
              {form.tollSegments.map((segment) => (
                <SegmentRow key={segment.id} segment={segment} onRemove={removeTollSegment} />
              ))}
            </View>
          </>
        ) : (
          <ReadOnlyRows rows={[['Toll fee', formatPhp(0)]]} />
        )}
      </SectionCard>
      <SectionCard title="Other costs" icon="plus-circle" theme={theme}>
        <View className="gap-3">
          {form.otherCosts.map((item) => (
            <View key={item.id} className="rounded-2xl border border-[#e2e8f0] bg-white p-3">
              <View className="flex-row items-center gap-2">
                <TextInput
                  className="h-12 flex-1 rounded-2xl bg-[#f8fafc] px-4 text-base text-[#111827]"
                  placeholder="Label"
                  placeholderTextColor="#94a3b8"
                  value={item.label}
                  onChangeText={(value) => updateOtherCost(item.id, 'label', value)}
                />
                <TextInput
                  className="h-12 w-28 rounded-2xl bg-[#f8fafc] px-4 text-right text-base font-bold text-[#111827]"
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  value={item.amount}
                  onChangeText={(value) => updateOtherCost(item.id, 'amount', value)}
                />
                <RoundButton icon="trash-2" onPress={() => removeOtherCost(item.id)} />
              </View>
            </View>
          ))}
        </View>
        <Pressable
          onPress={addOtherCost}
          className="mt-4 flex-row items-center justify-center rounded-2xl border border-dashed border-[#94a3b8] py-4">
          <Icon name="plus" size={18} color="#1d4ed8" />
          <Text className="ml-2 font-bold text-[#1d4ed8]">Add item</Text>
        </Pressable>
      </SectionCard>
      <SectionCard title="Rate" icon="briefcase" theme={theme}>
        <Field
          label="Rate amount"
          keyboardType="decimal-pad"
          placeholder="0"
          value={form.rate}
          onChangeText={(value) => onChange('rate', value)}
        />
        <Text className="mb-2 mt-4 text-xs font-bold uppercase tracking-wide text-[#64748b]">
          Rate type
        </Text>
        <ChipRow
          options={['NCR Rate', 'Provincial Rate']}
          selected={form.rateType}
          onSelect={(value) => onChange('rateType', value as 'NCR Rate' | 'Provincial Rate')}
        />
        <Field
          label="Rate period"
          placeholder="per day / per hour"
          value={form.ratePeriod}
          onChangeText={(value) => onChange('ratePeriod', value)}
        />
      </SectionCard>
      <SummaryCard calculated={calculated} />
      <View className="mb-28 mt-2 flex-row gap-3">
        <Pressable
          onPress={onSaveDraft}
          className="flex-1 items-center rounded-2xl border border-[#cbd5e1] bg-white py-4">
          <Text className="font-black text-[#111827]">Save Draft</Text>
        </Pressable>
        <Pressable
          onPress={onOpenPreview}
          className="flex-1 items-center rounded-2xl py-4"
          style={{ backgroundColor: palette.primaryBtnBg }}>
          <Text className="font-black text-white">Preview</Text>
        </Pressable>
      </View>
    </ScreenFrame>
  );
}

function TollPointPicker({
  label,
  placeholder,
  query,
  selectedPoint,
  onQueryChange,
  onSelect,
}: {
  label: string;
  placeholder: string;
  query: string;
  selectedPoint: TollPoint | null;
  onQueryChange: (value: string) => void;
  onSelect: (point: TollPoint) => void;
}) {
  const [open, setOpen] = useState(false);
  const options = useMemo(() => searchTollPoints(query, 10), [query]);
  return (
    <View className="mb-4">
      <Text className="mb-2 text-xs font-bold uppercase tracking-wide text-[#64748b]">{label}</Text>
      <TextInput
        className="h-14 rounded-2xl bg-[#f8fafc] px-4 text-base font-semibold text-[#111827]"
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={query}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => setOpen(false), 120);
        }}
        onChangeText={(value) => {
          onQueryChange(value);
          setOpen(true);
        }}
      />
      {selectedPoint ? (
        <Text className="mt-2 text-xs font-semibold text-[#64748b]">
          {selectedPoint.expresswayId} · {selectedPoint.rfid ?? 'RFID'}
        </Text>
      ) : null}
      {open ? (
        <View className="mt-2 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
          {options.length > 0 ? (
            options.map((point) => (
              <Pressable
                key={point.id}
                onPress={() => {
                  onSelect(point);
                  setOpen(false);
                }}
                className="border-b border-[#f1f5f9] px-4 py-3">
                <Text className="font-black text-[#111827]">{point.name}</Text>
                <Text className="mt-1 text-xs font-semibold text-[#64748b]">
                  {point.expresswayId} · {point.rfid ?? 'RFID'}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text className="px-4 py-3 text-sm font-semibold text-[#64748b]">Point not found</Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

function TollBreakdown({ route, onAdd }: { route: TollRouteCalculation; onAdd: () => void }) {
  const payableSegments = route.tollSegments.filter((segment) => segment.fee > 0);
  return (
    <View className="mt-4 rounded-2xl bg-[#eff6ff] p-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-[#1e3a8a]">Toll breakdown</Text>
        <Text className="text-lg font-black text-[#1e3a8a]">{formatPhp(route.totalFee)}</Text>
      </View>
      <View className="mt-3 gap-2">
        {payableSegments.length > 0 ? (
          payableSegments.map((segment, index) => (
            <View
              key={`${segment.entryPoint.id}-${segment.exitPoint.id}-${index}`}
              className="rounded-xl bg-white/80 p-3">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-xs font-black text-[#1e3a8a]">{segment.networkName}</Text>
                  <Text className="mt-1 text-xs font-semibold text-[#475569]">
                    {segment.entryPoint.name} ({segment.entryPoint.expresswayId}) to{' '}
                    {segment.exitPoint.name} ({segment.exitPoint.expresswayId})
                  </Text>
                </View>
                <Text className="font-black text-[#111827]">{formatPhp(segment.fee)}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-sm font-semibold text-[#475569]">No payable segment found.</Text>
        )}
      </View>
      <View className="mt-4 gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-bold text-[#166534]">AutoSweep</Text>
          <Text className="font-black text-[#166534]">{formatPhp(route.autoSweepTotal)}</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-bold text-[#1d4ed8]">EasyTrip</Text>
          <Text className="font-black text-[#1d4ed8]">{formatPhp(route.easyTripTotal)}</Text>
        </View>
      </View>
      <Pressable
        onPress={onAdd}
        className="mt-4 flex-row items-center justify-center rounded-2xl bg-[#111827] py-4">
        <Icon name="plus" size={18} color="#ffffff" />
        <Text className="ml-2 font-bold text-white">Add breakdown</Text>
      </Pressable>
    </View>
  );
}

function SegmentRow({
  segment,
  onRemove,
}: {
  segment: TollSegment;
  onRemove: (id: string) => void;
}) {
  return (
    <View className="flex-row items-center rounded-2xl bg-[#f8fafc] p-3">
      <View className="flex-1 pr-3">
        <Text className="font-black text-[#111827]">{segment.expressway}</Text>
        <Text className="mt-1 text-xs font-semibold text-[#64748b]">
          {segment.entry} to {segment.exit}
        </Text>
      </View>
      <Text className="mr-2 font-black text-[#111827]">{formatPhp(segment.fee)}</Text>
      <RoundButton icon="x" onPress={() => onRemove(segment.id)} small />
    </View>
  );
}

function SummaryCard({ calculated }: { calculated: CalculatedQuote }) {
  return (
    <View className="rounded-[28px] bg-white p-5">
      <Text className="mb-4 text-xl font-black text-[#111827]">Live summary</Text>
      <ReadOnlyRows
        rows={[
          ['Fuel Cost', formatPhp(calculated.fuelCost)],
          ['Toll Fee', formatPhp(calculated.tollTotal)],
          ['Other Costs', formatPhp(calculated.otherCostsTotal)],
          ['Rate', formatPhp(calculated.rateAmount)],
        ]}
      />
      <View className="mt-4 rounded-[24px] bg-[#111827] p-5">
        <Text className="text-sm font-semibold text-[#a7f3d0]">Grand Total</Text>
        <Text className="mt-1 text-4xl font-black text-white">
          {formatPhp(calculated.grandTotal)}
        </Text>
      </View>
    </View>
  );
}
