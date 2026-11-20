import { gsap } from 'gsap';

/* =========================================================
   Sabores: trocar o sabor muda a cor de destaque da página
   inteira e recolore as latas com hue-rotate (só a faixa é
   colorida; o preto da lata continua preto).
   ========================================================= */
interface Flavor {
  name: string;
  desc: string;
  accent: string;
  ink: string;
  hue: number;
}

const FLAVORS: Record<string, Flavor> = {
  lima: {
    name: 'Lima',
    desc: 'Limão-taiti com um fundo cítrico seco. O original, gelado e direto.',
    accent: '#c6ff00',
    ink: '#0a0d00',
    hue: 0,
  },
  glacier: {
    name: 'Glacier',
    desc: 'Mirtilo e hortelã. Refresca sem ficar doce, como mascar gelo.',
    accent: '#5ce1ff',
    ink: '#001419',
    hue: 118,
  },
  ember: {
    name: 'Ember',
    desc: 'Laranja-sanguínea com um toque de gengibre que esquenta no fim.',
    accent: '#ff7a1a',
    ink: '#1a0800',
    hue: -52,
  },
};

let currentFlavor = 'lima';
const flavorListeners: ((f: Flavor) => void)[] = [];

export function initFlavors(reducedMotion: boolean) {
  const root = document.documentElement;
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('.flavors__tabs [role="tab"]')];
  const nameEl = document.querySelector<HTMLElement>('.flavors__name')!;
  const descEl = document.querySelector<HTMLElement>('.flavors__desc')!;
  // Toda imagem da lata (vídeo do hero, fórmula, sabores, compra) leva data-tint
  const tinted = document.querySelectorAll<HTMLElement>('[data-tint]');

  const select = (key: string, focus = false) => {
    const flavor = FLAVORS[key];
    if (!flavor || key === currentFlavor) return;
    currentFlavor = key;

    tabs.forEach((t) => {
      const active = t.dataset.flavor === key;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      if (active && focus) t.focus();
    });

    root.style.setProperty('--accent', flavor.accent);
    root.style.setProperty('--accent-ink', flavor.ink);
    tinted.forEach((el) => (el.style.filter = flavor.hue ? `hue-rotate(${flavor.hue}deg) saturate(1.15)` : ''));

    const swap = () => {
      nameEl.textContent = flavor.name;
      descEl.textContent = flavor.desc;
    };
    if (reducedMotion) swap();
    else
      gsap.timeline()
        .to([nameEl, descEl], { autoAlpha: 0, y: -12, duration: 0.2, ease: 'power2.in', stagger: 0.04 })
        .add(swap)
        .fromTo([nameEl, descEl], { y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06 });

    flavorListeners.forEach((fn) => fn(flavor));
  };

  tabs.forEach((tab, i) => {
    tab.tabIndex = i === 0 ? 0 : -1;
    tab.addEventListener('click', () => select(tab.dataset.flavor!));
    // Setas do teclado entre as abas (padrão WAI-ARIA de tablist)
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      select(next.dataset.flavor!, true);
    });
  });

  // Inclinação 3D da lata seguindo o mouse
  const visual = document.querySelector<HTMLElement>('.flavors__visual');
  const can = document.querySelector<HTMLElement>('.flavors__can');
  if (visual && can && !reducedMotion && matchMedia('(pointer: fine)').matches) {
    // A centralização usa a propriedade CSS `translate`, separada de `transform`,
    // então o GSAP pode girar a lata sem desfazer o centro.
    gsap.set(can, { transformPerspective: 900 });
    const rotY = gsap.quickTo(can, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    const rotX = gsap.quickTo(can, 'rotationX', { duration: 0.8, ease: 'power3.out' });
    visual.addEventListener('pointermove', (e) => {
      const r = visual.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rotY(px * 22);
      rotX(-py * 14);
    });
    visual.addEventListener('pointerleave', () => {
      rotY(0);
      rotX(0);
    });
  } else if (visual && can && !reducedMotion && 'DeviceOrientationEvent' in window) {
    // Celular: inclina a lata com o giroscópio. O iOS exige pedir permissão
    // com um toque, então lá a lata só inclina depois do primeiro toque na seção.
    const rotY = gsap.quickTo(can, 'rotationY', { duration: 0.6, ease: 'power2.out' });
    const rotX = gsap.quickTo(can, 'rotationX', { duration: 0.6, ease: 'power2.out' });
    gsap.set(can, { transformPerspective: 900 });
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      rotY(gsap.utils.clamp(-20, 20, e.gamma * 0.5));
      rotX(gsap.utils.clamp(-12, 12, -(e.beta - 45) * 0.3));
    };
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof DOE.requestPermission === 'function') {
      visual.addEventListener(
        'click',
        () => DOE.requestPermission!().then((s) => s === 'granted' && window.addEventListener('deviceorientation', onTilt)),
        { once: true },
      );
    } else {
      window.addEventListener('deviceorientation', onTilt);
    }
  }
}

