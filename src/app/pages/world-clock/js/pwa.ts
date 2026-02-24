// pwa.ts

let $cuerpo: any = null;
let $btnModo: HTMLButtonElement | null = null;
let $botonesTema: NodeListOf<HTMLButtonElement> | null = null;

const guardar = (k: string, v: string) => localStorage.setItem(k, v);
const leer = (k: string) => localStorage.getItem(k);

/* ====== PWA ====== */
export function iniciarPWA(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
}

/* ====== Temas ====== */
export function iniciarTema(): void {
  $cuerpo = document.body;
  $botonesTema = document.querySelectorAll('.theme-btn') as NodeListOf<HTMLButtonElement>;

  const tema = leer('tema') || 'ocean';
  aplicarTema(tema);

  $botonesTema.forEach((btn) => {
    btn.addEventListener('click', () => {
      const t = btn.getAttribute('data-theme') || 'ocean';
      aplicarTema(t);
    });
  });
}

function aplicarTema(t: string): void {
  if (!$cuerpo || !$botonesTema) return;

  // ✅ aplicar en BODY (tu CSS escucha body[data-theme="..."])
  $cuerpo.setAttribute('data-theme', t);

  // ✅ opcional: también en HTML (por si luego lo cambias)
  document.documentElement.setAttribute('data-theme', t);

  guardar('tema', t);

  $botonesTema.forEach((b) => {
    const bt = b.getAttribute('data-theme') || '';
    b.classList.toggle('is-active', bt === t);
  });
}

/* ====== Modo oscuro ====== */
export function iniciarModo(): void {
  $cuerpo = document.body;
  $btnModo = document.querySelector('.mode-switch') as HTMLButtonElement | null;

  if (!$btnModo) return;

  aplicarModo(leer('modo') === 'oscuro');

  $btnModo.addEventListener('click', () => {
    if (!$cuerpo) return;
    aplicarModo(!$cuerpo.classList.contains('dark'));
  });
}

function aplicarModo(estado: boolean): void {
  if (!$cuerpo || !$btnModo) return;

  // ✅ tu CSS escucha body.dark
  $cuerpo.classList.toggle('dark', estado);

  // ✅ opcional: también en HTML
  document.documentElement.classList.toggle('dark', estado);

  $btnModo.textContent = estado ? 'Modo claro' : 'Modo oscuro';
  guardar('modo', estado ? 'oscuro' : 'claro');
}
