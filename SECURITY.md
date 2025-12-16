# Security & Isolation

This document describes the security measures implemented in Sidecar AI to prevent AI-generated content from affecting SillyTavern's UI or executing malicious code.

## Threat Model

AI-generated responses may contain:
- Malicious HTML/CSS that breaks page layout
- JavaScript injection attempts via inline handlers
- Position fixed/absolute CSS escaping container bounds
- Global style overrides via `<style>` blocks
- External resource loading via `<iframe>`, `<embed>`, `<object>`, or `<link>`
- Z-index manipulation causing UI stacking issues
- Event handlers executing arbitrary code

## Defense Layers

### Layer 1: Content Sanitization (JavaScript)

**Location:** `src/result-formatter.js` → `sanitizeContent()`

All AI responses are sanitized before rendering:

```javascript
// Strip dangerous positioning
position: fixed → position: relative
position: absolute → position: relative

// Remove stacking manipulation
z-index: * → (removed)

// Block external content
<iframe>, <embed>, <object> → (removed)
<script> → (removed)
<style> → (removed)
<link rel="stylesheet"> → (removed)

// Neutralize event handlers
onclick="..." → (removed)
onload="..." → (removed)
href="javascript:..." → href="#"

// Prevent viewport overflow
100vw, 50vh → 100%
```

### Layer 2: CSS Containment

**Location:** `style.css` → `.sidecar-container` & `.addon_result_content`

CSS containment creates isolated rendering contexts:

```css
/* Isolate layout, style, and paint */
contain: layout style paint;

/* Create new stacking context */
isolation: isolate;
position: relative;
z-index: 0;

/* Clip overflow */
overflow: hidden;
```

**Benefits:**
- Layout changes inside cannot affect outside elements
- Style changes are scoped to container
- Paint operations are isolated
- Creates performance boundaries

### Layer 3: Position Locking

**Location:** `style.css` → `.addon_result_content *`

All positioned elements inside result containers are forced to relative positioning:

```css
.addon_result_content [style*="position: absolute"],
.addon_result_content [style*="position: fixed"] {
    position: relative !important;
}
```

This prevents content from escaping container bounds via absolute/fixed positioning.

### Layer 4: Z-Index Normalization

**Location:** `style.css` → `.addon_result_content *`

All z-index values are reset to prevent stacking context manipulation:

```css
.addon_result_content * {
    z-index: auto !important;
}
```

This prevents AI-generated content from appearing above modal dialogs or other UI elements.

### Layer 5: Dangerous Element Blocking

**Location:** `style.css` → `.addon_result_content`

Potentially dangerous elements are hidden via CSS as a backup defense:

```css
.addon_result_content iframe,
.addon_result_content embed,
.addon_result_content object {
    display: none !important;
}
```

### Layer 6: Width/Overflow Control

**Location:** `style.css` → `.addon_result_content`

All media elements are constrained to container width:

```css
.addon_result_content img,
.addon_result_content video,
.addon_result_content svg {
    max-width: 100%;
    height: auto;
}
```

### Layer 7: Margin Normalization

**Location:** `style.css` → `.addon_result_content > *`

First and last child margins are removed to prevent layout shifting:

```css
.addon_result_content > *:first-child {
    margin-top: 0 !important;
}

.addon_result_content > *:last-child {
    margin-bottom: 0 !important;
}
```

### Layer 8: Error Message Escaping

**Location:** `src/result-formatter.js` → `showErrorIndicator()`

Error messages are HTML-escaped before display to prevent injection via error text:

```javascript
const safeErrorMsg = String(error.message || error)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // ... etc
```

## Testing Security

To test the security measures:

### Test 1: Position Escape Attempt
```html
<div style="position: fixed; top: 0; left: 0; z-index: 9999;">
  This should NOT cover the entire page
</div>
```
**Expected:** Content stays within result card, position converted to relative.

### Test 2: Script Injection
```html
<script>alert('XSS')</script>
<img src=x onerror="alert('XSS')">
```
**Expected:** Script tags removed, event handlers stripped, no alert shown.

### Test 3: Global Style Override
```html
<style>
  body { background: red !important; }
  #chat { display: none !important; }
</style>
```
**Expected:** Style blocks removed, page appearance unchanged.

### Test 4: External Resource Loading
```html
<iframe src="https://evil.com"></iframe>
<embed src="malware.swf">
<object data="tracking.html"></object>
```
**Expected:** All tags removed, nothing loads externally.

### Test 5: Z-Index Stacking
```html
<div style="position: relative; z-index: 999999;">
  On top of everything!
</div>
```
**Expected:** Z-index normalized, content stays within visual hierarchy.

## Browser Compatibility

The security measures use modern CSS properties:

- `contain:` - Supported in all modern browsers (Chrome 52+, Firefox 69+, Safari 15.4+)
- `isolation:` - Supported in all modern browsers (Chrome 41+, Firefox 36+, Safari 8+)

For older browsers, graceful degradation occurs - content is still sanitized via JavaScript even if CSS containment is not available.

## Limitations

These measures protect against:
- ✅ Layout manipulation
- ✅ Style interference
- ✅ Script execution
- ✅ External resource loading
- ✅ Position escaping

These measures do NOT protect against:
- ❌ Server-side attacks (not applicable)
- ❌ AI model prompt injection (out of scope)
- ❌ Rate limiting/API abuse (handled separately)

## Future Improvements

Potential enhancements:
1. **Shadow DOM Isolation** - Use Shadow DOM for complete encapsulation (may break SillyTavern theme integration)
2. **Content Security Policy** - Add CSP headers if running as standalone app
3. **DOMPurify Integration** - Use battle-tested HTML sanitization library
4. **Sandboxed iframes** - Render content in sandboxed iframes with restricted permissions

## Reporting Security Issues

If you discover a security vulnerability, please report it via:
- GitHub Issues (for non-critical issues)
- Direct message to maintainers (for critical issues)

Do not publicly disclose critical vulnerabilities until a fix is available.
