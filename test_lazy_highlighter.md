# 🧪 Lazy Highlighter Test

Teste das neue Lazy-Loading Syntax-Highlighting-System!

## JavaScript Example

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```

## TypeScript Example

```typescript
interface User {
  id: number;
  name: string;
  email?: string;
}

const createUser = (data: Partial<User>): User => {
  return {
    id: Date.now(),
    name: data.name || "Anonymous",
    ...data,
  };
};
```

## Python Example

```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))
```

## Bash Example

```bash
#!/bin/bash

# Feature-Flag testen
curl "http://localhost:3000/?ff=lazyHighlighter"

# Bundle-Größe messen
npm run build | grep "index-.*\.js"
```

## JSON Example

```json
{
  "featureFlags": {
    "lazyHighlighter": true,
    "debugMode": false
  },
  "bundleSize": "33.44 kB",
  "status": "✅ Lazy Loading Works!"
}
```

---

## 🧪 **Testing Instructions:**

1. **Without Feature-Flag:** Normal code blocks ohne Highlighting
2. **With Feature-Flag:** `?ff=lazyHighlighter` → Bunte Syntax-Highlighting
3. **Dev-UI:** Feature-Flag-Panel sollte `lazyHighlighter` anzeigen wenn aktiv
4. **Network Tab:** Prism.js wird nur bei Code-Blöcken geladen

**Expected Results:**

- ✨ **highlighted** Label bei erfolgreichen Code-Blöcken
- Loading-State während Prism.js-Download
- Fallback zu Plain-Text bei Fehlern
