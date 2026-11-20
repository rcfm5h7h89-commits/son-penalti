"use strict";

const get = id => document.getElementById(id);
const field = get("field");
const c = field.getContext("2d");
const W = field.width;
const H = field.height;
const goal = {left:226,right:594,top:116,bottom:285};
const spot = {x:410,y:435};
const clamp = (n,min,max) => Math.min(max,Math.max(min,n));
const mix = (a,b,t) => a+(b-a)*t;
const smooth = t => t*t*(3-2*t);
const maxShots = 5;
const rewardGoals = 3;
const seriesReward = 10;
const goldKey = "son-penalti-altin";
const profileKey = "son-penalti-ekipman";
const balls = new Map([
  ["classic",{name:"Klasik Top",price:0,glow:"#fffdf1",base:"#e3eee3",edge:"#7f9f99",patch:"#192c31"}],
  ["blue",{name:"Mavi Top",price:30,glow:"#e1f9ff",base:"#64ceff",edge:"#1755a4",patch:"#104675"}],
  ["red",{name:"Kırmızı Top",price:70,glow:"#ffe4b5",base:"#ff7b67",edge:"#ae2c38",patch:"#7a2435"}],
  ["purple",{name:"Mor Top",price:120,glow:"#f6e7ff",base:"#c7a0ff",edge:"#5f368e",patch:"#58287d"}],
  ["lime",{name:"Yeşil Top",price:40,glow:"#efffbd",base:"#9dd949",edge:"#3e781c",patch:"#214e25"}],
  ["sunset",{name:"Gün Batımı",price:50,glow:"#fff1ab",base:"#ff9e50",edge:"#c13a50",patch:"#bd395e",accent:"#ffe58d",pattern:"stripes"}],
  ["surf",{name:"Turkuaz Dalga",price:90,glow:"#d0fff6",base:"#4ed7c6",edge:"#137482",patch:"#157e98",accent:"#e6ffe7",pattern:"wave"}],
  ["rose",{name:"Pembe Yıldız",price:100,glow:"#ffe0ef",base:"#fa86be",edge:"#a82769",patch:"#861d63",accent:"#ffeaa9",pattern:"star"}],
  ["tiger",{name:"Kaplan",price:150,glow:"#fff0a5",base:"#fbb04b",edge:"#c35927",patch:"#332a2b",accent:"#ffc969",pattern:"stripes"}],
  ["bolt",{name:"Şimşek",price:170,glow:"#b0bfff",base:"#5a74da",edge:"#263161",patch:"#252355",accent:"#f8fb79",pattern:"bolt"}],
  ["frost",{name:"Buz Kristali",price:220,glow:"#f6ffff",base:"#b1e5ff",edge:"#4e84b4",patch:"#396f9a",accent:"#f4fdff",pattern:"crystal"}],
  ["night",{name:"Gece Göğü",price:250,glow:"#8893cb",base:"#3f467e",edge:"#161b3c",patch:"#9695eb",accent:"#fff0b2",pattern:"orbit"}],
  ["rainbow",{name:"Gökkuşağı",price:320,glow:"#fffdf9",base:"#d8e7ff",edge:"#716caa",pattern:"rainbow"}],
  ["trophy",{name:"Altın Kupa",price:400,glow:"#fff6a6",base:"#f6c853",edge:"#a7631b",patch:"#874815",accent:"#fff9c0",pattern:"star"}]
]);

const defaultShirt = {body:"#ffb34e",sleeves:"#e98b43",stripe:"#f7d06f"};
const shirtPrice = 40;
const shirts = new Map([
  ["blue",{name:"Mavi Forma",price:shirtPrice,body:"#459af1",sleeves:"#2563aa",stripe:"#a3d9ff"}],
  ["red",{name:"Kırmızı Forma",price:shirtPrice,body:"#ed595c",sleeves:"#aa2839",stripe:"#ffada2"}],
  ["lime",{name:"Yeşil Forma",price:shirtPrice,body:"#8bd44d",sleeves:"#46852f",stripe:"#d8fba6"}],
  ["violet",{name:"Mor Forma",price:shirtPrice,body:"#a37aed",sleeves:"#613eac",stripe:"#e5d2ff"}],
  ["pink",{name:"Pembe Forma",price:shirtPrice,body:"#f582b4",sleeves:"#af3d78",stripe:"#ffd4e8"}],
  ["white",{name:"Beyaz Forma",price:shirtPrice,body:"#f1f7f5",sleeves:"#8fb8c0",stripe:"#52929d"}]
]);

function polygon(ctx,points,fill,stroke,width=1) {
  ctx.beginPath();
  points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
  if(fill) {ctx.closePath();ctx.fillStyle=fill;ctx.fill();}
  if(stroke) {ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}
}

function ellipse(ctx,x,y,rx,ry,fill) {
  ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();
}

const background=document.createElement("canvas");
background.width=W;background.height=H;

