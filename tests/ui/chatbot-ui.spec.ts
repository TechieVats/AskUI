import { test, expect } from '@playwright/test';
import { ChatbotPage } from '../pages/ChatbotPage';
import { TestDataManager } from '../data/TestDataManager';

// Increase test timeout to 120 seconds to allow for manual reCAPTCHA handling
test.setTimeout(120000);

// Disable parallel test execution
test.describe.configure({ mode: 'serial' });

test.describe('Chatbot UI Tests', () => {
    let chatbotPage: ChatbotPage;
    const testData = TestDataManager.getInstance();

    test.beforeEach(async ({ page }) => {
        chatbotPage = new ChatbotPage(page);
        await chatbotPage.navigate();
    });

    test('can send and receive messages in desktop view', async () => {
        const testData = TestDataManager.getInstance();
        const testMessage = testData.getEnglishQueries()[2].prompt;
        console.log(`Sending test message: "${testMessage}"`);
        await chatbotPage.sendMessage(testMessage);
        
        // Wait for manual reCAPTCHA handling
        console.log('Waiting 45 seconds for potential reCAPTCHA...');
        await chatbotPage.page.waitForTimeout(45000);
        
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        console.log(`Bot response: "${responseText}"`);
        
        await expect(chatbotPage.messagesContainer).toContainText(testMessage);
        expect(await chatbotPage.isInputCleared()).toBeTruthy();
    });

    test('loading states are properly indicated', async () => {
        const testData = TestDataManager.getInstance();
        const testMessage = testData.getEnglishQueries()[0].prompt;
        console.log(`Sending test message: "${testMessage}"`);
        await chatbotPage.sendMessage(testMessage);
        
        // Wait for manual reCAPTCHA handling
        console.log('Waiting 45 seconds for potential reCAPTCHA...');
        await chatbotPage.page.waitForTimeout(45000);
        
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        console.log(`Bot response: "${responseText}"`);
        
        await expect(chatbotPage.botMessage).toBeVisible();
    });

    test('supports RTL rendering for Arabic responses', async () => {
        const arabicMessage = 'كيف يمكنني تجديد إقامتي؟';
        console.log(`📝 Sending Arabic message: "${arabicMessage}"`);
    
        await chatbotPage.sendMessage(arabicMessage);
    
        console.log('⏳ Waiting 45 seconds for potential reCAPTCHA...');
        await chatbotPage.page.waitForTimeout(45000);
    
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        console.log(`🤖 Bot response: "${responseText}"`);
    
        const lastMessage = await chatbotPage.getLastMessage();
        await expect(lastMessage).toHaveClass(/rtl/);
    });

    test('supports LTR rendering for English responses', async () => {
        const testData = TestDataManager.getInstance();
        const testMessage = testData.getEnglishQueries()[1].prompt;
        console.log(`Sending English message: "${testMessage}"`);
    
        await chatbotPage.sendMessage(testMessage);
    
        console.log('⏳ Waiting 45 seconds for potential reCAPTCHA...');
        await chatbotPage.page.waitForTimeout(45000);
    
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        console.log(`Bot response: "${responseText}"`);
    
        const lastMessage = await chatbotPage.getLastMessage();
        await expect(lastMessage).toHaveClass(/ltr/);
    });
    

    test('can start a new chat', async () => {
        // Send initial message
        const firstMessage = 'First message';
        console.log(`Sending first message: "${firstMessage}"`);
        await chatbotPage.sendMessage(firstMessage);
        
        // Wait for manual reCAPTCHA handling
        console.log('Waiting 45 seconds for potential reCAPTCHA...');
        await chatbotPage.page.waitForTimeout(45000);
        
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        console.log(`Bot response: "${responseText}"`);
        
        // Start new chat
        console.log('Starting new chat...');
        await chatbotPage.startNewChat();
        
        // Verify chat is cleared
        await expect(chatbotPage.messagesContainer).not.toContainText(firstMessage);
    });

    test('keyboard navigation works', async () => {
        const testData = TestDataManager.getInstance();
        const testMessage = testData.getEnglishQueries()[0].prompt;
        console.log(`Testing keyboard navigation with message: "${testMessage}"`);
        
        // Test focus and input
        await chatbotPage.inputBox.focus();
        await expect(chatbotPage.inputBox).toBeFocused();
        
        // Test typing and Enter key
        await chatbotPage.inputBox.fill(testMessage);
        await chatbotPage.page.keyboard.press('Enter');
        
        // Wait for manual reCAPTCHA handling
        console.log('Waiting 45 seconds for potential reCAPTCHA...');
        await chatbotPage.page.waitForTimeout(45000);
        
        // Verify message was sent
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        console.log(`Bot response: "${responseText}"`);
        
        // Verify input was cleared after sending
        expect(await chatbotPage.isInputCleared()).toBeTruthy();
        
        // Test Tab navigation
        await chatbotPage.inputBox.focus();
        await chatbotPage.page.keyboard.press('Tab');
        await expect(chatbotPage.sendButton).toBeFocused();
    });

    test.describe('Mobile View', () => {
        const MOBILE_VIEWPORT = { width: 390, height: 844 };
        const testData = TestDataManager.getInstance();

        test.beforeEach(async ({ page }) => {
            await page.setViewportSize(MOBILE_VIEWPORT);
            await chatbotPage.navigate();
        });

        test('chat widget loads correctly in mobile view', async () => {
            console.log('Testing mobile view (390x844)...');
            
            // Verify chat container is visible and properly sized
            await expect(chatbotPage.chatContainer).toBeVisible();
            const containerBox = await chatbotPage.chatContainer.boundingBox();
            expect(containerBox).toBeTruthy();
            expect(containerBox?.width).toBeLessThan(MOBILE_VIEWPORT.width);
            
            // Verify input elements are properly sized for mobile
            const inputBox = await chatbotPage.inputBox.boundingBox();
            const sendButton = await chatbotPage.sendButton.boundingBox();
            expect(inputBox).toBeTruthy();
            expect(sendButton).toBeTruthy();
            
            // Verify elements are within viewport
            if (inputBox && sendButton) {
                expect(inputBox.x + inputBox.width).toBeLessThanOrEqual(MOBILE_VIEWPORT.width);
                expect(sendButton.x + sendButton.width).toBeLessThanOrEqual(MOBILE_VIEWPORT.width);
            }
        });

        test('can send and receive messages in mobile view', async () => {
            console.log('Testing message sending in mobile view...');
            
            const testMessage = testData.getEnglishQueries()[0].prompt;
            console.log(`Sending test message: "${testMessage}"`);
            await chatbotPage.sendMessage(testMessage);
            
            // Wait for manual reCAPTCHA handling
            console.log('Waiting 45 seconds for potential reCAPTCHA...');
            await chatbotPage.page.waitForTimeout(45000);
            
            const response = await chatbotPage.getLastBotResponse();
            const responseText = await response.textContent();
            console.log(`Bot response: "${responseText}"`);
            
            // Verify message was sent and input was cleared
            await expect(chatbotPage.messagesContainer).toContainText(testMessage);
            expect(await chatbotPage.isInputCleared()).toBeTruthy();
            
            // Verify message bubbles are properly sized for mobile
            const messageBubble = await chatbotPage.getLastMessage();
            const bubbleBox = await messageBubble.boundingBox();
            expect(bubbleBox).toBeTruthy();
            if (bubbleBox) {
                expect(bubbleBox.width).toBeLessThan(MOBILE_VIEWPORT.width - 40); // 40px for margins
            }
        });

        test('keyboard behavior in mobile view', async () => {
            console.log('Testing keyboard behavior in mobile view...');
            
            const testMessage = testData.getEnglishQueries()[1].prompt;
            console.log(`Sending test message: "${testMessage}"`);
            
            // Test mobile keyboard interaction
            await chatbotPage.inputBox.click();
            await expect(chatbotPage.inputBox).toBeFocused();
            await chatbotPage.inputBox.fill(testMessage);
            
            // Verify virtual keyboard doesn't push content out of view
            const initialContainerBox = await chatbotPage.chatContainer.boundingBox();
            await chatbotPage.page.keyboard.press('Enter');
            
            // Wait for manual reCAPTCHA handling
            console.log('Waiting 45 seconds for potential reCAPTCHA...');
            await chatbotPage.page.waitForTimeout(45000);
            
            const response = await chatbotPage.getLastBotResponse();
            const responseText = await response.textContent();
            console.log(`Bot response: "${responseText}"`);
            
            // Verify message was sent
            await expect(chatbotPage.messagesContainer).toContainText(testMessage);
            
            // Verify container position hasn't changed significantly
            const finalContainerBox = await chatbotPage.chatContainer.boundingBox();
            expect(finalContainerBox).toBeTruthy();
            if (initialContainerBox && finalContainerBox) {
                expect(Math.abs(finalContainerBox.y - initialContainerBox.y)).toBeLessThan(100);
            }
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
                console.log(`Testing viewport size: ${size.width}x${size.height}`);
                await page.setViewportSize(size);
                await chatbotPage.navigate();
                
                const containerBox = await chatbotPage.chatContainer.boundingBox();
                expect(containerBox).toBeTruthy();
                
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
                console.log(`Testing UI elements in viewport: ${size.width}x${size.height}`);
                await page.setViewportSize(size);
                await chatbotPage.navigate();
                
                await expect(chatbotPage.inputBox).toBeVisible();
                await expect(chatbotPage.sendButton).toBeVisible();
                
                const inputBox = await chatbotPage.inputBox.boundingBox();
                const sendButton = await chatbotPage.sendButton.boundingBox();
                
                expect(inputBox).toBeTruthy();
                expect(sendButton).toBeTruthy();
                
                // Check if elements are within viewport width
                if (inputBox && sendButton) {
                    expect(inputBox.x + inputBox.width).toBeLessThanOrEqual(size.width);
                    expect(sendButton.x + sendButton.width).toBeLessThanOrEqual(size.width);
                }
            }
        });
    });

    test.describe('Cross-browser Compatibility', () => {
        test('chat widget works across different browsers', async () => {
            console.log('Testing cross-browser compatibility...');
            await expect(chatbotPage.chatContainer).toBeVisible();
            await expect(chatbotPage.inputBox).toBeVisible();
            await expect(chatbotPage.sendButton).toBeVisible();
            
            const testMessage = 'Test message';
            console.log(`Sending test message: "${testMessage}"`);
            await chatbotPage.sendMessage(testMessage);
            
            // Wait for manual reCAPTCHA handling
            console.log('Waiting 45 seconds for potential reCAPTCHA...');
            await chatbotPage.page.waitForTimeout(45000);
            
            const response = await chatbotPage.getLastBotResponse();
            const responseText = await response.textContent();
            console.log(`Bot response: "${responseText}"`);
            
            await expect(chatbotPage.messagesContainer).toContainText(testMessage);
        });
    });

    test.describe.only('Scroll Behavior', () => {
        test('auto-scrolls to new messages', async () => {
            const testData = TestDataManager.getInstance();
            const message = testData.getEnglishQueries()[0].prompt;
        
            console.log(`Sending message: "${message}"`);
            await chatbotPage.sendMessage(message);
        
            // Wait for manual reCAPTCHA handling
            console.log('⏳ Waiting 45 seconds for potential reCAPTCHA...');
            await chatbotPage.page.waitForTimeout(45000);
        
            const response = await chatbotPage.getLastBotResponse();
            const responseText = await response.textContent();
            console.log(`Bot response: "${responseText}"`);
        
            // Evaluate if scroll reached the bottom
            const isAtBottom = await chatbotPage.page.evaluate(() => {
                const container = document.querySelector('.chatbot-container');
                if (!container) return false;
                return container.scrollHeight - container.scrollTop <= container.clientHeight + 5;
            });
        
            expect(isAtBottom).toBe(true);
        });
        

        test('maintains scroll position when loading more messages', async () => {
            const testData = TestDataManager.getInstance();
            const longMessage = testData.getEnglishQueries()[0].prompt.repeat(5);
            
            // Send a long message to create scrollable content
            await chatbotPage.sendMessage(longMessage);
            
            // Wait for manual reCAPTCHA handling
            console.log('⏳ Waiting 45 seconds for potential reCAPTCHA...');
            await chatbotPage.page.waitForTimeout(45000);
            
            const response = await chatbotPage.getLastBotResponse();
            const responseText = await response.textContent();
            console.log(`Bot response: "${responseText}"`);

            // Scroll to middle of container
            await chatbotPage.page.evaluate(() => {
                const container = document.querySelector('.chat-container');
                if (container) {
                    container.scrollTop = container.scrollHeight / 2;
                }
            });

            // Get initial scroll position
            const initialScroll = await chatbotPage.page.evaluate(() => {
                const container = document.querySelector('.chat-container');
                return container ? container.scrollTop : 0;
            });

            // Send another message
            await chatbotPage.sendMessage('Test message');
            
            // Wait for manual reCAPTCHA handling
            console.log('⏳ Waiting 45 seconds for potential reCAPTCHA...');
            await chatbotPage.page.waitForTimeout(45000);

            // Get final scroll position
            const finalScroll = await chatbotPage.page.evaluate(() => {
                const container = document.querySelector('.chat-container');
                return container ? container.scrollTop : 0;
            });

            // Verify scroll position is maintained
            expect(finalScroll).toBeGreaterThanOrEqual(initialScroll);
        });
    });

    test.describe('Accessibility', () => {
        test('has proper ARIA labels and roles', async () => {
            // Check input box accessibility
            await expect(chatbotPage.inputBox).toHaveAttribute('aria-label', 'Type your message');
            await expect(chatbotPage.inputBox).toHaveAttribute('role', 'textbox');

            // Check send button accessibility
            await expect(chatbotPage.sendButton).toHaveAttribute('aria-label', 'Send message');
            await expect(chatbotPage.sendButton).toHaveAttribute('role', 'button');

            // Check message container accessibility
            await expect(chatbotPage.messagesContainer).toHaveAttribute('role', 'log');
            await expect(chatbotPage.messagesContainer).toHaveAttribute('aria-live', 'polite');
        });

        test('supports keyboard navigation', async () => {
            // Test Tab navigation
            await chatbotPage.inputBox.focus();
            await expect(chatbotPage.inputBox).toBeFocused();
            
            await chatbotPage.page.keyboard.press('Tab');
            await expect(chatbotPage.sendButton).toBeFocused();
            
            await chatbotPage.page.keyboard.press('Tab');
            await expect(chatbotPage.newChatButton).toBeFocused();
        });

        test('has proper color contrast', async () => {
            // Check text color contrast
            const textColor = await chatbotPage.page.evaluate(() => {
                const text = document.querySelector('.chat-text');
                if (!text) return null;
                const style = window.getComputedStyle(text);
                return {
                    color: style.color,
                    backgroundColor: style.backgroundColor
                };
            });

            expect(textColor).toBeTruthy();
            // Note: You might want to add a proper color contrast checking library
            // This is a basic check to ensure colors are defined
            expect(textColor?.color).toBeTruthy();
            expect(textColor?.backgroundColor).toBeTruthy();
        });

        test('has proper focus indicators', async () => {
            // Focus input box
            await chatbotPage.inputBox.focus();
            
            // Check focus styles
            const focusStyles = await chatbotPage.page.evaluate(() => {
                const input = document.querySelector('.chat-input-question');
                if (!input) return null;
                const style = window.getComputedStyle(input);
                return {
                    outline: style.outline,
                    outlineOffset: style.outlineOffset
                };
            });

            expect(focusStyles).toBeTruthy();
            expect(focusStyles?.outline).not.toBe('none');
            expect(focusStyles?.outlineOffset).toBeTruthy();
        });
    });
}); 