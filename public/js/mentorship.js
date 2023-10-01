"use strict";

// Event listener handles two tasks for now
// - navbar toogle menu
// - add class is-active to selected tab

document.addEventListener('DOMContentLoaded', () => {

  // Toggle Mobile Menu implementaion on client side
  // Via Bulma Css Framework Example
  //
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
  
      // Add a click event on each of them
      $navbarBurgers.forEach( el => {
        el.addEventListener('click', () => {
  
          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);
  
          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
  
        });
      });
    }
  // End Toggle Mobile Menu

  // When navigating from home page to
  // portal page, carry over tag of link
  // and set tag id with class is-active 
  // i.e: shows the selected tab
  const signupTab = document.getElementById('signup-tab');
  const loginTab = document.getElementById('login-tab');
  const tabContent = document.getElementsByClassName("tab-content");

  // check anchor tag is signup
  if (location.hash === "#signup-tab") {
      signupTab.classList.add('is-active');
      // if not check if tag is login
  } else if (location.hash === "#login-tab") {
      // remove is-active from signup
      signupTab.classList.remove('is-active');
      // add is-active to login
      loginTab.classList.add('is-active');
      // hide signup tab content
      tabContent[0].style.display = "none";
      // show login tab content
      tabContent[1].style.display = "block";
  }
});

// Maintain selection of tabs with click listener
function selectTab(evt, tabName) {
  let i, tabContent, tabLinks;

  tabContent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }

  tabLinks = document.getElementsByClassName("tab");
  for (i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" is-active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " is-active";
}