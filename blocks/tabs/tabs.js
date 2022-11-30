function getSection(name) {
  const $sections = Array.from(document.querySelectorAll('.section[data-tab]'));
  return $sections.find(($section) => $section.dataset.tab === name) ?? null;
}

export default function decorate($block) {
  const $tabs = $block.querySelectorAll('li');
  const $cards = document.querySelectorAll('section[data-tab]');
  const $firstTab = getSection($tabs[0].textContent.trim().toLowerCase());

  if ($firstTab) {
    $firstTab.classList.add('active');
  }

  $tabs.forEach((tab) => {
    const $section = getSection(tab.textContent.trim().toLowerCase());
    tab.addEventListener('click', () => {
      // Find currently active section
      // Remove active class from it
      // Find the clicked section
      // Add the active class to it
      $section.classList.add('active');
      const $searchTerm = tab.textContent.toLowerCase();
      $cards.forEach((card) => {
        if (card.getAttribute('data-tab').toLowerCase() === $searchTerm) {
          card.classList.remove('hidden');
        }
      });
    });
  });
}
