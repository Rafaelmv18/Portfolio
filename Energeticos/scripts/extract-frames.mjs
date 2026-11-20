// Gera os assets otimizados a partir dos arquivos brutos em /source-assets.
// - Quadros do vídeo -> public/frames/0001.webp ... (recorta a marca d'água inferior)
// - Imagens estáticas -> public/img/*.webp
// Uso: npm run frames
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import ffmpeg from 'ffmpeg-static';

const SRC = 'source-assets';
const FRAMES = 'public/frames';
const IMG = 'public/img';

// O vídeo é 768x768. A marca d'água fica entre y=700 e y=745,
// então mantemos só os 690px de cima (a lata termina em y≈640).
const CROP = 'crop=768:690:0:0';

const run = (args) => execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });

rmSync(FRAMES, { recursive: true, force: true });
mkdirSync(FRAMES, { recursive: true });
mkdirSync(IMG, { recursive: true });

console.log('Extraindo quadros do vídeo…');
run([
  '-i', join(SRC, 'explosion.mp4'),
  '-vf', CROP,
  '-c:v', 'libwebp', '-quality', '50', '-compression_level', '6',
  join(FRAMES, '%04d.webp'),
]);

const count = readdirSync(FRAMES).filter((f) => f.endsWith('.webp')).length;
// O front-end lê esse manifesto para saber quantos quadros existem.
writeFileSync(join(FRAMES, 'manifest.json'), JSON.stringify({ count, width: 768, height: 690 }));
console.log(`${count} quadros gerados.`);

console.log('Convertendo imagens estáticas…');
run(['-i', join(SRC, 'can-start.jpg'), '-c:v', 'libwebp', '-quality', '82', join(IMG, 'can-start.webp')]);
// A imagem quadrada também tem marca d'água embaixo: recorta e reduz.
run([
  '-i', join(SRC, 'can-splash.png'),
  '-vf', 'crop=2048:1780:0:0,scale=1200:-1',
  '-c:v', 'libwebp', '-quality', '78', join(IMG, 'can-splash.webp'),
]);
// Versões menores para o celular (usadas via srcset)
run(['-i', join(SRC, 'can-start.jpg'), '-vf', 'scale=768:-1', '-c:v', 'libwebp', '-quality', '80', join(IMG, 'can-start-768.webp')]);
run([
  '-i', join(SRC, 'can-splash.png'),
  '-vf', 'crop=2048:1780:0:0,scale=640:-1',
  '-c:v', 'libwebp', '-quality', '78', join(IMG, 'can-splash-640.webp'),
]);

// Imagem de prévia para redes sociais (1200x630): quadro do meio do vídeo sobre fundo preto
console.log('Gerando imagem de compartilhamento…');
run([
  '-ss', '3', '-i', join(SRC, 'explosion.mp4'),
  '-vf', `${CROP},scale=-1:630,pad=1200:630:(ow-iw)/2:0:black`,
  '-frames:v', '1', '-q:v', '3', 'public/og-image.jpg',
]);
console.log('Pronto.');
