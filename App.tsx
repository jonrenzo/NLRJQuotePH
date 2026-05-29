import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { appThemeStyles, createDefaultForm, defaultSettings } from './config/theme';
import {
  QUOTES_KEY,
  SETTINGS_KEY,
  type QuoteForm,
  type SavedQuote,
  type Screen,
  type SuggestionStatus,
} from './data';
import { calculateQuote } from './lib/quote';
import { BottomTabs } from './components/ui/BottomTabs';
import { HomeScreen } from './features/home/HomeScreen';
import { PreviewScreen } from './features/preview/PreviewScreen';
import { QuoteScreen } from './features/quote/QuoteScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';

import './global.css';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [settings, setSettings] = useState(defaultSettings);
  const [form, setForm] = useState<QuoteForm>(() =>
    createDefaultForm(defaultSettings.defaultDieselPrice)
  );
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [draftQuoteId, setDraftQuoteId] = useState<string>(() => `${Date.now()}`);
  const [draftIssuedAt, setDraftIssuedAt] = useState<string>(() => new Date().toISOString());
  const [tollSuggestionStatus, setTollSuggestionStatus] = useState<SuggestionStatus>('idle');
  const [hydrated, setHydrated] = useState(false);

  const calculated = useMemo(() => calculateQuote(form), [form]);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const [storedSettings, storedQuotes] = await Promise.all([
          AsyncStorage.getItem(SETTINGS_KEY),
          AsyncStorage.getItem(QUOTES_KEY),
        ]);

        if (storedSettings) {
          const nextSettings = { ...defaultSettings, ...JSON.parse(storedSettings) };
          setSettings(nextSettings);
          setForm((current) => ({ ...current, dieselPrice: nextSettings.defaultDieselPrice }));
        }

        if (storedQuotes) {
          setSavedQuotes(JSON.parse(storedQuotes));
        }
      } catch {
        Alert.alert('Storage issue', 'Saved app data could not be loaded.');
      } finally {
        setHydrated(true);
      }
    };

    void hydrate();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [hydrated, settings]);

  useEffect(() => {
    if (!hydrated) return;
    void AsyncStorage.setItem(QUOTES_KEY, JSON.stringify(savedQuotes));
  }, [hydrated, savedQuotes]);

  const updateForm = <K extends keyof QuoteForm>(key: K, value: QuoteForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const startNewQuote = () => {
    const now = new Date().toISOString();
    setEditingQuoteId(null);
    setDraftQuoteId(`${Date.now()}`);
    setDraftIssuedAt(now);
    setTollSuggestionStatus('idle');
    setForm(createDefaultForm(settings.defaultDieselPrice));
    setActiveScreen('quote');
  };

  const openSavedQuote = (quote: SavedQuote) => {
    setEditingQuoteId(quote.id);
    setDraftQuoteId(quote.id);
    setDraftIssuedAt(quote.issuedAt || quote.createdAt || new Date().toISOString());
    setTollSuggestionStatus(quote.tollSegments.length > 0 ? 'confirmed' : 'idle');
    setForm({
      customerName: quote.customerName,
      pickup: quote.pickup,
      dropoff: quote.dropoff,
      distanceKm: quote.distanceKm,
      dieselPrice: quote.dieselPrice,
      usesHighway: quote.usesHighway,
      tollVehicleClass: quote.tollVehicleClass ?? 1,
      tollSegments: quote.tollSegments,
      otherCosts: quote.otherCosts,
      rate: quote.rate,
      rateType: quote.rateType ?? 'NCR Rate',
      ratePeriod: quote.ratePeriod ?? '',
      vehicleType: quote.vehicleType ?? 'L300',
    });
    setActiveScreen('quote');
  };

  const buildSavedQuote = (status: SavedQuote['status']): SavedQuote => {
    const now = new Date().toISOString();
    const existing = editingQuoteId
      ? savedQuotes.find((quote) => quote.id === editingQuoteId)
      : undefined;
    const issuedAt = existing?.issuedAt ?? draftIssuedAt ?? now;
    const id = existing?.id ?? draftQuoteId ?? `${Date.now()}`;

    return {
      ...form,
      ...calculated,
      id,
      status,
      issuedAt,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
  };

  const saveQuote = (status: SavedQuote['status'], navigateHome = true) => {
    if (!form.customerName.trim() || !form.pickup.trim() || !form.dropoff.trim()) {
      Alert.alert('Missing trip details', 'Add the customer, pickup, and dropoff before saving.');
      return;
    }
    if (status === 'Saved' && tollSuggestionStatus === 'suggested') {
      Alert.alert(
        'Confirm toll suggestion',
        'Review and confirm the suggested toll segments before saving the final quote.'
      );
      return;
    }

    const nextQuote = buildSavedQuote(status);
    setSavedQuotes((quotes) => {
      const withoutCurrent = quotes.filter((quote) => quote.id !== nextQuote.id);
      return [nextQuote, ...withoutCurrent].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    });
    setEditingQuoteId(nextQuote.id);
    setDraftQuoteId(nextQuote.id);
    setDraftIssuedAt(nextQuote.issuedAt);

    if (navigateHome) {
      setActiveScreen('home');
    }
  };

  const deleteQuote = (id: string) => {
    Alert.alert('Delete quotation?', 'This removes the saved quotation from this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setSavedQuotes((quotes) => quotes.filter((quote) => quote.id !== id));
          if (editingQuoteId === id) {
            startNewQuote();
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: appThemeStyles[settings.theme].screenBg }}
        edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1">
          {activeScreen === 'home' ? (
            <HomeScreen
              settings={settings}
              theme={settings.theme}
              savedQuotes={savedQuotes}
              onNewQuote={startNewQuote}
              onOpenQuote={openSavedQuote}
              onDeleteQuote={deleteQuote}
              onOpenSettings={() => setActiveScreen('settings')}
            />
          ) : null}
          {activeScreen === 'quote' ? (
            <QuoteScreen
              calculated={calculated}
              form={form}
              theme={settings.theme}
              onChange={updateForm}
              suggestionStatus={tollSuggestionStatus}
              onSuggestionStatusChange={setTollSuggestionStatus}
              onOpenPreview={() => setActiveScreen('preview')}
              onSaveDraft={() => saveQuote('Draft')}
            />
          ) : null}
          {activeScreen === 'preview' ? (
            <PreviewScreen
              calculated={calculated}
              form={form}
              settings={settings}
              theme={settings.theme}
              quoteId={editingQuoteId ?? draftQuoteId}
              issuedAt={
                (editingQuoteId
                  ? savedQuotes.find((quote) => quote.id === editingQuoteId)?.issuedAt
                  : undefined) ?? draftIssuedAt
              }
              onBackToEdit={() => setActiveScreen('quote')}
              onSaveQuote={() => saveQuote('Saved')}
            />
          ) : null}
          {activeScreen === 'settings' ? (
            <SettingsScreen
              settings={settings}
              theme={settings.theme}
              onChange={setSettings}
              onBack={() => setActiveScreen('home')}
            />
          ) : null}
          <BottomTabs
            activeScreen={activeScreen}
            theme={settings.theme}
            onHome={() => setActiveScreen('home')}
            onNewQuote={startNewQuote}
            onPreview={() => setActiveScreen('preview')}
            onSettings={() => setActiveScreen('settings')}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
