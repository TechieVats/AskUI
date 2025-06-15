import { test, expect } from '@playwright/test';
import { ChatbotPage } from '../pages/ChatbotPage';
import { TestDataManager, SecurityTest } from '../data/TestDataManager';

test.setTimeout(120000);

test.describe.configure({ mode: 'serial' });

test.describe('Security Tests', () => {
    let chatbotPage: ChatbotPage;
    const testData = TestDataManager.getInstance();

    test.beforeEach(async ({ page }) => {
        chatbotPage = new ChatbotPage(page);
        await chatbotPage.navigate();
    });

    test.describe('Injection Tests', () => {
        const injectionTests = testData.getInjectionTests();

        for (const testCase of injectionTests) {
            test(`handles ${testCase.description}`, async () => {
                console.log(`Testing injection: "${testCase.input}"`);
                await chatbotPage.sendMessage(testCase.input);
                
                // Wait for manual reCAPTCHA handling
                console.log('Waiting 60 seconds for potential reCAPTCHA...');
                await chatbotPage.page.waitForTimeout(60000);
                
                const response = await chatbotPage.getLastBotResponse();
                const responseText = (await response.textContent())?.toLowerCase().trim();
                
                // Verify response exists
                expect(responseText).toBeTruthy();
                console.log(`Chatbot response: "${responseText}"`);

                // Check for expected indicators
                const foundIndicators = testCase.expectedIndicators.filter((indicator: string) =>
                    responseText?.includes(indicator)
                );

                // Log results
                if (foundIndicators.length > 0) {
                    console.log('Found security indicators:', foundIndicators);
                } else {
                    console.log('No security indicators found');
                }

                // Assert that at least one security indicator was found
                expect(foundIndicators.length).toBeGreaterThan(0);

                // Verify no error occurred
                await expect(chatbotPage.errorMessage).not.toBeVisible();
            });
        }
    });

    test.describe('XSS Tests', () => {
        const xssTests = testData.getXSSTests();

        for (const testCase of xssTests) {
            test(`handles ${testCase.description}`, async () => {
                console.log(`Testing XSS: "${testCase.input}"`);
                await chatbotPage.sendMessage(testCase.input);
                
                // Wait for manual reCAPTCHA handling
                console.log('Waiting 45 seconds for potential reCAPTCHA...');
                await chatbotPage.page.waitForTimeout(45000);
                
                const response = await chatbotPage.getLastBotResponse();
                const responseText = (await response.textContent())?.toLowerCase().trim();
                
                // Verify response exists
                expect(responseText).toBeTruthy();
                console.log(`Chatbot response: "${responseText}"`);

                // Check for expected indicators
                const foundIndicators = testCase.expectedIndicators.filter((indicator: string) =>
                    responseText?.includes(indicator)
                );

                // Log results
                if (foundIndicators.length > 0) {
                    console.log('Found security indicators:', foundIndicators);
                } else {
                    console.log('No security indicators found');
                }

                // Assert that at least one security indicator was found
                expect(foundIndicators.length).toBeGreaterThan(0);

                // Verify no error occurred
                await expect(chatbotPage.errorMessage).not.toBeVisible();
            });
        }
    });

    test.describe('SQL Injection Tests', () => {
        const sqlTests = testData.getSQLInjectionTests();

        for (const testCase of sqlTests) {
            test(`handles ${testCase.description}`, async () => {
                console.log(`Testing SQL injection: "${testCase.input}"`);
                await chatbotPage.sendMessage(testCase.input);
                
                // Wait for manual reCAPTCHA handling
                console.log('Waiting 45 seconds for potential reCAPTCHA...');
                await chatbotPage.page.waitForTimeout(45000);
                
                const response = await chatbotPage.getLastBotResponse();
                const responseText = (await response.textContent())?.toLowerCase().trim();
                
                // Verify response exists
                expect(responseText).toBeTruthy();
                console.log(`Chatbot response: "${responseText}"`);

                // Check for expected indicators
                const foundIndicators = testCase.expectedIndicators.filter((indicator: string) =>
                    responseText?.includes(indicator)
                );

                // Log results
                if (foundIndicators.length > 0) {
                    console.log('Found security indicators:', foundIndicators);
                } else {
                    console.log('No security indicators found');
                }

                // Assert that at least one security indicator was found
                expect(foundIndicators.length).toBeGreaterThan(0);

                // Verify no error occurred
                await expect(chatbotPage.errorMessage).not.toBeVisible();
            });
        }
    });

    test.describe('Malicious Tests', () => {
        const maliciousTests = testData.getMaliciousTests();

        for (const testCase of maliciousTests) {
            test(`handles ${testCase.description}`, async () => {
                console.log(`Testing malicious query: "${testCase.input}"`);
                await chatbotPage.sendMessage(testCase.input);
                
                // Wait for manual reCAPTCHA handling
                console.log('Waiting 45 seconds for potential reCAPTCHA...');
                await chatbotPage.page.waitForTimeout(45000);
                
                const response = await chatbotPage.getLastBotResponse();
                const responseText = (await response.textContent())?.toLowerCase().trim();
                
                // Verify response exists
                expect(responseText).toBeTruthy();
                console.log(`Chatbot response: "${responseText}"`);

                // Check for expected indicators
                const foundIndicators = testCase.expectedIndicators.filter((indicator: string) =>
                    responseText?.includes(indicator)
                );

                // Log results
                if (foundIndicators.length > 0) {
                    console.log('Found security indicators:', foundIndicators);
                } else {
                    console.log('No security indicators found');
                }

                // Assert that at least one security indicator was found
                expect(foundIndicators.length).toBeGreaterThan(0);

                // Verify no error occurred
                await expect(chatbotPage.errorMessage).not.toBeVisible();
            });
        }
    });
}); 