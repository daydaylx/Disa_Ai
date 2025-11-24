# Storage Layer Migration Guide (Deutsch)

## Überblick

Dieses Dokument beschreibt die Migration des Speichers von `localStorage` zu `IndexedDB` (Dexie). Ziel: höhere Kapazität, bessere Zuverlässigkeit, asynchrone Performance.

## Was hat sich geändert?

### Vorher (localStorage)

- Limit: ~5–10 MB (Browser-abhängig)
- Synchron, blockiert UI
- Keine Indizes, lineare Suche
- Keine Transaktionen

### Nachher (IndexedDB + Dexie)

- Limit: hunderte MB bis GB (Browser-abhängig)
- Asynchron, blockiert nicht
- Indizierte Abfragen, schnelle Lookups
- ACID-Transaktionen, bessere Fehlertoleranz

## Architektur

### Dual-Support

1. **Modern Storage Layer** (`storage-layer.ts`): IndexedDB
2. **Legacy Layer** (`conversation-manager.ts`): localStorage-Fallback
3. **Migration Tools** (`storage-migration.ts`): Datenübertrag

### Dateistruktur

```
src/lib/
├─ storage-layer.ts
├─ conversation-manager-modern.ts
└─ storage-migration.ts

src/hooks/
└─ use-storage.ts

src/components/
└─ StorageMigration.tsx

tests/unit/lib/
├─ storage-layer.test.ts
├─ conversation-manager-modern.test.ts
├─ storage-migration.test.ts
└─ storage-performance.test.ts
```

## Migrationsablauf

### Automatische Erkennung

1. Prüfe vorhandene localStorage-Daten
2. Prüfe vorhandene IndexedDB-Daten
3. Biete Migration an, falls nötig

### Manuell anstoßen

- Settings → Bereich „Daten“
- Migration-Prompt (wenn localStorage erkannt)

### Schritte

1. Backup localStorage erstellen
2. Datenvalidierung (Format/Integrität)
3. IndexedDB initialisieren
4. Datentransfer durchführen
5. Erfolg prüfen
6. Optional: localStorage leeren

## API-Änderungen

### Vorher (sync)

```typescript
const conversations = getAllConversations();
const conversation = getConversation(id);
saveConversation(conversation);
deleteConversation(id);
```

### Nachher (async)

```typescript
const conversations = await getAllConversations();
const conversation = await getConversation(id);
await saveConversation(conversation);
await deleteConversation(id);
```

### Neue Signaturen (alle async)

- `getConversationStats(): Promise<ConversationStats>`
- `getAllConversations(): Promise<ConversationMetadata[]>`
- `getConversation(id): Promise<Conversation | null>`
- `saveConversation(conversation): Promise<void>`
- `deleteConversation(id): Promise<void>`
- `cleanupOldConversations(days): Promise<number>`
- `exportConversations(): Promise<ExportData>`
- `importConversations(data, options): Promise<ImportResult>`

## React-Integration

### Aktualisierte Hooks

```typescript
const { newConversation, setActiveConversationId, refreshConversations } = useConversationManager({
  setMessages,
  setCurrentSystemPrompt,
  onNewConversation: () => {},
});

await refreshConversations();
```

### Neue Storage-Hooks

```typescript
const { conversations, loading, error } = useConversations();
const { conversation, loading: convLoading, error: convError } = useConversation(id);
const { stats, refresh: refreshStats } = useConversationStats();
const { status, migrate, isMigrating, migrationResult } = useStorageMigration();
```

## Fehlerbehandlung

### Graceful Degradation

Falls IndexedDB nicht verfügbar ist:

1. Fallback to localStorage
2. Show warning to user
3. Suggest migration when possible

### Migration Error Recovery

- **Partial Migration**: Resume from last successful item
- **Validation Errors**: Log warnings, continue migration
- **Storage Full**: Suggest cleanup, retry with smaller batches
- **Network Issues**: Retry with exponential backoff

## Performance Improvements

### Benchmarks

