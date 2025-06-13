"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDataManager = void 0;
const test_data_json_1 = __importDefault(require("../test-data.json"));
class TestDataManager {
    constructor() {
        this.data = test_data_json_1.default;
    }
    static getInstance() {
        if (!TestDataManager.instance) {
            TestDataManager.instance = new TestDataManager();
        }
        return TestDataManager.instance;
    }
    getEnglishQueries() {
        return this.data.commonQueries.english;
    }
    getArabicQueries() {
        return this.data.commonQueries.arabic;
    }
    getSecurityTests() {
        return this.data.securityTests;
    }
    getViewportSizes() {
        return this.data.uiValidation.viewportSizes;
    }
    getAccessibilityChecks() {
        return this.data.uiValidation.accessibilityChecks;
    }
}
exports.TestDataManager = TestDataManager;
//# sourceMappingURL=TestDataManager.js.map