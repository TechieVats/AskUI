declare module '@xenova/transformers' {
    export interface PipelineOptions {
        pooling?: 'mean' | 'max' | 'cls';
        [key: string]: any;
    }

    export interface PipelineOutput {
        data: number[];
        [key: string]: any;
    }

    export function pipeline(
        task: string,
        model: string,
        options?: PipelineOptions
    ): Promise<(text: string, options?: PipelineOptions) => Promise<PipelineOutput>>;
} 