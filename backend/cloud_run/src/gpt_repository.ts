import axios from 'axios';
import { backOff } from 'exponential-backoff';

export type GptModel = 'gpt-3.5-turbo-16k-0613' | 'gpt-3.5-turbo-0613';

export class GptRepository {
  async askGpt(params: {
    prompt: string;
    secondPrompt?: string | undefined;
    systemPrompt?: string | undefined;
    assistantResponse?: string | undefined;
    model?: GptModel | undefined;
    functions?: GptFunction[] | undefined;
  }): Promise<GptResponse> {
    const openAiKey = process.env.OPENAI_KEY!;
    if (openAiKey == null) {
      throw new Error('OPENAI_KEY is not set');
    }

    const shortPrompt = params.prompt.substring(0, 50);
    return await backOff<GptResponse>(
      async () => {
        const messages: any = [];
        if (params.systemPrompt) {
          messages.push({
            role: 'system',
            content: params.systemPrompt,
          });
        }

        messages.push({
          role: 'user',
          content: params.prompt,
        });

        if (params.assistantResponse) {
          messages.push({
            role: 'assistant',
            content: params.assistantResponse,
          });
        }

        if (params.secondPrompt) {
          messages.push({
            role: 'user',
            content: params.secondPrompt,
          });
        }

        const body: any = {
          model: params.model ?? 'gpt-3.5-turbo-16k-0613',
          messages: messages,
        };

        if (params.functions) {
          body.functions = params.functions;
        }

        console.log({
          message: `Ask ChatGpt with prompt "${shortPrompt}..."`,
          code: 'ask-chatgpt',
          body: body,
        });

        const url = 'https://api.openai.com/v1/chat/completions';
        const response = await axios.post(url, body, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
        });

        console.log({
          message: `ChatGPT response for prompt "${shortPrompt}..."`,
          code: 'openai-api-response',
          body: body,
          response: response.data,
          model: params.model,
        });

        if (response.status !== 200) {
          throw new Error(
            `OpenAI API returned status code ${response.status}. Response body: ${response.data}, Prompt: ${params.prompt}`
          );
        }

        const usage: GptUsage = {
          totalTokens: response.data.usage.total_tokens,
          completionTokens: response.data.usage.completion_tokens,
          promptTokens: response.data.usage.prompt_tokens,
        };

        const functionCallResponse =
          response.data.choices[0].message.function_call;
        if (params.functions != null && functionCallResponse != null) {
          return {
            message: functionCallResponse.arguments,
            finishReason: response.data.choices[0].finish_reason,
            usage: usage,
          };
        }

        return {
          message: response.data.choices[0].message.content,
          finishReason: response.data.choices[0].finish_reason,
          usage: usage,
        };
      },
      {
        retry(e, attemptNumber) {
          console.log({
            message: `Error asking ChatGPT with prompt "${shortPrompt}..." error="${e}" attemptNumber="${attemptNumber}"`,
            code: 'chatgpt-api-retry-error',
            prompt: params.prompt,
            error: e,
            attemptNumber: attemptNumber,
          });
          return true;
        },
        numOfAttempts: 3,
      }
    );
  }
}

/**
 * Reason for GPT API to stop generating text.
 *
 * null - API response still in progress or incomplete
 * length - Incomplete model output due to max_tokens parameter or token limit
 * content_filter - Omitted content due to a flag from our content filters
 * stop - API returned complete model output
 *
 * See https://platform.openai.com/docs/guides/chat/response-format.
 */
export type GptFinishReason =
  | 'null'
  | 'length'
  | 'content_filter'
  | 'stop'
  | 'function_call';

export interface GptResponse {
  message: string;
  finishReason: GptFinishReason;
  usage: GptUsage;
}

export interface GptFunction {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: {
      [key: string]: {
        type: 'string' | 'int';
        description?: string | undefined;
        enum?: string[] | undefined;
      };
    };
    required: string[];
  };
}

export interface GptUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}
