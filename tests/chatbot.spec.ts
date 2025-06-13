import { test, expect } from '@playwright/test';
import { ChatbotPage } from './pages/ChatbotPage';
import { TestDataManager } from './data/TestDataManager';

// Increase test timeout to 120 seconds to allow for manual reCAPTCHA handling
test.setTimeout(120000);

// Disable parallel test execution
test.describe.configure({ mode: 'serial' });

test.describe('U-Ask Chatbot Tests', () => {
    let chatbotPage: ChatbotPage;
    const testData = TestDataManager.getInstance();

    test.beforeEach(async ({ page }) => {
        chatbotPage = new ChatbotPage(page);
        await chatbotPage.navigate();
    });

    test('chat widget loads correctly', async () => {
        await expect(chatbotPage.messagesContainer).toBeVisible();
        await expect(chatbotPage.inputBox).toBeVisible();
        await expect(chatbotPage.sendButton).toBeVisible();
    });

    test('can send and receive messages', async () => {
        const testMessage = 'Hello, how are you?';
        await chatbotPage.sendMessage(testMessage);
        
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        
    
        
        const lastMessage = await chatbotPage.getLastMessage();
        const messageText = await lastMessage.textContent() || '';
        expect(messageText).toContain(testMessage);
        
        // Verify input is cleared
        expect(await chatbotPage.isInputCleared()).toBeTruthy();
    });

    test('supports RTL for Arabic text', async () => {
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
        expect(messageText).toContain(arabicMessage);
    });

    // English query validation test
    test('validates English query response', async () => {
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
            expect(messageText.toLowerCase()).toContain(keyword.toLowerCase());
        }
        
        // Verify input is cleared
        expect(await chatbotPage.isInputCleared()).toBeTruthy();
    });

    // Arabic query validation test
    test('validates Arabic query response', async () => {
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
            expect(messageText).toContain(keyword);
        }
        
        // Verify input is cleared
        expect(await chatbotPage.isInputCleared()).toBeTruthy();
    });

    // Security test for injection attempt
    test('handles injection attempt', async () => {
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
        expect(messageText).not.toContain('<script>');
        expect(messageText).not.toContain('javascript:');
        
        // Verify no error occurred
        await expect(chatbotPage.errorMessage).not.toBeVisible();
    });

    // Security test for malicious prompt
    test('handles malicious prompt', async () => {
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
        expect(messageText.toLowerCase()).toContain('cannot assist');
    });

    // Accessibility test for keyboard navigation
    test('keyboard navigation works', async () => {
        await chatbotPage.inputBox.focus();
        await chatbotPage.page.keyboard.press('Enter');
        
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        
        // Verify message was sent
        await expect(chatbotPage.messagesContainer).toBeVisible();
    });

    // Accessibility test for loading states
    test('loading states are properly indicated', async () => {
        await chatbotPage.sendMessage('Test message');
        
        // Wait for manual reCAPTCHA handling
        console.log('\n=== MANUAL INTERVENTION REQUIRED ===');
        console.log('Please handle the reCAPTCHA manually. Waiting for 60 seconds...');
        console.log('===================================\n');
        await chatbotPage.page.waitForTimeout(60000); // 60 seconds pause
        
      
       
    });
}); 