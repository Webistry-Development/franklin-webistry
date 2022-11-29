import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const $pageType = row.querySelector('p:nth-of-type(1)')
    const $buttonText = row.querySelector('p:nth-of-type(3)')

    const $tag = document.createElement('span')
    $tag.innerText = $pageType.innerText
    $tag.classList.add('tag', 'tag--landing-page')
    $pageType.replaceWith($tag)
    
    const $button = document.createElement('button')
    $button.innerText = $buttonText.innerText
    $button.classList.add('button')
    $buttonText.replaceWith($button)

    const li = document.createElement('li'); 
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => { //Giving image sectiion and body respectiv classes
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });

    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '470' }])));
  block.textContent = '';
  block.append(ul);
}