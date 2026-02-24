import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { iniciarPWA, iniciarTema, iniciarModo } from './js/pwa';
import { iniciarReloj } from './js/reloj';
import { iniciarCiudades, getEstado } from './js/ciudades';
import { iniciarClima } from './js/clima';

@Component({
  selector: 'app-world-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './world-clock.html',
  styleUrl: './world-clock.scss',
})
export class WorldClockComponent implements AfterViewInit {

  private iniciarApp(): void {
    iniciarPWA();              // Service Worker + PWA
    iniciarTema();             // tema guardado + listeners
    iniciarModo();             // modo oscuro guardado + listener

    iniciarCiudades();         // zona + ciudad + bandera (guardado)
    iniciarReloj(getEstado);   // reloj por zona (sweep)
    iniciarClima(getEstado);   // clima + pronóstico por ciudad/zona
  }

  ngAfterViewInit(): void {
    this.iniciarApp();

    requestAnimationFrame(() => {
      document.body.classList.add('app-ready');
    });
  }
}
