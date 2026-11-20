import './styles/main.css';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { FrameSequence, loadImage, type FrameManifest } from './frames';
import { HeroCanvas } from './hero-canvas';
import { initCart, initFlavors } from './shop';

gsap.registerPlugin(ScrollTrigger, SplitText);

// `?reduced-motion` no endereço força a versão sem movimento (útil para testar e demonstrar).
const reducedMotion =
  matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('reduced-motion');
if (reducedMotion) document.documentElement.classList.add('is-reduced');
const isSmallScreen = matchMedia('(max-width: 768px)').matches;
// Conexão econômica ou tela pequena: baixa só metade dos quadros.
const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
const FRAMES_URL = '/frames/';

const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;

/* =========================================================
   Rolagem suave (Lenis) sincronizada com o ScrollTrigger
   ========================================================= */
function initSmoothScroll(): Lenis | null {
  if (reducedMotion) return null;
  const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

function initAnchors(lenis: Lenis | null) {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const target = document.querySelector<HTMLElement>(a.hash);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.6 });
      else target.scrollIntoView();
    }),
  );
}

/* =========================================================
   Tela de carregamento
   ========================================================= */
function setLoaderProgress(p: number) {
  gsap.to('.loader__fill', { scaleY: p, duration: 0.4, ease: 'power2.out', overwrite: true });
  $('.loader__pct').textContent = `${Math.round(p * 100)}%`;
}

function hideLoader(): Promise<void> {
  return new Promise((resolve) => {
    gsap
      .timeline({ onComplete: resolve })
      .to('.loader__fill', { scaleY: 1, duration: 0.3 })
      .to('.loader', { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut' }, '+=0.15')
      .add(() => document.body.classList.remove('is-loading'), '<');
  });
}

/* =========================================================
   HERO: o scroll controla foto → clarão → vídeo
   ========================================================= */
function initHero(hero: HeroCanvas, frameCount: number) {
  const word = $('.hero__word');
  const facts = gsap.utils.toArray<HTMLElement>('.hero__facts li');
  const render = hero.render;

  if (reducedMotion) {
    // Sem animação: mostra direto a lata explodida e todo o texto.
    hero.state.still = 0;
    hero.state.frame = frameCount - 1;
    word.style.setProperty('--wdth', '150');
    gsap.set('.hero__lede, .hero__hint', { autoAlpha: 0 });
    render();
    return;
  }

  // Entrada única, logo depois do carregamento.
  // Usa só clip-path, scale e x: a opacidade e o y ficam com a timeline do scroll,
  // assim rolar durante a entrada não faz um sobrescrever o outro.
  const wdth = { v: 50 };
  const setWdth = () => word.style.setProperty('--wdth', wdth.v.toFixed(1));
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from(word, { clipPath: 'inset(100% 0 0 0)', scale: 1.08, duration: 1.2 })
    .from('.hero__lede', { clipPath: 'inset(0 100% 0 0)', x: -24, duration: 0.9 }, '-=0.8')
    .from('.hero__hint', { clipPath: 'inset(0 0 100% 0)', duration: 0.6 }, '-=0.5');

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: () => `+=${window.innerHeight * 3.2}`,
      pin: '.hero__stage',
      scrub: 0.4,
      invalidateOnRefresh: true,
    },
  });

  tl.to('.hero__hint', { autoAlpha: 0, duration: 0.04 }, 0)
    .to('.hero__lede', { autoAlpha: 0, y: -24, duration: 0.07 }, 0.02)
    // Clarão: esconde a troca da foto parada pelo vídeo
    .to('.hero__flash', { opacity: 0.95, duration: 0.05, ease: 'power2.in' }, 0.06)
    .to(hero.state, { still: 0, duration: 0.025, onUpdate: render }, 0.105)
    .to('.hero__flash', { opacity: 0, duration: 0.1, ease: 'power2.out' }, 0.11)
    // O vídeo inteiro acompanha o resto do scroll
    .fromTo(hero.state, { frame: 0 }, { frame: frameCount - 1, duration: 0.8, onUpdate: render }, 0.11)
    .to(hero.state, { zoom: 1.1, duration: 0.85, ease: 'power1.inOut', onUpdate: render }, 0.1)
    // A palavra se alarga junto com a explosão
    .to(wdth, { v: 140, duration: 0.75, ease: 'power2.inOut', onUpdate: setWdth }, 0.07)
    .to(word, { yPercent: 8, duration: 0.75 }, 0.07)
    .fromTo(facts, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.08, stagger: 0.06, ease: 'power3.out' }, 0.55)
    // Saída: a lata encolhe para o centro e apaga, a palavra sobe.
    // Assim o manifesto entra num palco já escuro, sem corte seco.
    .to(facts, { autoAlpha: 0, x: -20, duration: 0.06, stagger: 0.02, ease: 'power2.in' }, 0.9)
    .to('.hero__canvas', { scale: 0.55, autoAlpha: 0, duration: 0.14, ease: 'power2.in' }, 0.92)
    .to(word, { yPercent: -40, autoAlpha: 0, duration: 0.12, ease: 'power2.in' }, 0.94);
}

/* =========================================================
   Manifesto: cada palavra acende conforme o scroll
   ========================================================= */
