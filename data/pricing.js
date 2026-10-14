import { siteConfig } from './site-config.js?v=20261014-media14';
export const formatMoney = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
export function apartmentPrices(apartment) {
  if (!Number.isInteger(apartment.areaHundredths) || apartment.areaHundredths <= 0) return null;
  return {
    cash: apartment.areaHundredths * siteConfig.pricing.cashPerSquare / 100,
    installments: apartment.areaHundredths * siteConfig.pricing.installmentPerSquare / 100
  };
}
