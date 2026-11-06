// Contact form: records how long the form was open (a simple bot check the Worker reads) and
// preselects the topic from ?topic=. The form works without this script.
(function () {
  var form = document.querySelector('form[data-contact]');
  if (!form) return;
  var t0 = Date.now();
  var topic = new URLSearchParams(location.search).get('topic');
  var select = form.querySelector('#topic');
  if (topic && select && select.querySelector('option[value="' + topic.replace(/[^a-z-]/g, '') + '"]')) select.value = topic;
  form.addEventListener('submit', function () {
    form.querySelector('input[name="elapsed"]').value = String(Math.round((Date.now() - t0) / 1000));
  });
})();
