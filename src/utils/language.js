export const DEFAULT_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = ["en", "th"];
export const LANGUAGE_STORAGE_KEY = "portfolio-language";

export function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
}

export function readStoredLanguage(storage = window.localStorage) {
  return normalizeLanguage(storage.getItem(LANGUAGE_STORAGE_KEY));
}

export function writeStoredLanguage(language, storage = window.localStorage) {
  storage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguage(language));
}

export function getLocalizedValue(value, language) {
  if (!value || typeof value !== "object" || !Object.prototype.hasOwnProperty.call(value, language)) {
    throw new Error(`Missing localized value for "${language}"`);
  }

  return value[language];
}
