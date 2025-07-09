import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read disposable email domains from JSON file
const disposableDomainsPath = path.join(__dirname, '../node_modules/disposable-email-domains/index.json');
let disposableDomains = [];

try {
  disposableDomains = JSON.parse(fs.readFileSync(disposableDomainsPath, 'utf8'));
} catch (error) {
  console.error('Error reading disposable email domains:', error);
  // Fallback to empty array
  disposableDomains = [];
}

// Check if email is from a temporary/disposable domain
export const isTemporaryEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return false;
  }
  
  return disposableDomains.includes(domain);
};

// Validate email format
export const isValidEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Comprehensive email validation
export const validateEmail = (email) => {
  if (!isValidEmailFormat(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  if (isTemporaryEmail(email)) {
    return { isValid: false, error: 'Temporary/disposable emails are not allowed' };
  }
  
  return { isValid: true, error: null };
}; 