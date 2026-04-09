import { getSeedBundle } from '@/data/seed';
import type { ContentBundle } from '@/types/models';

/**
 * Abstraction over bundled vs remote content.
 * MVP: returns typed seed data synchronously from the bundle.
 * V2: swap `getBundle` to fetch JSON, validate, persist snapshot, return.
 */
export class ContentRepository {
  private bundle: ContentBundle | null = null;

  async getBundle(): Promise<ContentBundle> {
    if (this.bundle) return this.bundle;
    // Simulate async hydration (matches future network pattern)
    await Promise.resolve();
    this.bundle = getSeedBundle();
    return this.bundle;
  }

  /** Synchronous access after first await getBundle() — for derived selectors. */
  getBundleSync(): ContentBundle {
    if (!this.bundle) {
      this.bundle = getSeedBundle();
    }
    return this.bundle;
  }

  clearMemoryCache(): void {
    this.bundle = null;
  }
}

export const contentRepository = new ContentRepository();
