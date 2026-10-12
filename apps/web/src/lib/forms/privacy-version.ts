import 'server-only';

/** Bump this value when the contact form's first layer privacy notice changes. */
const DEFAULT_CONTACT_PRIVACY_NOTICE_VERSION = 'contact-form-privacy-v2';

export function getContactPrivacyNoticeVersion() {
  return process.env.PRIVACY_NOTICE_VERSION?.trim() || DEFAULT_CONTACT_PRIVACY_NOTICE_VERSION;
}

export function hasContactSubmissionConfiguration() {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY
    && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  );
}
