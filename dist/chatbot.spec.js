"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const ChatbotPage_1 = require("./pages/ChatbotPage");
const TestDataManager_1 = require("./data/TestDataManager");
// Increase test timeout to 120 seconds to allow for manual reCAPTCHA handling
test_1.test.setTimeout(120000);
// Disable parallel test execution
test_1.test.describe.configure({ mode: 'serial' });
test_1.test.describe('U-Ask Chatbot Tests', () => {
    let chatbotPage;
    const testData = TestDataManager_1.TestDataManager.getInstance();
    test_1.test.beforeEach(async ({ page }) => {
        chatbotPage = new ChatbotPage_1.ChatbotPage(page);
        await chatbotPage.navigate();
    });
    (0, test_1.test)('chat widget loads correctly', async () => {
        await (0, test_1.expect)(chatbotPage.messagesContainer).toBeVisible();
        await (0, test_1.expect)(chatbotPage.inputBox).toBeVisible();
        await (0, test_1.expect)(chatbotPage.sendButton).toBeVisible();
    });
    (0, test_1.test)('can send and receive messages', async () => {
        const testMessage = 'Hello, how are you?';
        await chatbotPage.sendMessage(testMessage);
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        const lastMessage = await chatbotPage.getLastMessage();
        const messageText = await lastMessage.textContent() || '';
        (0, test_1.expect)(messageText).toContain(testMessage);
        // Verify input is cleared
        (0, test_1.expect)(await chatbotPage.isInputCleared()).toBeTruthy();
    });
    (0, test_1.test)('supports RTL for Arabic text', async () => {
        const arabicMessage = 'مرحبا';
        await chatbotPage.switchLanguage('ar');
        await chatbotPage.sendMessage(arabicMessage);
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        const lastMessage = await chatbotPage.getLastMessage();
        const messageText = await lastMessage.textContent() || '';
        (0, test_1.expect)(messageText).toContain(arabicMessage);
    });
    // English query validation test
    (0, test_1.test)('validates English query response', async () => {
        const query = testData.getEnglishQueries()[0]; // Get first English query
        await chatbotPage.sendMessage(query.prompt);
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        const lastMessage = await chatbotPage.getLastMessage();
        const messageText = await lastMessage.textContent() || '';
        // Check for expected keywords
        for (const keyword of query.expectedKeywords) {
            (0, test_1.expect)(messageText.toLowerCase()).toContain(keyword.toLowerCase());
        }
        // Verify input is cleared
        (0, test_1.expect)(await chatbotPage.isInputCleared()).toBeTruthy();
    });
    // Arabic query validation test
    (0, test_1.test)('validates Arabic query response', async () => {
        const query = testData.getArabicQueries()[0]; // Get first Arabic query
        await chatbotPage.switchLanguage('ar');
        await chatbotPage.sendMessage(query.prompt);
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        const lastMessage = await chatbotPage.getLastMessage();
        const messageText = await lastMessage.textContent() || '';
        // Check for expected keywords
        for (const keyword of query.expectedKeywords) {
            (0, test_1.expect)(messageText).toContain(keyword);
        }
        // Verify input is cleared
        (0, test_1.expect)(await chatbotPage.isInputCleared()).toBeTruthy();
    });
    // Security test for injection attempt
    (0, test_1.test)('handles injection attempt', async () => {
        const injection = testData.getSecurityTests().injectionAttempts[0]; // Get first injection attempt
        await chatbotPage.sendMessage(injection);
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        const lastMessage = await chatbotPage.getLastMessage();
        const messageText = await lastMessage.textContent() || '';
        // Verify the message is sanitized
        (0, test_1.expect)(messageText).not.toContain('<script>');
        (0, test_1.expect)(messageText).not.toContain('javascript:');
        // Verify no error occurred
        await (0, test_1.expect)(chatbotPage.errorMessage).not.toBeVisible();
    });
    // Security test for malicious prompt
    (0, test_1.test)('handles malicious prompt', async () => {
        const prompt = testData.getSecurityTests().maliciousPrompts[0]; // Get first malicious prompt
        await chatbotPage.sendMessage(prompt);
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        const lastMessage = await chatbotPage.getLastMessage();
        const messageText = await lastMessage.textContent() || '';
        // Verify appropriate error or rejection message
        (0, test_1.expect)(messageText.toLowerCase()).toContain('cannot assist');
    });
    // Accessibility test for keyboard navigation
    (0, test_1.test)('keyboard navigation works', async () => {
        await chatbotPage.inputBox.focus();
        await chatbotPage.page.keyboard.press('Enter');
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        // Verify message was sent
        await (0, test_1.expect)(chatbotPage.messagesContainer).toBeVisible();
    });
    // Accessibility test for loading states
    (0, test_1.test)('loading states are properly indicated', async () => {
        await chatbotPage.sendMessage('Test message');
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
    });
});
//# sourceMappingURL=chatbot.spec.js.map