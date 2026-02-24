# Fluent UI Components Reference Guide

This guide provides quick reference for all Fluent UI components used in the Document Intelligence demo application.

## 📚 Table of Contents

- [Button](#button)
- [Card](#card)
- [Select](#select)
- [Text](#text)
- [Text Area](#text-area)
- [Progress Ring](#progress-ring)
- [Design System Provider](#design-system-provider)

---

## Button

Fluent UI buttons with various appearances and states.

### Usage

```html
<!-- Accent (Primary) Button -->
<fluent-button appearance="accent">
    Analyze Document
</fluent-button>

<!-- Stealth (Icon) Button -->
<fluent-button appearance="stealth" icon-only>
    ×
</fluent-button>

<!-- With Icon Slot -->
<fluent-button appearance="accent">
    <span slot="start">🔍</span>
    Analyze
</fluent-button>

<!-- Disabled State -->
<fluent-button disabled>
    Cannot Click
</fluent-button>
```

### Appearances

- `accent` - Primary action (blue background)
- `neutral` - Secondary action (default)
- `outline` - Outlined button
- `stealth` - Minimal styling
- `lightweight` - Subtle button

### Attributes

- `appearance` - Button style variant
- `disabled` - Disable button
- `icon-only` - Circular icon button
- `size` - small, medium, large

### Customization

```css
fluent-button::part(control) {
    padding: 0.875rem 2rem;
    font-size: 1rem;
}
```

### In This App

- **Analyze Button**: Primary accent button with icon
- **Send Button**: Icon-only accent button
- **Copy JSON Button**: Accent button with clipboard icon
- **Collapse Buttons**: Stealth buttons for panels
- **Remove File Button**: Stealth icon button

---

## Card

Elevated surface containers for grouping content.

### Usage

```html
<!-- Basic Card -->
<fluent-card>
    <h3>Card Title</h3>
    <p>Card content goes here</p>
</fluent-card>

<!-- With Custom Styling -->
<fluent-card class="upload-area">
    Content
</fluent-card>
```

### Customization

```css
/* Style the card surface */
fluent-card::part(control) {
    border: 2px dashed var(--border-color);
    background-color: var(--surface-color);
    padding: 2rem;
}

/* Hover effect */
fluent-card:hover::part(control) {
    border-color: var(--primary-color);
    background-color: rgba(0, 120, 212, 0.05);
}
```

### In This App

- **Upload Area**: Dashed border card with drag-drop functionality
- **File Info**: Card displaying selected file information

---

## Select

Dropdown selection component.

### Usage

```html
<fluent-select id="serviceType">
    <fluent-option value="document-intelligence">
        Document Intelligence
    </fluent-option>
    <fluent-option value="content-understanding">
        Content Understanding
    </fluent-option>
</fluent-select>
```

### JavaScript Access

```javascript
const select = document.getElementById('serviceType');

// Get selected value
const value = select.value;

// Listen for changes
select.addEventListener('change', (e) => {
    console.log('Selected:', e.target.value);
});
```

### Customization

```css
fluent-select::part(control) {
    min-height: 36px;
    min-width: 220px;
}

fluent-select::part(listbox) {
    max-height: 300px;
}
```

### In This App

- **Service Selector**: Choose between Document Intelligence and Content Understanding

---

## Text

Typography component with size and weight variants.

### Usage

```html
<!-- Large heading -->
<fluent-text size="700" weight="semibold">
    Document Intelligence Demo
</fluent-text>

<!-- Body text -->
<fluent-text size="400">
    Regular body text
</fluent-text>

<!-- Secondary text -->
<fluent-text size="300" class="upload-subtext">
    Supported formats: PDF, JPEG, PNG
</fluent-text>
```

### Size Scale

- `100` - Caption (10px)
- `200` - Caption (12px)
- `300` - Body Small (12px)
- `400` - Body (14px)
- `500` - Body Large (16px)
- `600` - Subtitle (18px)
- `700` - Title (20px)
- `800` - Title Large (24px)
- `900` - Display (32px)

### Weight Options

- `regular` (400)
- `semibold` (600)
- `bold` (700)

### In This App

- **Header Title**: Large semibold text
- **Panel Titles**: Medium semibold text
- **Upload Text**: Various text sizes for hierarchy
- **File Name**: Semibold text for emphasis

---

## Text Area

Multi-line text input with auto-resize capability.

### Usage

```html
<fluent-text-area
    id="chatInput"
    placeholder="Type your message..."
    resize="vertical"
    rows="1"
></fluent-text-area>
```

### Attributes

- `placeholder` - Placeholder text
- `resize` - both, horizontal, vertical, none
- `rows` - Initial number of rows
- `disabled` - Disable input
- `readonly` - Read-only mode

### JavaScript Access

```javascript
const textarea = document.getElementById('chatInput');

// Get/Set value
const text = textarea.value;
textarea.value = 'New text';

// Listen for input
textarea.addEventListener('input', (e) => {
    console.log('Text:', e.target.value);
});
```

### Customization

```css
fluent-text-area::part(control) {
    max-height: 150px;
    min-height: 40px;
}
```

### In This App

- **Chat Input**: Auto-resizing textarea for user questions

---

## Progress Ring

Circular indeterminate progress indicator.

### Usage

```html
<!-- Indeterminate (spinning) -->
<fluent-progress-ring></fluent-progress-ring>

<!-- With custom size -->
<fluent-progress-ring class="spinner"></fluent-progress-ring>
```

### Customization

```css
fluent-progress-ring.spinner {
    --stroke-width: 4;
    --height: 60px;
    --width: 60px;
}
```

### In This App

- **Loading Overlay**: Spinner shown during document processing

---

## Design System Provider

Root component for theming and design tokens (optional).

### Usage

```html
<!-- Light mode (default) -->
<fluent-design-system-provider use-defaults>
    <!-- App content -->
</fluent-design-system-provider>

<!-- Dark mode -->
<fluent-design-system-provider use-defaults theme="dark">
    <!-- App content -->
</fluent-design-system-provider>

<!-- Custom accent color -->
<fluent-design-system-provider accent-base-color="#0078d4">
    <!-- App content -->
</fluent-design-system-provider>
```

### Design Tokens

```javascript
// Set design tokens programmatically
const provider = document.querySelector('fluent-design-system-provider');
provider.accentBaseColor = '#0078d4';
provider.neutralBaseColor = '#f3f2f1';
```

---

## Common Patterns

### Disabled State Management

```javascript
// Disable a button
button.setAttribute('disabled', '');

// Enable a button
button.removeAttribute('disabled');

// Check if disabled
const isDisabled = button.hasAttribute('disabled');
```

### Event Handling

```javascript
// All Fluent UI components emit standard DOM events
button.addEventListener('click', () => {
    console.log('Button clicked');
});

select.addEventListener('change', (e) => {
    console.log('Selection:', e.target.value);
});

textarea.addEventListener('input', (e) => {
    console.log('Input:', e.target.value);
});
```

### Styling with CSS Parts

Fluent UI components expose internal elements via CSS `::part()`:

```css
/* Style specific parts of components */
fluent-button::part(control) {
    /* Styles for button surface */
}

fluent-card::part(control) {
    /* Styles for card surface */
}

fluent-text-area::part(control) {
    /* Styles for textarea input */
}
```

---

## Resources

- **Official Documentation**: https://docs.microsoft.com/en-us/fluent-ui/web-components/
- **Component Explorer**: https://explore.fast.design/components
- **GitHub Repository**: https://github.com/microsoft/fluentui/tree/master/packages/web-components
- **Design Tokens**: https://docs.microsoft.com/en-us/fluent-ui/web-components/design-system/design-tokens
- **Storybook Examples**: https://master--5e4bdef2075a690022d7a35e.chromatic.com/

---

## Migration from Standard HTML

### Before (Standard HTML)

```html
<button class="analyze-btn" disabled>Analyze</button>
<select id="service">
    <option value="doc-int">Document Intelligence</option>
</select>
<textarea placeholder="Type here..."></textarea>
```

```javascript
button.disabled = false;
select.value = 'doc-int';
textarea.value = 'Hello';
```

### After (Fluent UI)

```html
<fluent-button appearance="accent" disabled class="analyze-btn">
    Analyze
</fluent-button>
<fluent-select id="service">
    <fluent-option value="doc-int">Document Intelligence</fluent-option>
</fluent-select>
<fluent-text-area placeholder="Type here..."></fluent-text-area>
```

```javascript
button.removeAttribute('disabled');
select.value = 'doc-int';  // Same API!
textarea.value = 'Hello';  // Same API!
```

**Key Differences:**
- Use `setAttribute('disabled', '')` and `removeAttribute('disabled')` for boolean attributes
- Values are accessed the same way (`.value` property)
- Events work identically
- Style using `::part()` selector for shadow DOM elements

---

## Best Practices

### ✅ Do

- Use semantic HTML structure
- Leverage design tokens for theming
- Use `::part()` for component customization
- Test across different browsers
- Use appropriate component variants (accent for primary actions)
- Provide accessible labels and ARIA attributes

### ❌ Don't

- Mix Fluent UI with other component libraries (maintain consistency)
- Override component internals directly
- Forget to include the Fluent UI script
- Use inline styles when design tokens work better
- Ignore accessibility features built into components

---

## Quick Start Checklist

- [ ] Include Fluent UI script in HTML head
- [ ] Replace standard HTML elements with Fluent UI components
- [ ] Update CSS to use `::part()` selectors
- [ ] Update JavaScript to use `setAttribute`/`removeAttribute` for boolean attributes
- [ ] Test all interactive components
- [ ] Verify accessibility features
- [ ] Consider adding dark mode support
- [ ] Customize design tokens for branding

---

For more advanced usage and all available components, visit the [official Fluent UI documentation](https://docs.microsoft.com/en-us/fluent-ui/web-components/).
