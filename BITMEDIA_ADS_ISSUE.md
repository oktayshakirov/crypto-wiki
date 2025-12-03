# Bitmedia Ads Integration Issue - Next.js SPA Navigation

## Problem Statement

Integrating Bitmedia ads into a Next.js application with client-side navigation. The core issue is that **Bitmedia ads do not display correctly after client-side route changes**, even though they work on initial page load/refresh.

### Symptoms

- ✅ Ads display correctly on initial page load
- ✅ Ads display correctly on page refresh (full reload)
- ❌ Ads do NOT display after client-side navigation (Next.js router)
- ❌ When navigating from a page with N ads to a page with M ads, only some ads show (often only the difference M-N)

### Root Cause

Bitmedia's JavaScript loads once and scans the DOM for `<ins>` tags with the ad unit class. In Next.js SPAs:

1. **Components persist in memory**: Next.js keeps components mounted when navigating, so old `<ins>` tags from previous pages remain in the DOM
2. **Bitmedia doesn't re-scan**: Once Bitmedia's script loads and scans, it doesn't automatically re-scan when new `<ins>` tags are added via client-side navigation
3. **No public API**: Bitmedia doesn't expose a documented API to manually trigger re-scanning

## Approaches Attempted

### Approach 1: Basic Script Reload

**Strategy**: Remove and re-add the main Bitmedia JS script with cache busting

**Implementation**:

- Detect route changes via `router.events.on('routeChangeComplete')`
- Find and remove existing Bitmedia script
- Re-add script with cache buster: `?v=${timestamp}`

**Result**: ❌ **Doesn't work** - Script reloads but Bitmedia doesn't re-scan for new `<ins>` tags

**Why it failed**: Browser may cache the script, or Bitmedia has internal state preventing re-scan

---

### Approach 2: Remove and Re-execute Inline Scripts

**Strategy**: Remove all inline scripts that load Bitmedia, then re-execute them

**Implementation**:

- Store all inline scripts before removing
- Remove main Bitmedia script + all inline scripts
- Clear global state (`window.bitmedia`, `window.Bitmedia`)
- Re-execute inline scripts after delay

**Result**: ⚠️ **Partially works** - Sometimes triggers re-scan, but inconsistent

**Why it's inconsistent**: Timing issues, or Bitmedia's internal state prevents proper re-initialization

---

### Approach 3: Route-Aware Script Management

**Strategy**: Track which route each script belongs to, only keep scripts for current route

**Implementation**:

- Tag scripts with `data-route` attribute
- On route change, remove scripts from old routes
- Only reinitialize scripts for current route
- Check visibility before initializing

**Result**: ⚠️ **Partially works** - Better cleanup, but still doesn't reliably show ads after navigation

**Why it's inconsistent**: Bitmedia still doesn't reliably re-scan even when scripts are re-executed

---

### Approach 4: Complete Reset with Re-execution

**Strategy**: Complete cleanup of all Bitmedia state, then fresh initialization

**Implementation**:

- Remove ALL scripts (main + inline)
- Clear all global state
- Wait 300ms
- Re-execute all inline scripts for visible ads on current route
- Each inline script reloads Bitmedia JS

**Result**: ⚠️ **Partially works** - Most reliable approach so far, but still not 100%

---

### Approach 5: Bitmedia API Detection

**Strategy**: Check if Bitmedia exposes a public API for reloading

**Implementation**:

- Check for `window.bitmedia`, `window.Bitmedia`, etc.
- Try common methods: `reload()`, `reloadAds()`, `init()`, `refresh()`, `scan()`

**Result**: ❌ **Doesn't work** - No public API found

**Why it failed**: Bitmedia doesn't expose a documented API for manual re-scanning

---

## What We Know Works

### ✅ Initial Page Load

- Ads initialize correctly when page first loads
- Scripts are inserted after `<ins>` tags
- Bitmedia scans and displays ads

### ✅ Page Refresh

- Full page reload works perfectly
- All ads display correctly

### ✅ Script Insertion

- Our script insertion logic works correctly
- Scripts are properly placed after `<ins>` tags
- No duplicate scripts are created

