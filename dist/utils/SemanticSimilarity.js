"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticSimilarity = void 0;
class SemanticSimilarity {
    constructor() { }
    static getInstance() {
        if (!SemanticSimilarity.instance) {
            SemanticSimilarity.instance = new SemanticSimilarity();
        }
        return SemanticSimilarity.instance;
    }
    async calculateSimilarity(text1, text2) {
        // Normalize texts
        const normalized1 = this.normalizeText(text1);
        const normalized2 = this.normalizeText(text2);
        // Calculate Jaccard similarity
        const set1 = new Set(normalized1.split(' '));
        const set2 = new Set(normalized2.split(' '));
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        return intersection.size / union.size;
    }
    normalizeText(text) {
        return text
            .toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
}
exports.SemanticSimilarity = SemanticSimilarity;
//# sourceMappingURL=SemanticSimilarity.js.map