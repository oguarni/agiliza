/**
 * Date formatting utilities with i18n support
 */

/**
 * Format a date according to the specified locale
 * @param date - The date to format (Date object, ISO string, or null)
 * @param locale - The locale code (e.g., 'en', 'pt')
 * @returns Formatted date string or empty string if date is null
 */
export const formatDate = (date: Date | string | null | undefined, locale: string = 'en'): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '';

  // Portuguese and Brazilian format: dd/mm/yyyy
  if (locale === 'pt' || locale === 'pt-BR') {
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // English format: mm/dd/yyyy
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${month}/${day}/${year}`;
};

/**
 * Format a date with time according to the specified locale
 * @param date - The date to format (Date object, ISO string, or null)
 * @param locale - The locale code (e.g., 'en', 'pt')
 * @returns Formatted datetime string or empty string if date is null
 */
export const formatDateTime = (date: Date | string | null | undefined, locale: string = 'en'): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '';

  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;

  return `${formatDate(dateObj, locale)} ${time}`;
};

/**
 * Convert a date input value (yyyy-mm-dd) to the format expected by the API
 * @param dateStr - The date string from an input field
 * @returns ISO date string
 */
export const toISODate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString();
};

/**
 * Convert an ISO date string to a format suitable for date input (yyyy-mm-dd)
 * @param isoDate - ISO date string or Date object
 * @returns Date string in yyyy-mm-dd format
 */
export const toInputDate = (isoDate: Date | string | null | undefined): string => {
  if (!isoDate) return '';

  const dateObj = typeof isoDate === 'string' ? new Date(isoDate) : isoDate;

  if (isNaN(dateObj.getTime())) return '';

  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Format a relative date (e.g., "2 days ago", "in 3 hours")
 * @param date - The date to format
 * @param locale - The locale code
 * @returns Relative date string
 */
export const formatRelativeDate = (date: Date | string | null | undefined, locale: string = 'en'): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (locale === 'pt' || locale === 'pt-BR') {
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays === -1) return 'Amanhã';
    if (diffDays > 1) return `Há ${diffDays} dias`;
    if (diffDays < -1) return `Em ${Math.abs(diffDays)} dias`;
  }

  // English
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays === -1) return 'Tomorrow';
  if (diffDays > 1) return `${diffDays} days ago`;
  if (diffDays < -1) return `In ${Math.abs(diffDays)} days`;

  return formatDate(dateObj, locale);
};
