export function Footer() {
  return (
    <footer class="text-[13px] leading-[14px] text-center pt-12 pb-6">
      <span class="text-(--footer-muted)">Made by </span>
      <a class="text-(--footer-name) no-underline transition-colors duration-150 hover:text-(--footer-name-hover)" href="https://x.com/jakubantalik" target="_blank" rel="noopener noreferrer">
        Jakub Antalik
      </a>
      <span class="text-(--footer-muted)"> &amp; </span>
      <a class="text-(--footer-name) no-underline transition-colors duration-150 hover:text-(--footer-name-hover)" href="https://x.com/a_brinza" target="_blank" rel="noopener noreferrer">
        Alex Brinza
      </a>
      <br />
      <span class="text-(--footer-muted) inline-block mt-2">
        Ported to SolidJS by{' '}
        <a class="text-(--footer-name) no-underline transition-colors duration-150 hover:text-(--footer-name-hover)" href="https://x.com/MvkMvk216561" target="_blank" rel="noopener noreferrer">
          Mvk
        </a>
      </span>
    </footer>
  );
}
