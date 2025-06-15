export declare class TextSimilarity {
    private static instance;
    private model;
    private initializationPromise;
    private constructor();
    static getInstance(): TextSimilarity;
    initialize(): Promise<void>;
    calculateSimilarity(text1: string, text2: string): Promise<number>;
}
