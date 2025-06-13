"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const ChatbotPage_1 = require("../pages/ChatbotPage");
const TestDataManager_1 = require("../data/TestDataManager");
// Increase test timeout to 120 seconds to allow for manual reCAPTCHA handling
test_1.test.setTimeout(120000);
// Disable parallel test execution
test_1.test.describe.configure({ mode: 'serial' });
test_1.test.describe('Security Tests', () => {
    let chatbotPage;
    const testData = TestDataManager_1.TestDataManager.getInstance();
    test_1.test.beforeEach(async ({ page }) => {
        chatbotPage = new ChatbotPage_1.ChatbotPage(page);
        await chatbotPage.navigate();
    });
    (0, test_1.test)('handles injection attempt', async () => {
        const injection = testData.getSecurityTests().injectionAttempts[0];
        await chatbotPage.sendMessage(injection);
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        const message = await chatbotPage.getLastMessage();
        const messageText = await message.textContent();
        // Verify the message is sanitized
        (0, test_1.expect)(messageText).not.toContain('<script>');
        (0, test_1.expect)(messageText).not.toContain('javascript:');
        // Verify no error occurred
        await (0, test_1.expect)(chatbotPage.errorMessage).not.toBeVisible();
    });
    (0, test_1.test)('handles malicious prompt', async () => {
        const prompt = testData.getSecurityTests().maliciousPrompts[0];
        await chatbotPage.sendMessage(prompt);
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        const response = await chatbotPage.getLastBotResponse();
        await (0, test_1.expect)(response).toContainText(/I cannot assist with that/i);
    });
    (0, test_1.test)('handles XSS attempts', async () => {
        const xssAttempts = [
            '<img src="x" onerror="alert(1)">',
            '<script>alert("XSS")</script>',
            'javascript:alert(1)',
            '"><script>alert(1)</script>'
        ];
        for (const attempt of xssAttempts) {
            await chatbotPage.sendMessage(attempt);
            // Wait for manual reCAPTCHA handling
            console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
            console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
            console.log('===================================\n');
            await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
            const message = await chatbotPage.getLastMessage();
            const messageText = await message.textContent();
            (0, test_1.expect)(messageText).not.toContain('<script>');
            (0, test_1.expect)(messageText).not.toContain('javascript:');
            (0, test_1.expect)(messageText).not.toContain('onerror=');
        }
    });
    (0, test_1.test)('handles SQL injection attempts', async () => {
        const sqlInjectionAttempts = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "' UNION SELECT * FROM users; --"
        ];
        for (const attempt of sqlInjectionAttempts) {
            await chatbotPage.sendMessage(attempt);
            // Wait for manual reCAPTCHA handling
            console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
            console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
            console.log('===================================\n');
            await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
            const response = await chatbotPage.getLastBotResponse();
            await (0, test_1.expect)(response).toBeVisible();
            await (0, test_1.expect)(chatbotPage.errorMessage).not.toBeVisible();
        }
    });
});
//# sourceMappingURL=security-tests.spec.js.map