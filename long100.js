'use strict';
(() => {
  const el=id=>document.getElementById(id),checks=['I answered every requested part and used the course terminology.','I explained how it works, including relevant roles and decisions.','I applied a specific, consistent project example.','I evaluated limitations, consequences or trade-offs as requested.','I reached a supported judgement and checked clarity.'];
  let bank=[],filtered=[],selected=null,randomPool=[];
  state.longAnswers=state.longAnswers||{};
  const mark=(kind,id)=>'long100-'+kind+'-'+id;
  function progress(){const n=bank.filter(q=>state.marks[mark('reviewed',q.id)]).length;el('bankProgress').value=n;el('bankProgressText').textContent=`${n} of 100 questions marked reviewed (${n}%). Self-recorded practice, not an exam-readiness score.`;}
  function pick(id){selected=bank.find(q=>q.id===Number(id))||null;el('bankWorkspace').hidden=!selected;el('bankDownload').disabled=!bank.length;
    if(!selected){el('bankQuestion').textContent='No matching questions. Change the search or filter.';el('bankPick').replaceChildren();return;}
    const q=selected;el('bankPick').value=String(q.id);el('bankQuestion').innerHTML='<p class="eyebrow">'+esc(q.topic)+' · 20 marks</p><h3>Question '+q.id+'</h3><p>'+esc(q.question)+'</p>';
    el('bankHints').innerHTML=q.hints.map(x=>'<li>'+esc(x)+'</li>').join('');el('bankNotes').value=state.longAnswers['long100-'+q.id]||'';el('bankSaveStatus').textContent='Notes save on this browser. Download a backup for safekeeping.';
    el('bankBookmark').checked=!!state.marks[mark('bookmark',q.id)];el('bankReviewed').checked=!!state.marks[mark('reviewed',q.id)];el('bankChecks').replaceChildren();
    checks.forEach((text,i)=>{const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=!!state.marks[mark('check'+i,q.id)];input.onchange=()=>{state.marks[mark('check'+i,q.id)]=input.checked;save();};label.append(input,document.createTextNode(text));el('bankChecks').append(label);});
    const at=filtered.findIndex(x=>x.id===q.id);el('bankPrev').disabled=at<=0;el('bankNext').disabled=at<0||at===filtered.length-1;
  }
  function filter(keep=true){const text=el('bankSearch').value.trim().toLocaleLowerCase(),topic=el('bankTopic').value,mode=el('bankFilter').value;
    filtered=bank.filter(q=>(topic==='all'||q.topic===topic)&&(!text||( /^\d+$/.test(text)?q.id===Number(text):(q.question+' '+q.topic).toLocaleLowerCase().includes(text)))&&(mode==='all'||(mode==='unreviewed'?!state.marks[mark('reviewed',q.id)]:state.marks[mark('bookmark',q.id)])));
    el('bankMatches').textContent=`${filtered.length} matching question${filtered.length===1?'':'s'}.`;el('bankPick').innerHTML=filtered.map(q=>'<option value="'+q.id+'">Q'+q.id+' · '+esc(q.question.slice(0,100))+(q.question.length>100?'…':'')+'</option>').join('');el('bankPick').disabled=!filtered.length;el('bankRandom').disabled=!filtered.length;el('bankPrev').disabled=el('bankNext').disabled=!filtered.length;randomPool=[];
    const id=keep&&selected&&filtered.some(q=>q.id===selected.id)?selected.id:filtered[0]?.id;pick(id);progress();
  }
  el('bankTopic').onchange=()=>filter(false);el('bankSearch').oninput=()=>filter(false);el('bankFilter').onchange=()=>filter(false);el('bankPick').onchange=e=>pick(e.target.value);
  el('bankPrev').onclick=()=>{const at=filtered.findIndex(q=>q.id===selected?.id);if(at>0)pick(filtered[at-1].id);};el('bankNext').onclick=()=>{const at=filtered.findIndex(q=>q.id===selected?.id);if(at>=0&&at<filtered.length-1)pick(filtered[at+1].id);};
  el('bankRandom').onclick=()=>{if(!filtered.length)return;if(!randomPool.length)randomPool=shuffle(filtered.map(q=>q.id).filter(id=>filtered.length===1||id!==selected?.id));pick(randomPool.pop());};
  el('bankNotes').oninput=e=>{if(!selected)return;state.longAnswers['long100-'+selected.id]=e.target.value;save();el('bankSaveStatus').textContent=el('saveState').textContent;};
  el('bankBookmark').onchange=e=>{if(!selected)return;state.marks[mark('bookmark',selected.id)]=e.target.checked;save();if(el('bankFilter').value==='bookmarked')filter();};
  el('bankReviewed').onchange=e=>{if(!selected)return;state.marks[mark('reviewed',selected.id)]=e.target.checked;save();progress();if(el('bankFilter').value==='unreviewed')filter();};
  el('bankDownload').onclick=()=>{const rows=bank.filter(q=>state.longAnswers['long100-'+q.id]||state.marks[mark('reviewed',q.id)]||state.marks[mark('bookmark',q.id)]);download('BM522_my_long_answer_plans.txt',rows.length?rows.map(q=>`Question ${q.id} · ${q.topic}\n${q.question}\n\nMy answer plan:\n${state.longAnswers['long100-'+q.id]||'(No answer plan saved)'}\n\nReviewed: ${state.marks[mark('reviewed',q.id)]?'Yes':'No'}\nSaved for revision: ${state.marks[mark('bookmark',q.id)]?'Yes':'No'}\n\nSelf-check:\n${checks.map((c,i)=>`[${state.marks[mark('check'+i,q.id)]?'x':' '}] ${c}`).join('\n')}`).join('\n\n---\n\n'):'No answer plans saved yet. Open a question and write your plan first.');};
  fetch('./long100.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{bank=data;const topics=[...new Set(bank.map(q=>q.topic))];topics.forEach(topic=>{const o=document.createElement('option');o.value=o.textContent=topic;el('bankTopic').append(o);});filter(false);}).catch(()=>{el('bankMatches').textContent='The 100-question bank could not load. Reconnect and reload to finish downloading it.';el('bankDownload').disabled=true;});
})();

