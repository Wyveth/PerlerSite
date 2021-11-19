/**
* Template Name: FlexStart - v1.7.0
* Template URL: https://bootstrapmade.com/flexstart-bootstrap-startup-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
   const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
   const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach(e => e.addEventListener(type, listener))
    } else {
      select(el, all).addEventListener(type, listener)
    }
  }

  /**
   * Porfolio isotope and filter
   */
   let portfolioContainer = select('.portfolio-container');
   if (portfolioContainer) {
     let portfolioIsotope = new Isotope(portfolioContainer, {
       itemSelector: '.portfolio-item',
       layoutMode: 'fitRows'
     });

     let portfolioFilters = select('#portfolio-flters li', true);

     on('click', '#portfolio-flters li', function(e) {
       e.preventDefault();
       portfolioFilters.forEach(function(el) {
         el.classList.remove('filter-active');
       });
       this.classList.add('filter-active');

       portfolioIsotope.arrange({
         filter: this.getAttribute('data-filter')
       });
     }, true);
    }

    /**
    * Initiate portfolio lightbox 
    */
    const portfolioLightbox = GLightbox({
      selector: '.portfokio-lightbox'
    });

})();