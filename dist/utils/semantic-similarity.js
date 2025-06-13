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
exports.SemanticSimilarity = void 0;
const use = __importStar(require("@tensorflow-models/universal-sentence-encoder"));
class SemanticSimilarity {
    constructor() {
        this.model = null;
        this.initialized = false;
    }
    static getInstance() {
        if (!SemanticSimilarity.instance) {
            SemanticSimilarity.instance = new SemanticSimilarity();
        }
        return SemanticSimilarity.instance;
    }
    async initialize() {
        if (!this.initialized) {
            try {
                this.model = await use.load();
                this.initialized = true;
            }
            catch (error) {
                console.error('Failed to initialize model:', error);
                throw error;
            }
        }
    }
    async getEmbedding(text) {
        if (!this.initialized || !this.model) {
            await this.initialize();
        }
        try {
            const embeddings = await this.model.embed([text]);
            return Array.from(await embeddings.array())[0];
        }
        catch (error) {
            console.error('Failed to get embedding:', error);
            throw error;
        }
    }
    async calculateSimilarity(text1, text2) {
        const embedding1 = await this.getEmbedding(text1);
        const embedding2 = await this.getEmbedding(text2);
        return this.cosineSimilarity(embedding1, embedding2);
    }
    cosineSimilarity(vec1, vec2) {
        const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
        const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
        const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
        return dotProduct / (magnitude1 * magnitude2);
    }
}
exports.SemanticSimilarity = SemanticSimilarity;
//# sourceMappingURL=semantic-similarity.js.map