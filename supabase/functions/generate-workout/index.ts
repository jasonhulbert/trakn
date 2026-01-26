import 'jsr:@supabase/functions-js@2/edge-runtime.d.ts';
import Anthropic from 'npm:@anthropic-ai/sdk@0.71.2';
import promptManager from '../_shared/lib/prompt-manager/prompt-manager.ts';

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const anthropicModel = Deno.env.get('ANTHROPIC_MODEL') || 'claude-2';
const client = new Anthropic({
  apiKey: anthropicApiKey,
});

Deno.serve(async (req) => {
  // const { name } = await req.json();
  // const data = {
  //   message: `Hello, my name is ${name}!`,
  // };
  console.log(req);

  const prompt = await promptManager.loadPrompt('system/fitness_trainer');

  // const message = await client.messages.create({
  //   max_tokens: 1024,
  //   messages: [{ role: 'user', content: data.message }],
  //   model: anthropicModel ?? 'claude-haiku-4-5',
  // });

  // return new Response(JSON.stringify(message), {
  //   headers: { 'Content-Type': 'application/json' },
  // });

  return new Response(JSON.stringify(prompt), {
    headers: { 'Content-Type': 'application/text' },
  });
});
