// Client-side form handling: validation, loading state, POST to backend
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
      return;
    }
    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/send-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, date, time, message })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showMessage('Appointment request sent. We will contact you soon.', 'success');
        form.reset();
      } else {
        showMessage(data.message || 'Failed to send appointment. Please try again.', 'error');
      }
    } catch (err) {
      showMessage('Network error. Please try again later.', 'error');
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