function buildStadium() {
  const g=background.getContext("2d");
  const sky=g.createLinearGradient(0,0,0,280);
  sky.addColorStop(0,"#0a2024");sky.addColorStop(1,"#385d53");
  g.fillStyle=sky;g.fillRect(0,0,W,H);
  for(const x of [80,740]) {
    const glow=g.createRadialGradient(x,50,6,x,50,155);
    glow.addColorStop(0,"#e8ffce9e");glow.addColorStop(1,"#dfffbb00");
    g.fillStyle=glow;g.fillRect(x-155,0,310,205);
    polygon(g,[[x,62],[x,150]],null,"#405d55",5);
    g.fillStyle="#73897b";g.fillRect(x-34,35,68,22);
    for(let i=0;i<8;i++) {
      g.fillStyle="#edfbe0";g.fillRect(x-30+i*8,39,5,5);g.fillRect(x-30+i*8,48,5,5);
    }
  }
  polygon(g,[[0,99],[146,123],[302,136],[500,136],[682,121],[820,97],[820,239],[0,239]],"#203b3a","#50706a",3);
  polygon(g,[[0,141],[167,152],[330,158],[490,158],[665,153],[820,138],[820,219],[0,219]],"#142c2c");
  let seed=150;
  const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const palette=["#79a698","#335f56","#ddd77b","#9c7664","#52746d","#bcc1a8"];
  for(let i=0;i<1500;i++) {
    const x=rand()*W, y=129+rand()*80+(1-Math.abs((x-410)/410))*17;
    const size=.6+rand()*1.7;
    ellipse(g,x,y,size,size*.63,palette[Math.floor(rand()*palette.length)]);
  }
  for(const y of [160,191,219]) polygon(g,[[0,y-14],[410,y],[W,y-14]],null,"#294744",3);
  g.fillStyle="#18423b";g.fillRect(0,221,W,26);
  for(let x=13;x<W;x+=105) {
    polygon(g,[[x,226],[x+86,226],[x+80,241],[x,241]],x%2?"#314e46":"#394f38");
    polygon(g,[[x+9,233],[x+71,233]],null,"#c0d68066",2);
  }
  const turf=g.createLinearGradient(0,233,0,510);
  turf.addColorStop(0,"#387954");turf.addColorStop(1,"#173d2a");
  g.fillStyle=turf;g.fillRect(0,246,W,H-246);
  for(let i=-5;i<5;i+=2) polygon(g,[[410+i*72,245],[410+(i+1)*72,245],[410+(i+1)*154,H],[410+i*154,H]],"#7ed06419");
  for(let i=0;i<650;i++) {
    const x=rand()*W,y=250+rand()*260;
    polygon(g,[[x,y],[x+rand()*5,y-2]],null,i%2?"#ace59019":"#0b311e46");
  }
  polygon(g,[[5,283],[815,283]],null,"#e6f4e799",2);
  polygon(g,[[180,284],[116,363],[704,363],[640,284]],null,"#d6f0dbaa",2);
  polygon(g,[[92,284],[-4,476],[824,476],[728,284]],null,"#d6f0dbaa",2.2);
  ellipse(g,spot.x,spot.y+3,5,2.5,"#c4dbc4");
  ellipse(g,410,288,210,15,"#112e2480");
  drawNet(g);
}

function drawNet(g) {
  const {left,right,top,bottom}=goal;
  polygon(g,[[left-3,bottom],[253,265],[567,265],[right+3,bottom]],"#c2e5da20","#c2e5da8a");
  polygon(g,[[left,top],[253,top+20],[253,265],[left,bottom]],"#b2ddd83a","#b2ddd8aa");
  polygon(g,[[right,top],[567,top+20],[567,265],[right,bottom]],"#b2ddd83a","#b2ddd8aa");
  const netFill=g.createLinearGradient(0,top,0,bottom);
  netFill.addColorStop(0,"#b6e2d226");netFill.addColorStop(1,"#102f2c77");
  g.fillStyle=netFill;g.fillRect(left,top,right-left,bottom-top);
  for(let i=0;i<=24;i++) {
    const x=mix(left,right,i/24),back=mix(253,567,i/24);
    polygon(g,[[x,top],[back,top+20],[back,265],[x,bottom]],null,"#e7f7e84c",1);
  }
  for(let i=0;i<=11;i++) {
    const y=mix(top,bottom,i/11),backY=mix(top+20,265,i/11);
    polygon(g,[[left,y],[253,backY],[567,backY],[right,y]],null,"#e7f7e850",1);
  }
  polygon(g,[[left,bottom],[left,top],[right,top],[right,bottom]],null,"#123b37",11);
  polygon(g,[[left,bottom],[left,top],[right,top],[right,bottom]],null,"#eff6eb",7);
}

