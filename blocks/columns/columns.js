export default function decorate(block) {
  console.log(block)
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
}
