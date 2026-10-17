/* DE MATHS SQUADRON DASHBOARD 2.0 */

dashboard = function(){

const s = store();
const scores = s.scores || {};
const exams = s.exams || [];

$('learner').value = s.name || '';
$('level').value = s.level || '';

const total = DATA.reduce(
(n,sub)=>n+sub.lessons.length,0
);

const completed = Object.keys(scores).filter(
key=>DATA.some((sub,i)=>
sub.lessons.some((l,j)=>key===i+'-'+j)
)
).length;

const percent = Math.round(completed/total*100);

$('progressList').innerHTML = `
<h3>📊 Learning Overview</h3>

<div class="example">
<h2>${percent}% Complete</h2>
<p>${completed} of ${total} lessons practised</p>

<div class="bar">
<span style="width:${percent}%"></span>
</div>
</div>

<h3>📚 Subject Progress</h3>
`;

DATA.forEach((sub,i)=>{

let done = sub.lessons.filter(
(l,j)=>scores[i+'-'+j]!==undefined
).length;

let p = Math.round(done/sub.lessons.length*100);

const card = document.createElement('div');
card.className = 'card';

const heading = document.createElement('h3');
heading.textContent = sub.icon+' '+sub.name;

const info = document.createElement('p');
info.textContent = done+' of '+sub.lessons.length+
' lessons practised ('+p+'%)';

const bar = document.createElement('div');
bar.className = 'bar';

const fill = document.createElement('span');
fill.style.width = p+'%';
bar.append(fill);

const action = document.createElement('button');
action.textContent = 'Continue Learning →';
action.style.marginTop = '14px';
action.onclick = ()=>openSubject(i);

card.append(heading,info,bar,action);
$('progressList').append(card);

});

$('examHistory').replaceChildren();

const title = document.createElement('h3');
title.textContent = '🏆 Recent CBT Results';
$('examHistory').append(title);
const percentages = exams.map(e =>
  Math.round((Number(e.score) || 0) /
  Math.max(Number(e.total) || 12, 1) * 100)
);

const average = percentages.length
  ? Math.round(percentages.reduce((a,b) => a+b, 0) / percentages.length)
  : 0;

const best = percentages.length ? Math.max(...percentages) : 0;

const report = document.createElement('div');
report.className = 'example';
report.innerHTML = `
  <h3>📊 Performance Report</h3>
  <p>Exams taken: ${exams.length}</p>
  <p>Average score: ${average}%</p>
  <p>Best score: ${best}%</p>
`;
$('examHistory').append(report);
const history = document.createElement('div');
history.className = 'example';
history.innerHTML = '<h3>📈 Performance History</h3>';

percentages.forEach((pct, i) => {
  let change = 'First attempt';

  if (i > 0) {
    const diff = pct - percentages[i - 1];
    change = diff > 0
      ? '+' + diff + ' percentage points'
      : diff < 0
        ? diff + ' percentage points'
        : 'No change';
  }

  const row = document.createElement('p');
  row.textContent = 'Attempt ' + (i + 1) +
    ': ' + pct + '% — ' + change;

  history.appendChild(row);
});

$('examHistory').append(history);
if(!exams.length){
const empty = document.createElement('p');
empty.className = 'muted';
empty.textContent = 'No examination attempts yet.';
$('examHistory').append(empty);
}

exams.slice(0,5).forEach(e=>{

const row = document.createElement('p');
row.className = 'example';

row.textContent =
e.label+' — '+e.score+'/'+(e.total||12)+
' ('+e.date+')';

$('examHistory').append(row);

});

show('dashboard');

};
