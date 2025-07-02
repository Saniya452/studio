import { config } from 'dotenv';
config();

import '@/ai/flows/generate-opening-prompt.ts';
import '@/ai/flows/generate-robot-response.ts';
import '@/ai/flows/understand-mood.ts';