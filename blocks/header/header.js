import { readBlockConfig, replaceElement } from '../../scripts/lib-franklin.js';
import { createTag } from '../../scripts/scripts.js';

// When you click on the hamburger give a new class to the ul that has column layout

export default async function decorate($block) {
  const $cfg = readBlockConfig($block);

  // fetch nav content
  const $navPath = $cfg.nav || '/nav';
  const $resp = await fetch(`${$navPath}.plain.html`);

  if ($resp.ok) {
    const $container = document.createElement('div');
    $container.innerHTML = await $resp.text();
    $container.classList.add('container');

    // Replace the div surrounding the Webistry logo with an a tag
    const $logoLink = document.createElement('a');
    const $logo = $container.querySelector('picture');

    $logoLink.classList.add('header-logo');
    $logoLink.href = '/';
    $logo.parentElement.replaceWith($logoLink);
    $logoLink.append($logo);

    // Switch the 'div' containing li elements to a 'nav'
    const $list = $container.querySelector('ul');
    const $nav = document.createElement('nav');

    $list.parentElement.replaceWith($nav);
    $nav.append($list);

    // Wrap inner text of a tags with a span
    const $aTags = $container.querySelectorAll('nav > ul > li > a');
    $aTags.forEach((a) => {
      const $newSpan = document.createElement('span');
      $newSpan.textContent = a.textContent;
      a.textContent = '';
      a.append($newSpan);
      a.classList.add('nav');
    });

    // Turn bolded links into a CTA.
    const $buttons = $list.querySelectorAll('strong');

    $buttons.forEach(($button) => {
      const $newButton = createTag('button', { className: 'button-red' });
      $newButton.textContent = $button.textContent;
      $button.replaceWith($newButton);
    });

    // hamburger for mobile
    const $hamburger = document.createElement('div');
    $hamburger.classList.add('nav-hamburger');
    $hamburger.innerHTML = '<button class="nav-hamburger-icon"><figure class="header-hamburger">-_-</figure></button>';

    const $verticalList = $list.cloneNode(true);
    $verticalList.classList.add('header-vertical-list');
    $container.append($verticalList);

    $hamburger.addEventListener('click', () => {
      const $list = $container.querySelector('ul');
      $list.classList.add('showVerticalMenu');
    });

    $container.insertBefore($hamburger, $nav);

    // $nav.setAttribute('aria-expanded', 'false');

    $block.textContent = '';
    $block.append($container);
  }
}
