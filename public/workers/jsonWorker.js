/**
 * Web Worker for heavy JSON processing (Formatting, Minifying, Validating)
 * Offloads CPU-intensive parsing of large JSON payloads (>10MB) from the main UI thread.
 */

self.onmessage = function(e) {
  const { action, payload, tabSize = 2 } = e.data;

  try {
    if (action === 'format') {
      const parsed = JSON.parse(payload);
      const formatted = JSON.stringify(parsed, null, Number(tabSize));
      self.postMessage({ success: true, result: formatted });
    } 
    else if (action === 'minify') {
      const parsed = JSON.parse(payload);
      const minified = JSON.stringify(parsed);
      self.postMessage({ success: true, result: minified });
    } 
    else if (action === 'validate') {
      JSON.parse(payload); // Will throw if invalid
      self.postMessage({ success: true, result: 'Valid JSON' });
    }
  } catch (err) {
    self.postMessage({ success: false, error: err.message });
  }
};
