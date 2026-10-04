const CALL_LABEL = 'AW-18274939012/ed65CPLF8pAdEIThlYpE';

export function trackConversion(label) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', { send_to: label });
  }
}

export function initConversionTracking() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="tel:"]');
    if (link) trackConversion(CALL_LABEL);
  });
}