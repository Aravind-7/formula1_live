// OpenF1's country_code is a motorsport/IOC-style abbreviation, not ISO
// 3166-1 alpha-3 (e.g. Bahrain is "BRN" here, not the ISO "BHR") — map each
// one explicitly to the ISO 3166-1 alpha-2 code flagcdn.com expects, rather
// than guessing at a conversion. Covers every country on the 2024 and 2026
// calendars (the only years this app ever queries).
const COUNTRY_CODE_TO_ALPHA2: Record<string, string> = {
  AUS: "au",
  AUT: "at",
  AZE: "az",
  BEL: "be",
  BRA: "br",
  BRN: "bh",
  CAN: "ca",
  CHN: "cn",
  ESP: "es",
  GBR: "gb",
  HUN: "hu",
  ITA: "it",
  JPN: "jp",
  KSA: "sa",
  MEX: "mx",
  MON: "mc",
  NED: "nl",
  QAT: "qa",
  SGP: "sg",
  UAE: "ae",
  USA: "us",
};

export function flagUrl(countryCode: string): string | undefined {
  const alpha2 = COUNTRY_CODE_TO_ALPHA2[countryCode];
  return alpha2 ? `https://flagcdn.com/w80/${alpha2}.png` : undefined;
}
