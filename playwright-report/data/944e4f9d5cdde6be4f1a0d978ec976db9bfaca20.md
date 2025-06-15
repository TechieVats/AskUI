# Test info

- Name: Response Validation Tests >> validates semantic similarity of Arabic responses
- Location: /Users/abhishek.vats/Documents/Projects Git/Projects/AskUI_Assessment/tests/ai/response-validation.spec.ts:63:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('.chat-item.chatbot.chat-message-in[data-msgid]') to be visible

    at ChatbotPage.getLastBotResponse (/Users/abhishek.vats/Documents/Projects Git/Projects/AskUI_Assessment/tests/pages/ChatbotPage.ts:120:31)
    at /Users/abhishek.vats/Documents/Projects Git/Projects/AskUI_Assessment/tests/ai/response-validation.spec.ts:78:44
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
      - link "كيف يمكنني تجديد إقا...":
        - /url: javascript:void(0)
        - img
        - text: كيف يمكنني تجديد إقا...
- img
- text: كيف يمكنني تجديد إقامتي؟ 15/6/2025 @ 23:57:21
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
```

# Test source

```ts
   20 |     readonly searchResultsButton: Locator;
   21 |     readonly translateButton: Locator;
   22 |     readonly stopGeneratingButton: Locator;
   23 |     readonly predictionsContainer: Locator;
   24 |     readonly predictionButtons: Locator;
   25 |     readonly searchResultLink: Locator;
   26 |     readonly chatContainer: Locator;
   27 |     readonly micButton: Locator;
   28 |
   29 |     constructor(page: Page) {
   30 |         this.page = page;
   31 |         
   32 |         // Input area - exact selectors from HTML
   33 |         this.inputBox = page.locator('.expando-textarea.chat-input-question');
   34 |         this.sendButton = page.locator('#sendButton');
   35 |         this.micButton = page.locator('button.user-banner-btn.input-group-text.speech-recognition');
   36 |         
   37 |         // Messages area
   38 |         this.messagesContainer = page.locator('//div[@data-placeholder="Please ask me a question"]');
   39 |         this.botMessage = page.locator('.chat-item.chatbot.chat-message-in[data-msgid]');
   40 |         this.userMessage = page.locator('.chat-message-out.chat-item');
   41 |         this.messageText = page.locator('.chat-text.chat-message-text').nth(1);
   42 |         
   43 |         // Chat container
   44 |         this.chatContainer = page.locator('.chat-container');
   45 |         
   46 |         // Message interaction elements
   47 |         this.messageFooter = page.locator('.chat-item-footer');
   48 |         this.copyButton = page.locator('img[aria-label="Copy"]');
   49 |         this.likeButton = page.locator('img[aria-label="Helpful"]');
   50 |         this.dislikeButton = page.locator('img[aria-label="Not helpful"]');
   51 |         this.searchResultsButton = page.locator('img[aria-label="Search Results"]');
   52 |         this.translateButton = page.locator('img[aria-label="Translate"]');
   53 |         
   54 |         // Search result elements
   55 |         this.searchResultLink = page.locator('.chat-first-search-result a.link');
   56 |         
   57 |         // Stop generating button
   58 |         this.stopGeneratingButton = page.locator('.chat-stop-generating-btn');
   59 |         
   60 |         // Predictions
   61 |         this.predictionsContainer = page.locator('.chat-predictions-container.predictions');
   62 |         this.predictionButtons = page.locator('.prediction.chat-question-btn');
   63 |         
   64 |         // UI elements
   65 |         this.errorMessage = page.locator('.error-message');
   66 |         this.newChatButton = page.locator('#chat-new-session-btn');
   67 |         this.languageSelector = page.locator('.language-select');
   68 |
   69 |         // Disclaimer elements
   70 |         this.disclaimerContent = page.locator('.disclaimer-content');
   71 |         this.disclaimerAcceptButton = page.locator('button.btn.btn-brand.btn-block.mb-3');
   72 |     }
   73 |
   74 |     async navigate() {
   75 |         // Use the baseURL from Playwright config
   76 |         await this.page.goto('');
   77 |         await this.page.waitForTimeout(2000);
   78 |         await this.handleDisclaimer();
   79 |         await this.waitForChatToLoad();
   80 |     }
   81 |
   82 |     async handleDisclaimer() {
   83 |         try {
   84 |             // Click the accept button directly without waiting for visibility
   85 |             await this.disclaimerAcceptButton.click();
   86 |             // Wait for disclaimer to disappear
   87 |             await this.disclaimerContent.waitFor({ state: 'hidden', timeout: 10000 });
   88 |         } catch (error) {
   89 |             console.log('Disclaimer handling error:', error);
   90 |             // Continue even if disclaimer handling fails
   91 |         }
   92 |     }
   93 |
   94 |     async waitForChatToLoad() {
   95 |         try {
   96 |             // Wait for the input area to be visible
   97 |             await this.inputBox.waitFor({ state: 'visible', timeout: 15000 });
   98 |             // Wait for send button to be visible
   99 |             await this.sendButton.waitFor({ state: 'visible', timeout: 15000 });
  100 |             
  101 |             // Additional check to ensure chat is fully loaded
  102 |             await this.page.waitForTimeout(2000);
  103 |         } catch (error) {
  104 |             console.log('Chat loading error:', error);
  105 |             throw error;
  106 |         }
  107 |     }
  108 |
  109 |     async sendMessage(message: string) {
  110 |         console.log(`Sending message: ${message}`);
  111 |         await this.inputBox.waitFor({ state: 'visible' });
  112 |         // For contenteditable div, we need to use fill() instead of type()
  113 |         await this.inputBox.fill(message);
  114 |         console.log('Message filled, clicking send button...');
  115 |         await this.sendButton.click();
  116 |     }
  117 |
  118 |     async getLastBotResponse() {
  119 |         // Wait for the bot message to be visible
> 120 |         await this.botMessage.waitFor({ state: 'visible', timeout: 30000 });
      |                               ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  121 |         // Get the last bot message
  122 |         const lastMessage = this.botMessage.last();
  123 |         // Wait for the message text to be visible
  124 |         await lastMessage.waitFor({ state: 'visible', timeout: 30000 });
  125 |         return lastMessage;
  126 |     }
  127 |
  128 |     async getLastBotMessageText() {
  129 |         const message = await this.getLastBotResponse();
  130 |         return message.locator('.chat-text.chat-message-text').textContent();
  131 |     }
  132 |
  133 |     async getLastUserMessage() {
  134 |         await this.userMessage.waitFor({ state: 'visible' });
  135 |         return this.userMessage.last();
  136 |     }
  137 |
  138 |     async getLastUserMessageText() {
  139 |         const message = await this.getLastUserMessage();
  140 |         return message.locator('.chat-text.chat-message-text').textContent();
  141 |     }
  142 |
  143 |     async isMessageVisible(message: string) {
  144 |         try {
  145 |             // Wait for messages container to be visible
  146 |             await this.messagesContainer.waitFor({ state: 'visible', timeout: 10000 });
  147 |             const messageElement = this.messagesContainer
  148 |                 .locator('.chat-item.chatbot.chat-message-in')
  149 |                 .filter({ hasText: message });
  150 |             return await messageElement.isVisible({ timeout: 10000 });
  151 |         } catch (error) {
  152 |             console.log('Message visibility check error:', error);
  153 |             return false;
  154 |         }
  155 |     }
  156 |
  157 |     async isInputCleared() {
  158 |         try {
  159 |             // Wait for input box to be visible
  160 |             await this.inputBox.waitFor({ state: 'visible', timeout: 10000 });
  161 |             const value = await this.inputBox.textContent();
  162 |             return value === '';
  163 |         } catch (error) {
  164 |             console.log('Input cleared check error:', error);
  165 |             return false;
  166 |         }
  167 |     }
  168 |
  169 |     async switchLanguage(language: 'en' | 'ar') {
  170 |         try {
  171 |             // Wait for language selector to be visible and click it
  172 |             await this.languageSelector.waitFor({ state: 'visible', timeout: 10000 });
  173 |             await this.languageSelector.click();
  174 |             
  175 |             // Wait for language option to be visible and click it
  176 |             const languageOption = this.page.locator(`button[data-lang="${language}"]`);
  177 |             await languageOption.waitFor({ state: 'visible', timeout: 10000 });
  178 |             await languageOption.click();
  179 |             
  180 |             // Wait for language switch to take effect
  181 |             await this.page.waitForTimeout(2000);
  182 |         } catch (error) {
  183 |             console.log('Language switch error:', error);
  184 |             throw error;
  185 |         }
  186 |     }
  187 |
  188 |     async startNewChat() {
  189 |         try {
  190 |             // Wait for new chat button to be visible and click it
  191 |             await this.newChatButton.waitFor({ state: 'visible', timeout: 10000 });
  192 |             await this.newChatButton.click();
  193 |             
  194 |             // Wait for chat to reset
  195 |             await this.page.waitForTimeout(2000);
  196 |             await this.waitForChatToLoad();
  197 |         } catch (error) {
  198 |             console.log('Start new chat error:', error);
  199 |             throw error;
  200 |         }
  201 |     }
  202 |
  203 |     async copyLastMessage() {
  204 |         const lastMessage = await this.getLastBotResponse();
  205 |         await lastMessage.locator('img[aria-label="Copy"]').click();
  206 |     }
  207 |
  208 |     async rateLastMessage(isHelpful: boolean) {
  209 |         const lastMessage = await this.getLastBotResponse();
  210 |         const button = isHelpful ? this.likeButton : this.dislikeButton;
  211 |         await lastMessage.locator(button).click();
  212 |     }
  213 |
  214 |     async showSearchResults() {
  215 |         const lastMessage = await this.getLastBotResponse();
  216 |         await lastMessage.locator('img[aria-label="Search Results"]').click();
  217 |     }
  218 |
  219 |     async translateLastMessage() {
  220 |         const lastMessage = await this.getLastBotResponse();
```