import { readBlockConfig, replaceElement} from '../../scripts/lib-franklin.js';
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
    $logoLink.append($logo);
    $container.querySelector('div').replaceWith($logoLink);

    // Switch the 'div' containing li elements to a 'nav'
    const $oldLiDiv = $container.querySelector('.container > div');
    const $nav = document.createElement('nav');

    $nav.id = 'site-primary-navigation';
    $nav.append(...$oldLiDiv.childNodes);
    $oldLiDiv.replaceWith($nav);

    // Wrap inner text of a tags with a span
    const $aTags = $container.querySelectorAll('nav > ul > li > a');
    $aTags.forEach((a) => {
      const $newSpan = document.createElement('span');
      $newSpan.textContent = a.textContent;
      a.textContent = '';
      a.append($newSpan);
      a.classList.add('nav');
    });

    // Turn last li into a button
    const $lastLi = $container.querySelector('strong');
    const $newCTA = replaceElement($lastLi, 'button', 'button-red');
    $newCTA.classList.add('button', 'button-small');

    // hamburger for mobile

    const $hamburger = createTag('div', { class: 'nav-hamburger' });
    Array.from(Array(3)).forEach(() => {
      $hamburger.append(createTag('span', { class: 'bar' }));
    });
    $container.append($hamburger);
    console.log($container.cloneNode(true));

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
