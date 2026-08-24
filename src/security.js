import DOMPurify from 'dompurify';

export const validateInput = (input, maxLen = 300) => {
  if (!input || typeof input !== 'string') {
    return { valid: false, cleanText: '', error: 'Input cannot be empty.' };
  }
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { valid: false, cleanText: '', error: 'Input cannot be blank.' };
  }
  if (trimmed.length > maxLen) {
    return { valid: false, cleanText: '', error: `Input exceeds maximum length of ${maxLen} characters.` };
  }
  return { valid: true, cleanText: trimmed, error: null };
};

export const sanitizeText = (text) => {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

export const processSecureInput = (rawInput, maxLen = 300) => {
  const validation = validateInput(rawInput, maxLen);
  if (!validation.valid) {
    return { success: false, text: '', error: validation.error };
  }
  const sanitized = sanitizeText(validation.cleanText);
  return { success: true, text: sanitized, error: null };
};