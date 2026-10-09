export function scrollToElement(element) {
  if (!element) return;

  const header = document.querySelector('header');
  const headerOffset = header ? header.getBoundingClientRect().height : 0;
  const top = element.getBoundingClientRect().top + window.scrollY - headerOffset - 8;

  window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'auto' });
}
