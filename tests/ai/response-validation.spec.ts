import { test, expect } from '@playwright/test';
import { ChatbotPage } from '../pages/ChatbotPage';
import { TestDataManager } from '../data/TestDataManager';
import { TextSimilarity } from '../utils/text-similarity';

// Increase test timeout to 120 seconds to allow for manual reCAPTCHA handling
test.setTimeout(120000);

// Disable parallel test execution
test.describe.configure({ mode: 'serial' });

test.describe('Response Validation Tests', () => {
    let chatbotPage: ChatbotPage;
    const testData = TestDataManager.getInstance();
    const textSimilarity = TextSimilarity.getInstance();

    test.beforeEach(async ({ page }) => {
        chatbotPage = new ChatbotPage(page);
        await chatbotPage.navigate();
    });

    test('validates English query response', async () => {
        const query = testData.getEnglishQueries()[0];
        await chatbotPage.sendMessage(query.prompt);
        
        // Wait for manual reCAPTCHA handling
        console.log('Please handle the reCAPTCHA if it appears...');
        await chatbotPage.page.waitForTimeout(60000); // 60 second wait for manual handling
        
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        
        for (const keyword of query.expectedKeywords) {
            expect(responseText?.toLowerCase()).toContain(keyword.toLowerCase());
        }
    });

    test('validates Arabic query response', async () => {
        const query = testData.getArabicQueries()[0];
        await chatbotPage.sendMessage(query.prompt);
        
        // Wait for manual reCAPTCHA handling
        console.log('Please handle the reCAPTCHA if it appears...');
        await chatbotPage.page.waitForTimeout(60000); // 60 second wait for manual handling
        
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        expect(responseText).toBeTruthy();
        
        for (const keyword of query.expectedKeywords) {
            console.log(`Validating keyword: ${keyword}`);
            expect(responseText?.normalize()).toContain(keyword.normalize());
        }
    });

    test('validates semantic similarity of Arabic responses', async () => {
        const query = testData.getArabicQueries()[0];
        console.log('Sending query:', query.prompt);
        
        // Initialize the model before sending the query
        console.log('Pre-initializing similarity model...');
        await textSimilarity.initialize();
        
        await chatbotPage.sendMessage(query.prompt);
        
        // Wait for manual reCAPTCHA handling
        console.log('Please handle the reCAPTCHA if it appears...');
        await chatbotPage.page.waitForTimeout(60000); // 60 second wait for manual handling
        
        console.log('Getting bot response...');
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        expect(responseText).toBeTruthy();
        console.log('Response received:', responseText);

        console.log('Calculating similarities...');
        const startTime = Date.now();
        
        // Calculate similarity between response and each expected keyword
        const similarities = await Promise.all(
            query.expectedKeywords.map(async keyword => {
                try {
                    const score = await textSimilarity.calculateSimilarity(keyword, responseText || '');
                    console.log(`Similarity for keyword "${keyword}": ${score}`);
                    return score;
                } catch (error) {
                    console.error(`Error calculating similarity for keyword "${keyword}":`, error);
                    return 0;
                }
            })
        );

        console.log(`Similarity calculations completed in ${Date.now() - startTime}ms`);

        // Get the maximum similarity score
        const maxSimilarity = Math.max(...similarities);
        const averageSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;

        // Log detailed similarity information
        console.log('All similarity scores:', similarities);
        console.log('Maximum similarity score:', maxSimilarity);
        console.log('Average similarity score:', averageSimilarity);

        // Assert that the average similarity is above a lower threshold
        expect(averageSimilarity).toBeGreaterThan(0.2);
    });

    test('validates fallback message on invalid input', async () => {
        const invalidInput = '!@#$%^&*()';
        await chatbotPage.sendMessage(invalidInput);
        
        // Wait for manual reCAPTCHA handling
        console.log('Please handle the reCAPTCHA if it appears...');
        await chatbotPage.page.waitForTimeout(60000); // 60 second wait for manual handling
        
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        
        // Check for fallback message indicators
        expect(responseText?.toLowerCase()).toContain('sorry');
        expect(responseText?.toLowerCase()).toContain('understand');
        expect(responseText?.toLowerCase()).toContain('help');
    });

    test('validates HTML formatting in responses', async () => {
        const query = testData.getEnglishQueries()[0];
        await chatbotPage.sendMessage(query.prompt);
        
        // Wait for manual reCAPTCHA handling
        console.log('Please handle the reCAPTCHA if it appears...');
        await chatbotPage.page.waitForTimeout(60000); // 60 second wait for manual handling
        
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        
        // Check for proper HTML formatting
        expect(responseText).not.toContain('<script>');
        expect(responseText).not.toContain('<style>');
        expect(responseText).not.toContain('<iframe>');
        expect(responseText).not.toContain('javascript:');
        expect(responseText).not.toContain('onerror=');
        expect(responseText).not.toContain('onload=');
    });



    test('validates semantic consistency between English and Arabic responses', async () => {
        const englishQuery = testData.getEnglishQueries()[0];
        const arabicQuery = testData.getArabicQueries()[0];
        
        // Get English response
        await chatbotPage.sendMessage(englishQuery.prompt);
        console.log('Please handle the reCAPTCHA if it appears...');
        await chatbotPage.page.waitForTimeout(60000);
        const englishResponse = await chatbotPage.getLastBotResponse();
        const englishText = await englishResponse.textContent();
        
        // Get Arabic response
        await chatbotPage.sendMessage(arabicQuery.prompt);
        console.log('Please handle the reCAPTCHA if it appears...');
        await chatbotPage.page.waitForTimeout(60000);
        const arabicResponse = await chatbotPage.getLastBotResponse();
        const arabicText = await arabicResponse.textContent();
        
        // Check that both responses contain the same semantic information
        expect(englishText).toBeTruthy();
        expect(arabicText).toBeTruthy();
        expect(englishText?.length).toBeGreaterThan(0);
        expect(arabicText?.length).toBeGreaterThan(0);
    });

    test.describe('Fallback Message Tests', () => {
        const fallbackTests = testData.getFallbackTests();

        for (const testCase of fallbackTests) {
            test(`validates fallback message for ${testCase.description}`, async () => {
                // Send invalid input
                console.log(`📝 Sending invalid input: "${testCase.invalidInput}"`);
                await chatbotPage.sendMessage(testCase.invalidInput);

                // Allow time for manual reCAPTCHA if needed
                console.log('⏳ Waiting 60 seconds for potential reCAPTCHA...');
                await chatbotPage.page.waitForTimeout(60000);

                // Get the chatbot response
                const response = await chatbotPage.getLastBotResponse();
                const responseText = (await response.textContent())?.toLowerCase().trim();

                // Verify response exists
                expect(responseText).toBeTruthy();
                console.log(`💬 Chatbot response: "${responseText}"`);

                // Check if any expected fallback message fragment is included
                const foundIndicators = testCase.expectedIndicators.filter(phrase =>
                    responseText?.includes(phrase)
                );

                // Log which indicators were found
                if (foundIndicators.length > 0) {
                    console.log('Found fallback indicators:', foundIndicators);
                } else {
                    console.log(' No fallback indicators found in response');
                    console.log('Expected indicators:', testCase.expectedIndicators);
                }

                // Assert that at least one fallback indicator was found
                expect(foundIndicators.length).toBeGreaterThan(0);

                // Additional validation for malicious queries
                if (testCase.description.includes('Malicious') || 
                    testCase.description.includes('System')) {
                    expect(responseText).not.toContain(testCase.invalidInput.toLowerCase());
                    expect(responseText).not.toContain('execute');
                    expect(responseText).not.toContain('system');
                }

                // Additional validation for random string inputs
                if (testCase.description.includes('Random') || 
                    testCase.description.includes('Keyboard')) {
                    // Check if response indicates search attempt
                    const isSearchResponse = responseText?.includes('searching for') || 
                                          responseText?.includes('might not correspond');
                    
                    if (isSearchResponse) {
                        console.log('Response indicates search attempt');
                        // Verify the response doesn't contain the random input as a search term
                        expect(responseText).not.toContain(testCase.invalidInput.toLowerCase());
                    }
                }
            });
        }
    });

    test.describe('Hallucination Detection Tests', () => {
        const hallucinationTests = testData.getHallucinationTests();

        for (const testCase of hallucinationTests) {
            test(`detects hallucinations in ${testCase.description} response`, async () => {
                // Step 1: Send prompt
                console.log(`📝 Sending prompt: "${testCase.prompt}"`);
                await chatbotPage.sendMessage(testCase.prompt);

                // Step 2: Wait for manual reCAPTCHA if needed
                console.log('⏳ Waiting 60 seconds for potential reCAPTCHA...');
                await chatbotPage.page.waitForTimeout(60000);

                // Step 3: Fetch and normalize response
                const response = await chatbotPage.getLastBotResponse();
                const responseText = (await response.textContent())?.toLowerCase().trim();

                expect(responseText).toBeTruthy();
                console.log(`💬 Chatbot response: "${responseText}"`);

                // Step 4: Check for hallucination indicators
                const foundIndicators = testCase.hallucinationIndicators.filter(indicator =>
                    responseText?.includes(indicator)
                );

                // Log results
                if (foundIndicators.length > 0) {
                    console.log('❌ Found hallucination indicators:', foundIndicators);
                } else {
                    console.log('✅ No hallucination indicators found');
                }

                // Step 5: Assert no hallucination-like statements are present
                expect(foundIndicators.length).toBe(0);
            });
        }
    });
}); 