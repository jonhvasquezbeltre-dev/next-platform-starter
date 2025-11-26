const rounds = [
  {word: "MOTRICIDAD", forbidden: ["CUERPO","MOVIMIENTO","COORDINACIÓN"], text:"La motricidad integra control y movimiento."},
  {word: "FOTOSÍNTESIS", forbidden: ["PLANTA","LUZ","CLOROFILA"], text:"Proceso donde las plantas convierten luz en energía."},
  {word: "JÚPITER", forbidden: ["PLANETA","GIGANTE","SATÉLITE"], text:"Planeta gigante del sistema solar."},
  {word: "MONA LISA", forbidden: ["PINTOR","DA VINCI","LOUVRE"], text:"Famosa pintura ubicada en el Louvre."},
  {word: "ATMÓSFERA", forbidden: ["AIRE","CIELO","OXÍGENO"], text:"Capa de gases que rodea la Tierra."}
];

let idx = 0;
let score = 0;
let timer = null;
let secondsLeft = 0;
let showForbidden = true;

const wordEl = document.getElementById('word');
const fragmentText = document.getElementById('fragmentText');
const forbiddenList = document.getElementById('forbiddenList');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const offlineCard = document.getElementById('offlineCard');

function loadRound(i){
  const r = rounds[i];
  wordEl.textContent = r.word;
  fragmentText.textContent = r.text;
  forbiddenList.innerHTML = '';
  r.forbidden.forEach(w => {
    const span = document.createElement('span');
    span.textContent = w;
    span.style.padding = '6px 8px';
    span.style.background = '#1a1a1d';
    span.style.borderRadius = '6px';
    forbiddenList.appendChild(span);
  });
}

function startTimer(s=30){
  clearInterval(timer);
  secondsLeft = s;
  timerEl.textContent = secondsLeft + 's';
  timer = setInterval(()=>{
    secondsLeft--;
    timerEl.textContent = secondsLeft + 's';
    if(secondsLeft<=0){
      clearInterval(timer);
      alert('Tiempo agotado. La palabra era: ' + rounds[idx].word);
      nextRound();
    }
  },1000);
}

function stopTimer(){ clearInterval(timer); timer=null; timerEl.textContent='0s'; }

function correct(){ score+=1; scoreEl.textContent = score; stopTimer(); alert('Correcto! +1 punto'); nextRound(); }
function passRound(){ stopTimer(); alert('Pasaste.'); nextRound(); }
function nextRound(){ idx = (idx+1)%rounds.length; loadRound(idx); stopTimer(); }

document.getElementById('startBtn').addEventListener('click', ()=>startTimer(30));
document.getElementById('showForbiddenBtn').addEventListener('click', ()=>{
  showForbidden = !showForbidden;
  document.getElementById('forbiddenArea').style.display = showForbidden ? 'block' : 'none';
});
document.getElementById('hintBtn').addEventListener('click', ()=>{
  const hint = generateHint(rounds[idx].word);
  alert('Pista: ' + hint);
});
document.getElementById('correctBtn').addEventListener('click', correct);
document.getElementById('passBtn').addEventListener('click', passRound);
document.getElementById('nextBtn').addEventListener('click', nextRound);

function generateHint(word){
  const w = word.toLowerCase();
  if(w.includes('motr')) return 'Relacionado con movimiento y control';
  if(w.includes('foto')) return 'Plantas y luz';
  if(w.includes('júp')) return 'Gigante gaseoso';
  if(w.includes('mona')) return 'Pintura famosa';
  if(w.includes('atm')) return 'Capa de gases';
  return 'Relacionado con el tema';
}

window.addEventListener('load', ()=>{
  loadRound(0);
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
      .then(()=>{ console.log('SW registrado'); offlineCard.style.display='block'; })
      .catch(()=>console.log('SW fallo'));
  }
});
