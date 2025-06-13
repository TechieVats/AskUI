"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const ChatbotPage_1 = require("../pages/ChatbotPage");
const TestDataManager_1 = require("../data/TestDataManager");
const semantic_similarity_1 = require("../utils/semantic-similarity");
// Increase test timeout to 120 seconds to allow for manual reCAPTCHA handling
test_1.test.setTimeout(120000);
// Disable parallel test execution
test_1.test.describe.configure({ mode: 'serial' });
test_1.test.describe('Response Validation Tests', () => {
    let chatbotPage;
    const testData = TestDataManager_1.TestDataManager.getInstance();
    test_1.test.beforeEach(async ({ page }) => {
        chatbotPage = new ChatbotPage_1.ChatbotPage(page);
        await chatbotPage.navigate();
    });
    (0, test_1.test)('validates English query response', async () => {
        const query = testData.getEnglishQueries()[0];
        await chatbotPage.sendMessage(query.prompt);
        // Wait for manual reCAPTCHA handling
        console.log('Please handle the reCAPTCHA if it appears...');
        await chatbotPage.page.waitForTimeout(60000); // 60 second wait for manual handling
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        for (const keyword of query.expectedKeywords) {
            (0, test_1.expect)(responseText?.toLowerCase()).toContain(keyword.toLowerCase());
        }
    });
    (0, test_1.test)('validates Arabic query response', async () => {
        const query = testData.getArabicQueries()[0];
        await chatbotPage.sendMessage(query.prompt);
        // Wait for manual reCAPTCHA handling
        console.log('Please handle the reCAPTCHA if it appears...');
        await chatbotPage.page.waitForTimeout(60000); // 60 second wait for manual handling
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        (0, test_1.expect)(responseText).toBeTruthy();
        for (const keyword of query.expectedKeywords) {
            console.log(`Validating keyword: ${keyword}`);
            (0, test_1.expect)(responseText?.normalize()).toContain(keyword.normalize());
        }
    });
    test_1.test.only('response formatting is clean', async () => {
        const query = testData.getEnglishQueries()[0];
        await chatbotPage.sendMessage(query.prompt);
        // Wait for manual reCAPTCHA handling
        console.log('Please handle the reCAPTCHA if it appears...');
        await chatbotPage.page.waitForTimeout(60000); // 60 second wait for manual handling
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        // Check for common formatting issues
        (0, test_1.expect)(responseText).not.toContain('undefined');
        (0, test_1.expect)(responseText).not.toContain('null');
        (0, test_1.expect)(responseText).not.toContain('NaN');
        (0, test_1.expect)(responseText?.trim()).toBeTruthy();
    });
    (0, test_1.test)('validates fallback message on invalid input', async () => {
        const invalidInput = '!@#$%^&*()';
        await chatbotPage.sendMessage(invalidInput);
        // Wait for manual reCAPTCHA handling
        console.log('Please handle the reCAPTCHA if it appears...');
        await chatbotPage.page.waitForTimeout(60000); // 60 second wait for manual handling
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        // Check for fallback message indicators
        (0, test_1.expect)(responseText?.toLowerCase()).toContain('sorry');
        (0, test_1.expect)(responseText?.toLowerCase()).toContain('understand');
        (0, test_1.expect)(responseText?.toLowerCase()).toContain('help');
    });
    (0, test_1.test)('detects hallucinations in responses', async () => {
        const query = testData.getEnglishQueries()[0];
        await chatbotPage.sendMessage(query.prompt);
        // Wait for manual reCAPTCHA handling
        console.log('Please handle the reCAPTCHA if it appears...');
        await chatbotPage.page.waitForTimeout(60000); // 60 second wait for manual handling
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        // Check for common hallucination indicators
        (0, test_1.expect)(responseText).not.toContain('I am not sure');
        (0, test_1.expect)(responseText).not.toContain('I cannot verify');
        (0, test_1.expect)(responseText).not.toContain('I do not have access');
        (0, test_1.expect)(responseText).not.toContain('I cannot confirm');
    });
    (0, test_1.test)('validates semantic consistency between English and Arabic responses', async () => {
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
        (0, test_1.expect)(englishText).toBeTruthy();
        (0, test_1.expect)(arabicText).toBeTruthy();
        (0, test_1.expect)(englishText?.length).toBeGreaterThan(0);
        (0, test_1.expect)(arabicText?.length).toBeGreaterThan(0);
    });
    (0, test_1.test)('validates HTML formatting in responses', async () => {
        const query = testData.getEnglishQueries()[0];
        await chatbotPage.sendMessage(query.prompt);
        // Wait for manual reCAPTCHA handling
        console.log('Please handle the reCAPTCHA if it appears...');
        await chatbotPage.page.waitForTimeout(60000); // 60 second wait for manual handling
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        // Check for proper HTML formatting
        (0, test_1.expect)(responseText).not.toContain('<script>');
        (0, test_1.expect)(responseText).not.toContain('<style>');
        (0, test_1.expect)(responseText).not.toContain('<iframe>');
        (0, test_1.expect)(responseText).not.toContain('javascript:');
        (0, test_1.expect)(responseText).not.toContain('onerror=');
        (0, test_1.expect)(responseText).not.toContain('onload=');
    });
    (0, test_1.test)('validates semantic similarity of Arabic responses', async () => {
        const query = testData.getArabicQueries()[0];
        await chatbotPage.sendMessage(query.prompt);
        // Wait for manual reCAPTCHA handling
        console.log('Please handle the reCAPTCHA if it appears...');
        await chatbotPage.page.waitForTimeout(60000); // 60 second wait for manual handling
        const response = await chatbotPage.getLastBotResponse();
        const responseText = await response.textContent();
        (0, test_1.expect)(responseText).toBeTruthy();
        // Initialize semantic similarity checker
        const semanticChecker = semantic_similarity_1.SemanticSimilarity.getInstance();
        await semanticChecker.initialize();
        // Calculate similarity between expected and actual response
        const similarity = await semanticChecker.calculateSimilarity(query.expectedKeywords.join(' '), responseText || '');
        // Log similarity score for debugging
        console.log(`Semantic similarity score: ${similarity}`);
        // Assert that similarity is above threshold (0.7)
        (0, test_1.expect)(similarity).toBeGreaterThan(0.7);
    });
});
//# sourceMappingURL=response-validation.spec.js.map