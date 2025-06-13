export interface Query {
    prompt: string;
    expectedKeywords: string[];
    category: string;
}
export interface SecurityTest {
    injectionAttempts: string[];
    maliciousPrompts: string[];
}
export declare class TestDataManager {
    private static instance;
    private readonly data;
    private constructor();
    static getInstance(): TestDataManager;
    getEnglishQueries(): Query[];
    getArabicQueries(): Query[];
    getSecurityTests(): SecurityTest;
    getViewportSizes(): {
        width: number;
        height: number;
        device: string;
    }[];
    getAccessibilityChecks(): string[];
}
