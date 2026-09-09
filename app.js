(() => {
 'use strict';
 const $ = s => document.querySelector(s), projects=window.PROJECTS;
 const pagePath=n=>`assets/page-${String(n).padStart(2,'0')}.webp`;
 const grid=$('#project-grid'), dialog=$('#project-dialog'), content=$('#dialog-content');
 let lastFocus, currentProject, toastTimer;
 function cards(filter='all') {
   grid.innerHTML=projects.filter(p=>filter==='all'||p.filters.includes(filter)).map(p=>`<button class="project-card ${p.id==='meloody'?'featured-project':''} ${p.id==='cityrift'?'lead-project':''}" data-id="${p.id}" style="--accent:${p.accent}" aria-label="查看 ${p.title} 项目详情"><div class="project-label"><span>${p.id==='meloody'?'UNDERGRADUATE THESIS':'PROJECT '+p.n}</span><span>${p.role}</span></div><div class="project-image"><img src="${p.image?'assets/'+p.image:pagePath(p.cover)}" alt="${p.title} 项目封面" loading="lazy" decoding="async">${p.id==='archive'?'<span class="archive-number" aria-label="项目 05">05</span>':''}<span class="project-enter" aria-hidden="true">↗</span></div><div class="project-info"><h3>${p.title}</h3><span>${p.en}</span></div><p class="project-subtitle">${p.subtitle}</p>${p.id==='meloody'?'<p class="featured-description">本科毕业设计 · 独立设计与开发<br>将情绪调节融入剧情与节奏，探索有温度的游戏体验。</p>':''}<div class="tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div></button>`).join('');
 }
 cards();
 document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});cards(button.dataset.filter);
 }));
 function openDialog(){if(!dialog.open){lastFocus=document.activeElement;dialog.showModal();document.body.classList.add('modal-open')}dialog.scrollTop=0;$('#dialog-close').focus({preventScroll:true})}
 function gallery(p,poster=false){
  const box=$('#gallery');
  if(poster||!p.pages.length){box.innerHTML=`<figure><img src="assets/${p.poster}" alt="${p.title} 完整项目海报"><figcaption><span>完整项目海报</span><a href="assets/${p.poster}" target="_blank" rel="noopener">打开原图 / 放大查看 ↗</a></figcaption></figure>`;}
  else box.innerHTML=p.pages.map((n,i)=>`<figure><div class="archive-cover"><img src="${pagePath(n)}" alt="${p.title} · 作品集第 ${n} 页" ${i?'loading="lazy"':''}>${n===35?'<span class="archive-number" aria-label="项目 05">05</span>':''}</div><figcaption><span>PORTFOLIO / ${String(n).padStart(2,'0')}</span><a href="assets/portfolio-part-${String(Math.ceil(n/6)).padStart(2,'0')}.pdf#page=${(n-1)%6+1}" target="_blank" rel="noopener">在 PDF 中放大查看 ↗</a></figcaption></figure>`).join('');
 }
 function openProject(id){
  const p=projects.find(p=>p.id===id);if(!p)return;currentProject=p;
  $('#dialog-kicker').textContent=`PROJECT ${p.n} / ${p.en}`;
  content.innerHTML=`<div class="dialog-intro"><p class="eyebrow">${p.tags.join(' / ')}</p><h2 id="dialog-title">${p.title}</h2><p>${p.subtitle}</p><p>${p.description}</p><div class="dialog-role"><strong>${p.role}</strong><span>${p.responsibility}</span></div></div><div class="detail-tabs">${p.pages.length?'<button class="active" data-view="pages">设计过程</button>':''}${p.poster?`<button class="${p.pages.length?'':'active'}" data-view="poster">完整海报</button>`:''}${p.id==='meloody'?'<a href="assets/meloody-thesis.pdf" target="_blank" rel="noopener">阅读毕业论文 ↗</a>':''}</div><div class="page-gallery" id="gallery"></div><div class="dialog-next"><span>继续探索 / NEXT PROJECT</span><button id="next-project">${projects[(projects.indexOf(p)+1)%projects.length].title} →</button></div>`;
  gallery(p);openDialog();
  content.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{content.querySelectorAll('[data-view]').forEach(t=>t.classList.toggle('active',t===b));gallery(p,b.dataset.view==='poster')}));
  $('#next-project').addEventListener('click',()=>openProject(projects[(projects.indexOf(p)+1)%projects.length].id));
 }
 grid.addEventListener('click',e=>{const card=e.target.closest('[data-id]');if(card)openProject(card.dataset.id)});
 $('#dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastFocus?.focus({preventScroll:true})});
 function contactRows(){return document.querySelector('.contact-methods').outerHTML}
 $('#resume-open').addEventListener('click',()=>{
  $('#dialog-kicker').textContent='RESUME / LAN QI';
  content.innerHTML='<div class="dialog-intro"><h2 id="dialog-title">完整简历</h2><p><a class="text-link" href="assets/resume.pdf" target="_blank" rel="noopener">打开 PDF ↗</a>　<a class="text-link" href="assets/resume.pdf" download="蓝琪_中文简历.pdf">下载简历 ↓</a></p></div><div class="page-gallery"><img src="assets/resume-preview.webp" alt="蓝琪中文简历：A 类赛事及省市级奖项均为 18 项，网易云音乐实习为 2025.12—2026.04"></div>';openDialog()
 });
 $('#awards-open').addEventListener('click',()=>{
  $('#dialog-kicker').textContent='HONORS / SELECTED RECOGNITION';
  content.innerHTML='<div class="dialog-intro"><h2 id="dialog-title">核心奖项</h2><p>个人荣誉、学科竞赛与设计奖项。</p></div><div class="award-groups">'+window.AWARD_GROUPS.map(g=>'<section><h3>'+g.title+'</h3><ul>'+g.items.map(a=>'<li><span>'+a[0]+'</span><strong>'+a[1]+'</strong></li>').join('')+'</ul></section>').join('')+'</div>';openDialog()
 });
 function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),2500)}
 document.addEventListener('click',async e=>{const button=e.target.closest('[data-copy]');if(!button)return;const value=button.dataset.copy,label=button.dataset.copyLabel;
  try{await navigator.clipboard.writeText(value);toast(label+'已复制')}
  catch{const t=document.createElement('textarea');t.value=value;t.style.position='fixed';t.style.opacity='0';(dialog.open?dialog:document.body).append(t);t.select();const ok=document.execCommand('copy');t.remove();button.focus();toast(ok?label+'已复制':'请选中文字复制')}
 });
 // A procedural particle sculpture: no external libraries or generated project imagery.
 const canvas=$('#particles'),ctx=canvas.getContext('2d'),hero=$('.hero'),toggle=$('#motion-toggle');
 if(!ctx){toggle.hidden=true;return}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let motion=!reduced.matches,visible=true,w=0,h=0,dpr=1,raf=0,time=0,last=0,pointer={x:0,y:0},points=[];
 function seed(){points=[];const count=w<650?1500:3200;for(let i=0;i<count;i++){const a=i*2.39996322973,y=1-2*(i+.5)/count,r=Math.sqrt(1-y*y);points.push({x:Math.cos(a)*r,y,z:Math.sin(a)*r,s:.45+(i%7)/10})}}
 function resize(){w=hero.clientWidth;h=hero.clientHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);seed();draw()}
 function draw(){ctx.clearRect(0,0,w,h);const mobile=w<650,cx=w*(mobile?.73:.75),cy=h*(mobile?.31:.43),radius=Math.min(w*(mobile?.43:.265),h*.42),rot=time*.12+pointer.x*.16,tilt=-.4+pointer.y*.12;
  const glow=ctx.createRadialGradient(cx,cy,5,cx,cy,radius*1.5);glow.addColorStop(0,'rgba(105,140,212,.075)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  for(const p of points){let x=p.x*Math.cos(rot)-p.z*Math.sin(rot),z=p.x*Math.sin(rot)+p.z*Math.cos(rot),y=p.y*Math.cos(tilt)-z*Math.sin(tilt);z=p.y*Math.sin(tilt)+z*Math.cos(tilt);const ripple=1+.07*Math.sin(p.y*9+time*.45)+.035*Math.cos(p.x*12+time*.3),pers=3.3/(3.3-z*.45),px=cx+x*radius*ripple*pers,py=cy+y*radius*ripple*pers,alpha=(.16+(z+1)*.32)*(mobile?.67:.9);ctx.fillStyle=`rgba(${145+Math.round(z*20)},${180+Math.round(z*13)},${232+Math.round(z*15)},${alpha})`;ctx.beginPath();ctx.arc(px,py,p.s*pers*(mobile?.85:1),0,Math.PI*2);ctx.fill()}
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.48);ctx.scale(1,.29);ctx.strokeStyle='rgba(131,171,233,.18)';ctx.lineWidth=.6;ctx.beginPath();ctx.arc(0,0,radius*1.3,0,Math.PI*2);ctx.stroke();ctx.restore();
  for(let i=0;i<45;i++){let x=(i*197.3+Math.sin(time*.1+i)*12)%w,y=(i*79.1+Math.cos(time*.12+i)*15+h)%h;ctx.fillStyle=`rgba(160,190,240,${.12+(i%4)*.07})`;ctx.fillRect(x,y,i%9===0?2:1,i%9===0?2:1)}
 }
 function frame(now){raf=0;if(!motion||!visible||document.hidden)return;const elapsed=now-last;if(elapsed>30){time+=Math.min(elapsed,60)/1000;last=now;draw()}raf=requestAnimationFrame(frame)}
 function schedule(){if(motion&&visible&&!document.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(frame)}}
 function state(){toggle.setAttribute('aria-pressed',String(motion));toggle.querySelector('span').textContent=motion?'ON':'OFF';if(!motion){cancelAnimationFrame(raf);raf=0;draw()}else schedule()}
 toggle.addEventListener('click',()=>{motion=!motion;state()});reduced.addEventListener('change',e=>{motion=!e.matches;state()});hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();pointer.x=(e.clientX-r.left)/w-.5;pointer.y=(e.clientY-r.top)/h-.5});hero.addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0});
 new ResizeObserver(resize).observe(hero);new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0}else schedule()}).observe(hero);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else schedule()});resize();state();
})();

