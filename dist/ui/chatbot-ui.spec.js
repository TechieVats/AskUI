"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const ChatbotPage_1 = require("../pages/ChatbotPage");
const TestDataManager_1 = require("../data/TestDataManager");
// Increase test timeout to 120 seconds to allow for manual reCAPTCHA handling
test_1.test.setTimeout(120000);
// Disable parallel test execution
test_1.test.describe.configure({ mode: 'serial' });
test_1.test.describe('Chatbot UI Tests', () => {
    let chatbotPage;
    const testData = TestDataManager_1.TestDataManager.getInstance();
    test_1.test.beforeEach(async ({ page }) => {
        chatbotPage = new ChatbotPage_1.ChatbotPage(page);
        await chatbotPage.navigate();
    });
    // Running only 5 critical tests
    (0, test_1.test)('can send and receive messages in desktop view', async () => {
        const testMessage = 'Hello';
        await chatbotPage.sendMessage(testMessage);
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        await (0, test_1.expect)(chatbotPage.messagesContainer).toContainText(testMessage);
        (0, test_1.expect)(await chatbotPage.isInputCleared()).toBeTruthy();
    });
    (0, test_1.test)('loading states are properly indicated', async () => {
        await chatbotPage.sendMessage('Test message');
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        await (0, test_1.expect)(chatbotPage.botMessage).toBeVisible();
    });
    (0, test_1.test)('supports RTL for Arabic text', async () => {
        const arabicMessage = 'مرحبا';
        await chatbotPage.sendMessage(arabicMessage);
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        const message = await chatbotPage.getLastMessage();
        await (0, test_1.expect)(message).toHaveCSS('direction', 'rtl');
    });
    (0, test_1.test)('can start a new chat', async () => {
        // Send initial message
        await chatbotPage.sendMessage('First message');
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        // Start new chat
        await chatbotPage.startNewChat();
        // Verify chat is cleared
        await (0, test_1.expect)(chatbotPage.messagesContainer).not.toContainText('First message');
    });
    (0, test_1.test)('keyboard navigation works', async () => {
        await chatbotPage.inputBox.focus();
        await chatbotPage.page.keyboard.press('Enter');
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        await (0, test_1.expect)(chatbotPage.messagesContainer).toBeVisible();
    });
    // Commenting out other tests for now
    /*
    test.describe('Mobile View', () => {
        test('chat widget loads correctly in mobile view', async ({ page }) => {
            // Set mobile viewport
            await page.setViewportSize({ width: 390, height: 844 });
            await chatbotPage.navigate();
            
            await expect(chatbotPage.chatContainer).toBeVisible();
            // Verify mobile-specific layout
            const containerBox = await chatbotPage.chatContainer.boundingBox();
            expect(containerBox?.width).toBeLessThan(600); // Mobile width check
        });

        test('can send and receive messages in mobile view', async ({ page }) => {
            await page.setViewportSize({ width: 390, height: 844 });
            await chatbotPage.navigate();
            
            const testMessage = 'Hello';
            await chatbotPage.sendMessage(testMessage);
            
            await expect(chatbotPage.messagesContainer).toContainText(testMessage);
            expect(await chatbotPage.isInputCleared()).toBeTruthy();
        });

        test('keyboard behavior in mobile view', async ({ page }) => {
            await page.setViewportSize({ width: 390, height: 844 });
            await chatbotPage.navigate();
            
            // Test virtual keyboard interaction
            await chatbotPage.inputBox.click();
            await page.keyboard.type('Test message');
            await page.keyboard.press('Enter');
            
            await expect(chatbotPage.messagesContainer).toContainText('Test message');
        });
    });

    test.describe('Responsive Design', () => {
        test('chat widget adapts to different screen sizes', async ({ page }) => {
            const viewportSizes = [
                { width: 1920, height: 1080 }, // Desktop
                { width: 810, height: 1080 },  // Tablet
                { width: 390, height: 844 }    // Mobile
            ];

            for (const size of viewportSizes) {
                await page.setViewportSize(size);
                await chatbotPage.navigate();
                
                const containerBox = await chatbotPage.chatContainer.boundingBox();
                expect(containerBox).toBeTruthy();
                
                // Verify chat container is visible and properly sized
                await expect(chatbotPage.chatContainer).toBeVisible();
                expect(containerBox?.width).toBeLessThanOrEqual(size.width);
            }
        });

        test('UI elements are properly positioned in different views', async ({ page }) => {
            const viewportSizes = [
                { width: 1920, height: 1080 }, // Desktop
                { width: 390, height: 844 }    // Mobile
            ];

            for (const size of viewportSizes) {
                await page.setViewportSize(size);
                await chatbotPage.navigate();
                
                // Verify input box and send button are visible and properly positioned
                await expect(chatbotPage.inputBox).toBeVisible();
                await expect(chatbotPage.sendButton).toBeVisible();
                
                const inputBox = await chatbotPage.inputBox.boundingBox();
                const sendButton = await chatbotPage.sendButton.boundingBox();
                
                expect(inputBox).toBeTruthy();
                expect(sendButton).toBeTruthy();
                
                // Verify elements are within viewport
                expect(inputBox?.right).toBeLessThanOrEqual(size.width);
                expect(sendButton?.right).toBeLessThanOrEqual(size.width);
            }
        });
    });

    test.describe('Cross-browser Compatibility', () => {
        test('chat widget works across different browsers', async () => {
            await expect(chatbotPage.chatContainer).toBeVisible();
            await expect(chatbotPage.inputBox).toBeVisible();
            await expect(chatbotPage.sendButton).toBeVisible();
            
            // Test basic functionality
            await chatbotPage.sendMessage('Test message');
            await expect(chatbotPage.messagesContainer).toContainText('Test message');
        });
    });
    */
});
//# sourceMappingURL=chatbot-ui.spec.js.map