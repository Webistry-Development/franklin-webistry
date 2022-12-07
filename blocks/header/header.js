import { readBlockConfig, replaceElement } from '../../scripts/lib-franklin.js';

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

    console.log($container.cloneNode(true));

    $logoLink.classList.add('header-logo');
    $logoLink.href = 'https://www.webistry.com';
    $logoLink.append($logo);
    $container.querySelector('div').replaceWith($logoLink);

    // Switch the 'div' containing li elements to a 'nav'
    const $oldLiDiv = $container.querySelector('.container > div');
    const $nav = document.createElement('nav');

    $nav.id = 'site-primary-navigation';
    $nav.append(...$oldLiDiv.childNodes);
    $oldLiDiv.replaceWith($nav);

    // Wrap inner text of a tags with a span
    const $list = $container.querySelectorAll('nav > ul > li > a');
    $list.forEach((a) => {
      const $newSpan = document.createElement('span');
      $newSpan.textContent = a.textContent;
      a.textContent = '';
      a.append($newSpan);
      a.classList.add('nav');
    });

    // Turn last li into a button
    const $lastLi = $container.querySelector('li:last-of-type');
    const $newCTA = replaceElement($lastLi, 'button', 'button-red');
    $newCTA.classList.add('button', 'button-small');

    $block.textContent = '';
    $block.append($container);
  }
}
