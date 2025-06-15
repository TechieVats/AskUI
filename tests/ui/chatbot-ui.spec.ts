import { test, expect } from '@playwright/test';
import { ChatbotPage } from '../pages/ChatbotPage';
import { TestDataManager } from '../data/TestDataManager';

// Increase test timeout to 120 seconds to allow for manual reCAPTCHA handling
test.setTimeout(120000);

test.describe.configure({ mode: 'serial' });

test.describe('Chatbot UI Tests', () => {
    let chatbotPage: ChatbotPage;
    const testData = TestDataManager.getInstance();

    test.beforeEach(async ({ page }) => {
        chatbotPage = new ChatbotPage(page);
        await chatbotPage.navigate();
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
        let chatbotPage: ChatbotPage;

        test.beforeEach(async ({ page }) => {
            chatbotPage = new ChatbotPage(page);
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
                
                // Set viewport size
                await page.setViewportSize(size);
                
                // Create new page instance for each viewport
                chatbotPage = new ChatbotPage(page);
                await chatbotPage.navigate();
                
                // Wait for chat to be fully loaded
                await page.waitForTimeout(2000);
                
                try {
                    const containerBox = await chatbotPage.chatContainer.boundingBox();
                    expect(containerBox).toBeTruthy();
                    
                    await expect(chatbotPage.chatContainer).toBeVisible();
                    expect(containerBox?.width).toBeLessThanOrEqual(size.width);
                    
                    // Additional wait between viewport changes
                    await page.waitForTimeout(1000);
                } catch (error) {
                    console.error(`Error testing viewport ${size.width}x${size.height}:`, error);
                    throw error;
                }
            }
        });

        test('UI elements are properly positioned in different views', async ({ page }) => {
            const viewportSizes = [
                { width: 1920, height: 1080 }, // Desktop
                { width: 390, height: 844 }    // Mobile
            ];

            for (const size of viewportSizes) {
                console.log(`Testing UI elements in viewport: ${size.width}x${size.height}`);
                
                // Set viewport size
                await page.setViewportSize(size);
                
                // Create new page instance for each viewport
                chatbotPage = new ChatbotPage(page);
                await chatbotPage.navigate();
                
                // Wait for chat to be fully loaded
                await page.waitForTimeout(2000);
                
                try {
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
                    
                    // Additional wait between viewport changes
                    await page.waitForTimeout(1000);
                } catch (error) {
                    console.error(`Error testing UI elements in viewport ${size.width}x${size.height}:`, error);
                    throw error;
                }
            }
        });
    });

    test.describe('Cross-browser Compatibility @cross-browser', () => {
        test('chat widget works across different browsers', async () => {
            console.log('Testing cross-browser compatibility...');
            
            // Test basic functionality
            await expect(chatbotPage.inputBox).toBeVisible();
            await expect(chatbotPage.sendButton).toBeVisible();
            await expect(chatbotPage.micButton).toBeVisible();
            
            // Test contenteditable behavior
            await chatbotPage.inputBox.click();
            await chatbotPage.inputBox.fill('Test message');
            const inputText = await chatbotPage.inputBox.textContent();
            expect(inputText).toBe('Test message');
            
            // Test button interactions with reCAPTCHA handling
            await chatbotPage.sendButton.click();
            console.log('Waiting 60 seconds for potential reCAPTCHA...');
            await chatbotPage.page.waitForTimeout(60000); // 60 second wait for manual handling
            await expect(chatbotPage.botMessage).toBeVisible();
            
            // Test new chat functionality
            await chatbotPage.newChatButton.click();
            await expect(chatbotPage.inputBox).toBeVisible();
            await expect(chatbotPage.inputBox).toHaveAttribute('placeholder', 'Please ask me a question');
        });
    });

    test.describe('Scroll Behavior', () => {
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
            console.log('Waiting 45 seconds for potential reCAPTCHA...');
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
            // Check input area
            await expect(chatbotPage.inputBox).toHaveAttribute('data-placeholder', 'Please ask me a question');
            await expect(chatbotPage.inputBox).toHaveAttribute('contenteditable', 'true');
            
            // Check send button
            await expect(chatbotPage.sendButton).toHaveAttribute('type', 'button');
            await expect(chatbotPage.sendButton).toHaveAttribute('aria-label', 'Send');
            await expect(chatbotPage.sendButton).toHaveAttribute('data-bs-original-title', 'Send');
            
            // Check microphone button
            await expect(chatbotPage.micButton).toHaveAttribute('type', 'button');
            await expect(chatbotPage.micButton).toHaveAttribute('class', 'btn user-banner-btn input-group-text speech-recognition hide-firefox');
            
            // Check language selector
            await expect(chatbotPage.languageSelector).toHaveAttribute('class', 'language-select hide-firefox');
            await expect(chatbotPage.languageSelector).toHaveAttribute('onchange', 'updateLang()');
            
            // Check new chat button
            await expect(chatbotPage.newChatButton).toHaveAttribute('id', 'chat-new-session-btn');
            await expect(chatbotPage.newChatButton).toHaveAttribute('aria-current', 'page');
            await expect(chatbotPage.newChatButton).toHaveAttribute('data-bs-original-title', 'New chat');
        });

        test('supports keyboard navigation', async () => {
            // Test Tab navigation through all interactive elements
            await chatbotPage.inputBox.focus();
            await expect(chatbotPage.inputBox).toBeFocused();
            
            // Tab to send button
            await chatbotPage.page.keyboard.press('Tab');
            await expect(chatbotPage.sendButton).toBeFocused();
            
            // Tab to microphone button
            await chatbotPage.page.keyboard.press('Tab');
            await expect(chatbotPage.micButton).toBeFocused();
            
            // Tab to language selector
            await chatbotPage.page.keyboard.press('Tab');
            await expect(chatbotPage.languageSelector).toBeFocused();
            
            // Test Shift+Tab to go backwards
            await chatbotPage.page.keyboard.press('Shift+Tab');
            await expect(chatbotPage.micButton).toBeFocused();
            
            await chatbotPage.page.keyboard.press('Shift+Tab');
            await expect(chatbotPage.sendButton).toBeFocused();
            
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