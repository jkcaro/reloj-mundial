import { CLIMA_POR_ZONA } from "./ciudades";

let $climaIcono: HTMLElement | null = null;
let $climaTemp: HTMLElement | null = null;
let $climaDesc: HTMLElement | null = null;
let $forecastList: HTMLElement | null = null;

let intervalId: number | null = null;

type Estado = {
  zonaActiva: string;
  usaCiudad: boolean;
  ciudadObj: { lat: number; lon: number; nombre: string } | null;
  climaZonaObj: { lat: number; lon: number; ciudad: string } | null;
};

type GetEstado = () => Estado;

/* ====== Iconos y texto por código ====== */
function iconoClima(code: number): [string, string, "sol" | "nube" | "lluvia" | "nieve" | "niebla"] {
  if (code === 0) return ["☀️", "Despejado", "sol"];
  if ([1, 2].includes(code)) return ["🌤️", "Parcial", "sol"];
  if (code === 3) return ["☁️", "Nublado", "nube"];
  if ([45, 48].includes(code)) return ["🌫️", "Niebla", "niebla"];
  if ([51, 53, 55].includes(code)) return ["🌦️", "Llovizna", "lluvia"];
  if ([61, 63, 65].includes(code)) return ["🌧️", "Lluvia", "lluvia"];
  if ([71, 73, 75].includes(code)) return ["❄️", "Nieve", "nieve"];
  if ([95, 96, 99].includes(code)) return ["⛈️", "Tormenta", "lluvia"];
  return ["⛅", "Clima", "nube"];
}

function pintarClimaError(): void {
  if ($climaIcono) $climaIcono.textContent = "⛅";
  if ($climaTemp) $climaTemp.textContent = "--°C";
  if ($climaDesc) $climaDesc.textContent = "Clima no disponible";
  document.body.classList.remove("fx-sol", "fx-lluvia", "fx-nieve", "fx-niebla");
}

function aplicarFX(tipo: string): void {
  document.body.classList.remove("fx-sol", "fx-lluvia", "fx-nieve", "fx-niebla");
  if (tipo === "sol") document.body.classList.add("fx-sol");
  if (tipo === "lluvia") document.body.classList.add("fx-lluvia");
  if (tipo === "nieve") document.body.classList.add("fx-nieve");
  if (tipo === "niebla") document.body.classList.add("fx-niebla");
}

/* ====== Fetch Open-Meteo ====== */
async function fetchMeteo(lat: number, lon: number): Promise<any> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${encodeURIComponent(lat)}` +
    `&longitude=${encodeURIComponent(lon)}` +
    `&current=temperature_2m,apparent_temperature,wind_speed_10m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Open-Meteo error");
  return res.json();
}

/* ====== Pronóstico UI ====== */
function nombreDia(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(d);
}

function pintarPronostico(daily: any): void {
  if (!$forecastList || !daily) return;

  const days: string[] = daily.time || [];
  const max: number[] = daily.temperature_2m_max || [];
  const min: number[] = daily.temperature_2m_min || [];
  const code: number[] = daily.weather_code || [];

  $forecastList.innerHTML = days
    .slice(0, 7)
    .map((fecha, i) => {
      const [ico, texto] = iconoClima(Number(code[i]));
      return `
        <div class="forecast-item" title="${texto}">
          <div class="forecast-icon">${ico}</div>
          <div class="forecast-day">${nombreDia(fecha)}</div>
          <div class="forecast-temp">
            <span class="temp-max">${Math.round(max[i])}°</span>
            <span class="temp-min">${Math.round(min[i])}°</span>
          </div>
        </div>
      `;
    })
    .join("");
}

/* ====== Decide coords por zona/ciudad ====== */
function coordsDesdeEstado(getEstado: GetEstado): { lat: number; lon: number; nombre: string } | null {
  const st = getEstado();

  if (st.usaCiudad && st.ciudadObj) {
    return { lat: st.ciudadObj.lat, lon: st.ciudadObj.lon, nombre: st.ciudadObj.nombre };
  }

  const info = (CLIMA_POR_ZONA as any)[st.zonaActiva] || st.climaZonaObj;
  if (!info) return null;
  return { lat: info.lat, lon: info.lon, nombre: info.ciudad };
}

/* ====== Render clima ====== */
async function actualizarClima(getEstado: GetEstado): Promise<void> {
  try {
    const reloj = document.querySelector<HTMLElement>(".clock");
    const weather = document.querySelector<HTMLElement>(".weather");

    // Animación salida
    if (reloj) reloj.classList.add("fade-out");
    if (weather) weather.classList.add("fade-out");

    await new Promise<void>((r) => setTimeout(() => r(), 250));

    const coords = coordsDesdeEstado(getEstado);
    if (!coords) return pintarClimaError();

    const data = await fetchMeteo(coords.lat, coords.lon);

    const temp = data?.current?.temperature_2m;
    const feels = data?.current?.apparent_temperature;
    const wind = data?.current?.wind_speed_10m;
    const code = Number(data?.current?.weather_code);

    const [ico, texto, tipo] = iconoClima(code);

    if ($climaIcono) $climaIcono.textContent = ico;
    if ($climaTemp) $climaTemp.textContent = `${Math.round(temp)}°C`;
    if ($climaDesc) {
      $climaDesc.textContent =
        `${texto} • ${coords.nombre} • Viento ${Math.round(wind)} km/h • Sensación ${Math.round(feels)}°C`;
    }

    aplicarFX(tipo);
    pintarPronostico(data.daily);

    // Animación entrada
    if (reloj) reloj.classList.remove("fade-out");
    if (weather) weather.classList.remove("fade-out");
  } catch {
    pintarClimaError();
  }
}

export function iniciarClima(getEstado: GetEstado): void {
  // DOM ready (Angular)
  $climaIcono = document.querySelector<HTMLElement>("#weather-icon");
  $climaTemp = document.querySelector<HTMLElement>("#weather-temp");
  $climaDesc = document.querySelector<HTMLElement>("#weather-desc");
  $forecastList = document.querySelector<HTMLElement>("#forecast-list");

  if (!$climaIcono || !$climaTemp || !$climaDesc || !$forecastList) return;

  // primera carga
  actualizarClima(getEstado);

  // refresca cada 10 min (solo 1 interval)
  if (intervalId) window.clearInterval(intervalId);
  intervalId = window.setInterval(() => actualizarClima(getEstado), 10 * 60 * 1000);

  // refresco inmediato cuando cambias zona/ciudad
  window.addEventListener("estado-cambio", () => actualizarClima(getEstado));
}
