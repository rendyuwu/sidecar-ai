# 📦 Storage Migration Guide (v0.3.0)

## Important Change in v0.3.0

Sidecar AI now stores results in `message.extra` instead of HTML comments in `message.mes`.

### Why This Change?

**Before (v0.1.x):**
```html
<!-- sidecar-storage:addon_12345:YGBgaHRtbAo8ZGl2IGNsYXNzPSJzaWRlY2FyLWNvbnRlbnQtY2FyZCIg... (2-5KB of base64) -->
```

This was stored IN the message text, meaning:
- ❌ Sent to AI as part of context (wasting tokens)
- ❌ Could confuse the main AI
- ❌ Massive token waste (2-5KB per result × multiple sidecars)
- ❌ Visible in message source/HTML

**After (v0.3.0):**
```javascript
message.extra.sidecarResults = {
  "addon_12345": {
    result: "...",
    addonName: "Reader Comments",
    timestamp: 1234567890,
    formatStyle: "html-css"
  }
}
```

Benefits:
- ✅ NOT sent to AI (saves massive tokens)
- ✅ Clean separation of data vs display
- ✅ Easier to manage programmatically
- ✅ Follows SillyTavern's metadata conventions
- ✅ No context pollution

### Token Savings Example

**Scenario:** 3 sidecars per message, 20 messages in context

**Before:**
- 3 sidecars × 3KB average × 20 messages = **180KB in context**
- At ~4 chars/token = **~45,000 extra tokens per request**
- With GPT-4: **$0.45 - $0.90 extra cost per request!**

**After:**
- **0KB in context** (stored in metadata, not sent to AI)
- **$0.00 extra cost**

**Savings:** Up to ~45K tokens and $0.90 per request!

## Automatic Migration

Good news: **Migration is automatic!**

When you update to v0.3.0:
1. New results are stored in `message.extra` (clean)
2. Old HTML comment storage still works (backward compatible)
3. When results are updated, old comments are cleaned up automatically

### What Happens

**Reading Results:**
- Extension checks `message.extra` first (modern)
- Falls back to HTML comments (legacy)
- Both work seamlessly

**Saving New Results:**
- Stores in `message.extra` only (clean)
- Removes old HTML comments if found (cleanup)

**Updating Existing Results:**
- Stores in `message.extra`
- Cleans up old HTML comments
- Gradual migration as you interact with sidecars

### Manual Cleanup (Optional)

If you want to clean up old HTML comments immediately:

1. Open browser console (F12)
2. Run this cleanup script:

```javascript
// Clean up old sidecar storage comments
const chatLog = SillyTavern.getContext().chat;
let cleaned = 0;

chatLog.forEach(msg => {
  if (msg.mes && msg.mes.includes('sidecar-storage:')) {
    const before = msg.mes.length;
    msg.mes = msg.mes.replace(/\n?<!-- sidecar-storage:[^>]+ -->/g, '');
    msg.mes = msg.mes.replace(/\n?<!-- sidecar-edited:[^>]+ -->/g, '');
    msg.mes = msg.mes.replace(/\n?<!-- sidecar-fallback:[^>]+ -->/g, '');
    const after = msg.mes.length;
    if (before !== after) {
      cleaned++;
    }
  }
});

console.log(`Cleaned ${cleaned} messages`);
SillyTavern.getContext().saveChat();
```

This removes old storage comments but keeps results in `message.extra`.

### Verify Migration

Check if migration is working:

```javascript
// Check a recent message
const lastMsg = SillyTavern.getContext().chat.slice(-1)[0];
console.log('message.extra.sidecarResults:', lastMsg.extra?.sidecarResults);
console.log('Has old HTML comments:', lastMsg.mes?.includes('sidecar-storage:'));
```

**Expected:**
- `sidecarResults` shows your results (good!)
- `Has old HTML comments: false` (clean!)

## Impact on Existing Chats

### No Data Loss

- ✅ All existing results are preserved
- ✅ History viewer still works
- ✅ Edit functionality still works
- ✅ No re-processing needed

### Gradual Migration

Old data migrates as you:
- Edit existing results
- Generate new results
- Update sidecar configurations

### Chat Export/Import

**When exporting chats:**
- Both `message.extra` and old HTML comments are included
- Full backward compatibility

**When importing chats:**
- Old format still works
- New format preferred
- Mixed formats handled gracefully

## For Developers/Extension Creators

If you're accessing sidecar results programmatically:

### Old Way (Deprecated)
```javascript
const pattern = /<!-- sidecar-storage:addon_id:(.+?) -->/;
const match = message.mes.match(pattern);
const decoded = atob(match[1]);
```

### New Way (Recommended)
```javascript
const result = message.extra?.sidecarResults?.['addon_id']?.result;
```

Much cleaner!

### Backward Compatible Code
```javascript
function getSidecarResult(message, addonId) {
  // Try modern storage
  if (message.extra?.sidecarResults?.[addonId]) {
    return message.extra.sidecarResults[addonId].result;
  }
  
  // Fallback to legacy
  const pattern = new RegExp(`<!-- sidecar-storage:${addonId}:(.+?) -->`);
  const match = message.mes?.match(pattern);
  if (match && match[1]) {
    return decodeURIComponent(escape(atob(match[1])));
  }
  
  return null;
}
```

## Troubleshooting

**Results not showing after update?**
- They're still there, just stored differently
- Refresh the page to reload with new code
- Check console for migration messages

**Old HTML comments still visible in message source?**
- Normal for existing results that haven't been updated yet
- They'll be cleaned up when results are edited or regenerated
- Run manual cleanup script if you want immediate cleanup

**Context still seems bloated?**
- Check if you have other extensions adding HTML comments
- Verify you're on v0.3.0 (check manifest.json)
- Look for `[Sidecar AI] Saved result in message.extra` in console

## Benefits Summary

### For Users
- 💰 **Massive token savings** (up to 45K tokens per request)
- 🚀 **Faster responses** (less context to process)
- 💵 **Lower costs** (fewer tokens = less money)
- 🧹 **Cleaner chat exports**

### For Developers
- 📦 **Cleaner API** (proper metadata field)
- 🔧 **Easier debugging** (structured data, not base64)
- 🛠️ **Better integration** (follows ST conventions)
- 📊 **Programmatic access** (simple object property vs regex parsing)

---

**Questions?** Open an issue: https://github.com/skirianov/sidecar-ai/issues

**Want to contribute?** Suggest improvements to the storage system!
