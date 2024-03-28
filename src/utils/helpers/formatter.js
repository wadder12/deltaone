// src/utils/helpers/formatter.js - for the chatter.js file
export function splitResponse(str, chunkSize) {
    const chunks = [];
    for (let i = 0; i < str.length; i += chunkSize) {
      chunks.push(str.slice(i, i + chunkSize));
    }
    return chunks;
  }
  
  export function formatUserInfo(userInfo) {
    let formattedInfo = '';
    for (const [key, value] of Object.entries(userInfo)) {
      formattedInfo += `${key}: ${formatValue(value)}. `;
    }
    return formattedInfo.trim();
  }
  
  export function formatValue(value) {
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    } else if (Array.isArray(value)) {
      return value.map(formatValue).join(', ');
    } else if (typeof value === 'object' && value !== null) {
      return Object.entries(value)
        .map(([key, val]) => `${key}: ${formatValue(val)}`)
        .join(', ');
    }
    return String(value);
  }