## What Doesn't Work

### ❌ Client-Side Navigation

- Ads don't display after route changes
- Even when scripts are re-executed, Bitmedia doesn't re-scan

### ❌ Script Reload Alone

- Simply reloading the main Bitmedia JS file doesn't trigger re-scan
- Cache busting doesn't help

### ❌ Bitmedia API

- No public API exists to manually trigger re-scan
- No documented method to refresh ads

## Current Implementation

The current codebase uses **Approach 4** (Complete Reset with Re-execution):

1. **Route Tracking**: Tracks current route and only initializes ads on active route
2. **Visibility Check**: Only initializes visible ads
3. **Complete Cleanup**: On route change, removes all scripts and clears global state
4. **Re-execution**: Re-executes inline scripts for current route's visible ads

**File**: `layouts/components/BannerAd.js`

**Key Features**:

- Route-aware initialization
- Visibility checking
- Complete Bitmedia reset on navigation
- Re-execution of inline scripts

## Known Limitations

1. **Inconsistent Behavior**: Ads sometimes show after navigation, sometimes don't
2. **Timing Sensitive**: Requires specific delays (300ms, 1000ms) that may not work in all scenarios
3. **No Guarantee**: Even with complete reset, Bitmedia may not re-scan reliably

## Potential Solutions (Not Yet Tried)

### Option 1: Separate Ad Units Per Page Type

**Approach**: Use different `adUnitId` for different page types (home, posts, exchanges)

**Pros**:

- Each page type has its own ad unit
- No conflicts between pages
- Simpler logic

**Cons**:

- Requires multiple ad units in Bitmedia dashboard
- More complex configuration
- May not be desired if you want to reuse the same ad unit

### Option 2: Force Full Page Reload on Navigation

**Approach**: Use `window.location.href` instead of Next.js router for navigation

**Pros**:

- Guaranteed to work (full reload = fresh Bitmedia scan)

**Cons**:

- Poor UX (loses SPA benefits)
- Slower navigation
- Not recommended

### Option 3: Contact Bitmedia Support

**Approach**: Reach out to Bitmedia for SPA/React/Next.js specific guidance

**Pros**:

- May have undocumented API or best practices
- Official support

**Cons**:

- May not have a solution
- Response time unknown

### Option 4: Use Different Ad Network

**Approach**: Switch to an ad network with better SPA support

**Pros**:

- May have better React/Next.js integration

**Cons**:

- Requires changing ad provider
- May have different revenue terms

## Debugging

Enable debug mode by setting:

```javascript
window.__BITMEDIA_DEBUG__ = true;
```

Or via environment variable:

```bash
NEXT_PUBLIC_BITMEDIA_DEBUG=true
```

Debug logs show:

- Route changes
- Script insertion/removal
- Visibility checks
- Re-execution attempts

## Testing Checklist

- [ ] Ads show on initial page load
- [ ] Ads show on page refresh
- [ ] Ads show after navigating from home to posts
- [ ] Ads show after navigating from posts to exchanges
- [ ] Ads show after navigating back to previous pages
- [ ] All ads on a page display (not just some)
- [ ] No duplicate ads
- [ ] No console errors

## Current Status

**Status**: ⚠️ **Partially Working**

- Initial load: ✅ Works
- Page refresh: ✅ Works
- Client-side navigation: ⚠️ Inconsistent

**Recommendation**:

1. Test current implementation thoroughly
2. If still inconsistent, consider using separate ad units per page type
3. Contact Bitmedia support for official SPA guidance
4. Consider alternative ad networks with better SPA support

## Code Location

- Component: `layouts/components/BannerAd.js`
- Usage: `pages/index.js`, `pages/posts/page/[slug].js`, `pages/exchanges/page/[slug].js`

## References

- [Bitmedia Implementation Guide](https://bitmedia.io/guides/publisher/implement-js-code-on-website)
- Next.js Router: https://nextjs.org/docs/api-reference/next/router

---

**Last Updated**: Based on implementation attempts through multiple iterations
**Next Steps**: Test current implementation, consider alternative approaches if needed
