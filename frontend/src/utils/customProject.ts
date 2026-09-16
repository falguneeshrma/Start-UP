/**
 * Centralized configuration and handler for Custom Project Requests.
 * Connects all "Request Custom Project" CTAs directly to the external Google Form.
 * 
 * Desktop: opens Google Form in a new tab/window (window.open with noopener,noreferrer)
 * Mobile/Android: opens Google Form directly in device browser or navigates safely in Android WebView.
 */
import { useConfig } from '../context/ConfigContext';
import { useToast } from '../components/common/Toast';

export const DEFAULT_CUSTOM_PROJECT_FORM_URL = 'https://forms.gle/AQMjdWbB3jkEWtFo6';

export const CUSTOM_PROJECT_FORM_URL: string = (
  (import.meta.env.VITE_CUSTOM_PROJECT_FORM_URL as string) || DEFAULT_CUSTOM_PROJECT_FORM_URL
).trim();

export interface CustomProjectHandlerOptions {
  telegramBotUsername?: string;
  onFallbackNotice?: (message: string) => void;
}

/**
 * Detect whether client is running on a mobile device (Android, iOS, etc.)
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
};

/**
 * Detect whether client is embedded inside an Android WebView.
 * WebViews often block window.open('_blank') unless multi-window is handled natively.
 */
export const isAndroidWebView = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Android/i.test(ua) && (/wv/i.test(ua) || /Version\/[\d.]+/i.test(ua));
};

/**
 * Open the Google Form responder URL.
 * - Desktop: Opens in a new tab/window using 'noopener,noreferrer'.
 * - Mobile / Android WebView: Opens in device browser or navigates directly to ensure full screen usability.
 */
export const openCustomProjectForm = (options?: CustomProjectHandlerOptions): boolean => {
  const url = CUSTOM_PROJECT_FORM_URL || DEFAULT_CUSTOM_PROJECT_FORM_URL;

  if (!url) {
    // Graceful fallback when the Google Form URL is genuinely missing
    const fallbackMessage =
      'Custom project requests are temporarily unavailable. Please contact us on Telegram.';

    if (options?.onFallbackNotice) {
      options.onFallbackNotice(fallbackMessage);
    }

    if (options?.telegramBotUsername) {
      window.open(`https://t.me/${options.telegramBotUsername}`, '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://t.me/start_up', '_blank', 'noopener,noreferrer');
    }

    return false;
  }

  // Android WebView: directly navigate to trigger Android intent / device browser
  if (isAndroidWebView()) {
    window.location.href = url;
    return true;
  }

  // Desktop (Chrome, Edge, Firefox) & Android Chrome:
  // Open in a new tab/window with noopener,noreferrer
  const openedWindow = window.open(url, '_blank', 'noopener,noreferrer');

  // Fallback for mobile devices where window.open might be blocked by popup blocker
  if (!openedWindow || openedWindow.closed || typeof openedWindow.closed === 'undefined') {
    if (isMobileDevice()) {
      window.location.href = url;
    }
  }

  return true;
};

/**
 * Hook providing access to the centralized custom project workflow.
 */
export const useCustomProjectForm = () => {
  const { telegramBotUsername } = useConfig();
  const { showToast } = useToast();

  const handleRequestCustomProject = () => {
    openCustomProjectForm({
      telegramBotUsername,
      onFallbackNotice: (msg) => showToast(msg, 'info'),
    });
  };

  return {
    formUrl: CUSTOM_PROJECT_FORM_URL,
    isFormConfigured: Boolean(CUSTOM_PROJECT_FORM_URL),
    openCustomProject: handleRequestCustomProject,
  };
};
