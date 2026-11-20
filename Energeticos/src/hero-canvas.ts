import type { FrameSequence } from './frames';

/**
 * Onde a lata está dentro de cada imagem-fonte (em pixels da fonte).
 * A foto parada e o vídeo têm enquadramentos diferentes; alinhando pela
 * lata, a troca de uma para a outra acontece sem a lata "pular".
 */
interface CanBox {
  cx: number;
  cy: number;
  height: number;
}

const STILL_CAN: CanBox = { cx: 704, cy: 397, height: 575 }; // can-start.webp (1408x768)
const VIDEO_CAN: CanBox = { cx: 385, cy: 423, height: 430 }; // quadros (768x690)

export interface HeroState {
  /** 0..1, opacidade da foto parada */
  still: number;
  /** índice do quadro do vídeo (pode ser fracionário) */
  frame: number;
  /** zoom extra aplicado à cena toda */
  zoom: number;
}

export class HeroCanvas {
  private readonly ctx: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private raf = 0;
  readonly state: HeroState = { still: 1, frame: 0, zoom: 1 };

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly still: HTMLImageElement,
    private readonly frames: FrameSequence,
  ) {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D indisponível');
    this.ctx = ctx;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  /** Agenda um redesenho (no máximo um por quadro de tela). */
  render = () => {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.draw();
    });
  };

  private resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = Math.round(rect.width * this.dpr);
    this.canvas.height = Math.round(rect.height * this.dpr);
    this.draw();
  }

  /** Altura da lata na tela: cabe na altura e não estoura a largura no celular. */
  private canHeight(): number {
    const byHeight = this.height * 0.56;
    const byWidth = this.width * 0.62 * (575 / 215); // proporção da lata ≈ 2,67
    return Math.min(byHeight, byWidth) * this.state.zoom;
  }

  private draw() {
    const { ctx, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.width, this.height);

    const target = {
      cx: this.width / 2,
      cy: this.height * 0.47,
      height: this.canHeight(),
    };

    const { still, frame } = this.state;

    if (still < 1) {
      const img = this.frames.nearest(frame);
      if (img) this.drawAligned(img, VIDEO_CAN, target, 1, true);
    }
    if (still > 0) {
      this.drawAligned(this.still, STILL_CAN, target, still, true);
    }
  }

  private drawAligned(img: HTMLImageElement, box: CanBox, target: CanBox, alpha: number, feather: boolean) {
    const { ctx } = this;
    const k = target.height / box.height;
    const w = img.naturalWidth * k;
    const h = img.naturalHeight * k;
    const x = target.cx - box.cx * k;
    const y = target.cy - box.cy * k;

    // Desenha numa camada à parte para poder escurecer as bordas antes de
    // misturar com o que já está no canvas (senão o degradê preto apagaria
    // a imagem de baixo durante a transição).
    const layer = this.layer();
    const lctx = layer.getContext('2d')!;
    lctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    lctx.fillStyle = '#000';
    lctx.fillRect(0, 0, this.width, this.height);
    lctx.drawImage(img, x, y, w, h);
    // As imagens são menores que a tela: as bordas se dissolvem no preto
    // em vez de mostrar um corte reto.
    if (feather) this.featherEdges(lctx, x, y, w, h, Math.min(w, h) * 0.16);

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = alpha;
    ctx.drawImage(layer, 0, 0);
    ctx.restore();
  }

  private offscreen: HTMLCanvasElement | null = null;
  private layer(): HTMLCanvasElement {
    if (!this.offscreen) this.offscreen = document.createElement('canvas');
    if (this.offscreen.width !== this.canvas.width || this.offscreen.height !== this.canvas.height) {
      this.offscreen.width = this.canvas.width;
      this.offscreen.height = this.canvas.height;
    }
    return this.offscreen;
  }

  private featherEdges(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, f: number) {
    const strip = (x0: number, y0: number, x1: number, y1: number, rx: number, ry: number, rw: number, rh: number) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(rx, ry, rw, rh);
    };
    strip(x, 0, x + f, 0, x - 1, y, f, h);                 // esquerda
    strip(x + w, 0, x + w - f, 0, x + w - f, y, f + 1, h); // direita
    strip(0, y, 0, y + f, x, y - 1, w, f);                 // topo
    strip(0, y + h, 0, y + h - f * 1.6, x, y + h - f * 1.6, w, f * 1.6 + 1); // base (corte da marca d'água)
  }
}
