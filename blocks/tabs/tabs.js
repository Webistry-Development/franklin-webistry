function getSection(name) {
  const $sections = Array.from(document.querySelectorAll('.section[data-tab]'));
  return $sections.find(($section) => $section.getAttribute('data-tab').toLowerCase() === name) ?? null;
}

export default function decorate($block) {
  const $tabs = $block.querySelectorAll('li');
  const $sections = document.querySelectorAll('.section[data-tab]');
  const $firstSection = getSection($sections[0].textContent.trim().toLowerCase());

  $firstSection.classList.add('active');

  $tabs.forEach((tab) => {
    const $section = getSection(tab.textContent.trim().toLowerCase());
    tab.addEventListener('click', () => {
      $sections.forEach((section) => {
        if (section.classList.contains('active')) {
          section.classList.remove('active');
        }
      });
      $section.classList.add('active');
    });
  });
}
