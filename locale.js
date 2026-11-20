"use strict";
(() => {
 const lang=(navigator.languages?.[0]||navigator.language||"tr").toLowerCase().split("-")[0];
 const translations={"en":{"Yeni seri":"New series","Maç":"Match","Dükkân":"Shop","Top sende":"Your turn","Gol":"Goals","Rekor":"Best","Altın":"Coins","Nişan":"Aim","Orta":"Center","Sol":"Left","Sağ":"Right","Şut gücü":"Shot power","Şut çek":"Shoot","Şut çek ⚽":"Shoot ⚽","Sıradaki şut":"Next shot","Yeniden oyna":"Play again","Top havada":"Ball in flight","Şut çekildi":"Shot taken","Seri bitti":"Series finished","Gol!":"Goal!","Kaleci kurtardı!":"Keeper saved it!","Top dışarıda!":"Missed!","Toplar":"Balls","Kaleci Forması":"Goalkeeper jerseys","Ücretsiz":"Free","Sahipsin":"Owned","Seçili":"Selected","Kullan":"Use","Satın al":"Buy","Altın eksik":"Not enough coins","İlk formaya dön":"Default jersey","ÖZEL MOD":"SPECIAL MODE","Robotla Penaltı Maçı":"Penalty Match vs Robot","Sen":"You","Robot":"Robot","3 penaltılık karşılaşma":"Three-round match","Maç tamamlandı":"Match finished","Şut dışarı gitti!":"Shot missed!","GOL":"GOAL","KAÇTI":"MISSED","Kurtardın!":"Great save!","Robot gol attı!":"Robot scored!","Robotun şutu dışarı gitti!":"Robot missed!","Tekrar oyna":"Play again","Maç başlamak üzere!":"Match is about to start!","Şut 1 / 5":"Shot 1 / 5","Penaltı sonuçları":"Penalty results","Nişanı ayarla":"Adjust aim","Dükkân bölümleri":"Shop categories","Dükkânı kapat":"Close shop","Maçı kapat":"Close match","Klasik Top":"Classic ball","Mavi Top":"Blue ball","Kırmızı Top":"Red ball","Mor Top":"Purple ball","Yeşil Top":"Green ball","Gün Batımı":"Sunset","Turkuaz Dalga":"Turquoise wave","Pembe Yıldız":"Pink star","Kaplan":"Tiger","Şimşek":"Lightning","Buz Kristali":"Ice crystal","Gece Göğü":"Night sky","Gökkuşağı":"Rainbow","Altın Kupa":"Golden trophy","Mavi Forma":"Blue jersey","Kırmızı Forma":"Red jersey","Yeşil Forma":"Green jersey","Mor Forma":"Purple jersey","Pembe Forma":"Pink jersey","Beyaz Forma":"White jersey","Sola nişan al":"Aim left","Sağa nişan al":"Aim right","Yukarı nişan al":"Aim up","Aşağı nişan al":"Aim down","5 şutta 3 veya daha fazla gol at, 10 altın kazan.":"Score 3 or more goals in 5 shots to earn 10 coins.","Kaleye dokunarak nişan al veya topu yukarı kaydırarak şut çek.":"Tap the goal to aim or swipe up to shoot.","Ok tuşlarıyla nişan al, boşlukla şut çek.":"Use arrow keys to aim and Space to shoot.","Altının":"Your coins","Aldığın top hemen oyuna girer.":"Your purchased ball is equipped immediately.","Her forma 40 altın. Seçtiğin formayı kaleci giyer.":"Each jersey costs 40 coins. Your keeper wears the selected one.","İlk penaltını kullanmak için kaleye nişan al.":"Aim at the goal to take your first penalty.","Kazanan: 30 altın · Beraberlik: 10 altın":"Win: 30 coins · Draw: 10 coins","Top kaleye gidiyor…":"Ball flying toward goal…","GOL! Şimdi kaleye geç.":"GOAL! Now defend.","Kaleci ilk formasını giydi.":"Keeper is wearing the default jersey."},"es":{"Yeni seri":"Nueva serie","Maç":"Partido","Dükkân":"Tienda","Gol":"Goles","Rekor":"Récord","Altın":"Monedas","Nişan":"Apuntar","Orta":"Centro","Sol":"Izquierda","Sağ":"Derecha","Şut çek":"Disparar","Toplar":"Balones","Kaleci Forması":"Camisetas del portero","Sen":"Tú","Robot":"Robot","Tekrar oyna":"Jugar otra vez","ÖZEL MOD":"MODO ESPECIAL","Robotla Penaltı Maçı":"Penaltis contra robot","Ücretsiz":"Gratis","Satın al":"Comprar","Seçili":"Seleccionado","Kullan":"Usar","Sahipsin":"Adquirido","GOL":"GOL","KAÇTI":"FALLO"},"de":{"Yeni seri":"Neue Runde","Maç":"Spiel","Dükkân":"Shop","Gol":"Tore","Rekor":"Rekord","Altın":"Münzen","Nişan":"Zielen","Orta":"Mitte","Sol":"Links","Sağ":"Rechts","Şut çek":"Schießen","Toplar":"Bälle","Kaleci Forması":"Torwarttrikots","Sen":"Du","Robot":"Roboter","Tekrar oyna":"Erneut spielen","ÖZEL MOD":"SPEZIALMODUS","Robotla Penaltı Maçı":"Elfmeterschießen gegen Roboter","Ücretsiz":"Kostenlos","Satın al":"Kaufen","Seçili":"Ausgewählt","Kullan":"Benutzen","Sahipsin":"Im Besitz","GOL":"TOR","KAÇTI":"DANEBEN"},"fr":{"Yeni seri":"Nouvelle série","Maç":"Match","Dükkân":"Boutique","Gol":"Buts","Rekor":"Record","Altın":"Pièces","Nişan":"Viser","Orta":"Centre","Sol":"Gauche","Sağ":"Droite","Şut çek":"Tirer","Toplar":"Ballons","Kaleci Forması":"Maillots de gardien","Sen":"Vous","Robot":"Robot","Tekrar oyna":"Rejouer","ÖZEL MOD":"MODE SPÉCIAL","Robotla Penaltı Maçı":"Tirs au but contre le robot","Ücretsiz":"Gratuit","Satın al":"Acheter","Seçili":"Sélectionné","Kullan":"Utiliser","Sahipsin":"Possédé","GOL":"BUT","KAÇTI":"RATÉ"}};
 if(lang==="tr")return;
 const dict={...translations.en,...(translations[lang]||{})};
 document.documentElement.lang=translations[lang]?lang:"en";
 const rules=[
 [/^Şut (\d+) \/ (\d+)$/,(a,b)=>"Shot "+a+" / "+b],
 [/^Penaltı (\d+) \/ (\d+)$/,(a,b)=>"Penalty "+a+" / "+b],
 [/^(\d+)\. penaltını kullan! Kaleye nişan al\.$/,(a)=>"Take penalty "+a+"! Aim at the goal."],
 [/^(.+) şut çekecek! Kurtarmak için Sol, Orta veya Sağ seç\.$/,(a)=>a+" will shoot! Choose left, center or right to save."],
 [/^(.+) şut çekiyor…$/,(a)=>a+" is shooting…"],
 [/^(.+) kazandı\. Bir dahaki sefere!$/,(a)=>a+" won. Better luck next time!"],
 [/^Maçı kazandın! 30 altın senin!$/()=>""]
 ];
 rules.pop();
 const patterns=[
 [/^(\d+) altın$/,(n)=>n+" coins"],
 [/^Bu ürün için (\d+) altın daha gerekiyor\.$/,(n)=>"You need "+n+" more coins."],
 [/^(.+) seçildi\.$/,(n)=>(dict[n]||n)+" selected."],
 [/^(.+) alındı ve seçildi!$/,(n)=>(dict[n]||n)+" purchased and equipped!"],
 [/^\+(\d+) altın$/,(n)=>"+"+n+" coins"],
 [/^(\d+) altın kazandın!$/,(n)=>"You earned "+n+" coins!"],
 [/^Maçı kazandın! 30 altın senin!$/ ,()=> "You won the match! 30 coins earned!"],
 [/^Berabere! 10 altın kazandın\.$/,()=> "Draw! You earned 10 coins."],
 [/^Şut (\d+) \/ (\d+)$/,(a,b)=>"Shot "+a+" / "+b],
 [/^Penaltı (\d+) \/ (\d+)$/,(a,b)=>"Penalty "+a+" / "+b],
 [/^(\d+)\. penaltını kullan! Kaleye nişan al\.$/,(a)=>"Penalty "+a+": aim at the goal!"],
 [/^(.+) şut çekecek! Kurtarmak için Sol, Orta veya Sağ seç\.$/,(a)=>a+" will shoot! Choose left, center or right."],
 [/^(.+) şut çekiyor…$/,(a)=>a+" is shooting…"],
 [/^(.+) kazandı\. Bir dahaki sefere!$/,(a)=>a+" won. Better luck next time!"],
 [/^(.+) üst$/,(a)=>(dict[a]||a)+" high"],
 [/^(.+) alt$/,(a)=>(dict[a]||a)+" low"]
 ];
 function translate(s){
  if(dict[s])return dict[s];
  const trimmed=s.trim();
  if(dict[trimmed])return s.replace(trimmed,dict[trimmed]);
  for(const [re,fn] of patterns){const m=trimmed.match(re);if(m)return s.replace(trimmed,fn(...m.slice(1)));}
  return s;
 }
 const seen=new WeakMap();
 function visit(node){
  if(node.nodeType===3){
   const v=node.nodeValue;
   if(seen.get(node)===v)return;
   const out=translate(v);
   seen.set(node,out);
   if(out!==v)node.nodeValue=out;
  }else if(node.nodeType===1){
   if(["SCRIPT","STYLE"].includes(node.tagName))return;
   for(const attr of ["aria-label","title","placeholder"]){if(node.hasAttribute(attr)){const v=node.getAttribute(attr),out=translate(v);if(v!==out)node.setAttribute(attr,out);}}
   for(const child of node.childNodes)visit(child);
  }
 }
 let pending=false;
 function refresh(){pending=false;visit(document.body);}
 const observer=new MutationObserver(()=>{if(!pending){pending=true;queueMicrotask(refresh);}});
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{refresh();observer.observe(document.body,{subtree:true,childList:true,characterData:true});});
 else{refresh();observer.observe(document.body,{subtree:true,childList:true,characterData:true});}
})();
