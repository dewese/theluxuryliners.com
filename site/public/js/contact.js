// Contact form (audit-a11y round 1, B2; audit-qa round 1, S4). The form works without this script
// (the browser's own checks, then the Worker's page). With it:
//  - the topic is preselected from ?topic=
//  - the time the form was open is recorded (a simple bot check the Worker reads)
//  - on submit the rules stated on the page are checked (the same rules as src/lib/contact.ts,
//    read from the #contact-rules JSON block): an error summary that links to each field, aria-invalid,
//    each message tied to its field with aria-describedby, and nothing typed is lost
//  - with the Turnstile widget on the page, a send before its token arrives says the check is
//    still running
//  - a valid form is sent with fetch (Accept: application/json); the Worker's errors are shown
//    the same way, and a sent message goes to /contact/sent/
(function () {
  var form = document.querySelector('form[data-contact]');
  if (!form) return;
  var rules;
  try { rules = JSON.parse(document.getElementById('contact-rules').textContent); } catch (e) { return; }
  var L = rules.limits, M = rules.messages;
  var FIELDS = ['name', 'email', 'topic', 'message'];
  var EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
  var summary = form.querySelector('[data-contact-errors]');
  var button = form.querySelector('button[type="submit"]');
  var t0 = Date.now();
  form.noValidate = true; // this script shows the errors itself

  var topic = new URLSearchParams(location.search).get('topic');
  var select = form.querySelector('#topic');
  if (topic && select && select.querySelector('option[value="' + topic.replace(/[^a-z-]/g, '') + '"]')) select.value = topic;

  function val(id) { var el = form.querySelector('#' + id); return el ? String(el.value || '') : ''; }
  function clean(s) { return s.replace(/[\r\n\u0000-\u001f\u007f\u0085\u2028\u2029]+/g, ' ').trim(); }

  function validate() {
    var e = {};
    var name = clean(val('name'));
    if (!name) e.name = M.name;
    else if (name.length > L.nameMax) e.name = M.nameLong;
    else if (/[<>`]/.test(name)) e.name = M.nameChars;
    if (!EMAIL_RE.test(clean(val('email')))) e.email = M.email;
    if (!val('topic')) e.topic = M.topic;
    var msg = val('message').replace(/\r\n?/g, '\n').trim();
    if (msg.length < L.messageMin) e.message = M.messageShort;
    else if (msg.length > L.messageMax) e.message = M.messageLong;
    else if ((msg.match(/https?:\/\/|www\./gi) || []).length > L.maxLinks) e.message = M.messageLinks;
    return e;
  }

  function clear() {
    FIELDS.forEach(function (f) {
      var input = form.querySelector('#' + f), slot = form.querySelector('#' + f + '-error');
      if (input) input.removeAttribute('aria-invalid');
      if (slot) { slot.textContent = ''; slot.hidden = true; }
    });
    summary.hidden = true;
    summary.textContent = '';
  }

  function show(errors) {
    clear();
    var keys = Object.keys(errors);
    if (!keys.length) return;
    var h = document.createElement('h2');
    h.className = 'h3';
    h.textContent = 'Your message was not sent';
    var p = document.createElement('p');
    p.textContent = 'Please fix ' + (keys.length === 1 ? 'this' : 'these') + ' and send it again. Everything you typed is still here.';
    var ul = document.createElement('ul');
    keys.forEach(function (k) {
      var li = document.createElement('li');
      var input = form.querySelector('#' + k);
      if (FIELDS.indexOf(k) >= 0 && input) {
        var a = document.createElement('a');
        a.href = '#' + k;
        a.textContent = errors[k];
        a.addEventListener('click', function (ev) { ev.preventDefault(); input.focus(); });
        li.appendChild(a);
        input.setAttribute('aria-invalid', 'true');
        var slot = form.querySelector('#' + k + '-error');
        if (slot) { slot.textContent = errors[k]; slot.hidden = false; }
      } else li.textContent = errors[k];
      ul.appendChild(li);
    });
    summary.appendChild(h);
    summary.appendChild(p);
    summary.appendChild(ul);
    summary.hidden = false;
    summary.focus();
  }

  form.addEventListener('submit', function (ev) {
    form.querySelector('input[name="elapsed"]').value = String(Math.round((Date.now() - t0) / 1000));
    var errors = validate();
    if (Object.keys(errors).length) { ev.preventDefault(); show(errors); return; }
    // with the Turnstile widget on the page, wait for its token: a send before it arrives would
    // be refused with the "turn on JavaScript" message, though JavaScript is on (audit-a11y round 2, m4)
    if (form.querySelector('.cf-turnstile')) {
      var tok = form.querySelector('input[name="cf-turnstile-response"]');
      if (!tok || !tok.value) { ev.preventDefault(); show({ form: M.checking || M.unavailable }); return; }
    }
    if (!window.fetch || !window.URLSearchParams || !window.FormData) return; // a plain post
    ev.preventDefault();
    clear();
    button.disabled = true;
    fetch(form.action, {
      method: 'POST', credentials: 'same-origin',
      headers: { Accept: 'application/json' },
      body: new URLSearchParams(new FormData(form)),
    }).then(function (res) {
      return res.json().catch(function () { return { ok: false }; });
    }).then(function (out) {
      if (out && out.ok) { location.assign('/contact/sent/'); return; }
      button.disabled = false;
      if (window.turnstile && typeof window.turnstile.reset === 'function') try { window.turnstile.reset(); } catch (e) { /* the widget renews itself */ }
      show(out && out.errors && Object.keys(out.errors).length ? out.errors : { form: M.unavailable });
    }).catch(function () {
      button.disabled = false;
      show({ form: M.unavailable });
    });
  });
})();
