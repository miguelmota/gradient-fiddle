var bar_rgb = document.querySelector('.bar-rgb');
var bar_r = document.querySelector('.bar-r');
var bar_g = document.querySelector('.bar-g');
var bar_b = document.querySelector('.bar-b');
var range_step = document.querySelector('.range-step');
var step_output = document.querySelector('.output-step');
var button_run = document.querySelector('.button-run');
var editor = ace.edit('editor');

var steps = 25;
var width = bar_rgb.offsetWidth;

function createSlice(r, g, b) {
    var el = document.createElement('div');
    var rgb_string = 'rgb(' + (r >> 0) + ',' + (g >> 0) + ',' + (b >> 0) + ')';
    el.style.display = 'inline-block';
    el.style.width = (width / steps) + 'px';
    el.style.height = 20 + 'px';
    el.style.background = rgb_string;
    el.title = rgb_string;
    return el;
}

function fnBody(fn) {
  return (fn||'').toString()
    .replace(/^[^{]*{\s*/,'')
    .replace(/\s*}[^}]*$/,'');
}

function generate(colors) {
  bar_r.innerHTML = '';
  bar_g.innerHTML = '';
  bar_b.innerHTML = '';
  bar_rgb.innerHTML = '';

  for (var i = 0; i < colors.length; i++) {
    var r = colors[i][0];
    var g = colors[i][1];
    var b = colors[i][2];

    bar_r.appendChild(createSlice(r, r, r));
    bar_g.appendChild(createSlice(g, g, g));
    bar_b.appendChild(createSlice(b, b, b));
    bar_rgb.appendChild(createSlice(r, g, b));
  }
}

function update(event) {
    steps = range_step.value;
    step_output.textContent = 'var steps = ' + steps + ';';
    var code = editor.getSession().getValue();
    var colors = [];
    try {
      colors = Function('steps', 'var colors = []; ' + code + '; return colors;')(steps);
      generate(colors);
    } catch(e) {

    }
}

var examples = {
  rainbow: function() {
var frequency = (Math.PI * 2) / steps;
var amplitude = 127;
var center = 128;
var slice = (Math.PI * 2) / 3;

for (var i = 0; i < steps; i++) {
  var r = Math.sin((frequency * i)) * amplitude + center;
  var g = Math.sin((frequency * i) + slice) * amplitude + center;
  var b = Math.sin((frequency * i) + (slice * 2)) * amplitude + center;

  colors.push([r, g, b]);
}
},
  grayscale: function() {
var frequency = Math.PI / steps;
var amplitude = 127;
var center = 128;
var slice = Math.PI * 2 / 4;

for (var i = 0; i < steps; i++) {
  var v = Math.sin((frequency * i) + slice) * amplitude + center;

  colors.push([v, v, v]);
}
},
pastel: function() {
var frequency = (Math.PI * 2) / steps;
var amplitude = 50;
var center = 200;
var slice = (Math.PI * 2) / 3;

for (var i = 0; i < steps; i++) {
  var r = Math.sin((frequency * i)) * amplitude + center;
  var g = Math.sin((frequency * i) + slice) * amplitude + center;
  var b = Math.sin((frequency * i) + (slice * 2)) * amplitude + center;

  colors.push([r, g, b]);
}
},
black2blue: function() {
var frequency = Math.PI / steps;
var amplitude = 127;
var center = 128;
var slice = (Math.PI * 2) / 3;

for (var i = 0; i < steps; i++) {
  var r = 0;
  var g = 0;
  var b = Math.sin((frequency * i) + (slice * 2)) * amplitude + center;

  colors.push([r, g, b]);
}
},
white2blue: function() {
var frequency = Math.PI / steps;
var amplitude = 127;
var center = 128;
var slice = Math.PI / 2;

for (var i = 0; i < steps; i++) {
  var r = Math.sin((frequency * i) + slice) * amplitude + center;
  var g = Math.sin((frequency * i) + slice) * amplitude + center;
  var b = 255;

  colors.push([r, g, b]);
}
}
};

function loadExample(example) {
  editor.setValue(fnBody(examples[example]), -1);
}

loadExample('rainbow');

[].slice.call(document.querySelectorAll('.example-link')).forEach(function(example_link) {
  example_link.addEventListener('click', function(event) {
    event.preventDefault();
    loadExample(example_link.dataset.example);
  });
});

editor.setTheme('ace/theme/chrome');
editor.getSession().setMode('ace/mode/javascript');
range_step.addEventListener('input', update, false);
button_run.addEventListener('click', update, false);
editor.on('input', update);

window.addEventListener('resize', function() {
  width = bar_rgb.offsetWidth;
  update();
});

update();
