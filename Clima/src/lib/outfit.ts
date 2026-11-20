import type { Kind } from './weather';

/*
  O visual da Bolota é COMPOSTO, não escolhido de uma lista fechada.
  Cada fator (tempo, hora, temperatura, vento) preenche "espaços":
  cabeça, rosto, corpo, mão direita, mão esquerda e extras.
  Assim "noite + chuva" ou "frio + vento" geram combinações próprias.
*/

export type ItemId =
  // cabeça
  | 'flower' | 'cap' | 'beanie' | 'hood' | 'nightcap' | 'bowler' | 'blanket' | 'sleepmask' | 'earmuffs'
  // rosto
  | 'sunglasses'
  // corpo
  | 'scarf' | 'raincoat' | 'boots'
  // mão direita
  | 'umbrella' | 'umbrellaFlipped' | 'popsicle' | 'mug' | 'fan' | 'snowball'
  // mão esquerda
  | 'lantern' | 'flashlight' | 'teddy'
  // extras
  | 'sweat' | 'breath' | 'flakes' | 'leaf' | 'zzz';

export type Mood = 'happy' | 'cool' | 'cold' | 'delight' | 'scared' | 'squint' | 'sleepy' | 'tired' | 'cozy';
export type Fx = 'shiver' | 'tremble' | 'lean' | 'nod' | 'bounce';
export type TimeOfDay = 'night' | 'dawn' | 'day' | 'dusk';
export type TempBand = 'freezing' | 'cold' | 'mild' | 'warm' | 'hot';

export interface Look {
  items: ItemId[];
  right: ItemId | null;
  left: ItemId | null;
  head: ItemId | null;
  mood: Mood;
  fx: Fx | null;
  mittens: boolean;
  tip: string;
}

export interface LookInput {
  kind: Kind;
  tempC: number;
  wind: number;
  sun: number; // altura do sol, -1 a 1
  hour: number; // hora local, 0–23
}

export const timeOfDay = (sun: number, hour: number): TimeOfDay =>
  sun < -0.05 ? 'night' : sun <= 0.2 ? (hour < 12 ? 'dawn' : 'dusk') : 'day';

export const tempBand = (c: number): TempBand =>
  c <= 0 ? 'freezing' : c <= 12 ? 'cold' : c >= 30 ? 'hot' : c >= 25 ? 'warm' : 'mild';

