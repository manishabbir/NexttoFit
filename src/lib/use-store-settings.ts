import { useState, useEffect } from "react";

export interface StoreSettings {
  storeName: string;
  email: string;
  phone: string;
  currency: string;
  freeShippingThreshold: string;
  shippingCost: string;
  taxRate: string;
  enableCOD: boolean;
  enableCard: boolean;
  enableEasyPaisa: boolean;
  enableBankTransfer: boolean;
}

const defaultSettings: StoreSettings = {
  storeName: "NEXTFITT",
  email: "hello@nextfitt.com",
  phone: "+92 300 1234567",
  currency: "PKR",
  freeShippingThreshold: "5000",
  shippingCost: "500",
  taxRate: "5",
  enableCOD: true,
  enableCard: true,
  enableEasyPaisa: true,
  enableBankTransfer: false,
};

let cachedSettings: StoreSettings | null = null;

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      return;
    }

    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.store_settings) {
          const parsed = JSON.parse(data.store_settings) as StoreSettings;
          cachedSettings = parsed;
          setSettings({ ...defaultSettings, ...parsed });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}