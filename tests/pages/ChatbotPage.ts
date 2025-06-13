import { Page, Locator } from '@playwright/test';

export class ChatbotPage {
    readonly page: Page;
    readonly inputBox: Locator;
    readonly sendButton: Locator;
    readonly messagesContainer: Locator;
    readonly botMessage: Locator;
    readonly userMessage: Locator;
    readonly errorMessage: Locator;
    readonly newChatButton: Locator;
    readonly languageSelector: Locator;
    readonly disclaimerAcceptButton: Locator;
    readonly disclaimerContent: Locator;
    readonly messageText: Locator;
    readonly messageFooter: Locator;
    readonly copyButton: Locator;
    readonly likeButton: Locator;
    readonly dislikeButton: Locator;
    readonly searchResultsButton: Locator;
    readonly translateButton: Locator;
    readonly stopGeneratingButton: Locator;
    readonly predictionsContainer: Locator;
    readonly predictionButtons: Locator;
    readonly searchResultLink: Locator;
    readonly chatContainer: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Input area - exact selectors from HTML
        this.inputBox = page.locator('.expando-textarea.chat-input-question');
        this.sendButton = page.locator('#sendButton');
        
        // Messages area
        this.messagesContainer = page.locator('//div[@data-placeholder="Please ask me a question"]');
        this.botMessage = page.locator('.chat-item.chatbot.chat-message-in[data-msgid]');
        this.userMessage = page.locator('.chat-message-out.chat-item');
        this.messageText = page.locator('.chat-text.chat-message-text').nth(1);
        
        // Chat container
        this.chatContainer = page.locator('.chat-container');
        
        // Message interaction elements
        this.messageFooter = page.locator('.chat-item-footer');
        this.copyButton = page.locator('img[aria-label="Copy"]');
        this.likeButton = page.locator('img[aria-label="Helpful"]');
        this.dislikeButton = page.locator('img[aria-label="Not helpful"]');
        this.searchResultsButton = page.locator('img[aria-label="Search Results"]');
        this.translateButton = page.locator('img[aria-label="Translate"]');
        
        // Search result elements
        this.searchResultLink = page.locator('.chat-first-search-result a.link');
        
        // Stop generating button
        this.stopGeneratingButton = page.locator('.chat-stop-generating-btn');
        
        // Predictions
        this.predictionsContainer = page.locator('.chat-predictions-container.predictions');
        this.predictionButtons = page.locator('.prediction.chat-question-btn');
        
        // UI elements
        this.errorMessage = page.locator('.error-message');
        this.newChatButton = page.locator('#chat-new-session-btn');
        this.languageSelector = page.locator('.language-select');

