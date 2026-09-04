/* Educate Ohio — Candidates roster: load JSON "database", render, filter, search */
(function () {
  'use strict';
  var grid = document.getElementById('cgrid');
  var select = document.getElementById('district');
  var search = document.getElementById('search');
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');
  if (!grid) return;

  var SRC = grid.getAttribute('data-src') || 'data/candidates.json';
  var NOUN = grid.getAttribute('data-noun') || 'champions';
  var all = [];

  function norm(s) { return (s || '').toLowerCase(); }

  function render(list) {
    grid.querySelectorAll('.card').forEach(function (c) {
      var show = list.indexOf(c) !== -1;
      c.classList.toggle('hide', !show);
    });
    var n = list.length;
    if (count) count.innerHTML = '<b>' + n + '</b> of ' + all.length + ' ' + NOUN;
    if (empty) empty.hidden = n !== 0;
  }

  function apply() {
    var dsel = select ? select.value : '';
    var q = search ? norm(search.value.trim()) : '';
    var visible = all.filter(function (o) {
      if (dsel && o.district !== dsel) return false;
      if (q && norm(o.name).indexOf(q) === -1 && norm(o.district).indexOf(q) === -1) return false;
      return true;
    }).map(function (o) { return o.el; });
    render(visible);
  }

  function buildCard(o) {
    var card = document.createElement('article');
    card.className = 'card';
    var ph = document.createElement('div');
    ph.className = 'ph';
    if (o.photo) {
      var img = document.createElement('img');
      img.src = o.photo;
      img.alt = o.name;
      img.loading = 'lazy';
      img.decoding = 'async';
      ph.appendChild(img);
    }
    var body = document.createElement('div');
    body.className = 'body';
    var name = document.createElement('h3');
    name.className = 'name';
    name.textContent = o.name;
    var dist = document.createElement('p');
    dist.className = 'dist';
    dist.textContent = o.district.replace(/ School District$/, '');
    body.appendChild(name);
    body.appendChild(dist);
    card.appendChild(ph);
    card.appendChild(body);
    return card;
  }

  fetch(SRC)
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      var frag = document.createDocumentFragment();
      all = data.map(function (o) {
        var el = buildCard(o);
        frag.appendChild(el);
        return { name: o.name, district: o.district, el: el };
      });
      grid.appendChild(frag);

      // populate district dropdown
      if (select) {
        var districts = data.map(function (o) { return o.district; })
          .filter(function (v, i, a) { return a.indexOf(v) === i; })
          .sort();
        districts.forEach(function (d) {
          var opt = document.createElement('option');
          opt.value = d;
          opt.textContent = d.replace(/ School District$/, '');
          select.appendChild(opt);
        });
        select.addEventListener('change', apply);
      }
      if (search) search.addEventListener('input', apply);
      apply();
    })
    .catch(function (err) {
      if (empty) {
        empty.hidden = false;
        empty.textContent = 'Could not load the champions list. If you are viewing this file directly, run it through a local server (see README).';
      }
      // eslint-disable-next-line no-console
      console.error('candidates load failed:', err);
    });
})();
