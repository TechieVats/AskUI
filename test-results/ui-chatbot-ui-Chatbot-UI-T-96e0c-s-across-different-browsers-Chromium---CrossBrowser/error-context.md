# Test info

- Name: Chatbot UI Tests >> Cross-browser Compatibility @cross-browser >> chat widget works across different browsers
- Location: /Users/abhishek.vats/Documents/Projects Git/Projects/AskUI_Assessment/tests/ui/chatbot-ui.spec.ts:321:13

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('.chat-item.chatbot.chat-message-in[data-msgid]')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('.chat-item.chatbot.chat-message-in[data-msgid]')

    at /Users/abhishek.vats/Documents/Projects Git/Projects/AskUI_Assessment/tests/ui/chatbot-ui.spec.ts:339:50
```

# Page snapshot

```yaml
- button "Expand menu":
  - img
- link "Logo":
  - /url: /
  - img "Logo"
- button "العربية":
  - text: العربية
  - img
- navigation:
  - link "New chat":
    - /url: javascript:void(0);
    - text: New chat
    - img
  - list:
    - listitem: Chat History
    - listitem:
      - link "Test message":
        - /url: javascript:void(0)
        - img
        - text: Test message
- img
- text: Test message 15/6/2025 @ 23:55:7
- img
- img
- dialog:
  - iframe
- text: Please ask me a question
- button "Send":
  - img
- button:
  - img
- combobox:
  - option "Arabic [العربية]"
  - option "English [English]" [selected]
  - option "French [Français]"
  - option "Spanish [Español]"
  - option "German [Deutsch]"
  - option "Italian [Italiano]"
  - option "Portuguese [Português]"
  - option "Swedish [Svenska]"
  - option "Dutch [Nederlands]"
  - option "Danish [Dansk]"
  - option "Finnish [Suomi]"
  - option "Greek [Ελληνικά]"
  - option "Hungarian [Magyar]"
  - option "Norwegian [Norsk]"
  - option "Romanian [Română]"
  - option "Turkish [Türkçe]"
  - option "Chinese [中文]"
  - option "Japanese [日本語]"
  - option "Russian [Русский]"
  - option "Korean [한국어]"
  - option "Polish [Polski]"
  - option "Catalan [Català]"
  - option "Urdu [اردو]"
  - option "Hindi [हिन्दी]"
  - option "Bengali [বাংলা]"
  - option "Indonesian [Bahasa Indonesia]"
  - option "Thai [ไทย]"
  - option "Vietnamese [Tiếng Việt]"
  - option "Hebrew [עברית]"
  - option "Ukrainian [Українська]"
- text: EN
- link "Terms of Service":
  - /url: /en/UAsk/TermsOfService