        // Disclaimer elements
        this.disclaimerContent = page.locator('.disclaimer-content');
        this.disclaimerAcceptButton = page.locator('button.btn.btn-brand.btn-block.mb-3');
    }

    async navigate() {
        // Use the baseURL from Playwright config
        await this.page.goto('');
        await this.page.waitForTimeout(2000);
        await this.handleDisclaimer();
        await this.waitForChatToLoad();
    }

    async handleDisclaimer() {
        try {
            // Click the accept button directly without waiting for visibility
            await this.disclaimerAcceptButton.click();
            // Wait for disclaimer to disappear
            await this.disclaimerContent.waitFor({ state: 'hidden', timeout: 10000 });
        } catch (error) {
            console.log('Disclaimer handling error:', error);
            // Continue even if disclaimer handling fails
        }
    }

    async waitForChatToLoad() {
        try {
            // Wait for the input area to be visible
            await this.inputBox.waitFor({ state: 'visible', timeout: 15000 });
            // Wait for send button to be visible
            await this.sendButton.waitFor({ state: 'visible', timeout: 15000 });
            
            // Additional check to ensure chat is fully loaded
            await this.page.waitForTimeout(2000);
        } catch (error) {
            console.log('Chat loading error:', error);
            throw error;
        }
    }

    async sendMessage(message: string) {
        console.log(`Sending message: ${message}`);
        await this.inputBox.waitFor({ state: 'visible' });
        // For contenteditable div, we need to use fill() instead of type()
        await this.inputBox.fill(message);
        console.log('Message filled, clicking send button...');
        await this.sendButton.click();
    }

    async getLastBotResponse() {
        // Wait for the bot message to be visible
        await this.botMessage.waitFor({ state: 'visible', timeout: 30000 });
        // Get the last bot message
        const lastMessage = this.botMessage.last();
        // Wait for the message text to be visible
        await lastMessage.waitFor({ state: 'visible', timeout: 30000 });
        return lastMessage;
    }

    async getLastBotMessageText() {
        const message = await this.getLastBotResponse();
        return message.locator('.chat-text.chat-message-text').textContent();
    }

    async getLastUserMessage() {
        await this.userMessage.waitFor({ state: 'visible' });
        return this.userMessage.last();
    }

    async getLastUserMessageText() {
        const message = await this.getLastUserMessage();
        return message.locator('.chat-text.chat-message-text').textContent();
    }

    async isMessageVisible(message: string) {
        try {
            // Wait for messages container to be visible
            await this.messagesContainer.waitFor({ state: 'visible', timeout: 10000 });
            const messageElement = this.messagesContainer
                .locator('.chat-item.chatbot.chat-message-in')
                .filter({ hasText: message });
            return await messageElement.isVisible({ timeout: 10000 });
        } catch (error) {
            console.log('Message visibility check error:', error);
            return false;
        }
    }

    async isInputCleared() {
        try {
            // Wait for input box to be visible
            await this.inputBox.waitFor({ state: 'visible', timeout: 10000 });
            const value = await this.inputBox.textContent();
            return value === '';
        } catch (error) {
            console.log('Input cleared check error:', error);
            return false;
        }
    }

    async switchLanguage(language: 'en' | 'ar') {
        try {
            // Wait for language selector to be visible and click it
            await this.languageSelector.waitFor({ state: 'visible', timeout: 10000 });
            await this.languageSelector.click();
            
            // Wait for language option to be visible and click it
            const languageOption = this.page.locator(`button[data-lang="${language}"]`);
            await languageOption.waitFor({ state: 'visible', timeout: 10000 });
            await languageOption.click();
            
            // Wait for language switch to take effect
            await this.page.waitForTimeout(2000);
        } catch (error) {
            console.log('Language switch error:', error);
            throw error;
        }
    }

    async startNewChat() {
        try {
            // Wait for new chat button to be visible and click it
            await this.newChatButton.waitFor({ state: 'visible', timeout: 10000 });
            await this.newChatButton.click();
            
            // Wait for chat to reset
            await this.page.waitForTimeout(2000);
            await this.waitForChatToLoad();
        } catch (error) {
            console.log('Start new chat error:', error);
            throw error;
        }
    }

    async copyLastMessage() {
        const lastMessage = await this.getLastBotResponse();
        await lastMessage.locator('img[aria-label="Copy"]').click();
    }

    async rateLastMessage(isHelpful: boolean) {
        const lastMessage = await this.getLastBotResponse();
        const button = isHelpful ? this.likeButton : this.dislikeButton;
        await lastMessage.locator(button).click();
    }

    async showSearchResults() {
        const lastMessage = await this.getLastBotResponse();
        await lastMessage.locator('img[aria-label="Search Results"]').click();
    }

    async translateLastMessage() {
        const lastMessage = await this.getLastBotResponse();
        await lastMessage.locator('img[aria-label="Translate"]').click();
    }

    async stopGenerating() {
        await this.stopGeneratingButton.click();
    }

    async clickPrediction(index: number) {
        const predictions = await this.predictionButtons.all();
        if (index >= 0 && index < predictions.length) {
            await predictions[index].click();
        }
    }

    async getSearchResultLink() {
        return this.searchResultLink;
    }

    async getMessageDateTime() {
        const lastMessage = await this.getLastBotResponse();
        return lastMessage.locator('.chat-datetime.date-time').textContent();
    }

    async getLastMessage() {
        // Wait for either bot or user message to be visible
        await Promise.race([
            this.botMessage.waitFor({ state: 'visible', timeout: 30000 }),
           
        ]);
        
        // Get the last message of either type
        const lastBotMessage = this.botMessage.last();
        const lastUserMessage = this.userMessage.last();
        
        // Return the message that appears last
        return  lastBotMessage;
    }
} 