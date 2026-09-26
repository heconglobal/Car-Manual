# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rear-body.spec.js >> rear glass, sail windows and deck vents are independent selectable assemblies
- Location: tests/rear-body.spec.js:3:1

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: locator.click: Test timeout of 180000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Reset view', exact: true })
    - locator resolved to <button title="Reset view" class="icon-button" data-action="reset" aria-label="Reset view">…</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - link "Fiero Workshop home" [ref=e4] [cursor=pointer]:
      - /url: "#"
      - generic [ref=e5]:
        - text: F
        - generic [ref=e6]: ↗
      - generic [ref=e7]:
        - text: FIERO
        - generic [ref=e8]: WORKSHOP / 85
    - generic [ref=e10]:
      - strong [ref=e11]: 1985 Pontiac Fiero SE 2M6
      - generic [ref=e12]: 2.8L V6 4-speed manual WS6
    - generic [ref=e15]:
      - generic [ref=e16]: VISUAL REVIEW 0.2
      - button "Configure" [ref=e18] [cursor=pointer]
      - button "Reference library" [ref=e22] [cursor=pointer]
  - generic [ref=e26]:
    - generic [ref=e27]:
      - text: INTERACTIVE WORKSHOP
      - generic [ref=e29]: /
      - generic [ref=e30]: VEHICLE EXPLORER
    - generic [ref=e31]: VIN 1G2PF3796FP217611
  - main [ref=e32]:
    - complementary "Systems and components" [ref=e33]:
      - generic [ref=e35]:
        - paragraph [ref=e36]: YOUR VEHICLE
        - heading "Assembly explorer" [level=1] [ref=e37]
      - generic [ref=e38]:
        - searchbox "Search components" [ref=e41]: vent grille
        - generic [ref=e42]: /
      - paragraph [ref=e43]:
        - text: SYSTEMS
        - generic [ref=e44]: "09"
      - navigation "Vehicle systems" [ref=e45]:
        - button "Whole vehicle 94" [ref=e46] [cursor=pointer]:
          - generic [ref=e49]: Whole vehicle
          - generic [ref=e50]: "94"
        - button "Body & chassis 23" [pressed] [ref=e51] [cursor=pointer]:
          - generic [ref=e54]: Body & chassis
          - generic [ref=e55]: "23"
        - button "Engine & intake 9" [ref=e56] [cursor=pointer]:
          - generic [ref=e59]: Engine & intake
          - generic [ref=e60]: "9"
        - button "Transmission & clutch 5" [ref=e61] [cursor=pointer]:
          - generic [ref=e64]: Transmission & clutch
          - generic [ref=e65]: "5"
        - button "Suspension & steering 8" [ref=e66] [cursor=pointer]:
          - generic [ref=e69]: Suspension & steering
          - generic [ref=e70]: "8"
        - button "Brakes & wheels 8" [ref=e71] [cursor=pointer]:
          - generic [ref=e74]: Brakes & wheels
          - generic [ref=e75]: "8"
        - button "Cooling system 6" [ref=e76] [cursor=pointer]:
          - generic [ref=e79]: Cooling system
          - generic [ref=e80]: "6"
        - button "Fuel & exhaust 6" [ref=e81] [cursor=pointer]:
          - generic [ref=e84]: Fuel & exhaust
          - generic [ref=e85]: "6"
        - button "Electrical 20" [ref=e86] [cursor=pointer]:
          - generic [ref=e89]: Electrical
          - generic [ref=e90]: "20"
        - button "Interior & controls 9" [ref=e91] [cursor=pointer]:
          - generic [ref=e94]: Interior & controls
          - generic [ref=e95]: "9"
      - generic [ref=e96]:
        - paragraph [ref=e97]:
          - text: COMPONENTS
          - generic [ref=e98]: "09"
        - button "Clear" [ref=e99] [cursor=pointer]
      - generic [ref=e100]:
        - button "Left engine-deck vent grille" [ref=e101] [cursor=pointer]
        - button "Right engine-deck vent grille" [pressed] [ref=e106] [cursor=pointer]
        - button "Rear decklid" [ref=e111] [cursor=pointer]
        - button "Driver-side engine vent grille Body / Rear decklid, vents & torque rods" [ref=e116] [cursor=pointer]:
          - generic [ref=e118]:
            - text: Driver-side engine vent grille
            - generic [ref=e119]: Body / Rear decklid, vents & torque rods
        - button "Passenger-side engine vent grille Body / Rear decklid, vents & torque rods" [ref=e122] [cursor=pointer]:
          - generic [ref=e124]:
            - text: Passenger-side engine vent grille
            - generic [ref=e125]: Body / Rear decklid, vents & torque rods
        - button "Driver vent support & retainer Body / Rear decklid, vents & torque rods" [ref=e128] [cursor=pointer]:
          - generic [ref=e130]:
            - text: Driver vent support & retainer
            - generic [ref=e131]: Body / Rear decklid, vents & torque rods
        - button "Driver vent fastener set Body / Rear decklid, vents & torque rods" [ref=e134] [cursor=pointer]:
          - generic [ref=e136]:
            - text: Driver vent fastener set
            - generic [ref=e137]: Body / Rear decklid, vents & torque rods
        - button "Passenger vent support & retainer Body / Rear decklid, vents & torque rods" [ref=e140] [cursor=pointer]:
          - generic [ref=e142]:
            - text: Passenger vent support & retainer
            - generic [ref=e143]: Body / Rear decklid, vents & torque rods
        - button "Passenger vent fastener set Body / Rear decklid, vents & torque rods" [ref=e146] [cursor=pointer]:
          - generic [ref=e148]:
            - text: Passenger vent fastener set
            - generic [ref=e149]: Body / Rear decklid, vents & torque rods
      - generic [ref=e155]:
        - text: Original configuration
        - strong [ref=e156]: WS6 handling package
    - region "3D vehicle explorer" [ref=e158]:
      - generic:
        - generic:
          - paragraph: 02 / BODY & CHASSIS
          - heading "Body & chassis." [level=2]
          - paragraph: Panels, structure & glass · select a component to inspect
        - generic:
          - generic: US LEFT-HAND DRIVE
          - generic: REFERENCE RECONSTRUCTION
      - img "Interactive 3D model of the 1985 Pontiac Fiero. Drag to orbit, scroll to zoom. Components can also be selected in the assembly list." [ref=e160]
      - generic [ref=e161]:
        - button "Reset view" [ref=e162] [cursor=pointer]
        - button "Hide body panels" [ref=e166] [cursor=pointer]
        - button "Component labels" [ref=e169] [cursor=pointer]
        - button "Wireframe" [ref=e172] [cursor=pointer]
        - button "Fullscreen viewer" [ref=e175] [cursor=pointer]
      - group "Camera views" [ref=e178]:
        - button "Perspective" [pressed] [ref=e179] [cursor=pointer]
        - button "Front" [ref=e180] [cursor=pointer]
        - button "Rear" [ref=e181] [cursor=pointer]
        - button "Driver side" [ref=e182] [cursor=pointer]
        - button "Passenger side" [ref=e183] [cursor=pointer]
        - button "Top" [ref=e184] [cursor=pointer]
      - generic:
        - generic:
          - generic: ↔
          - text: Drag to orbit
          - generic: ·
          - text: Scroll to zoom
          - generic: ·
          - text: Click to inspect
        - generic [ref=e185]:
          - generic [ref=e186]:
            - generic [ref=e187]: EXPLODED VIEW
            - status [ref=e188]: 0%
          - slider "Exploded view" [ref=e189] [cursor=pointer]: "0"
          - generic [ref=e190]:
            - generic [ref=e191]: Assembled
            - generic [ref=e192]: Separated
      - generic [ref=e193]:
        - generic [ref=e195]: 3D reconstruction · factory reference proportions
        - generic [ref=e196]: 1 assembly selected
    - complementary "Component information and walkthroughs" [ref=e197]:
      - navigation "Inspector pages" [ref=e198]:
        - button "Inspect" [pressed] [ref=e199] [cursor=pointer]
        - button "Guides" [ref=e200] [cursor=pointer]
        - button "Specs" [ref=e201] [cursor=pointer]
        - button "Options" [ref=e202] [cursor=pointer]
        - button "UAT" [ref=e203] [cursor=pointer]
      - generic [ref=e204]:
        - paragraph [ref=e205]: Body & chassis
        - generic [ref=e206]:
          - heading "Right engine-deck vent grille" [level=2] [ref=e207]
          - generic [ref=e208]: "17"
        - generic [ref=e209]: ILLUSTRATIVE GEOMETRY
        - paragraph [ref=e212]: Removable louvred grille alongside the raised center of the rear decklid. Separate selectable geometry follows the 1985 panel layout.
        - generic [ref=e213]:
          - button "Focus part" [ref=e214] [cursor=pointer]
          - button "Isolate" [ref=e217] [cursor=pointer]
        - button "Explode this assembly" [ref=e220] [cursor=pointer]
        - generic [ref=e223]:
          - generic [ref=e224]:
            - generic [ref=e225]: Location
            - strong [ref=e226]: Right engine deck
          - generic [ref=e227]:
            - generic [ref=e228]: Assembly
            - strong [ref=e229]: Body & chassis
          - generic [ref=e230]:
            - generic [ref=e231]: Configuration
            - strong [ref=e232]: 1985 SE · original
          - generic [ref=e233]:
            - generic [ref=e234]: Part number
            - strong [ref=e235]: Not yet verified
          - generic [ref=e236]:
            - generic [ref=e237]: Service specifications
            - strong [ref=e238]: Not yet verified
        - paragraph [ref=e239]: RELATED EXPLORATION
        - button "Meet the mid-engine layout Interactive 3D walkthrough" [ref=e240] [cursor=pointer]:
          - generic [ref=e243]:
            - text: Meet the mid-engine layout
            - generic [ref=e244]: Interactive 3D walkthrough
        - paragraph [ref=e250]: Geometry is illustrative. Repair procedures and service specifications await factory verification.
        - button "Open reference library" [ref=e251] [cursor=pointer]
        - button "Add a UAT note about this part" [ref=e254] [cursor=pointer]
  - generic [ref=e257]:
    - generic [ref=e258]: LOCAL WORKSPACE
    - generic [ref=e260]: 1985 / SE 2M6 / WS6
    - button "About this build" [ref=e261] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('rear glass, sail windows and deck vents are independent selectable assemblies',async({page})=>{
  4  |  test.setTimeout(180000);
  5  |  await page.goto('/');await page.waitForFunction(()=>window.__fiero);
  6  |  const ids=['rear-clip','rear-window','sail-left','sail-right','deck-vent-left','deck-vent-right'];
  7  |  const bounds=await page.evaluate(ids=>Object.fromEntries(ids.map(id=>[id,window.__fiero.getPartBounds(id)])),ids);
  8  |  for(const id of ids){expect(bounds[id]).not.toBeNull();for(let axis=0;axis<3;axis++)expect(bounds[id].max[axis]).toBeGreaterThan(bounds[id].min[axis]);}
  9  |  // The side appliques and the rear backlight occupy different planes.
  10 |  expect(bounds['sail-left'].max[0]).toBeLessThan(bounds['rear-window'].min[0]);
  11 |  expect(bounds['sail-right'].min[0]).toBeGreaterThan(bounds['rear-window'].max[0]);
  12 |  await page.getByRole('searchbox').fill('sail window');
  13 |  // Search includes descriptions, so the roof's related sail-window text can
  14 |  // also match. Both independently selectable applique results must appear.
  15 |  await expect(page.locator('.part-button[data-part^="sail-"]')).toHaveCount(2);
  16 |  await page.locator('[data-part="sail-left"].part-button').click();
  17 |  await expect(page.locator('.component-heading')).toContainText('Left sail window');
  18 |  await page.getByRole('button',{name:'Isolate',exact:true}).click();
  19 |  expect(await page.evaluate(()=>window.__fiero.getModelState().isolate)).toBe(true);
  20 |  await page.getByRole('button',{name:'Reset view',exact:true}).click();
  21 |  await page.getByRole('searchbox').fill('vent grille');
  22 |  await expect(page.locator('.part-button[data-part^="deck-vent-"]')).toHaveCount(2);
  23 |  await page.locator('[data-part="deck-vent-right"].part-button').click();
  24 |  await expect(page.locator('.component-heading')).toContainText('Right engine-deck vent');
> 25 |  await page.getByRole('button',{name:'Reset view',exact:true}).click();
     |                                                                ^ Error: locator.click: Test timeout of 180000ms exceeded.
  26 |  const assembled=await page.evaluate(()=>window.__fiero.getPartBounds('deck-vent-right'));
  27 |  await page.locator('#explode').fill('50');
  28 |  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  29 |  const separated=await page.evaluate(()=>window.__fiero.getPartBounds('deck-vent-right'));
  30 |  expect(separated.min[1]-assembled.min[1]).toBeGreaterThan(.45);
  31 |  await page.locator('#explode').fill('0');
  32 | });
  33 | 
```