function initManifesto() {
  // aria: 'none' mantém o texto real nas palavras (o leitor de tela lê normalmente)
  // em vez de colocar aria-label no <p>, que não é permitido
  const split = SplitText.create('.manifesto__text', { type: 'words', wordsClass: 'word', aria: 'none' });
  if (reducedMotion) return;
  gsap.to(split.words, {
    opacity: 1,
    stagger: 0.1,
    ease: 'none',
    scrollTrigger: { trigger: '.manifesto', start: 'top 70%', end: 'bottom 65%', scrub: true },
  });
}

/* =========================================================
   Fórmula: lata entra, linhas se desenham, ingredientes aparecem
   ========================================================= */
function initFormula() {
  const paths = gsap.utils.toArray<SVGPathElement>('.formula__lines path');
  const items = gsap.utils.toArray<HTMLElement>('.formula__item');
  if (reducedMotion) return;

  const mm = gsap.matchMedia();

  mm.add('(min-width: 861px)', () => {
    paths.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
    gsap
      .timeline({
        scrollTrigger: { trigger: '.formula', start: 'top top', end: '+=140%', pin: '.formula__pin', scrub: 0.5 },
      })
      .from('.formula__title', { autoAlpha: 0, y: 30, duration: 0.15 })
      .from('.formula__can', { autoAlpha: 0, scale: 0.8, duration: 0.25, ease: 'power2.out' }, 0.05)
      .to(paths, { strokeDashoffset: 0, duration: 0.25, stagger: 0.12 }, 0.25)
      .from(items, { autoAlpha: 0, y: 20, duration: 0.15, stagger: 0.12 }, 0.35)
      .to({}, { duration: 0.15 });
  });

  mm.add('(max-width: 860px)', () => {
    items.forEach((item) =>
      gsap.from(item, { autoAlpha: 0, y: 24, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 88%' } }),
    );
  });
}

/* =========================================================
   Faixa: anda sozinha, acelera, inverte e inclina com o scroll
   ========================================================= */
function initMarquee(lenis: Lenis | null) {
  if (reducedMotion) return;
  const track = $('.marquee__track');
  const loop = gsap.to(track, { xPercent: -50, duration: 22, ease: 'none', repeat: -1 });
  const skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3.out' });
  let direction = 1;

  lenis?.on('scroll', ({ velocity }: { velocity: number }) => {
    if (velocity !== 0) direction = velocity > 0 ? 1 : -1;
    const speed = 1 + Math.min(Math.abs(velocity) * 0.25, 6);
    gsap.to(loop, { timeScale: speed * direction, duration: 0.3, overwrite: true });
    skew(gsap.utils.clamp(-12, 12, -velocity * 0.6));
  });
}

/* =========================================================
   Seções seguintes: entradas discretas
   ========================================================= */
function initReveals() {
  if (reducedMotion) return;
  gsap.from('.flavors__visual', {
    autoAlpha: 0,
    scale: 0.9,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.flavors', start: 'top 70%' },
  });
  gsap.from('.footer__word', {
    '--wdth': 50,
    yPercent: 30,
    ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
  });
}

/* =========================================================
   Boot
   ========================================================= */
async function boot() {
  document.body.classList.add('is-loading');
  const lenis = initSmoothScroll();
  lenis?.stop();
  window.scrollTo(0, 0);

  const manifest: FrameManifest = await fetch(`${FRAMES_URL}manifest.json`).then((r) => r.json());
  const frames = new FrameSequence(manifest, FRAMES_URL, isSmallScreen || saveData ? 2 : 1);

  const [still] = await Promise.all([loadImage('/img/can-start.webp'), document.fonts.ready]);
  const hero = new HeroCanvas($<HTMLCanvasElement>('.hero__canvas'), still, frames);

  // Libera a página quando o primeiro lote progressivo chegar; o resto continua em segundo plano.
  const needed = frames.initialBatch;
  let released = false;
  await new Promise<void>((ready) => {
    // Rede muito lenta: libera mesmo assim, o canvas usa o quadro carregado mais próximo.
    setTimeout(() => {
      if (!released) {
        released = true;
        ready();
      }
    }, 12000);
    frames
      .load((loaded) => {
        if (!released) setLoaderProgress(Math.min(1, loaded / needed));
        if (!released && loaded >= needed) {
          released = true;
          ready();
        }
        hero.render(); // cada quadro novo deixa a animação mais lisa
      })
      .then(() => {
        if (!released) {
          released = true;
          ready();
        }
      });
  });

  await hideLoader();

  initHero(hero, manifest.count);
  initManifesto();
  initFormula();
  initMarquee(lenis);
  initFlavors(reducedMotion);
  initCart(reducedMotion);
  initReveals();
  initAnchors(lenis);

  lenis?.start();
  ScrollTrigger.refresh();
}

/**
 * Se algo impedir a animação de iniciar (quadros que não carregam, navegador
 * sem canvas…), a página não pode ficar presa na tela de carregamento:
 * mostra a versão estática e mantém a loja funcionando.
 */
function fallbackToStatic(error: unknown) {
  console.error('[VELKOR] Animação desativada, usando a versão estática:', error);
  document.documentElement.classList.add('is-static');
  document.body.classList.remove('is-loading');
  gsap.set('.loader', { autoAlpha: 0 });
  initFlavors(true);
  initCart(true);
}

boot().catch(fallbackToStatic);
