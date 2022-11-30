export default function decorate($block) {
  const $tabs = $block.querySelectorAll('li');
  const $cards = document.querySelectorAll('.cards-container');
  const $cardsMinusFirst = [...$cards].splice(1); // ------> Better way to do this??/Is 'View all' an actual section or just unhide all

  $cardsMinusFirst.forEach((card) => {
    card.classList.add('hidden');
  });

  $tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const $searchTerm = tab.textContent.toLowerCase();
      $cards.forEach((card) => {
        if (card.getAttribute('data-tab').toLowerCase() === $searchTerm) {
          card.classList.remove('hidden');
        }
        else {
          card.classList.add('hidden');
        }
      });
    });
  });
}
