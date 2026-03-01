import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

const useOpenAI = !!process.env.OPENAI_API_KEY;
const useGoogle = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : useOpenAI
    ? customProvider({
        languageModels: {
          'chat-model': openai('gpt-4o'),
          'chat-model-reasoning': wrapLanguageModel({
            model: openai('o3-mini'),
            middleware: extractReasoningMiddleware({ tagName: 'think' }),
          }),
          'title-model': openai('gpt-4o-mini'),
          'artifact-model': openai('gpt-4o-mini'),
        },
        imageModels: {
          'small-model': openai.image('dall-e-3'),
        },
      })
    : useGoogle
      ? customProvider({
          languageModels: {
            'chat-model': google('gemini-2.0-flash'),
            'chat-model-reasoning': wrapLanguageModel({
              model: google('gemini-2.0-flash'),
              middleware: extractReasoningMiddleware({ tagName: 'think' }),
            }),
            'title-model': google('gemini-2.0-flash'),
            'artifact-model': google('gemini-2.0-flash'),
          },
        })
      : customProvider({
          languageModels: {
            'chat-model': xai('grok-2-vision-1212'),
            'chat-model-reasoning': wrapLanguageModel({
              model: xai('grok-3-mini-beta'),
              middleware: extractReasoningMiddleware({ tagName: 'think' }),
            }),
            'title-model': xai('grok-2-1212'),
            'artifact-model': xai('grok-2-1212'),
          },
          imageModels: {
            'small-model': xai.image('grok-2-image'),
          },
        });
