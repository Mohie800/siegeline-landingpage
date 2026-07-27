/**
 * Single place for every value that changes between "planning" and "published".
 * Anything marked TODO must be settled before the site goes in front of a Play
 * reviewer — see README.md §Before launch.
 */

export const SITE = {
  /** Canonical origin. Update here + astro.config.mjs `site` together. */
  url: 'https://siegeline.mohyeldeen.dev',

  /** Game brand. */
  name: 'SIEGELINE',
  nameAr: 'خط الحصار',
  tagline: 'Real-time siege warfare, in your pocket.',
  taglineAr: 'حرب حصار لحظية، في جيبك.',

  /** Publisher shown on the site and in the legal documents. */
  studio: 'Mohyeldeen',

  /** TODO(D3): confirm this mailbox exists and is monitored — deletion requests land here. */
  supportEmail: 'support@mohyeldeen.dev',

  /** Governing law for the Terms. Mirrored in the Terms §11 prose — change both. */
  governingLaw: 'Sudan',

  /** Permanent Android application id. Must match unity-client/ProjectSettings. */
  androidAppId: 'com.siegeline.game',

  /**
   * Flip to true only once the app is actually live on Google Play; until then the
   * hero renders a "coming soon" badge instead of a link to a 404 listing.
   */
  playLive: false,

  /**
   * The Unity client ships an in-app DELETE ACCOUNT row (Ui/SettingsSheet.cs)
   * calling the `account_delete` RPC, so both of the paths Play requires exist.
   * Set true 2026-07-25; the deletion page describes both routes.
   */
  inAppDeletion: true,

  /** Working days to action a deletion request. Stated on /account-deletion. */
  deletionWindowDays: 30,

  /** Minimum age. Also declared in the Play Console target-audience section. */
  minimumAge: 13,
} as const;

export const PLAY_URL = `https://play.google.com/store/apps/details?id=${SITE.androidAppId}`;

export type Locale = 'en' | 'ar';

export const LOCALES: Locale[] = ['en', 'ar'];
export const DEFAULT_LOCALE: Locale = 'en';

/** Arabic marketing pages are built and linked. */
export const AR_READY = true;

/**
 * Arabic translations of the four legal documents. While false, Arabic pages
 * link to the English documents rather than to routes that don't exist.
 */
export const AR_LEGAL_READY = false;

/** `/privacy` in English, `/ar/privacy` in Arabic. */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === DEFAULT_LOCALE ? clean : `/${locale}${clean}`;
}

/** Same as localizedPath, but falls back to English until the legal docs are translated. */
export function legalPath(path: string, locale: Locale): string {
  return localizedPath(path, AR_LEGAL_READY ? locale : DEFAULT_LOCALE);
}
