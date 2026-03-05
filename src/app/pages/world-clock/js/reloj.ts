// reloj.ts

let $hora: HTMLElement | null = null;
let $minuto: HTMLElement | null = null;
let $segundo: HTMLElement | null = null;

let $horaDigital: HTMLElement | null = null;
let $fechaDigital: HTMLElement | null = null;

let rafId: number | null = null;

// baseTime se guarda como MILISEGUNDOS UTC "de la zona"
let baseTimeUTCms = 0;
let basePerf = 0;

let lastZona: string | null = null;

type Estado = { zonaActiva: string };
type GetEstado = () => Estado;

/* =========================================================
   Obtener timestamp UTC que representa "la hora actual en zona"
   (IMPORTANTE: no construimos Date local con string sin offset)
========================================================= */
function obtenerZonaAhoraUTCms(zona: string): number {
  const ahora = new Date();

  const partes = new Intl.DateTimeFormat("es-ES", {
    timeZone: zona,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(ahora);

  const getNum = (t: string) => Number(partes.find((p) => p.type === t)?.value);

  const y = getNum("year");
  const mo = getNum("month");  // 1-12
  const d = getNum("day");
  const h = getNum("hour");
  const mi = getNum("minute");
  const s = getNum("second");

  // Date.UTC usa mes 0-11
  return Date.UTC(y, mo - 1, d, h, mi, s);
}

/* =========================
   Inicializar base estable
========================= */
function initBase(zona: string): void {
  baseTimeUTCms = obtenerZonaAhoraUTCms(zona);
  basePerf = performance.now();
}

/* =========================
   Renderizar analógico
   (usa getters UTC para coherencia con baseTimeUTCms)
========================= */
function renderAnalogico(currentUTCms: number): void {
  const d = new Date(currentUTCms);

  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const s = d.getUTCSeconds();
  const ms = d.getUTCMilliseconds();

  // Sweep continuo
  const sCont = s + ms / 1000;
  const mCont = m + sCont / 60;
  const hCont = (h % 12) + mCont / 60;

  if ($segundo) $segundo.style.transform = `rotate(${sCont * 6}deg)`;
  if ($minuto) $minuto.style.transform = `rotate(${mCont * 6}deg)`;
  if ($hora) $hora.style.transform = `rotate(${hCont * 30}deg)`;
}

/* =========================
   Renderizar digital (la fuente de verdad visual)
========================= */
function renderDigital(zona: string): void {
  const ahora = new Date();

  if ($horaDigital) {
    $horaDigital.textContent = new Intl.DateTimeFormat("es-ES", {
      timeZone: zona,
      timeStyle: "medium",
    }).format(ahora);
  }

  if ($fechaDigital) {
    $fechaDigital.textContent = new Intl.DateTimeFormat("es-ES", {
      timeZone: zona,
      dateStyle: "full",
    }).format(ahora);
  }
}

/* =========================
   Animación ultra fluida
========================= */
function tick(getEstado: GetEstado): void {
  const { zonaActiva } = getEstado();

  // Recalcular base si: no hay base o cambió la zona
  if (!baseTimeUTCms || lastZona !== zonaActiva) {
    initBase(zonaActiva);
    lastZona = zonaActiva;
  }

  const nowPerf = performance.now();
  const elapsed = nowPerf - basePerf;

  // Tiempo "actual" en zona, representado como UTCms coherente
  const currentUTCms = baseTimeUTCms + elapsed;

  // Analógico y digital apuntan a la MISMA zona
  renderAnalogico(currentUTCms);
  renderDigital(zonaActiva);

  rafId = requestAnimationFrame(() => tick(getEstado));
}

export function iniciarReloj(getEstado: GetEstado): void {
  // Asegurar DOM (Angular)
  $hora = document.querySelector<HTMLElement>(".hour");
  $minuto = document.querySelector<HTMLElement>(".minute");
  $segundo = document.querySelector<HTMLElement>(".second");

  $horaDigital = document.querySelector<HTMLElement>("#digital-time");
  $fechaDigital = document.querySelector<HTMLElement>("#digital-date");

  if (!$hora || !$minuto || !$segundo || !$horaDigital || !$fechaDigital) return;

  if (rafId) cancelAnimationFrame(rafId);

  // Reset base
  baseTimeUTCms = 0;
  basePerf = 0;
  lastZona = null;

  // Iniciar
  initBase(getEstado().zonaActiva);
  lastZona = getEstado().zonaActiva;

  rafId = requestAnimationFrame(() => tick(getEstado));
}
