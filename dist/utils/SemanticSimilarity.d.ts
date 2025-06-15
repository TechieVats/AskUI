export declare class SemanticSimilarity {
    private static instance;
    private constructor();
    static getInstance(): SemanticSimilarity;
    calculateSimilarity(text1: string, text2: string): Promise<number>;
    private normalizeText;
}
