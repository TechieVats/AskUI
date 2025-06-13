import * as tf from '@tensorflow/tfjs';
import { load } from '@tensorflow-models/universal-sentence-encoder';

// Set backend to CPU
tf.setBackend('cpu');

export class TextSimilarity {
    private static instance: TextSimilarity;
    private model: any = null;
    private initializationPromise: Promise<void> | null = null;

    private constructor() {
        // Start initialization immediately
        this.initialize().catch(error => {
            console.error('Error during model initialization:', error);
        });
    }

    public static getInstance(): TextSimilarity {
        if (!TextSimilarity.instance) {
            TextSimilarity.instance = new TextSimilarity();
        }
        return TextSimilarity.instance;
    }

    public async initialize() {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        if (!this.model) {
            console.log('Initializing TensorFlow.js model...');
            const startTime = Date.now();
            
            try {
                // Wait for backend to be ready
                await tf.ready();
                console.log('TensorFlow.js backend ready');
                
                this.model = await load();
                console.log(`Model loaded in ${Date.now() - startTime}ms`);
            } catch (error) {
                console.error('Error loading model:', error);
                throw error;
            }
        }
    }

    public async calculateSimilarity(text1: string, text2: string): Promise<number> {
        try {
            await this.initialize();

            // Get embeddings for both texts
            const embeddings = await this.model.embed([text1, text2]);
            
            // Convert to tensors
            const [vec1, vec2] = tf.split(embeddings, 2);
            
            // Calculate cosine similarity using tensor operations
            const normalizedVec1 = tf.div(vec1, tf.norm(vec1));
            const normalizedVec2 = tf.div(vec2, tf.norm(vec2));
            
            // Compute dot product of normalized vectors
            const similarity = tf.matMul(normalizedVec1, normalizedVec2.transpose());
            
            // Get the scalar value
            const similarityScore = await similarity.data();
            
            // Clean up tensors
            tf.dispose([vec1, vec2, normalizedVec1, normalizedVec2, similarity]);
            
            return similarityScore[0];
        } catch (error) {
            console.error('Error calculating similarity:', error);
            return 0; // Return 0 similarity on error
        }
    }
} 