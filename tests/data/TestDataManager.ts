import testData from '../test-data.json';

export interface Query {
    prompt: string;
    expectedKeywords: string[];
    category: string;
}

export interface SecurityTest {
    input: string;
    expectedIndicators: string[];
    description: string;
}

export interface SecurityTests {
    injectionTests: SecurityTest[];
    xssTests: SecurityTest[];
    sqlInjectionTests: SecurityTest[];
    maliciousTests: SecurityTest[];
}

export interface HallucinationTest {
    prompt: string;
    hallucinationIndicators: string[];
    description: string;
}

export interface FallbackTest {
    invalidInput: string;
    expectedIndicators: string[];
    description: string;
}

export class TestDataManager {
    private static instance: TestDataManager;
    private readonly data: typeof testData;

    private constructor() {
        this.data = testData;
    }

    public static getInstance(): TestDataManager {
        if (!TestDataManager.instance) {
            TestDataManager.instance = new TestDataManager();
        }
        return TestDataManager.instance;
    }

    public getEnglishQueries(): Query[] {
        return this.data.commonQueries.english;
    }

    public getArabicQueries(): Query[] {
        return this.data.commonQueries.arabic;
    }

    public getSecurityTests(): SecurityTests {
        return this.data.securityTests;
    }

    public getInjectionTests(): SecurityTest[] {
        return this.data.securityTests.injectionTests;
    }

    public getXSSTests(): SecurityTest[] {
        return this.data.securityTests.xssTests;
    }

    public getSQLInjectionTests(): SecurityTest[] {
        return this.data.securityTests.sqlInjectionTests;
    }

    public getMaliciousTests(): SecurityTest[] {
        return this.data.securityTests.maliciousTests;
    }

    public getHallucinationTests(): HallucinationTest[] {
        return this.data.hallucinationTests;
    }

    public getViewportSizes() {
        return this.data.uiValidation.viewportSizes;
    }

    public getAccessibilityChecks() {
        return this.data.uiValidation.accessibilityChecks;
    }

    public getFallbackTests(): FallbackTest[] {
        return this.data.fallbackTests;
    }
} 