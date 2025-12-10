type SupportedLang = 'fr' | 'en' | 'nl' | string;

const DEFAULT_LANG: SupportedLang = 'fr';

const LABELS = {
  sale: {
    fr: 'À VENDRE',
    en: 'For sale',
    nl: 'Te koop'
  },
  rent: {
    fr: 'À LOUER',
    en: 'To rent',
    nl: 'Te huur'
  },
  option: {
    fr: 'SOUS OPTION',
    en: 'Under option',
    nl: 'Onder optie'
  },
  sold: {
    fr: 'VENDU',
    en: 'Sold',
    nl: 'Verkocht'
  },
  rented: {
    fr: 'LOUÉ',
    en: 'Rented',
    nl: 'Verhuurd'
  }
};

const COLORS = {
  available: '#283152',
  option: '#26CE6C',
  sold: '#26CE6C',
  rented: '#FFC738'
};

function normalizeLang(lang?: SupportedLang): keyof typeof LABELS.sale {
  const normalized = (lang || DEFAULT_LANG).toLowerCase();
  if (normalized === 'en' || normalized === 'nl') {
    return normalized;
  }
  return 'fr';
}

function resolveLabel(
  lang: SupportedLang,
  key: keyof typeof LABELS
): string {
  const normalized = normalizeLang(lang);
  return LABELS[key][normalized];
}

export function getStatusLabel(
  lang: SupportedLang,
  goal: number,
  subStatus: number
): string {
  if (subStatus === 13) {
    return resolveLabel(lang, 'rented');
  }

  if (subStatus === 6 || subStatus === 4 || subStatus === 5) {
    return resolveLabel(lang, 'sold');
  }

  if (subStatus === 3) {
    return resolveLabel(lang, 'option');
  }

  const isRental = goal === 1;
  return resolveLabel(lang, isRental ? 'rent' : 'sale');
}

export function getStatusColor(goal: number, subStatus: number): string {
  if (subStatus === 13) {
    return COLORS.rented;
  }

  if (subStatus === 6 || subStatus === 4 || subStatus === 5) {
    return COLORS.sold;
  }

  if (subStatus === 3) {
    return COLORS.option;
  }

  return COLORS.available;
}