export function composeLook({ kind, tempC, wind, sun, hour }: LookInput): Look {
  const time = timeOfDay(sun, hour);
  const temp = tempBand(tempC);
  const night = time === 'night';
  const windy = wind >= 35;
  const chilly = temp === 'cold' || temp === 'freezing';

  // `as` evita que o TypeScript "estreite" para null: os setters abaixo alteram estas variáveis
  let head = null as ItemId | null;
  let face = null as ItemId | null;
  let right = null as ItemId | null;
  let left = null as ItemId | null;
  const body = new Set<ItemId>();
  const extras = new Set<ItemId>();
  let mood: Mood = 'happy';
  let fx: Fx | null = null;
  let mittens = false;
  let tip = '';

  // cada espaço só aceita uma peça: quem chega primeiro (o fator mais importante) fica
  const setHead = (id: ItemId) => { head ??= id; };
  const setRight = (id: ItemId) => { right ??= id; };
  const setLeft = (id: ItemId) => { left ??= id; };

  /* ---------- 1. tipo de tempo ---------- */
  if (kind === 'storm') {
    mood = 'scared';
    fx = 'tremble';
    if (night) {
      setHead('blanket');
      setLeft('teddy');
      tip = 'Trovoada de madrugada. Fique debaixo da coberta.';
    } else {
      setHead('hood');
      body.add('raincoat').add('boots');
      setRight(windy ? 'umbrellaFlipped' : 'umbrella');
      tip = 'Tempestade. Melhor ficar em casa.';
    }
  } else if (kind === 'rain' || kind === 'drizzle') {
    if (temp === 'hot' || temp === 'warm') {
      // chuva de verão: guarda-chuva e roupa leve
      setRight(windy ? 'umbrellaFlipped' : 'umbrella');
      extras.add('sweat');
      tip = 'Chuva quente de verão. Guarda-chuva e roupa leve.';
    } else {
      setHead('hood');
      body.add('raincoat');
      if (kind === 'rain') body.add('boots');
      if (kind === 'rain' || windy) setRight(windy ? 'umbrellaFlipped' : 'umbrella');
      tip = kind === 'drizzle' ? 'Só uma garoa. A capa resolve.' : 'Não esqueça o guarda-chuva.';
    }
    if (windy) {
      mood = 'squint';
      tip = 'Chuva com vento. O guarda-chuva não vai aguentar.';
    }
    if (night) {
      setLeft('flashlight');
      mood = 'tired';
      tip = 'Chuva à noite. Leve lanterna e guarda-chuva.';
    }
  } else if (kind === 'snow') {
    setHead('beanie');
    body.add('scarf');
    extras.add('flakes');
    mittens = true;
    if (night) {
      setRight('mug');
      mood = 'cozy';
      tip = 'Neve lá fora. Noite de chocolate quente.';
    } else {
      setRight('snowball');
      mood = 'delight';
      fx = 'bounce';
      tip = 'Neve! Gorro, luvas e guerra de bola de neve.';
    }
  } else if (kind === 'fog') {
    setLeft('lantern');
    body.add('scarf');
    mood = 'squint';
    tip = night ? 'Neblina à noite. Farol baixo e devagar.' : 'Neblina. Cuidado na estrada.';
  } else {
    /* ---------- céu limpo ou com nuvens: a hora e a temperatura decidem ---------- */
    if (night) {
      mood = 'sleepy';
      fx = 'nod';
      if (temp === 'hot' || temp === 'warm') {
        setHead('sleepmask');
        setRight('fan');
        tip = 'Noite quente. Ventilador ligado.';
      } else if (chilly) {
        setHead('nightcap');
        body.add('scarf');
        setRight('mug');
        mood = 'cozy';
        tip = 'Noite fria. Chocolate quente e cobertor.';
      } else {
        setHead('nightcap');
        extras.add('zzz');
        tip = kind === 'clear' ? 'Céu limpo. Boa noite para ver estrelas.' : 'Já é tarde. Hora de descansar.';
      }
    } else if (time === 'dawn') {
      setRight('mug');
      mood = 'tired';
      if (chilly) setHead('beanie');
      tip = 'Bom dia! Primeiro o café.';
    } else if (time === 'dusk') {
      mood = 'happy';
      if (temp === 'hot' || temp === 'warm') face = 'sunglasses';
      tip = kind === 'clear' ? 'Fim de tarde com céu limpo. Olhe o pôr do sol.' : 'Fim de tarde. Hora de voltar para casa.';
    } else if (temp === 'hot') {
      setHead('cap');
      setRight('popsicle');
      extras.add('sweat');
      if (kind === 'clear' || kind === 'partly') face = 'sunglasses';
      mood = 'cool';
      tip = 'Calor! Beba água e passe protetor solar.';
    } else if (temp === 'warm') {
      setHead('cap');
      if (kind === 'clear' || kind === 'partly') face = 'sunglasses';
      mood = 'cool';
      tip = 'Dia quente e gostoso. Protetor solar.';
    } else if (chilly) {
      setHead('beanie');
      body.add('scarf');
      extras.add('breath');
      mood = 'cold';
      fx = 'shiver';
      tip = 'Brrr. Leve um casaco.';
    } else {
      if (kind !== 'cloudy') setHead('flower');
      tip = kind === 'cloudy' ? 'Nublado, mas sem chuva. Dá para sair.' : 'Dia bom para sair. Aproveite!';
    }
  }

  /* ---------- 2. modificadores ---------- */
  if (temp === 'freezing') {
    if (!head || head === 'flower') head = 'earmuffs';
    body.add('scarf');
    mittens = true;
    if (head !== 'blanket') extras.add('breath');
    if (!fx || fx === 'nod') fx = 'shiver';
    if (mood === 'happy') mood = 'cold';
    if (kind === 'clear' || kind === 'partly' || kind === 'cloudy') tip = 'Abaixo de zero. Proteja orelhas e mãos.';
  }

  if (windy && kind !== 'storm' && kind !== 'rain' && kind !== 'drizzle') {
    setHead('bowler');
    extras.add('leaf');
    if (fx !== 'shiver') fx = 'lean';
    if (mood === 'happy' || mood === 'cool') mood = 'squint';
    if (kind === 'clear' || kind === 'partly' || kind === 'cloudy') tip = 'Vento forte. Segure o chapéu!';
  }

  const items = [head, face, ...body, right, left, ...extras].filter((x): x is ItemId => x !== null);
  return { items, right, left, head, mood, fx, mittens, tip };
}