function drawKeeper(x,y,lean,t) {
  const shirt=shirts.get(profile.selectedShirt)??defaultShirt;
  ellipse(c,x,goal.bottom-4,30,5,"#142e23a0");
  c.save();c.translate(x,y);c.rotate(lean);
  const stride=Math.sin(t*10)*3*(1-Math.min(1,Math.abs(lean)));
  c.lineCap="round";
  polygon(c,[[-9,9],[-13+stride,25],[-20+stride,38]],null,"#223343",9);
  polygon(c,[[8,9],[14-stride,24],[19-stride,38]],null,"#223343",9);
  polygon(c,[[-20+stride,38],[-26+stride,39]],null,"#ebf3dd",5);
  polygon(c,[[19-stride,38],[25-stride,38]],null,"#ebf3dd",5);
  polygon(c,[[-13,-17],[-24,-8],[-28,-14]],null,shirt.sleeves,8);
  polygon(c,[[13,-17],[24,-8],[29,-15]],null,shirt.sleeves,8);
  ellipse(c,-29,-14,5,6,"#f5eee3");ellipse(c,30,-15,5,6,"#f5eee3");
  polygon(c,[[-13,-20],[13,-20],[11,6],[-11,6]],shirt.body,"#243a34",1.5);
  polygon(c,[[-4,-17],[-1,3],[4,3],[2,-17]],shirt.stripe);
  ellipse(c,0,-28,9,10,"#b56e4f");
  polygon(c,[[-9,-30],[-7,-36],[2,-39],[9,-32]],"#3c2e28");
  c.restore();
}

function drawBallPattern(ctx,r,skin) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(0,0,r*.97,0,Math.PI*2);
  ctx.clip();
  ctx.scale(r,r);
  const mark=(points,fill=skin.patch)=>polygon(ctx,points,fill);
  switch(skin.pattern) {
    case "stripes":
      mark([[-1,-.56],[-.62,-.76],[.93,.03],[.83,.27],[-.2,-.17]]);
      mark([[-1,-.05],[-.38,-.11],[.82,.51],[.56,.78],[-.15,.28]]);
      mark([[-.63,.43],[-.25,.47],[.42,.96],[-.32,1]],skin.accent);
      break;
    case "wave":
      mark([[-1,.18],[-.72,-.25],[-.32,-.4],[.12,-.21],[.49,-.29],[.95,-.63],[1,-.22],[.6,.21],[.14,.33],[-.33,.13],[-.69,.23],[-1,.66]]);
      mark([[-1,.8],[-.61,.47],[-.3,.41],[.23,.55],[.62,.4],[1,.09],[1,.55],[.47,.89],[.06,.96],[-.43,.73]],skin.accent);
      break;
    case "star":
      mark(Array.from({length:10},(_,i)=>{
        const angle=i*Math.PI/5-Math.PI/2;
        const radius=i%2?.29:.70;
        return [Math.cos(angle)*radius,Math.sin(angle)*radius];
      }));
      for(const [x,y] of [[-.68,-.45],[.69,-.3],[-.38,.75],[.51,.62]]) ellipse(ctx,x,y,.10,.10,skin.accent);
      break;
    case "bolt":
      mark([[-.17,-1],[.46,-1],[.15,-.25],[.67,-.24],[-.42,.98],[-.07,.13],[-.58,.14]],skin.accent);
      polygon(ctx,[[-.96,-.24],[-.66,-.21],[-.46,-.46]],null,skin.patch,.07);
      break;
    case "crystal":
      for(let i=0;i<6;i++) {
        ctx.rotate(Math.PI/3);
        polygon(ctx,[[0,0],[0,-.77]],null,skin.patch,.085);
        polygon(ctx,[[-.15,-.59],[0,-.43],[.15,-.59]],null,skin.patch,.075);
      }
      ellipse(ctx,0,0,.13,.13,skin.accent);
      break;
    case "orbit":
      ctx.beginPath();ctx.ellipse(0,0,1.08,.35,-.48,0,Math.PI*2);
      ctx.strokeStyle=skin.patch;ctx.lineWidth=.09;ctx.stroke();
      for(const [x,y,size] of [[-.62,-.3,.09],[.57,-.47,.08],[.19,.24,.13],[-.31,.63,.055],[.68,.38,.06]]) {
        mark([[x,y-size],[x+size*.55,y],[x,y+size],[x-size*.55,y]],skin.accent);
      }
      break;
    case "rainbow":
      ctx.rotate(-.36);
      ["#ed5277","#f39551","#fbe478","#60d2a9","#6ea0f9","#9d73d8"].forEach((color,i)=>{
        ctx.fillStyle=color;
        ctx.fillRect(-1.1,-.72+i*.25,2.2,.255);
      });
      break;
  }
  ctx.restore();
}

function drawBall(ctx,x,y,r,spin,skin) {
  ctx.save();ctx.translate(x,y);ctx.rotate(spin);
  const color=ctx.createRadialGradient(-r*.27,-r*.38,1,0,0,r);
  color.addColorStop(0,skin.glow);color.addColorStop(.76,skin.base);color.addColorStop(1,skin.edge);
  ellipse(ctx,0,0,r,r,color);
  if(skin.pattern) {
    drawBallPattern(ctx,r,skin);
    ctx.restore();
    return;
  }
  const patches=[[0,0,.36],[-.76,.25,.23],[.71,.41,.22],[.2,-.77,.24],[-.26,.76,.21]];
  patches.forEach(([px,py,size])=>{
    const points=Array.from({length:5},(_,i)=>{
      const angle=i*Math.PI*2/5-Math.PI/2;
      return [(px+Math.cos(angle)*size)*r,(py+Math.sin(angle)*size)*r];
    });
    polygon(ctx,points,skin.patch);
  });
  ctx.restore();
}

