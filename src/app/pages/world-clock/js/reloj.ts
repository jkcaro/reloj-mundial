// reloj.ts

let $hora: HTMLElement | null = null;
let $minuto: HTMLElement | null = null;
let $segundo: HTMLElement | null = null;

let $horaDigital: HTMLElement | null = null;
let $fechaDigital: HTMLElement | null = null;

let rafId: number | null = null;
let baseTime = 0;
let basePerf = 0;

type Estado = { zonaActiva: string };
type GetEstado = () => Estado;

export function obtenerHoraZona(zona: string): { h: number; m: number; s: number; ms: number } {
  const ahora = new Date();
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: zona,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(ahora);

  const get = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? '0';

  return {
    h: Number(get('hour')),
    m: Number(get('minute')),
    s: Number(get('second')),
    ms: ahora.getMilliseconds(),
  };
}

/* =========================
   Inicializar base estable
========================= */
function initBase(): void {
  baseTime = Date.now();
  basePerf = performance.now();
}

/* =========================
   Animación ultra fluida
========================= */
function tick(getEstado: GetEstado): void {
  const { zonaActiva } = getEstado();

  if (!baseTime) initBase();

  const ahora = new Date();
  const { h, m, s, ms } = obtenerHoraZona(zonaActiva);

  const sCont = s + ms / 1000;
  const mCont = m + sCont / 60;
  const hCont = (h % 12) + mCont / 60;

  if ($segundo) $segundo.style.transform = `rotate(${sCont * 6}deg)`;
  if ($minuto) $minuto.style.transform = `rotate(${mCont * 6}deg)`;
  if ($hora) $hora.style.transform = `rotate(${hCont * 30}deg)`;

  if ($horaDigital) {
    $horaDigital.textContent = new Intl.DateTimeFormat('es-ES', {
      timeZone: zonaActiva,
      timeStyle: 'medium',
    }).format(ahora);
  }

  if ($fechaDigital) {
    $fechaDigital.textContent = new Intl.DateTimeFormat('es-ES', {
      timeZone: zonaActiva,
      dateStyle: 'full',
    }).format(ahora);
  }

  rafId = requestAnimationFrame(() => tick(getEstado));
}

export function iniciarReloj(getEstado: GetEstado): void {
  $hora = document.querySelector<HTMLElement>('.hour');
  $minuto = document.querySelector<HTMLElement>('.minute');
  $segundo = document.querySelector<HTMLElement>('.second');

  $horaDigital = document.querySelector<HTMLElement>('#digital-time');
  $fechaDigital = document.querySelector<HTMLElement>('#digital-date');

  if (!$hora || !$minuto || !$segundo || !$horaDigital || !$fechaDigital) return;

  if (rafId) cancelAnimationFrame(rafId);

  baseTime = 0;
  basePerf = 0;
  initBase();

  rafId = requestAnimationFrame(() => tick(getEstado));
}