- **Large Conversations**: 1000+ messages handled efficiently
- **Bulk Operations**: 100+ conversations processed in <5s
- **Search Performance**: Sub-second search across 500+ conversations
- **Memory Usage**: No memory leaks during repeated operations

### Optimization Features

- **Lazy Loading**: Conversations loaded on demand
- **Pagination**: Large datasets split into pages
- **Indexing**: Fast lookups by ID, date, model
- **Caching**: Frequently accessed data cached in memory

## Browser Compatibility

### IndexedDB Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: iOS 8+, macOS 10.10+
- **Mobile**: PWA support on iOS/Android

### Fallback Strategy

```typescript
// Automatic fallback if IndexedDB unavailable
try {
  await modernStorage.getConversationStats();
  useModernStorage = true;
} catch (error) {
  console.warn("IndexedDB unavailable, using localStorage");
  useModernStorage = false;
}
```

## Data Format Changes

### Conversation Structure

```typescript
interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;
  model: string;
  messageCount: number;
  messages?: ChatMessage[];
  isFavorite?: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  model: string;
}
```

### Migration Validation

The migration process validates:

- Required fields present (id, title, createdAt, updatedAt)
- Valid date formats
- Message count consistency
- Data type integrity

## Testing

### Unit Tests

- Storage layer functionality
- Migration logic
- Error handling
- Performance benchmarks

### Integration Tests

- React component integration
- Hook behavior
- Async operation handling

### E2E Tests

- Complete migration workflow
- Error scenarios
- User interaction flows

## Rollback Plan

### Emergency Rollback

If issues occur after migration:

1. **Data Recovery**: localStorage backup automatically created
2. **Rollback Script**: Restore from backup
3. **User Notification**: Clear communication about rollback

### Backup Strategy

```typescript
// Automatic backup before migration
const backup = {
  timestamp: new Date().toISOString(),
  conversations: localStorage.getItem("disa:conversations"),
  metadata: localStorage.getItem("disa:conversations:metadata"),
  version: "1.0",
};
```

## Monitoring and Analytics

### Migration Metrics

- Success/failure rates
- Performance benchmarks
- Error types and frequencies
- User adoption rates

### Storage Health

- Database size monitoring
- Performance degradation alerts
- Corruption detection

## Future Enhancements

### Planned Features

- **Cloud Sync**: Optional cloud backup/sync
- **Compression**: Automatic data compression
- **Encryption**: Client-side encryption for sensitive data
- **Analytics**: Usage patterns and optimization

### API Evolution

- **GraphQL**: Potential migration to GraphQL
- **Real-time**: WebSocket support for live updates
- **Offline-first**: Enhanced PWA capabilities

## Troubleshooting

### Common Issues

#### Migration Fails

1. Check browser IndexedDB support
2. Verify storage quota available
3. Clear browser cache and retry
4. Check console for specific errors

#### Performance Issues

1. Large conversations may load slowly
2. Consider splitting very long conversations
3. Clear old conversations periodically

#### Data Loss Prevention

1. Always backup before major changes
2. Export conversations regularly
3. Monitor storage usage

### Debug Mode

Enable debug logging:

```typescript
localStorage.setItem("disa:debug", "true");
```

### Support

For issues or questions:

1. Check browser console for errors
2. Verify IndexedDB support
3. Try manual migration from settings
4. Contact support with error details

## Migration Checklist

- [ ] IndexedDB support detected
- [ ] localStorage data backed up
- [ ] Migration UI accessible
- [ ] Async operations implemented
- [ ] Error handling tested
- [ ] Performance benchmarks met
- [ ] Browser compatibility verified
- [ ] Rollback plan documented
- [ ] User documentation updated
- [ ] Support procedures established

## Conclusion

The migration to IndexedDB provides significant improvements in performance, reliability, and scalability. The dual-storage approach ensures backward compatibility while enabling a smooth transition to modern web storage standards.

For technical support or questions about this migration, please refer to the troubleshooting section or contact the development team.