buildStadium();
function loadBest() {
  try {return clamp(Number(localStorage.getItem("son-penalti-rekor"))||0,0,maxShots);}
  catch {return 0;}
}

let state="ready", results=[], aim={x:410,y:195}, power=68, best=loadBest();
let shot=null, gesture=null, clock=0;
const shop=get("shop");
const matchDialog=get("matchDialog");
const shopNote=get("shopNote");
const shopItems=get("shopItems");
const starterShirt=get("starterShirt");
const initialProfile={gold:0,legacyGold:0,owned:["classic"],selected:"classic",ownedShirts:[],selectedShirt:null};
let profile=readProfile(initialProfile);
let category="balls";

function readProfile(fallback) {
  try {
    const oldGold=Number(localStorage.getItem(goldKey));
    const legacyGold=Number.isSafeInteger(oldGold)&&oldGold>=0?oldGold:0;
    const saved=JSON.parse(localStorage.getItem(profileKey));
    if(!saved) return {...fallback,gold:Math.max(fallback.gold,legacyGold),legacyGold};
    const owned=Array.isArray(saved.owned)?saved.owned.filter(id=>balls.has(id)):[];
    if(!owned.includes("classic")) owned.unshift("classic");
    const selected=owned.includes(saved.selected)?saved.selected:"classic";
    const ownedShirts=Array.isArray(saved.ownedShirts)?saved.ownedShirts.filter(id=>shirts.has(id)):[];
    const selectedShirt=ownedShirts.includes(saved.selectedShirt)?saved.selectedShirt:null;
    const gold=Number.isSafeInteger(saved.gold)&&saved.gold>=0?saved.gold:0;
    const imported=Number.isSafeInteger(saved.legacyGold)?saved.legacyGold:legacyGold;
    return {gold:gold+Math.max(0,legacyGold-imported),legacyGold,owned,selected,ownedShirts,selectedShirt};
  } catch {return fallback;}
}

function updateProfile(change) {
  const update=()=>{
    const current=readProfile(profile);
    profile=change(current);
    if(profile!==current) {
      try {localStorage.setItem(profileKey,JSON.stringify(profile));} catch {}
    }
    renderShop();
  };
  if(navigator.locks) navigator.locks.request(goldKey,update).catch(update);
  else update();
}

function addSeriesReward() {
  updateProfile(current=>({...current,gold:current.gold+seriesReward}));
}

function chooseItem(item,id,ownedKey,selectedKey) {
  updateProfile(current=>{
    if(current[selectedKey]===id) return current;
    if(current[ownedKey].includes(id)) {
      shopNote.textContent=item.name+" seçildi.";
      return {...current,[selectedKey]:id};
    }
    if(current.gold<item.price) {
      shopNote.textContent="Bu ürün için "+(item.price-current.gold)+" altın daha gerekiyor.";
      return current;
    }
    shopNote.textContent=item.name+" alındı ve seçildi!";
    return {...current,gold:current.gold-item.price,[ownedKey]:[...current[ownedKey],id],[selectedKey]:id};
  });
}

function previewBall(context,skin) {
  ellipse(context,76,111,41,9,"#0918127a");
  drawBall(context,76,61,48,-.22,skin);
}

function previewShirt(context,skin) {
  ellipse(context,76,112,42,8,"#0918127a");
  polygon(context,[[44,22],[60,14],[68,25],[84,25],[92,14],[108,22],[132,42],
    [114,68],[103,61],[106,105],[46,105],[49,61],[38,68],[20,42]],skin.sleeves,"#101f1e",2);
  polygon(context,[[44,22],[60,14],[68,25],[84,25],[92,14],[108,22],[103,61],[106,105],[46,105],[49,61]],skin.body);
  polygon(context,[[61,26],[69,33],[83,33],[91,26]],null,skin.stripe,4);
  polygon(context,[[69,35],[82,35],[84,101],[69,101]],skin.stripe);
  polygon(context,[[81,38],[92,38],[92,47],[86.5,51],[81,47]],skin.stripe,"#f0f7ed",1);
}

function makeShopCards(items,ownedKey,selectedKey,drawPreview) {
  return Array.from(items,([id,skin])=>{
    const card=document.createElement("article");
    card.className="shop-card";
    card.tabIndex=-1;
    const preview=document.createElement("canvas");
    preview.width=152;preview.height=128;
    preview.setAttribute("aria-hidden","true");
    drawPreview(preview.getContext("2d"),skin);
    const title=document.createElement("h3");
    title.textContent=skin.name;
    const price=document.createElement("p");
    const button=document.createElement("button");
    button.type="button";
    button.addEventListener("click",()=>chooseItem(skin,id,ownedKey,selectedKey));
    card.append(preview,title,price,button);
    return {id,card,price,button,skin,ownedKey,selectedKey};
  });
}

const shopCards={
  balls:makeShopCards(balls,"owned","selected",previewBall),
  shirts:makeShopCards(shirts,"ownedShirts","selectedShirt",previewShirt)
};

