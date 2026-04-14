// Client-side form handling: validation, loading state, local confirmation popup (no backend)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('appointment-form');
  const btn = document.getElementById('submit-btn');
  const msg = document.getElementById('form-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !phone || !date || !time) {
      showMessage('Please fill in all required fields.', 'error');
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);
    try {
      // No backend call: show a local confirmation popup/toast
      await new Promise((r) => setTimeout(r, 600));
      const confirmation = 'Appointment request received. We will contact you soon.';
      showMessage(confirmation, 'success');
      showToast(confirmation, 'success');
      form.reset();
    } catch (err) {
      showMessage('An error occurred. Please try again.', 'error');
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  });

  function validateEmail(v) {
    return /^\S+@\S+\.\S+$/.test(v);
  }
  function showMessage(text, type = 'success') {
    msg.textContent = text;
    msg.className = 'form-message ' + (type === 'error' ? 'error' : 'success');
  }
  function clearMessage() {
    msg.textContent = '';
    msg.className = 'form-message';
  }
  function setLoading(loading) {
    btn.disabled = loading;
    btn.textContent = loading ? 'Sending...' : 'Request Appointment';
  }
  function showToast(text, type = 'success') {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.className = 'toast ' + (type === 'error' ? 'error' : 'success') + ' show';
    clearTimeout(toast._hideTimeout);
    toast._hideTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
  // Convert decorative inline SVG to a JPEG data URL and replace it with an <img>
  (function convertSvgToJpeg(){
    try {
      const svgEl = document.querySelector('.hero-image svg');
      if (!svgEl) return;
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgEl);
      if (!/xmlns="http:\/\/www.w3.org\/2000\/svg"/.test(svgString)) {
        svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      const width = parseInt(svgEl.getAttribute('width')) || (svgEl.viewBox && svgEl.viewBox.baseVal && svgEl.viewBox.baseVal.width) || 260;
      const height = parseInt(svgEl.getAttribute('height')) || (svgEl.viewBox && svgEl.viewBox.baseVal && svgEl.viewBox.baseVal.height) || 160;
      const imgSrc = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
      const img = new Image();
      img.onload = function(){
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        // Ensure a non-transparent background before exporting to JPEG
        ctx.fillStyle = getComputedStyle(document.body).backgroundColor || '#ffffff';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        const imgEl = document.createElement('img');
        imgEl.src = jpegDataUrl;
        imgEl.alt = 'Illustration';
        imgEl.width = canvas.width;
        imgEl.height = canvas.height;
        svgEl.parentNode.replaceChild(imgEl, svgEl);
      };
      img.onerror = function(e){ console.error('Failed to convert SVG to JPEG', e); };
      img.src = imgSrc;
    } catch (err) {
      console.error('SVG->JPEG convert error', err);
    }
  })();
});
