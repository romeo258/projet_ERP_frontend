import { Injectable } from '@angular/core';
declare var jQuery: any;

@Injectable({
  providedIn: 'root'
})
export class SidebarNavbarService {

  constructor() { }

  initSidebarToggle(): void {
    (function($) {
      "use strict";

      // Vérifier si l'état du sidebar est déjà stocké dans localStorage
      const sidebarToggled = localStorage.getItem('sidebarToggled');

      // Si aucun état n'est stocké, initialiser le sidebar comme réduit
      if (sidebarToggled === null) {
        $("body").addClass("sidebar-toggled");
        $(".sidebar").addClass("toggled");
        localStorage.setItem('sidebarToggled', 'true'); // Stocker l'état réduit dans localStorage
      } else {
        // Sinon, récupérer l'état du sidebar depuis localStorage et l'appliquer
        if (sidebarToggled === 'true') {
          $("body").addClass("sidebar-toggled");
          $(".sidebar").addClass("toggled");
        }
      }

      // Fonction pour basculer la navigation latérale
      $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");

        // Mettre à jour l'état du sidebar dans localStorage
        const toggled = $("body").hasClass("sidebar-toggled");
        localStorage.setItem('sidebarToggled', toggled ? 'true' : 'false');

        if ($(".sidebar").hasClass("toggled")) {
          $('.sidebar .collapse').collapse('hide');
        };
      });

    })(jQuery);
  }

}