function renderShop() {
  get("gold").textContent=profile.gold;
  get("shopGold").textContent=profile.gold;
  starterShirt.disabled=profile.selectedShirt===null;
  for(const {id,card,price,button,skin,ownedKey,selectedKey} of shopCards[category]) {
    const owned=profile[ownedKey].includes(id);
    const selected=profile[selectedKey]===id;
    const affordable=profile.gold>=skin.price;
    card.dataset.selected=selected;
    price.textContent=skin.price===0?"Ücretsiz":owned?"Sahipsin":skin.price+" altın";
    const action=selected?"Seçili":owned?"Kullan":affordable?"Satın al":"Altın eksik";
    button.textContent=action;
    button.setAttribute("aria-label",skin.name+" · "+action);
    if(document.activeElement===button&&(selected||(!owned&&!affordable))) {
      card.focus({preventScroll:true});
    }
    button.disabled=selected||(!owned&&!affordable);
  }
}

let matchState=null;
const matchLog=get("matchLog");
const matchField=get("matchField");
const mc=matchField.getContext("2d");
const matchDirections=[...document.querySelectorAll("[data-match-direction]")];
const robotNames=["Atlas","RoboGol","Demir","Turbo","Kaptan Bot","Şimşek"];
const matchZones=["Sol","Orta","Sağ"];
const zoneX={Sol:goal.left+65,Orta:410,Sağ:goal.right-65};
let matchGesture=null;
let matchTimer=null;

