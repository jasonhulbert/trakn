import { inject, Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

export type IconVariant = 'regular' | 'solid';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cache = new Map<string, SafeHtml>();
  private readonly pending = new Map<string, Promise<SafeHtml | null>>();

  load(name: string, variant: IconVariant = 'regular'): Promise<SafeHtml | null> {
    const key = `${variant}:${name}`;

    const cached = this.cache.get(key);
    if (cached !== undefined) return Promise.resolve(cached);

    const inflight = this.pending.get(key);
    if (inflight !== undefined) return inflight;

    const url = `/icons/${variant}/${name}.svg`;
    const request = firstValueFrom(this.http.get(url, { responseType: 'text' }))
      .then((svg) => {
        const safe = this.sanitizer.bypassSecurityTrustHtml(this.prepare(svg));
        this.cache.set(key, safe);
        this.pending.delete(key);
        return safe;
      })
      .catch((err) => {
        this.pending.delete(key);
        if (isDevMode()) {
          console.warn(`[IconService] Icon not found: "${name}" (${variant})`, err);
        }
        return null;
      });

    this.pending.set(key, request);
    return request;
  }

  private prepare(svg: string): string {
    return svg
      .replace(/\s+(width|height)="[^"]*"/g, '')
      .replace('<svg', '<svg style="width:100%;height:100%;display:block"');
  }
}
