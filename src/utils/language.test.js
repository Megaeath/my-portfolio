import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  getLocalizedValue,
  normalizeLanguage,
  readStoredLanguage,
  writeStoredLanguage,
} from "./language";

describe("language utilities", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("normalizes unknown values to english and persists supported values only", () => {
    expect(DEFAULT_LANGUAGE).toBe("en");
    expect(normalizeLanguage("th")).toBe("th");
    expect(normalizeLanguage("jp")).toBe("en");

    writeStoredLanguage("th");
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("th");
    expect(readStoredLanguage()).toBe("th");

    writeStoredLanguage("jp");
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("en");
    expect(readStoredLanguage()).toBe("en");
  });

  test("returns the requested localized value and throws for missing translations", () => {
    expect(
      getLocalizedValue({ en: "About me", th: "เกี่ยวกับฉัน" }, "th")
    ).toBe("เกี่ยวกับฉัน");

    expect(() => getLocalizedValue({ en: "About me" }, "th")).toThrow(
      'Missing localized value for "th"'
    );
  });
});