function clearMatchTimer() {
  if(matchTimer!==null) {clearTimeout(matchTimer);matchTimer=null;}
}
function matchLater(callback,delay=850) {
  clearMatchTimer();
  matchTimer=setTimeout(()=>{matchTimer=null;if(matchDialog.open) callback();},delay);
}
function renderMatchField() {
  if(!matchState) return;
  mc.drawImage(background,0,0);
  const s=matchState;
  const keeperX=s.phase==="defend"||s.phase==="robotResult" ? zoneX[s.keeperZone||"Orta"] : 410;
  // Goalkeeper silhouette, using the current purchased goalkeeper shirt.
  const shirt=shirts.get(profile.selectedShirt)??defaultShirt;
  mc.fillStyle=shirt.body;mc.fillRect(keeperX-15,206,30,37);
  mc.fillStyle="#e4a782";mc.beginPath();mc.arc(keeperX,198,11,0,Math.PI*2);mc.fill();
  mc.strokeStyle=shirt.sleeves;mc.lineWidth=10;mc.beginPath();mc.moveTo(keeperX-13,219);mc.lineTo(keeperX-32,230);mc.moveTo(keeperX+13,219);mc.lineTo(keeperX+32,230);mc.stroke();
  mc.strokeStyle="#263747";mc.lineWidth=9;mc.beginPath();mc.moveTo(keeperX-7,241);mc.lineTo(keeperX-17,267);mc.moveTo(keeperX+7,241);mc.lineTo(keeperX+17,267);mc.stroke();
  if(s.phase==="player"||s.phase==="playerResult") {
    const x=s.aim.x,y=s.aim.y;
    mc.strokeStyle="#e2ff69";mc.lineWidth=3;
    mc.beginPath();mc.arc(x,y,15,0,Math.PI*2);mc.stroke();
    mc.beginPath();mc.moveTo(x-8,y);mc.lineTo(x+8,y);mc.moveTo(x,y-8);mc.lineTo(x,y+8);mc.stroke();
  }
  if(s.phase==="defend"||s.phase==="robotResult") {
    mc.fillStyle="#e2ff69";mc.font="bold 23px system-ui";mc.textAlign="center";
    mc.fillText("KALECİ SENSİN",410,65);
  }
  const ballX=s.phase==="robotResult" ? zoneX[s.robotShotZone] : spot.x;
  const ballY=s.phase==="robotResult" ? 260 : spot.y;
  drawBall(mc,ballX,ballY,s.phase==="robotResult"?12:22,0,balls.get(profile.selected));
}
function renderMatch() {
  if(!matchState) return;
  const s=matchState;
  get("robotName").textContent=s.robotName;
  get("matchPlayerScore").textContent=s.playerGoals;
  get("matchRobotScore").textContent=s.robotGoals;
  get("matchRound").textContent=s.phase==="done"?"Maç tamamlandı":"Penaltı "+(s.round+1)+" / 3";
  matchLog.replaceChildren();
  s.log.forEach(entry=>{
    const line=document.createElement("p");
    const who=document.createElement("span");
    const result=document.createElement("strong");
    who.textContent=entry.who+" · "+entry.direction;
    result.textContent=entry.goal?"GOL":"KAÇTI";
    result.className=entry.goal?"goal-text":"miss-text";
    line.append(who,result);matchLog.append(line);
  });
  matchLog.scrollTop=matchLog.scrollHeight;
  get("matchStatus").textContent=s.status;
  get("matchDirections").hidden=s.phase!=="defend";
  get("matchKick").hidden=s.phase!=="player";
  get("restartMatch").hidden=s.phase!=="done";
  matchDirections.forEach(button=>button.disabled=s.phase!=="defend");
  renderMatchField();
}
function startMatch() {
  clearMatchTimer();
  matchGesture=null;
  matchState={round:0,playerGoals:0,robotGoals:0,phase:"player",log:[],
    robotName:robotNames[Math.floor(Math.random()*robotNames.length)],
    aim:{x:410,y:195},keeperZone:"Orta",robotShotZone:"Orta",
    status:"Kaleye dokunarak nişan al veya topu yukarı kaydırarak şut çek."};
  if(!matchDialog.open)matchDialog.showModal();
  renderMatch();
}
function finishMatch() {
  const s=matchState;
  if(!s||s.phase==="done")return;
  let reward=0,message=s.robotName+" kazandı. Bir dahaki sefere!";
  if(s.playerGoals>s.robotGoals){reward=30;message="Maçı kazandın! 30 altın senin!";}
  else if(s.playerGoals===s.robotGoals){reward=10;message="Berabere! 10 altın kazandın.";}
  s.phase="done";s.status=message;
  if(reward)updateProfile(current=>({...current,gold:current.gold+reward}));
  renderMatch();
}
function aimMatch(x,y) {
  if(!matchState||matchState.phase!=="player")return;
  matchState.aim={x:clamp(x,goal.left-25,goal.right+25),y:clamp(y,goal.top-40,goal.bottom+20)};
  renderMatch();
}
function fireMatch() {
  const s=matchState;
  if(!s||s.phase!=="player")return;
  const shot=makeShot(s.aim,68,410,s.round,Math.random());
  const scored=shot.outcome==="goal";
  s.playerGoals+=Number(scored);
  const direction=s.aim.x<350?"Sol":s.aim.x>470?"Sağ":"Orta";
  s.log.push({who:"Sen",direction,goal:scored});
  s.phase="playerResult";
  s.status=scored?"GOL! Şimdi kaleye geç.":"Şut kaçtı! Şimdi kaleye geç.";
  renderMatch();
  matchLater(()=>{
    s.phase="defend";
    s.status=s.robotName+" şut çekecek! Kurtarmak için Sol, Orta veya Sağ seç.";
    renderMatch();
  });
}
function defendMatch(direction) {
  const s=matchState;
  if(!s||s.phase!=="defend")return;
  s.keeperZone=direction;
  s.robotShotZone=matchZones[Math.floor(Math.random()*3)];
  const onTarget=Math.random()<0.88;
  const saved=direction===s.robotShotZone&&Math.random()<0.88;
  const scored=onTarget&&!saved;
  s.robotGoals+=Number(scored);
  s.log.push({who:s.robotName,direction:s.robotShotZone,goal:scored});
  s.phase="robotResult";
  s.status=scored?"Robot gol attı!":saved?"Kurtardın!":"Robotun şutu dışarı gitti!";
  renderMatch();
  matchLater(()=>{
    s.round++;
    if(s.round===3){finishMatch();return;}
    s.phase="player";s.aim={x:410,y:195};s.keeperZone="Orta";
    s.status=(s.round+1)+". penaltını kullan! Kaleye nişan al.";
    renderMatch();
  });
}
get("openMatch").addEventListener("click",startMatch);
get("closeMatch").addEventListener("click",()=>matchDialog.close());
matchDialog.addEventListener("close",()=>{clearMatchTimer();matchGesture=null;});
get("restartMatch").addEventListener("click",startMatch);
get("matchKick").addEventListener("click",fireMatch);
matchDirections.forEach(button=>button.addEventListener("click",()=>defendMatch(button.dataset.matchDirection)));
function matchPoint(event) {
  const rect=matchField.getBoundingClientRect();
  return {x:(event.clientX-rect.left)*W/rect.width,y:(event.clientY-rect.top)*H/rect.height};
}
matchField.addEventListener("pointerdown",event=>{
  if(!matchState||matchState.phase!=="player"||event.button!==0)return;
  const p=matchPoint(event);
  matchGesture={id:event.pointerId,origin:p,swipe:p.y>342};
  if(!matchGesture.swipe)aimMatch(p.x,p.y);
  matchField.setPointerCapture(event.pointerId);
});
matchField.addEventListener("pointermove",event=>{
  if(!matchGesture||matchGesture.id!==event.pointerId)return;
  const p=matchPoint(event);
  if(matchGesture.swipe)aimMatch(spot.x+(p.x-matchGesture.origin.x)*1.55,267-(matchGesture.origin.y-p.y)*.55);
  else aimMatch(p.x,p.y);
});
matchField.addEventListener("pointerup",event=>{
  if(!matchGesture||matchGesture.id!==event.pointerId)return;
  const p=matchPoint(event);
  if(matchGesture.swipe&&matchGesture.origin.y-p.y>=42) {
    aimMatch(spot.x+(p.x-matchGesture.origin.x)*1.55,267-(matchGesture.origin.y-p.y)*.55);
    fireMatch();
  }
  matchGesture=null;
});
for(const name of ["pointercancel","lostpointercapture"])matchField.addEventListener(name,event=>{
  if(matchGesture?.id===event.pointerId)matchGesture=null;
});

