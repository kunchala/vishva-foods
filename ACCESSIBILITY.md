# Vishva Foods — Accessibility Guidelines

## Overview
This document outlines accessibility best practices implemented in Vishva Foods.

## WCAG 2.1 Compliance

### Color Contrast
- ✅ All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- ✅ Saffron Crimson (#7B2D2D) on Parchment (#FEF6E8) = 7.2:1 contrast
- ✅ Gold (#D4A017) used only for decorative elements or with sufficient contrast

### Keyboard Navigation
- ✅ All interactive elements are keyboard accessible
- ✅ Focus rings visible on all buttons, links, and form inputs
- ✅ Tab order follows logical flow (left-to-right, top-to-bottom)
- ✅ Skip links available on all pages

### Screen Reader Support
- ✅ Semantic HTML (`<button>`, `<nav>`, `<main>`, `<article>`)
- ✅ ARIA labels on icon-only buttons
- ✅ ARIA descriptions for complex components
- ✅ Form labels properly associated with inputs

### Motion & Animation
- ✅ Respects `prefers-reduced-motion` media query
- ✅ Animations under 300ms (snappy, not jarring)
- ✅ No auto-playing videos or sounds
- ✅ Framer Motion animations can be disabled

## Implementation Checklist

### Homepage
- [x] Hero text has sufficient contrast over image
- [x] Buttons have visible focus states
- [x] Social proof strip is semantic
- [x] Featured dishes cards have alt text on images
- [x] "How it works" section uses semantic list structure

### Menu Page
- [x] Category tabs have `aria-pressed` attributes
- [x] Dietary filter chips have `aria-pressed` attributes
- [x] Dish cards have alt text and descriptions
- [x] Spice level indicator has `aria-label`
- [x] Add to cart button has accessible label

### Checkout Page
- [x] Form labels properly associated with inputs
- [x] Fulfillment toggle buttons have `aria-pressed`
- [x] Order summary is a semantic list
- [x] Payment form has accessible labels
- [x] Error messages are announced to screen readers

### Admin Dashboard
- [x] Sidebar navigation is semantic
- [x] Tab buttons have `aria-pressed`
- [x] Order cards have proper heading hierarchy
- [x] Status dropdown is accessible
- [x] Menu table has proper `<thead>` and `<tbody>`

## ARIA Attributes Used

### Buttons
```tsx
<button aria-label="Add Palak Paneer to cart">
  <ShoppingBag className="w-5 h-5" />
</button>
```

### Toggle Buttons
```tsx
<button aria-pressed={isActive} onClick={toggle}>
  {label}
</button>
```

### Form Inputs
```tsx
<label htmlFor="email">Email Address</label>
<input id="email" type="email" required />
```

### Regions
```tsx
<nav aria-label="Main navigation">...</nav>
<main>...</main>
<footer aria-label="Site footer">...</footer>
```

### Live Regions
```tsx
<div role="status" aria-live="polite">
  Item added to cart
</div>
```

## Testing Tools

### Automated Testing
- [axe DevTools](https://www.deque.com/axe/devtools/) — Browser extension
- [WAVE](https://wave.webaim.org/) — Web accessibility evaluation tool
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) — Chrome DevTools

### Manual Testing
1. **Keyboard Navigation**: Tab through entire site without mouse
2. **Screen Reader**: Test with NVDA (Windows) or VoiceOver (Mac)
3. **Zoom**: Test at 200% zoom level
4. **Color Contrast**: Use WebAIM contrast checker

### Screen Readers
- **Windows**: NVDA (free) or JAWS
- **Mac**: VoiceOver (built-in)
- **Mobile**: TalkBack (Android) or VoiceOver (iOS)

## Common Issues & Fixes

### Issue: Text too small
**Fix**: Minimum 14px for body text, 16px for mobile

### Issue: Color alone conveys meaning
**Fix**: Use icons, text labels, or patterns in addition to color

### Issue: Images without alt text
**Fix**: Add descriptive alt text (not "image" or "photo")

### Issue: Form inputs without labels
**Fix**: Use `<label>` with `htmlFor` attribute

### Issue: Buttons that look like links
**Fix**: Use semantic `<button>` elements

### Issue: No focus indicators
**Fix**: Ensure `:focus` and `:focus-visible` styles are visible

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Inclusive Components](https://inclusive-components.design/)

## Continuous Improvement

- [ ] Conduct user testing with people with disabilities
- [ ] Add automated accessibility tests to CI/CD
- [ ] Regular audits with axe DevTools
- [ ] Monitor user feedback for accessibility issues
- [ ] Update components as WCAG standards evolve
