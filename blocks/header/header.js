import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { createTag } from '../../scripts/scripts.js';

// When you click on the hamburger give a new class to the ul that has column layout

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
    $list.classList.add('nav-list')
    const $nav = createTag('nav');
    $list.parentElement.replaceWith($nav);
    $nav.append($list);

    // Wrap inner text of a tags with a span
    const $aTags = $container.querySelectorAll('nav > ul > li > a');
    $aTags.forEach((a) => {
      const $newSpan = createTag('span', { class: 'nav' });
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

    // hamburger for mobile
    const $hamburger = createTag('div', { class: 'nav-hamburger', aria_expanded: 'false' });
    Array.from(Array(3)).forEach(() => {
      $hamburger.append(createTag('span', { class: 'bar' }));
    });
    $container.append($hamburger);
    console.log($container.cloneNode(true));

    $hamburger.addEventListener('click', () => {
      console.log($hamburger.getAttribute('aria_expanded'))
      if ($hamburger.getAttribute('aria_expanded') === 'false') {
        $hamburger.setAttribute('aria_expanded', 'true');
        $header.classList.add('mobile-active')
      } else {
        $hamburger.setAttribute('aria_expanded', 'false');
        $header.classList.remove('mobile-active')
      }
    });

    $block.textContent = '';
    $block.append($container);
  }
}