function showCategory(next) {
  category=next;
  const showShirts=next==="shirts";
  get("showBalls").setAttribute("aria-pressed",String(!showShirts));
  get("showShirts").setAttribute("aria-pressed",String(showShirts));
  starterShirt.hidden=!showShirts;
  shopItems.replaceChildren(...shopCards[category].map(({card})=>card));
  shopItems.scrollTop=0;
  shopNote.textContent=showShirts?"Her forma 40 altın. Seçtiğin formayı kaleci giyer.":"Aldığın top hemen oyuna girer.";
  renderShop();
}

get("showBalls").addEventListener("click",()=>showCategory("balls"));
get("showShirts").addEventListener("click",()=>showCategory("shirts"));
starterShirt.addEventListener("click",()=>{
  updateProfile(current=>({...current,selectedShirt:null}));
  shopNote.textContent="Kaleci ilk formasını giydi.";
  get("showShirts").focus({preventScroll:true});
});

get("openShop").addEventListener("click",()=>{
  profile=readProfile(profile);
  showCategory(category);
  shop.showModal();
});
window.addEventListener("storage",event=>{
  if(event.key===profileKey||event.key===goldKey||event.key===null) {
    profile=readProfile(event.key===null?initialProfile:profile);
    renderShop();
  }
});
const powerInput=get("power");
const kick=get("kick");
const arrows=[...document.querySelectorAll(".aim button")];

function syncControls() {
  const ready=state==="ready";
  arrows.forEach(button=>button.disabled=!ready);
  powerInput.disabled=!ready;
  powerInput.value=power;
  get("powerText").textContent="%"+power;
  const column=aim.x<358?"Sol":aim.x>462?"Sağ":"Orta";
  const height=aim.y<168?" üst":aim.y>226?" alt":"";
  get("direction").textContent=column+height;
  kick.disabled=state==="flying";
  kick.firstChild.textContent=state==="done"?"Yeniden oyna ":state==="scored"?"Sıradaki şut ":state==="flying"?"Top havada ":"Şut çek ";
}

function renderBoard() {
  const goals=results.filter(result=>result==="goal").length;
  get("goals").textContent=goals;
  get("best").textContent=best;
  get("counter").textContent="Şut "+(state==="ready"||state==="flying"?results.length+1:results.length)+" / "+maxShots;
  const slots=Array.from({length:maxShots},(_,i)=>{
    const li=document.createElement("li"), result=results[i];
    li.className=result==="goal"?"goal":result?"miss":i===results.length?"current":"";
    li.textContent=result==="goal"?"✓":result?"×":i+1;
    li.setAttribute("aria-label",(i+1)+". şut"+(result?result==="goal"?", gol":result==="save"?", kurtarış":", dışarı":", bekliyor"));
    return li;
  });
  get("attempts").replaceChildren(...slots);
  syncControls();
}

function target(x,y) {
  aim={x:clamp(x,goal.left-32,goal.right+32),y:clamp(y,goal.top-52,goal.bottom+26)};
  syncControls();
}

function prepare() {
  state="ready";shot=null;gesture=null;aim={x:410,y:195};power=68;
  get("flash").hidden=true;
  get("fieldStatus").textContent="Top sende";
  get("result").textContent="";
  renderBoard();
}

function reset() {
  results=[];
  prepare();
}

const keeperAt=t=>410+Math.sin(t*2.4)*67;

function makeShot(aim,power,keeper,round,random) {
  const ends={x:aim.x,y:aim.y};
  if(power<33) ends.y+=90-(power-20)*5;
  if(power>93) ends.y-=(power-93)*3.6;
  const inside=ends.x>=goal.left+8&&ends.x<=goal.right-8&&ends.y>=goal.top+8&&ends.y<=goal.bottom-6;
  const reads=random<.44+round*.055;
  const reach=156-power*.72+round*4;
  const lateral=ends.x-keeper;
  const guess=random<.78?-reach:reach;
  const stride=reads?clamp(lateral,-reach,reach):guess;
  const dive=clamp(keeper+stride,goal.left+25,goal.right-25);
  const lean=clamp((dive-keeper)/92,-1,1);
  const height=clamp(ends.y,163,239);
  const saved=inside&&Math.abs(ends.x-dive)<44&&Math.abs(ends.y-height)<33;
  const outcome=inside?saved?"save":"goal":"miss";
  return {ends,keeper,dive,height,lean,outcome,duration:mix(.9,.44,(power-20)/80)};
}

function fire() {
  if(state!=="ready") return;
  const live=makeShot(aim,power,keeperAt(clock),results.length,Math.random());
  shot={...live,begin:clock,skin:balls.get(profile.selected)};
  state="flying";gesture=null;
  get("fieldStatus").textContent="Şut çekildi";
  syncControls();
}

