export class SemanticSimilarity {
    private static instance: SemanticSimilarity;

    private constructor() {}

    public static getInstance(): SemanticSimilarity {
        if (!SemanticSimilarity.instance) {
            SemanticSimilarity.instance = new SemanticSimilarity();
        }
        return SemanticSimilarity.instance;
    }

    public async calculateSimilarity(text1: string, text2: string): Promise<number> {
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

    private normalizeText(text: string): string {
        return text
            .toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
} 