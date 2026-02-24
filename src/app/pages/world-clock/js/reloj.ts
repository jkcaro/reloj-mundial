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

/* =========================
   Obtener fecha real por zona
========================= */
function obtenerFechaZona(zona: string): Date {
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

  const get = (t: string) => partes.find((p) => p.type === t)?.value;

  return new Date(
    `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`,
  );
}

/* =========================
   Inicializar base estable
========================= */
function initBase(zona: string): void {
  const fechaZona = obtenerFechaZona(zona);
  baseTime = fechaZona.getTime();
  basePerf = performance.now();
}

/* =========================
   Animación ultra fluida
========================= */
function tick(getEstado: GetEstado): void {
  const { zonaActiva } = getEstado();

  // Si cambió la zona o no hay base, recalculamos base
  if (!baseTime) initBase(zonaActiva);

  const nowPerf = performance.now();
  const elapsed = nowPerf - basePerf;

  const currentTime = new Date(baseTime + elapsed);

  const h = currentTime.getHours();
  const m = currentTime.getMinutes();
  const s = currentTime.getSeconds();
  const ms = currentTime.getMilliseconds();

  // Sweep continuo
  const sCont = s + ms / 1000;
  const mCont = m + sCont / 60;
  const hCont = (h % 12) + mCont / 60;

  if ($segundo) $segundo.style.transform = `rotate(${sCont * 6}deg)`;
  if ($minuto) $minuto.style.transform = `rotate(${mCont * 6}deg)`;
  if ($hora) $hora.style.transform = `rotate(${hCont * 30}deg)`;

  // Digital (formateado por zona)
  if ($horaDigital) {
    $horaDigital.textContent = new Intl.DateTimeFormat("es-ES", {
      timeZone: zonaActiva,
      timeStyle: "medium",
    }).format(new Date());
  }

  if ($fechaDigital) {
    $fechaDigital.textContent = new Intl.DateTimeFormat("es-ES", {
      timeZone: zonaActiva,
      dateStyle: "full",
    }).format(new Date());
  }

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

  // Reset base para recalcular al iniciar
  baseTime = 0;
  basePerf = 0;

  const { zonaActiva } = getEstado();
  initBase(zonaActiva);

  rafId = requestAnimationFrame(() => tick(getEstado));
}