function settle() {
  if(state!=="flying") return;
  const outcome=shot.outcome;
  const caption={goal:"Gol!",save:"Kaleci kurtardı!",miss:"Top dışarıda!"}[outcome];
  results.push(outcome);
  state=results.length===maxShots?"done":"scored";
  const goals=results.filter(result=>result==="goal").length;
  if(goals>best) {
    best=goals;
    try {localStorage.setItem("son-penalti-rekor",String(best));} catch {}
  }
  const rewarded=state==="done"&&goals>=rewardGoals;
  if(rewarded) addSeriesReward();
  const flash=get("flash");
  flash.dataset.outcome=outcome;
  flash.textContent=caption;flash.hidden=false;
  get("fieldStatus").textContent=state==="done"?(rewarded?"+"+seriesReward+" altın":"Seri bitti"):caption;
  const summary=state==="done"?" Seri tamamlandı. "+goals+" / "+maxShots+" gol.":"";
  get("result").textContent=caption+summary+(rewarded?" "+seriesReward+" altın kazandın!":"");
  renderBoard();
}

function draw() {
  c.drawImage(background,0,0);
  const travel=shot?clamp((clock-shot.begin)/shot.duration,0,1):0;
  const dive=shot?smooth(clamp((travel-.12)/.88,0,1)):0;
  drawKeeper(shot?mix(shot.keeper,shot.dive,dive):keeperAt(clock),
    shot?mix(241,shot.height+15,dive):241,
    shot?shot.lean*dive*.98:0,clock);

  if(state==="ready") {
    if(gesture?.swipe) {
      polygon(c,[[spot.x,spot.y],[aim.x,aim.y]],null,"#dafa586b",2);
    }
    c.strokeStyle="#e2ff69";c.lineWidth=2;
    c.beginPath();c.arc(aim.x,aim.y,12+Math.sin(clock*5)*2,0,Math.PI*2);c.stroke();
    polygon(c,[[aim.x-6,aim.y],[aim.x+6,aim.y]],null,"#f7ffaf");
    polygon(c,[[aim.x,aim.y-6],[aim.x,aim.y+6]],null,"#f7ffaf");
  }
  const end=shot?.ends??spot;
  const bx=mix(spot.x,end.x,travel);
  const lift=Math.sin(Math.PI*travel)*(power/4);
  const by=mix(spot.y,end.y,travel)-lift;
  ellipse(c,bx,mix(spot.y+8,goal.bottom,travel),mix(25,8,travel),mix(6,2,travel),"#142f2478");
  drawBall(c,bx,by,mix(22,7,travel),travel*13,shot?.skin??balls.get(profile.selected));
}

function frame(time) {
  clock=time/1000;
  if(state==="flying"&&clock-shot.begin>=shot.duration) settle();
  draw();
  requestAnimationFrame(frame);
}

function primaryAction() {
  if(state==="ready") fire();
  else if(state==="scored") prepare();
  else if(state==="done") reset();
}

kick.addEventListener("click",primaryAction);
get("reset").addEventListener("click",()=>{reset();kick.focus();});
arrows.forEach(button=>button.addEventListener("click",()=>{
  if(state==="ready") target(aim.x+Number(button.dataset.x)*26,aim.y+Number(button.dataset.y)*19);
}));
powerInput.addEventListener("input",()=>{power=Number(powerInput.value);syncControls();});

function pointOnField(event) {
  const rect=field.getBoundingClientRect();
  return {x:(event.clientX-rect.left)*W/rect.width,y:(event.clientY-rect.top)*H/rect.height};
}

function swipeTarget(point) {
  const dx=point.x-gesture.origin.x,dy=gesture.origin.y-point.y;
  power=Math.round(clamp(48+dy*.19,20,100));
  target(spot.x+dx*1.55,267-dy*.55);
}

field.addEventListener("pointerdown",event=>{
  if(state!=="ready"||event.button!==0||gesture) return;
  const origin=pointOnField(event);
  gesture={id:event.pointerId,origin,swipe:origin.y>342};
  if(!gesture.swipe) target(origin.x,origin.y);
  field.setPointerCapture(event.pointerId);
});
field.addEventListener("pointermove",event=>{
  if(gesture?.id!==event.pointerId) return;
  const point=pointOnField(event);
  if(gesture.swipe) swipeTarget(point);
  else target(point.x,point.y);
});
field.addEventListener("pointerup",event=>{
  if(gesture?.id!==event.pointerId) return;
  const point=pointOnField(event);
  if(gesture.swipe&&gesture.origin.y-point.y>=42) {
    swipeTarget(point);
    fire();
  }
  gesture=null;
});
for(const name of ["pointercancel","lostpointercapture"]) {
  field.addEventListener(name,event=>{if(gesture?.id===event.pointerId) gesture=null;});
}

const vectors={ArrowLeft:[-26,0],ArrowRight:[26,0],ArrowUp:[0,-19],ArrowDown:[0,19]};
window.addEventListener("keydown",event=>{
  if(shop.open||matchDialog.open||event.altKey||event.metaKey||event.ctrlKey) return;
  if(Object.hasOwn(vectors,event.key)&&state==="ready"&&event.target!==powerInput) {
    event.preventDefault();
    const [dx,dy]=vectors[event.key];
    target(aim.x+dx,aim.y+dy);
  }
  if(event.code==="Space"&&!event.repeat&&document.activeElement?.tagName!=="BUTTON"&&event.target!==powerInput) {
    event.preventDefault();primaryAction();
  }
});

prepare();
showCategory("balls");
requestAnimationFrame(frame);
