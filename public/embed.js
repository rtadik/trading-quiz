/**
 * Trading Personality Quiz - WordPress Embed Script
 *
 * Usage:
 * <div id="trading-quiz"></div>
 * <script src="https://your-quiz-domain.com/embed.js"></script>
 *
 * Or with custom options:
 * <div id="trading-quiz" data-height="700" data-border-radius="12"></div>
 * <script src="https://your-quiz-domain.com/embed.js"></script>
 */
(function () {
  var container = document.getElementById('trading-quiz');
  if (!container) {
    console.error('Trading Quiz: Container #trading-quiz not found');
    return;
  }

  var scriptTag = document.currentScript || document.querySelector('script[src*="embed.js"]');
  var baseUrl = '';

  if (scriptTag && scriptTag.src) {
    var url = new URL(scriptTag.src);
    baseUrl = url.origin;
  }

  var height = container.getAttribute('data-height') || '700';
  var borderRadius = container.getAttribute('data-border-radius') || '12';

  var iframe = document.createElement('iframe');
  iframe.src = baseUrl + '/quiz';
  iframe.width = '100%';
  iframe.height = height + 'px';
  iframe.frameBorder = '0';
  iframe.style.border = 'none';
  iframe.style.borderRadius = borderRadius + 'px';
  iframe.style.maxWidth = '100%';
  iframe.style.overflow = 'hidden';
  iframe.setAttribute('allow', 'clipboard-write');
  iframe.setAttribute('title', 'Trading Personality Quiz');

  container.appendChild(iframe);

  // Auto-resize based on messages from quiz
  window.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'quiz-resize') {
      iframe.height = event.data.height + 'px';
    }
  });
})();
