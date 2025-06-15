"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextSimilarity = void 0;
const tf = __importStar(require("@tensorflow/tfjs"));
const universal_sentence_encoder_1 = require("@tensorflow-models/universal-sentence-encoder");
// Set backend to CPU
tf.setBackend('cpu');
class TextSimilarity {
    constructor() {
        this.model = null;
        this.initializationPromise = null;
        // Start initialization immediately
        this.initialize().catch(error => {
            console.error('Error during model initialization:', error);
        });
    }
    static getInstance() {
        if (!TextSimilarity.instance) {
            TextSimilarity.instance = new TextSimilarity();
        }
        return TextSimilarity.instance;
    }
    async initialize() {
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
                this.model = await (0, universal_sentence_encoder_1.load)();
                console.log(`Model loaded in ${Date.now() - startTime}ms`);
            }
            catch (error) {
                console.error('Error loading model:', error);
                throw error;
            }
        }
    }
    async calculateSimilarity(text1, text2) {
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
        }
        catch (error) {
            console.error('Error calculating similarity:', error);
            return 0; // Return 0 similarity on error
        }
    }
}
exports.TextSimilarity = TextSimilarity;
//# sourceMappingURL=text-similarity.js.map