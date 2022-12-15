import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { createTag } from '../../scripts/scripts.js';

function buildMobileMenu($container, $header) {
  const $hamburger = createTag('div', { class: 'nav-hamburger', aria_expanded: 'false' });

  for (let bar = 0; bar < 3; bar += 1) {
    $hamburger.append(createTag('span', { class: 'bar' }));
  }

  $container.append($hamburger);

  $hamburger.addEventListener('click', () => {
    if ($hamburger.getAttribute('aria_expanded') === 'false') {
      $hamburger.setAttribute('aria_expanded', 'true');
      $header.classList.add('mobile-active');
    } else {
      $header.classList.remove('mobile-active');
      $hamburger.setAttribute('aria_expanded', 'false');
    }
  });

  document.addEventListener('click', (event) => {
    if (!$container.contains(event.target) && $hamburger.getAttribute('aria_expanded') === 'true') {
      $hamburger.setAttribute('aria_expanded', 'false');
      $header.classList.remove('mobile-active');
    }
  });
}

export default async function decorate($block) {
  const $cfg = readBlockConfig($block);

  // fetch nav content
  const $navPath = $cfg.nav || '/nav';
  const $resp = await fetch(`${$navPath}.plain.html`);

  if ($resp.ok) {
    const $container = createTag('div', { class: 'container' });
    $container.innerHTML = await $resp.text();
    const $header = document.querySelector('.header-wrapper > .header.block');

    // Replace the div surrounding the Webistry logo with an a tag
    const $logoLink = createTag('a', { class: 'header-logo', href: '/' });
    const $logo = $container.querySelector('picture');
    $logo.parentElement.replaceWith($logoLink);
    $logoLink.append($logo);

    // Switch the 'div' containing li elements to a 'nav'
    const $list = $container.querySelector('ul');
    $list.classList.add('nav-list');
    const $nav = createTag('nav');
    $list.parentElement.replaceWith($nav);
    $nav.append($list);

    // Wrap inner text of a tags with a span
    const $aTags = $container.querySelectorAll('nav > ul > li > a');
    $aTags.forEach((a) => {
      const $newSpan = createTag('span', { class: 'nav-item' });
      $newSpan.textContent = a.textContent;
      a.textContent = '';
      a.append($newSpan);
    });

    // Turn bolded links into a CTA.
    const $buttons = $list.querySelectorAll('strong');

    $buttons.forEach(($button) => {
      const $newButton = createTag('button', { class: 'button-red' });
      $newButton.textContent = $button.textContent;
      $button.replaceWith($newButton);
    });

    buildMobileMenu($container, $header);

    $block.textContent = '';
    $block.append($container);
  }
}
