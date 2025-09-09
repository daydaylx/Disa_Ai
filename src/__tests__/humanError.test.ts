import { describe, expect, it } from 'vitest';

import { humanError, humanErrorToToast } from '../lib/errors/humanError';

describe('humanError', () => {
  it('should handle 401 authentication errors', () => {
    const error = new Error('API-Key fehlt oder ist ungültig (401).');
    const result = humanError(error);
    
    expect(result.title).toBe('Authentifizierung fehlgeschlagen');
    expect(result.message).toBe('API-Key fehlt oder ist ungültig.');
    expect(result.action).toBe('Prüfen Sie Ihren API-Key in den Einstellungen.');
  });

  it('should handle 429 rate limit errors', () => {
    const error = new Error('Rate-Limit/Quota erreicht (429).');
    const result = humanError(error);
    
    expect(result.title).toBe('Rate-Limit erreicht');
    expect(result.message).toBe('Zu viele Anfragen. Versuchen Sie es später erneut.');
    expect(result.action).toBe('Warten Sie einen Moment und versuchen Sie es dann erneut.');
  });

  it('should handle network errors', () => {
    const error = new TypeError('fetch failed');
    const result = humanError(error);
    
    expect(result.title).toBe('Verbindungsfehler');
    expect(result.message).toBe('Keine Internetverbindung oder Server nicht erreichbar.');
    expect(result.action).toBe('Prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
  });

  it('should handle NO_API_KEY errors', () => {
    const error = new Error('NO_API_KEY');
    const result = humanError(error);
    
    expect(result.title).toBe('API-Key erforderlich');
    expect(result.message).toBe('Kein API-Key konfiguriert.');
    expect(result.action).toBe('Gehen Sie zu den Einstellungen und fügen Sie Ihren API-Key hinzu.');
  });

  it('should convert to toast format', () => {
    const error = new Error('API-Key fehlt oder ist ungültig (401).');
    const toast = humanErrorToToast(error);
    
    expect(toast.kind).toBe('error');
    expect(toast.title).toBe('Authentifizierung fehlgeschlagen');
    expect(toast.message).toContain('API-Key fehlt oder ist ungültig');
    expect(toast.message).toContain('Prüfen Sie Ihren API-Key');
  });
});