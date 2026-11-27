'use strict';
// Keep reading inside the app, including an installed iPhone web app.
(() => {
 const documents = new Set(['BM522_Mock_Exam.pdf','BM522_Mock_Answers.pdf','BM522_12_Questions_With_Clues.pdf','BM522_100_Practice_Questions.pdf']);
 const dialog = document.createElement('dialog');
 dialog.id = 'pdfReader';
 dialog.setAttribute('aria-labelledby','pdfReaderTitle');
 dialog.innerHTML = `<div class="pdf-reader-shell">
  <header class="pdf-reader-header"><button type="button" id="pdfReaderBack">← Back to IT Lab 1</button><h2 id="pdfReaderTitle">PDF reader</h2><button type="button" id="pdfReaderSave" disabled>Save PDF copy</button></header>
  <nav class="pdf-reader-controls" aria-label="PDF page controls"><button type="button" id="pdfReaderPrev" disabled>← Previous page</button><span id="pdfReaderCount" role="status">Loading…</span><button type="button" id="pdfReaderNext" disabled>Next page →</button><button type="button" id="pdfReaderSmaller" disabled aria-label="Zoom out">A−</button><button type="button" id="pdfReaderLarger" disabled aria-label="Zoom in">A+</button></nav>
  <p id="pdfReaderStatus" role="status" aria-live="polite"></p><div id="pdfReaderContent" tabindex="0" aria-label="Scrollable PDF page"><canvas id="pdfReaderCanvas" aria-hidden="true"></canvas><div id="pdfReaderText" class="pdf-sr-only"></div></div>
  <p class="pdf-reader-note">Your place in the app is kept. To tick or edit PDF form fields, save a copy and open it in a compatible PDF reader.</p></div>`;
 document.body.append(dialog);
 const el = id => dialog.querySelector('#'+id);
 let library, task, pdf, rendering, bytes, filename, pageNumber=1, zoom=1, revision=0, returnFocus, returnY=0, opening=false, resizeTimer;
 function controls(busy=false) {
  el('pdfReaderPrev').disabled=!pdf||busy||pageNumber<=1;
  el('pdfReaderNext').disabled=!pdf||busy||pageNumber>=pdf.numPages;
  el('pdfReaderSmaller').disabled=!pdf||busy||zoom<=0.8;
  el('pdfReaderLarger').disabled=!pdf||busy||zoom>=2.4;
  el('pdfReaderSave').disabled=!bytes;
 }
 async function renderPage() {
  if(!pdf||!dialog.open)return;
  const run=revision,doc=pdf;
  if(rendering){rendering.cancel();try{await rendering.promise;}catch{} rendering=null;}
  controls(true);el('pdfReaderCount').textContent=`Page ${pageNumber} of ${doc.numPages}`;
  try{
   const page=await doc.getPage(pageNumber);
   if(run!==revision||!dialog.open)return;
   const base=page.getViewport({scale:1});
   const width=Math.max(240,el('pdfReaderContent').clientWidth-24);
   const viewport=page.getViewport({scale:width/base.width*zoom});
   const ratio=Math.min(window.devicePixelRatio||1,2);
   const canvas=el('pdfReaderCanvas');
   canvas.width=Math.ceil(viewport.width*ratio);canvas.height=Math.ceil(viewport.height*ratio);
   canvas.style.width=Math.ceil(viewport.width)+'px';canvas.style.height=Math.ceil(viewport.height)+'px';
   const render=page.render({canvasContext:canvas.getContext('2d'),viewport,transform:[ratio,0,0,ratio,0,0]});rendering=render;
   await render.promise;
   if(run!==revision||!dialog.open)return;
   rendering=null;el('pdfReaderStatus').textContent='';
   const text=await page.getTextContent();
   if(run!==revision||!dialog.open)return;
   el('pdfReaderText').textContent=`Page ${pageNumber} of ${doc.numPages}. `+text.items.map(i=>i.str||'').join(' ');
   el('pdfReaderContent').scrollTo(0,0);controls();
  }catch(error){
   if(run!==revision||error?.name==='RenderingCancelledException')return;
   el('pdfReaderStatus').textContent='This page could not be displayed. Save the PDF copy to read it in your device’s PDF reader.';controls();
  }
 }
 function cleanup(){
  revision++;clearTimeout(resizeTimer);
  if(rendering){rendering.cancel();rendering=null;}
  if(task){task.destroy().catch(()=>{});task=null;}
  pdf=null;bytes=null;opening=false;controls();
  document.body.classList.remove('pdf-reader-open');
  el('pdfReaderCanvas').width=1;el('pdfReaderCanvas').height=1;el('pdfReaderText').textContent='';
  returnFocus?.focus({preventScroll:true});window.scrollTo(0,returnY);
 }
 function leave(){
  if(!dialog.open)return;
  if(history.state?.itlabPDFReader){history.back();}
  else{dialog.close();}
 }
 window.addEventListener('popstate',()=>{if(dialog.open){dialog.close();}});
 dialog.addEventListener('close',cleanup);
 dialog.addEventListener('cancel',event=>{event.preventDefault();leave();});
 el('pdfReaderBack').addEventListener('click',leave);
 el('pdfReaderPrev').onclick=()=>{if(pdf&&pageNumber>1){pageNumber--;renderPage();}};
 el('pdfReaderNext').onclick=()=>{if(pdf&&pageNumber<pdf.numPages){pageNumber++;renderPage();}};
 el('pdfReaderSmaller').onclick=()=>{zoom=Math.max(.8,Math.round((zoom-.2)*10)/10);renderPage();};
 el('pdfReaderLarger').onclick=()=>{zoom=Math.min(2.4,Math.round((zoom+.2)*10)/10);renderPage();};
 window.addEventListener('resize',()=>{if(dialog.open){clearTimeout(resizeTimer);resizeTimer=setTimeout(renderPage,180);}});
 el('pdfReaderSave').onclick=async()=>{
  if(!bytes)return;
  const file=new File([bytes],filename,{type:'application/pdf'});
  if(navigator.canShare?.({files:[file]})&&navigator.share){
   try{await navigator.share({files:[file],title:el('pdfReaderTitle').textContent});return;}
   catch(error){if(error?.name==='AbortError')return;}
  }
  const url=URL.createObjectURL(file),a=document.createElement('a');
  a.href=url;a.download=filename;a.target='_blank';a.rel='noopener noreferrer';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
  el('pdfReaderStatus').textContent='A PDF copy was requested. If your browser opens a separate viewer, return to IT Lab 1 when finished.';
 };
 async function openReader(anchor){
  if(opening||dialog.open)return;
  const url=new URL(anchor.href,location.href);filename=url.pathname.split('/').pop();
  if(url.origin!==location.origin||!documents.has(filename))return;
  opening=true;returnFocus=document.activeElement;returnY=window.scrollY;pageNumber=1;zoom=1;
  el('pdfReaderTitle').textContent=anchor.dataset.pdfTitle||'PDF reader';
  el('pdfReaderStatus').textContent='Loading the PDF inside IT Lab 1…';el('pdfReaderCount').textContent='Loading…';
  document.body.classList.add('pdf-reader-open');dialog.showModal();controls();
  history.pushState({itlabPDFReader:true},'', '#pdf-reader');
  const run=++revision;
  try{
   library ||= await import('./vendor/pdfjs/pdf.min.mjs');
   library.GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/pdf.worker.min.mjs',location.href).href;
   if(run!==revision||!dialog.open)return;
   task=library.getDocument({url:url.href,isEvalSupported:false,useSystemFonts:true});
   pdf=await task.promise;
   if(run!==revision||!dialog.open)return;
   bytes=await pdf.getData();
   if(run!==revision||!dialog.open)return;
   opening=false;await renderPage();
  }catch(error){
   if(run!==revision||!dialog.open)return;
   opening=false;el('pdfReaderStatus').textContent='The PDF could not load. Connect once to finish the offline download, then try again. Back to IT Lab 1 always returns to the app.';el('pdfReaderCount').textContent='PDF unavailable';controls();
  }
 }
 document.addEventListener('click',event=>{
  const anchor=event.target.closest('a[data-pdf-view]');if(!anchor)return;
  event.preventDefault();openReader(anchor);
 });
})();
