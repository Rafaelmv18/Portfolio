/**
 * Carregamento progressivo dos quadros do vídeo.
 *
 * Em vez de baixar os 141 quadros em ordem, baixa primeiro 1 a cada 8,
 * depois 1 a cada 4, depois 2 e por fim todos. Com poucos quadros a
 * animação já funciona inteira (só fica menos lisa) e vai ficando
 * mais suave enquanto o resto chega em segundo plano.
 */
export interface FrameManifest {
  count: number;
  width: number;
  height: number;
}

export class FrameSequence {
  readonly images: (HTMLImageElement | null)[];
  private readonly order: number[];
  private loadedCount = 0;

  constructor(
    readonly manifest: FrameManifest,
    private readonly baseUrl: string,
    /** No celular pulamos quadros ímpares: metade do download. */
    finestStride: number,
  ) {
    this.images = new Array(manifest.count).fill(null);
    this.order = buildOrder(manifest.count, finestStride);
  }

  /** Quantos quadros precisam estar prontos para liberar a tela de carregamento. */
  get initialBatch(): number {
    return Math.min(this.order.length, Math.ceil(this.manifest.count / 4));
  }

  /**
   * Baixa tudo respeitando a ordem progressiva, com algumas conexões em paralelo.
   * onProgress recebe a quantidade de quadros já carregados.
   */
  async load(onProgress: (loaded: number) => void, concurrency = 6): Promise<void> {
    let cursor = 0;
    const worker = async () => {
      while (cursor < this.order.length) {
        const index = this.order[cursor++];
        try {
          this.images[index] = await loadImage(this.url(index));
        } catch {
          // Um quadro que falhou não deve travar a página: o vizinho mais próximo cobre.
        }
        this.loadedCount++;
        onProgress(this.loadedCount);
      }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
  }

  /** Quadro carregado mais próximo do índice pedido. */
  nearest(index: number): HTMLImageElement | null {
    const n = this.images.length;
    const i = Math.max(0, Math.min(n - 1, Math.round(index)));
    if (this.images[i]) return this.images[i];
    for (let d = 1; d < n; d++) {
      const before = this.images[i - d];
      if (before) return before;
      const after = this.images[i + d];
      if (after) return after;
    }
    return null;
  }

  private url(index: number): string {
    return `${this.baseUrl}${String(index + 1).padStart(4, '0')}.webp`;
  }
}

function buildOrder(count: number, finestStride: number): number[] {
  const seen = new Set<number>();
  const order: number[] = [];
  for (const stride of [8, 4, 2, 1]) {
    if (stride < finestStride) break;
    for (let i = 0; i < count; i += stride) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  // Garante que o último quadro (fim da explosão) sempre exista.
  if (!seen.has(count - 1)) order.splice(1, 0, count - 1);
  return order;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
