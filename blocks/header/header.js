import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate($block) {
  const $cfg = readBlockConfig($block);
  $block.textContent = '';

  // fetch nav content
  const $navPath = $cfg.nav || '/nav';
  const $resp = await fetch(`${$navPath}.plain.html`);
  if ($resp.ok) {
    const $html = await $resp.text();
    const $container = document.createElement('div');
    $container.classList.add('container');
    $container.innerHTML = $html;

    // Replace the div surrounding the Webistry logo with an a tag
    const $homeATag = document.createElement('a');
    const $webistryLogo = $container.querySelector('picture > img');

    $homeATag.classList.add('header__logo');
    $homeATag.href = 'https://www.webistry.com';
    $homeATag.append($webistryLogo);
    $container.querySelector('div').replaceWith($homeATag);

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

    $block.textContent = '';
    $block.append($container);
  }
}