- iframe
```

# Test source

```ts
  239 |     //     test('chat widget adapts to different screen sizes', async ({ page }) => {
  240 |     //         const viewportSizes = [
  241 |     //             { width: 1920, height: 1080 }, // Desktop
  242 |     //             { width: 810, height: 1080 },  // Tablet
  243 |     //             { width: 390, height: 844 }    // Mobile
  244 |     //         ];
  245 |
  246 |     //         for (const size of viewportSizes) {
  247 |     //             console.log(`Testing viewport size: ${size.width}x${size.height}`);
  248 |                 
  249 |     //             // Set viewport size
  250 |     //             await page.setViewportSize(size);
  251 |                 
  252 |     //             // Create new page instance for each viewport
  253 |     //             chatbotPage = new ChatbotPage(page);
  254 |     //             await chatbotPage.navigate();
  255 |                 
  256 |     //             // Wait for chat to be fully loaded
  257 |     //             await page.waitForTimeout(2000);
  258 |                 
  259 |     //             try {
  260 |     //                 const containerBox = await chatbotPage.chatContainer.boundingBox();
  261 |     //                 expect(containerBox).toBeTruthy();
  262 |                     
  263 |     //                 await expect(chatbotPage.chatContainer).toBeVisible();
  264 |     //                 expect(containerBox?.width).toBeLessThanOrEqual(size.width);
  265 |                     
  266 |     //                 // Additional wait between viewport changes
  267 |     //                 await page.waitForTimeout(1000);
  268 |     //             } catch (error) {
  269 |     //                 console.error(`Error testing viewport ${size.width}x${size.height}:`, error);
  270 |     //                 throw error;
  271 |     //             }
  272 |     //         }
  273 |     //     });
  274 |
  275 |     //     test('UI elements are properly positioned in different views', async ({ page }) => {
  276 |     //         const viewportSizes = [
  277 |     //             { width: 1920, height: 1080 }, // Desktop
  278 |     //             { width: 390, height: 844 }    // Mobile
  279 |     //         ];
  280 |
  281 |     //         for (const size of viewportSizes) {
  282 |     //             console.log(`Testing UI elements in viewport: ${size.width}x${size.height}`);
  283 |                 
  284 |     //             // Set viewport size
  285 |     //             await page.setViewportSize(size);
  286 |                 
  287 |     //             // Create new page instance for each viewport
  288 |     //             chatbotPage = new ChatbotPage(page);
  289 |     //             await chatbotPage.navigate();
  290 |                 
  291 |     //             // Wait for chat to be fully loaded
  292 |     //             await page.waitForTimeout(2000);
  293 |                 
  294 |     //             try {
  295 |     //                 await expect(chatbotPage.inputBox).toBeVisible();
  296 |     //                 await expect(chatbotPage.sendButton).toBeVisible();
  297 |                     
  298 |     //                 const inputBox = await chatbotPage.inputBox.boundingBox();
  299 |     //                 const sendButton = await chatbotPage.sendButton.boundingBox();
  300 |                     
  301 |     //                 expect(inputBox).toBeTruthy();
  302 |     //                 expect(sendButton).toBeTruthy();
  303 |                     
  304 |     //                 // Check if elements are within viewport width
  305 |     //                 if (inputBox && sendButton) {
  306 |     //                     expect(inputBox.x + inputBox.width).toBeLessThanOrEqual(size.width);
  307 |     //                     expect(sendButton.x + sendButton.width).toBeLessThanOrEqual(size.width);
  308 |     //                 }
  309 |                     
  310 |     //                 // Additional wait between viewport changes
  311 |     //                 await page.waitForTimeout(1000);
  312 |     //             } catch (error) {
  313 |     //                 console.error(`Error testing UI elements in viewport ${size.width}x${size.height}:`, error);
  314 |     //                 throw error;
  315 |     //             }
  316 |     //         }
  317 |     //     });
  318 |     // });
  319 |
  320 |     test.describe('Cross-browser Compatibility @cross-browser', () => {
  321 |         test('chat widget works across different browsers', async () => {
  322 |             console.log('Testing cross-browser compatibility...');
  323 |             
  324 |             // Test basic functionality
  325 |             await expect(chatbotPage.inputBox).toBeVisible();
  326 |             await expect(chatbotPage.sendButton).toBeVisible();
  327 |             await expect(chatbotPage.micButton).toBeVisible();
  328 |             
  329 |             // Test contenteditable behavior
  330 |             await chatbotPage.inputBox.click();
  331 |             await chatbotPage.inputBox.fill('Test message');
  332 |             const inputText = await chatbotPage.inputBox.textContent();
  333 |             expect(inputText).toBe('Test message');
  334 |             
  335 |             // Test button interactions with reCAPTCHA handling
  336 |             await chatbotPage.sendButton.click();
  337 |             console.log('Waiting 60 seconds for potential reCAPTCHA...');
  338 |             await chatbotPage.page.waitForTimeout(60000); // 60 second wait for manual handling
> 339 |             await expect(chatbotPage.botMessage).toBeVisible();
      |                                                  ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  340 |             
  341 |             // Test new chat functionality
  342 |             await chatbotPage.newChatButton.click();
  343 |             await expect(chatbotPage.inputBox).toBeVisible();
  344 |             await expect(chatbotPage.inputBox).toHaveAttribute('placeholder', 'Please ask me a question');
  345 |         });
  346 |     });
  347 |
  348 |     test.describe('Scroll Behavior', () => {
  349 |         test('auto-scrolls to new messages', async () => {
  350 |             const testData = TestDataManager.getInstance();
  351 |             const message = testData.getEnglishQueries()[0].prompt;
  352 |         
  353 |             console.log(`Sending message: "${message}"`);
  354 |             await chatbotPage.sendMessage(message);
  355 |         
  356 |             // Wait for manual reCAPTCHA handling
  357 |             console.log('⏳ Waiting 45 seconds for potential reCAPTCHA...');
  358 |             await chatbotPage.page.waitForTimeout(45000);
  359 |         
  360 |             const response = await chatbotPage.getLastBotResponse();
  361 |             const responseText = await response.textContent();
  362 |             console.log(`Bot response: "${responseText}"`);
  363 |         
  364 |             // Evaluate if scroll reached the bottom
  365 |             const isAtBottom = await chatbotPage.page.evaluate(() => {
  366 |                 const container = document.querySelector('.chatbot-container');
  367 |                 if (!container) return false;
  368 |                 return container.scrollHeight - container.scrollTop <= container.clientHeight + 5;
  369 |             });
  370 |         
  371 |             expect(isAtBottom).toBe(true);
  372 |         });
  373 |         
  374 |
  375 |         test('maintains scroll position when loading more messages', async () => {
  376 |             const testData = TestDataManager.getInstance();
  377 |             const longMessage = testData.getEnglishQueries()[0].prompt.repeat(5);
  378 |             
  379 |             // Send a long message to create scrollable content
  380 |             await chatbotPage.sendMessage(longMessage);
  381 |             
  382 |             // Wait for manual reCAPTCHA handling
  383 |             console.log('⏳ Waiting 45 seconds for potential reCAPTCHA...');
  384 |             await chatbotPage.page.waitForTimeout(45000);
  385 |             
  386 |             const response = await chatbotPage.getLastBotResponse();
  387 |             const responseText = await response.textContent();
  388 |             console.log(`Bot response: "${responseText}"`);
  389 |
  390 |             // Scroll to middle of container
  391 |             await chatbotPage.page.evaluate(() => {
  392 |                 const container = document.querySelector('.chat-container');
  393 |                 if (container) {
  394 |                     container.scrollTop = container.scrollHeight / 2;
  395 |                 }
  396 |             });
  397 |
  398 |             // Get initial scroll position
  399 |             const initialScroll = await chatbotPage.page.evaluate(() => {
  400 |                 const container = document.querySelector('.chat-container');
  401 |                 return container ? container.scrollTop : 0;
  402 |             });
  403 |
  404 |             // Send another message
  405 |             await chatbotPage.sendMessage('Test message');
  406 |             
  407 |             // Wait for manual reCAPTCHA handling
  408 |             console.log('Waiting 45 seconds for potential reCAPTCHA...');
  409 |             await chatbotPage.page.waitForTimeout(45000);
  410 |
  411 |             // Get final scroll position
  412 |             const finalScroll = await chatbotPage.page.evaluate(() => {
  413 |                 const container = document.querySelector('.chat-container');
  414 |                 return container ? container.scrollTop : 0;
  415 |             });
  416 |
  417 |             // Verify scroll position is maintained
  418 |             expect(finalScroll).toBeGreaterThanOrEqual(initialScroll);
  419 |         });
  420 |     });
  421 |
  422 |     test.describe('Accessibility', () => {
  423 |         test('has proper ARIA labels and roles', async () => {
  424 |             // Check input area
  425 |             await expect(chatbotPage.inputBox).toHaveAttribute('data-placeholder', 'Please ask me a question');
  426 |             await expect(chatbotPage.inputBox).toHaveAttribute('contenteditable', 'true');
  427 |             
  428 |             // Check send button
  429 |             await expect(chatbotPage.sendButton).toHaveAttribute('type', 'button');
  430 |             await expect(chatbotPage.sendButton).toHaveAttribute('aria-label', 'Send');
  431 |             await expect(chatbotPage.sendButton).toHaveAttribute('data-bs-original-title', 'Send');
  432 |             
  433 |             // Check microphone button
  434 |             await expect(chatbotPage.micButton).toHaveAttribute('type', 'button');
  435 |             await expect(chatbotPage.micButton).toHaveAttribute('class', 'btn user-banner-btn input-group-text speech-recognition hide-firefox');
  436 |             
  437 |             // Check language selector
  438 |             await expect(chatbotPage.languageSelector).toHaveAttribute('class', 'language-select hide-firefox');
  439 |             await expect(chatbotPage.languageSelector).toHaveAttribute('onchange', 'updateLang()');
```