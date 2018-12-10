# Step 02 - View Encapsulation

The style into the component template only work for that component and is not viewed outside of it.

The style for the **blueprintserver** must be copied into the **server-element** template:
```css
p { color: blue; }
```
Angular assigns each element a specific attribute, the attribute is used to manage the specific style for each element.

---

## Encapsulation

The **ViewEncapsulation** defines the behaviour for the style visibility in the application.

- **Native** - uses the ShadowDom technology for the browsers who supports it.
- **Emulated** - the default behaviour, emulate the ShadowDom behaviour.
- **None** - do not create any attribute and uses the style for globally.

```typescript
import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  ...
  encapsulation: ViewEncapsulation.Emulated
})
```



