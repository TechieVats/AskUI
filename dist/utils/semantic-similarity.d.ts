export declare class SemanticSimilarity {
    private static instance;
    private model;
    private initialized;
    private constructor();
    static getInstance(): SemanticSimilarity;
    initialize(): Promise<void>;
    getEmbedding(text: string): Promise<number[]>;
    calculateSimilarity(text1: string, text2: string): Promise<number>;
    private cosineSimilarity;
}
