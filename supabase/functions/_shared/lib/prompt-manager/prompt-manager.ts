import 'jsr:@supabase/functions-js@2/edge-runtime.d.ts';
import { fromFileUrl, join } from 'jsr:@std/path@1.1.4';

export class PromptManager {
  async loadPrompt(promptPath: string): Promise<string> {
    const filePath = this.resolvePromptFilePath(promptPath);
    let contents = '';

    try {
      const read = await Deno.readFile(filePath);

      contents = new TextDecoder('utf-8').decode(read);
    } catch (e) {
      console.error('Error loading prompt:', e);

      throw new ReferenceError((e as Error).message);
    }

    console.log(`\nPrompt loaded: (${promptPath})\n`);

    return contents;
  }

  private resolvePromptFilePath(promptPath: string): string {
    const hereDir = fromFileUrl(new URL('.', new URL(import.meta.url)));
    const promptsDir = join(hereDir, '../../../', '_shared/static/prompts');

    return join(promptsDir, `${promptPath}.yml`);
  }
}

export default new PromptManager();
