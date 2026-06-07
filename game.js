
let idx=0,score=0,attempt=0,timer=null,time=10,selected=[],used=[];
const $=id=>document.getElementById(id);
function shuf(a){return [...a].sort(()=>Math.random()-.5)}
function sample(n=12){return shuf(VERBS).slice(0,n)}
let qs=[];
function start(mode){qs=makeQs(mode);idx=0;score=0;render()}
function tick(){time-=.1;$('fill').style.width=Math.max(0,time*10)+'%';if(time<=0){clearInterval(timer);reveal()}}
function beginTimer(t=10){clearInterval(timer);time=t;$('fill').style.width='100%';timer=setInterval(tick,100)}
function render(){clearInterval(timer);attempt=0;selected=[];used=[];$('score').textContent=score;$('qnum').textContent=idx+1;$('total').textContent=qs.length;$('fb').textContent='';$('fb').className='feedback';$('next').disabled=true;$('choices').innerHTML='';$('build').style.display='none';let q=qs[idx];$('inst').textContent=q.inst;$('q').innerHTML=q.q;if(q.type==='build'){renderBuild(q);beginTimer(18)}else{renderChoices(q);beginTimer(q.time||10)}}
function renderChoices(q){$('choices').style.display='grid';q.opts.forEach(o=>{let b=document.createElement('button');b.className='choice';b.textContent=o;b.onclick=()=>choose(b,o,q.ans);$('choices').appendChild(b)})}
function choose(b,o,ans){if(o===ans){clearInterval(timer);b.classList.add('correct');score++;finishGood()}else{attempt++;b.classList.add('wrong');b.disabled=true;if(attempt>=2)reveal();else bad('Try again! Clue: '+ans[0].toUpperCase()+' ...')}}
function finishGood(){$('score').textContent=score;$('fb').textContent='Correct! Click Next.';$('fb').className='feedback good';$('next').disabled=false;document.querySelectorAll('.choice,.letter').forEach(x=>x.disabled=true)}
function reveal(){let q=qs[idx];$('fb').textContent='Answer: '+q.ans+'. Click Next.';$('fb').className='feedback good';$('next').disabled=false;document.querySelectorAll('.choice,.letter').forEach(x=>x.disabled=true);document.querySelectorAll('.choice').forEach(x=>{if(x.textContent===q.ans)x.classList.add('correct')})}
function bad(t){$('fb').textContent=t;$('fb').className='feedback bad'}
function nextQ(){idx++; if(idx<qs.length)render(); else end()}
function end(){clearInterval(timer);$('inst').textContent='Quest complete';$('q').innerHTML='<div class=finish>You scored '+score+' / '+qs.length+'. Replay to beat your score!</div>';$('choices').innerHTML='';$('build').style.display='none';$('next').disabled=true;$('fb').textContent=''}
function back(){location.href='index.html'}
function makeQs(mode){
 let a=sample(12), out=[];
 for(const v of a){
  let [base,past,part]=v, opts;
  if(mode==='nibble'){opts=shuf([base,past,part,base+'ing']);out.push({type:'choice',inst:'Nibble Monster wants the SIMPLE PAST form.',q:base+' → ?',ans:past,opts,time:8})}
  if(mode==='fly'){opts=shuf([past,part,base,base+'s']);out.push({type:'choice',inst:'Swat the SIMPLE PAST bug.',q:'BASE VERB: '+base,ans:past,opts,time:7})}
  if(mode==='pit'){opts=shuf([part,past,base,base+'ing']);out.push({type:'choice',inst:'Choose the PAST PARTICIPLE to cross the pit.',q:base+' → '+past+' → ?',ans:part,opts,time:9})}
  if(mode==='boss'){let choose=Math.random()<.5?'past':'part';opts=choose==='past'?shuf([past,part,base,base+'ing']):shuf([part,past,base,base+'ing']);out.push({type:'choice',inst:choose==='past'?'Boss asks for SIMPLE PAST.':'Boss asks for PRESENT PERFECT form.',q:choose==='past'?base+' → ?':'I have ___ ('+base+')',ans:choose==='past'?past:part,opts,time:8})}
 }
 return out
}
function makeBuildQs(){return sample(10).map(v=>({type:'build',inst:'Click letters to build the past participle. Use Undo if needed.',q:v[0]+' → '+v[1]+' → ?',ans:v[2].replace('/',''),letters:shuf(v[2].replace('/','').toUpperCase().split(''))}))}
function startBuild(){qs=makeBuildQs();idx=0;score=0;render()}
function renderBuild(q){$('choices').style.display='none';$('build').style.display='block';$('slots').innerHTML='';$('letters').innerHTML='';for(let i=0;i<q.ans.length;i++){let s=document.createElement('div');s.className='slot';s.textContent=(selected[i]||'');$('slots').appendChild(s)}q.letters.forEach((l,i)=>{let b=document.createElement('button');b.className='letter';b.textContent=l;b.disabled=used.includes(i);b.onclick=()=>{selected.push(l);used.push(i);renderBuild(q)};$('letters').appendChild(b)})}
function undo(){selected.pop();used.pop();renderBuild(qs[idx])}
function clearLetters(){selected=[];used=[];renderBuild(qs[idx])}
function checkBuild(){let q=qs[idx], ans=selected.join('').toLowerCase(); if(ans===q.ans.toLowerCase()){clearInterval(timer);score++;finishGood()}else{attempt++;if(attempt>=2){selected=q.ans.toUpperCase().split('');renderBuild(q);reveal()}else bad('Try again! First letter: '+q.ans[0].toUpperCase())}}
