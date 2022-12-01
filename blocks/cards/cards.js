import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function getLinkedPage(row) {
  const $link = row.querySelector('a');
  return $link.attributes.href.textContent;
}

export default function decorate($block) {
  const $cardsContainer = document.createElement('div');
  [...$block.children].forEach((row) => {
    const $card = document.createElement('div');
    $card.classList.add('portfolio-card');
    $card.innerHTML = row.innerHTML;
    [...$card.children].forEach((column) => {
      if (column.querySelector('picture')) {
        const $photo = column.querySelector('picture');
        $photo.classList.add('portfolio-card__image');
        const $aTag = document.createElement('a');
        $aTag.href = getLinkedPage(column.parentElement);
        $aTag.append($photo);
        column.replaceWith($aTag);
      } else {
        column.className = 'cards-card-body';
        const $button = column.querySelector('.button');
        $button.parentElement.replaceWith($button);
      }

      const $tags = column.querySelectorAll('h4');
      const $divTags = document.createElement('div');
      $divTags.classList.add('portfolio-card__tag-wrapper');
      column.prepend($divTags);

      $tags.forEach((tag) => {
        const $newTag = document.createElement('span');
        $newTag.textContent = tag.textContent;
        $divTags.appendChild($newTag);
        tag.remove();
      });
    });
    $cardsContainer.append($card);
  });
  $cardsContainer.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  $block.textContent = '';
  $block.append($cardsContainer);
  $cardsContainer.classList.add('portfolio-cards');
}


