/**
 * Utility for Indonesian Phone Number Validation
 * Validates prefixes for Telkomsel, Indosat, XL, Axis, Tri, and Smartfren.
 * Detects fake/dummy numbers, ascending sequences, and incorrect lengths.
 */

export interface PhoneValidationResult {
  isValid: boolean;
  message?: string;
  normalized?: string;
  provider?: string;
}

export const VALID_INDONESIAN_PREFIXES: Record<string, string> = {
  // Telkomsel
  '0811': 'Telkomsel (Halo)',
  '0812': 'Telkomsel (Simpati)',
  '0813': 'Telkomsel (Simpati)',
  '0821': 'Telkomsel (Simpati/Loop)',
  '0822': 'Telkomsel (Loop)',
  '0823': 'Telkomsel (AS)',
  '0851': 'Telkomsel (by.U / AS)',
  '0852': 'Telkomsel (AS)',
  '0853': 'Telkomsel (AS)',

  // Indosat Ooredoo Hutchison (IM3)
  '0814': 'Indosat (M2)',
  '0815': 'Indosat (Matrix/Mentari)',
  '0816': 'Indosat (Matrix)',
  '0855': 'Indosat (Matrix)',
  '0856': 'Indosat (IM3)',
  '0857': 'Indosat (IM3)',
  '0858': 'Indosat (Mentari)',

  // XL Axiata
  '0817': 'XL Axiata',
  '0818': 'XL Axiata',
  '0819': 'XL Axiata',
  '0859': 'XL Axiata',
  '0877': 'XL Axiata',
  '0878': 'XL Axiata',

  // Axis
  '0831': 'Axis',
  '0832': 'Axis',
  '0833': 'Axis',
  '0838': 'Axis',

  // Tri (3)
  '0895': 'Tri (3)',
  '0896': 'Tri (3)',
  '0897': 'Tri (3)',
  '0898': 'Tri (3)',
  '0899': 'Tri (3)',

  // Smartfren
  '0881': 'Smartfren',
  '0882': 'Smartfren',
  '0883': 'Smartfren',
  '0884': 'Smartfren',
  '0885': 'Smartfren',
  '0886': 'Smartfren',
  '0887': 'Smartfren',
  '0888': 'Smartfren',
  '0889': 'Smartfren',
};

export const validateIndonesianPhoneNumber = (input: string): PhoneValidationResult => {
  if (!input || !input.trim()) {
    return { isValid: false, message: 'Nomor ponsel wajib diisi.' };
  }

  // Remove spaces, dashes, parentheses
  const digitsOnly = input.replace(/\D/g, '');

  if (digitsOnly.length < 8) {
    return { isValid: false, message: 'Nomor ponsel terlalu pendek.' };
  }

  // Normalize format to standard 08xxxxxxxxxx
  let normalized = digitsOnly;
  if (normalized.startsWith('62')) {
    normalized = '0' + normalized.substring(2);
  } else if (!normalized.startsWith('0') && normalized.startsWith('8')) {
    normalized = '0' + normalized;
  }

  // Must start with 08
  if (!normalized.startsWith('08')) {
    return {
      isValid: false,
      message: 'Nomor tidak valid! Nomor ponsel Indonesia harus diawali dengan 08 atau 8.',
    };
  }

  // Length check (Indonesian mobile numbers are between 10 and 13 digits)
  if (normalized.length < 10) {
    return {
      isValid: false,
      message: `Nomor ponsel kurang lengkap (${normalized.length} digit). Minimal 10 digit (contoh: 081234567890).`,
    };
  }

  if (normalized.length > 13) {
    return {
      isValid: false,
      message: `Nomor ponsel terlalu panjang (${normalized.length} digit). Maksimal 13 digit.`,
    };
  }

  // Check valid operator prefix (4 digits)
  const prefix = normalized.substring(0, 4);
  const provider = VALID_INDONESIAN_PREFIXES[prefix];

  if (!provider) {
    return {
      isValid: false,
      message: `Prefix operator "${prefix}" tidak valid. Harap gunakan nomor resmi operator Indonesia (Telkomsel, Indosat, XL, Axis, Tri, Smartfren).`,
    };
  }

  // Detect dummy repeating digits (e.g. 081211111111, 081200000000)
  const numberBody = normalized.substring(4);
  if (numberBody.length >= 6) {
    const isAllSame = numberBody.split('').every((char) => char === numberBody[0]);
    if (isAllSame) {
      return {
        isValid: false,
        message: 'Nomor tidak valid: Jangan gunakan angka berulang palsu.',
      };
    }
  }

  // Detect sequential fake patterns (e.g. 12345678, 87654321)
  if (
    normalized.includes('1234567') ||
    normalized.includes('2345678') ||
    normalized.includes('3456789') ||
    normalized.includes('9876543') ||
    normalized.includes('8765432')
  ) {
    return {
      isValid: false,
      message: 'Nomor tidak valid: Dilarang menggunakan nomor urut acak / palsu.',
    };
  }

  return {
    isValid: true,
    normalized,
    provider,
  };
};