/* =========================================================
   Compra: pack, quantidade, total e carrinho
   ========================================================= */
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function initCart(reducedMotion: boolean) {
  const form = document.querySelector<HTMLFormElement>('.buy__form')!;
  const qtyOut = form.querySelector<HTMLOutputElement>('.qty__value')!;
  const minus = form.querySelector<HTMLButtonElement>('[data-step="-1"]')!;
  const totalEl = form.querySelector<HTMLElement>('.buy__total-value')!;
  const flavorName = form.querySelector<HTMLElement>('.buy__flavor-name')!;
  const countEl = document.querySelector<HTMLElement>('.nav__count')!;
  const toast = document.querySelector<HTMLElement>('.toast')!;

  let qty = 1;
  let cartCount = 0;
  let toastTimer = 0;

  const selectedPack = () => form.querySelector<HTMLInputElement>('input[name="pack"]:checked')!;

  const update = () => {
    const price = Number(selectedPack().dataset.price);
    qtyOut.value = String(qty);
    minus.disabled = qty <= 1;
    totalEl.textContent = brl.format(price * qty);
  };

  form.addEventListener('change', update);
  form.querySelectorAll<HTMLButtonElement>('.qty__btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      qty = Math.min(20, Math.max(1, qty + Number(btn.dataset.step)));
      update();
    }),
  );

  flavorListeners.push((f) => (flavorName.textContent = f.name));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cans = selectedPack().value;
    const flavor = FLAVORS[currentFlavor].name;
    cartCount += qty;
    countEl.textContent = String(cartCount);

    toast.textContent =
      qty === 1
        ? `Pack com ${cans} latas de ${flavor} adicionado ao carrinho.`
        : `${qty} packs com ${cans} latas de ${flavor} adicionados ao carrinho.`;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);

    if (!reducedMotion) gsap.fromTo(countEl, { scale: 1.6 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  });

  update();

  // Botão magnético: puxa na direção do cursor e o texto vai um pouco mais longe
  const cta = form.querySelector<HTMLButtonElement>('.buy__cta')!;
  const label = cta.querySelector('span')!;
  if (!reducedMotion && matchMedia('(pointer: fine)').matches) {
    const bx = gsap.quickTo(cta, 'x', { duration: 0.6, ease: 'power3.out' });
    const by = gsap.quickTo(cta, 'y', { duration: 0.6, ease: 'power3.out' });
    const lx = gsap.quickTo(label, 'x', { duration: 0.6, ease: 'power3.out' });
    const ly = gsap.quickTo(label, 'y', { duration: 0.6, ease: 'power3.out' });
    cta.addEventListener('pointermove', (e) => {
      const r = cta.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      bx(dx * 0.06);
      by(dy * 0.3);
      lx(dx * 0.05);
      ly(dy * 0.15);
    });
    cta.addEventListener('pointerleave', () => {
      bx(0);
      by(0);
      lx(0);
      ly(0);
    });
  }
}
