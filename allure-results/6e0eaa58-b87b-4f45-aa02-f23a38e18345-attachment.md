# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/merchant-demo/merchantDemo.spec.js >> Merchant Demo Complete Journey
- Location: tests/merchant-demo/merchantDemo.spec.js:31:5

# Error details

```
Error: browserType.launchPersistentContext: Failed to create a ProcessSingleton for your profile directory. This usually means that the profile is already in use by another instance of Chromium.
Call log:
  - <launching> /Applications/Google Chrome.app/Contents/MacOS/Google Chrome --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --no-sandbox --user-data-dir=/Users/the_lostvayn/Desktop/snapmint_api-automation/user_creation/playwright-profile --remote-debugging-pipe about:blank
  - <launched> pid=39524
  - [pid=39524][err] [0816/121028.459734:ERROR:third_party/crashpad/crashpad/util/mac/xattr.cc:41] getxattr size org.chromium.crashpad.database.initialized on file /Users/the_lostvayn/Library/Application Support/Google/Chrome/Crashpad: Operation not permitted (1)
  - [pid=39524][err] [0816/121028.460407:ERROR:third_party/crashpad/crashpad/util/mac/xattr.cc:41] getxattr size com.googlecode.crashpad.initialized on file /Users/the_lostvayn/Library/Application Support/Google/Chrome/Crashpad: Operation not permitted (1)
  - [pid=39524][err] [0816/121028.460425:ERROR:third_party/crashpad/crashpad/util/mac/xattr.cc:66] setxattr org.chromium.crashpad.database.initialized on file /Users/the_lostvayn/Library/Application Support/Google/Chrome/Crashpad: Operation not permitted (1)
  - [pid=39524][err] [0816/121028.460821:ERROR:third_party/crashpad/crashpad/util/file/file_io.cc:103] ReadExactly: expected 8, observed 0
  - [pid=39524][err] [0816/121028.461121:ERROR:third_party/crashpad/crashpad/util/mac/xattr.cc:41] getxattr size org.chromium.crashpad.database.initialized on file /Users/the_lostvayn/Library/Application Support/Google/Chrome/Crashpad: Operation not permitted (1)
  - [pid=39524][err] [0816/121028.461140:ERROR:third_party/crashpad/crashpad/util/mac/xattr.cc:41] getxattr size com.googlecode.crashpad.initialized on file /Users/the_lostvayn/Library/Application Support/Google/Chrome/Crashpad: Operation not permitted (1)
  - [pid=39524][err] [0816/121028.461158:ERROR:third_party/crashpad/crashpad/util/mac/xattr.cc:66] setxattr org.chromium.crashpad.database.initialized on file /Users/the_lostvayn/Library/Application Support/Google/Chrome/Crashpad: Operation not permitted (1)
  - [pid=39524][err] [39524:618824:0816/121028.475459:ERROR:chrome/browser/process_singleton_posix.cc:1043] Failed to create socket directory.
  - [pid=39524][err] [39524:618824:0816/121028.475549:ERROR:chrome/app/chrome_main_delegate.cc:520] Failed to create a ProcessSingleton for your profile directory. This means that running multiple instances would start multiple browser processes rather than opening a new window in the existing process. Aborting now to avoid profile corruption.
  - [pid=39524] <gracefully close start>
  - [pid=39524] <kill>
  - [pid=39524] <will force kill>
  - [pid=39524] exception while trying to kill process: Error: kill EPERM
  - [pid=39524] <process did exit: exitCode=21, signal=null>
  - [pid=39524] starting temporary directories cleanup
  - [pid=39524] finished temporary directories cleanup
  - [pid=39524] <gracefully close end>

```

# Test source

```ts
  1  | import { test as base, chromium, expect } from '@playwright/test';
  2  | 
  3  | import { MerchantDemoPage } from '../pages/MerchantDemoPage';
  4  | import { KycPage } from '../pages/KycPage';
  5  | import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
  6  | import { WebsitePage } from '../pages/WebsitePage';
  7  | import { AddressPage } from '../pages/AddressPage';
  8  | import { PaymentPage } from '../pages/PaymentPage';
  9  | import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
  10 | 
  11 | export const test = base.extend({
  12 | 
  13 |     page: async ({ }, use) => {
> 14 |         const context = await chromium.launchPersistentContext(
     |                         ^ Error: browserType.launchPersistentContext: Failed to create a ProcessSingleton for your profile directory. This usually means that the profile is already in use by another instance of Chromium.
  15 |             './playwright-profile',
  16 |             {
  17 |                 headless: false,
  18 |                 channel: 'chrome',
  19 |             }
  20 |         );
  21 | 
  22 |         const page = context.pages()[0] || await context.newPage();
  23 | 
  24 |         await use(page);
  25 | 
  26 |         await context.close();
  27 |     },
  28 | 
  29 |     merchantPage: async ({ page }, use) => {
  30 |         await use(new MerchantDemoPage(page));
  31 |     },
  32 | 
  33 |     kycPage: async ({ page }, use) => {
  34 |         await use(new KycPage(page));
  35 |     },
  36 | 
  37 |     orderPage: async ({ page }, use) => {
  38 |         await use(new OrderConfirmationPage(page));
  39 |     },
  40 | 
  41 |     websitePage: async ({ page }, use) => {
  42 |         await use(new WebsitePage(page));
  43 |     },
  44 | 
  45 |     addressPage: async ({ page }, use) => {
  46 |         await use(new AddressPage(page));
  47 |     },
  48 | 
  49 |     paymentPage: async ({ page }, use) => {
  50 |         await use(new PaymentPage(page));
  51 |     },
  52 | 
  53 |     adminLoginPage: async ({ page }, use) => {
  54 |         await use(new AdminLoginPage(page));
  55 |     },
  56 | 
  57 | });
  58 | 
  59 | export { expect };
```