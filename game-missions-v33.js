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

const stadiums=new Map([
  ["classic",{name:"Klasik Stadyum",price:0,sky:"#0a2024",skyEnd:"#385d53",stand:"#203b3a",crowd:"#142c2c",turf:"#387954",turfEnd:"#173d2a"}],
  ["night",{name:"Gece Arenası",price:100,sky:"#080e2d",skyEnd:"#202b60",stand:"#252654",crowd:"#141735",turf:"#287253",turfEnd:"#0b382b"}],
  ["sunset",{name:"Gün Batımı",price:150,sky:"#ba5a43",skyEnd:"#e9aa6d",stand:"#8b514b",crowd:"#56343f",turf:"#548a4b",turfEnd:"#214d30"}],
  ["blue",{name:"Mavi Arena",price:220,sky:"#163a69",skyEnd:"#4e83a8",stand:"#26598a",crowd:"#163b69",turf:"#368c69",turfEnd:"#1b5541"}],
  ["gold",{name:"Şampiyon Stadyumu",price:350,sky:"#473220",skyEnd:"#b68b4e",stand:"#99723e",crowd:"#554026",turf:"#59954b",turfEnd:"#28502d"}]
]);
let activeStadium=stadiums.get("classic");
const defaultShirt = {body:"#ffb34e",sleeves:"#e98b43",stripe:"#f7d06f"};
const shirtPrice = 40;
const shirts = new Map([
  ["blue",{name:"Mavi Forma",price:shirtPrice,body:"#459af1",sleeves:"#2563aa",stripe:"#a3d9ff"}],
  ["red",{name:"Kırmızı Forma",price:shirtPrice,body:"#ed595c",sleeves:"#aa2839",stripe:"#ffada2"}],
  ["lime",{name:"Yeşil Forma",price:shirtPrice,body:"#8bd44d",sleeves:"#46852f",stripe:"#d8fba6"}],
  ["violet",{name:"Mor Forma",price:shirtPrice,body:"#a37aed",sleeves:"#613eac",stripe:"#e5d2ff"}],
  ["pink",{name:"Pembe Forma",price:shirtPrice,body:"#f582b4",sleeves:"#af3d78",stripe:"#ffd4e8"}],
  ["white",{name:"Beyaz Forma",price:shirtPrice,body:"#f1f7f5",sleeves:"#8fb8c0",stripe:"#52929d"}],
  ["brazil",{name:"🇧🇷 Brezilya Forması",price:shirtPrice,body:"#ffdf28",sleeves:"#ffdf28",stripe:"#16884a",national:"brazil"}],
  ["portugal",{name:"🇵🇹 Portekiz Forması",price:shirtPrice,body:"#b71932",sleeves:"#a5122b",stripe:"#087a46",national:"portugal"}],
  ["argentina",{name:"🇦🇷 Arjantin Forması",price:shirtPrice,body:"#f8fbff",sleeves:"#85c9f1",stripe:"#75bce8",national:"argentina"}],
  ["france",{name:"🇫🇷 Fransa Forması",price:shirtPrice,body:"#17366f",sleeves:"#102754",stripe:"#e63a49",national:"france"}],
  ["spain",{name:"🇪🇸 İspanya Forması",price:shirtPrice,body:"#d91f32",sleeves:"#c41628",stripe:"#ffc928",national:"spain"}],
  ["turkey",{name:"🇹🇷 Türkiye Forması",price:shirtPrice,body:"#f9fafb",sleeves:"#e8edf2",stripe:"#e51b35",national:"turkey"}]
]);

balls.set("box-emerald",{name:"Zümrüt Yıldızı",price:100,boxOnly:true,glow:"#e5fff0",base:"#16b98a",edge:"#075b55",patch:"#103f48",accent:"#fff4a1",pattern:"star"});
shirts.set("box-royal",{name:"Kraliyet Forması",price:200,boxOnly:true,body:"#23134c",sleeves:"#492a88",stripe:"#f6cc59"});
stadiums.set("box-aurora",{name:"Aurora Arenası",price:200,boxOnly:true,sky:"#12304e",skyEnd:"#39a69c",stand:"#254a69",crowd:"#182b48",turf:"#369c73",turfEnd:"#124b43"});
balls.set("box-ball-0",{"name":"Safir Özel Top","price":100,"boxOnly":true,"glow":"#d8faff","base":"#2879dc","edge":"#263849","patch":"#17283b","accent":"#d8faff","pattern":"star"});
shirts.set("box-shirt-0",{"name":"Safir Özel Forma","price":200,"boxOnly":true,"body":"#2879dc","sleeves":"#25304b","stripe":"#d8faff"});
stadiums.set("box-stadium-0",{"name":"Safir Arenası","price":200,"boxOnly":true,"sky":"#2879dc","skyEnd":"#d8faff","stand":"#2879dc","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-1",{"name":"Lav Özel Top","price":100,"boxOnly":true,"glow":"#ffd26a","base":"#d83d34","edge":"#263849","patch":"#17283b","accent":"#ffd26a","pattern":"wave"});
shirts.set("box-shirt-1",{"name":"Lav Özel Forma","price":200,"boxOnly":true,"body":"#d83d34","sleeves":"#25304b","stripe":"#ffd26a"});
stadiums.set("box-stadium-1",{"name":"Lav Arenası","price":200,"boxOnly":true,"sky":"#d83d34","skyEnd":"#ffd26a","stand":"#d83d34","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-2",{"name":"Galaksi Özel Top","price":100,"boxOnly":true,"glow":"#e6b7ff","base":"#713db8","edge":"#263849","patch":"#17283b","accent":"#e6b7ff","pattern":"bolt"});
shirts.set("box-shirt-2",{"name":"Galaksi Özel Forma","price":200,"boxOnly":true,"body":"#713db8","sleeves":"#25304b","stripe":"#e6b7ff"});
stadiums.set("box-stadium-2",{"name":"Galaksi Arenası","price":200,"boxOnly":true,"sky":"#713db8","skyEnd":"#e6b7ff","stand":"#713db8","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-3",{"name":"Gümüş Özel Top","price":100,"boxOnly":true,"glow":"#ffffff","base":"#aabac9","edge":"#263849","patch":"#17283b","accent":"#ffffff","pattern":"crystal"});
shirts.set("box-shirt-3",{"name":"Gümüş Özel Forma","price":200,"boxOnly":true,"body":"#aabac9","sleeves":"#25304b","stripe":"#ffffff"});
stadiums.set("box-stadium-3",{"name":"Gümüş Arenası","price":200,"boxOnly":true,"sky":"#aabac9","skyEnd":"#ffffff","stand":"#aabac9","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-4",{"name":"Mercan Özel Top","price":100,"boxOnly":true,"glow":"#ffe3c4","base":"#f77d76","edge":"#263849","patch":"#17283b","accent":"#ffe3c4","pattern":"stripes"});
shirts.set("box-shirt-4",{"name":"Mercan Özel Forma","price":200,"boxOnly":true,"body":"#f77d76","sleeves":"#25304b","stripe":"#ffe3c4"});
stadiums.set("box-stadium-4",{"name":"Mercan Arenası","price":200,"boxOnly":true,"sky":"#f77d76","skyEnd":"#ffe3c4","stand":"#f77d76","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-5",{"name":"Okyanus Özel Top","price":100,"boxOnly":true,"glow":"#70f2e4","base":"#167d9a","edge":"#263849","patch":"#17283b","accent":"#70f2e4","pattern":"star"});
shirts.set("box-shirt-5",{"name":"Okyanus Özel Forma","price":200,"boxOnly":true,"body":"#167d9a","sleeves":"#25304b","stripe":"#70f2e4"});
stadiums.set("box-stadium-5",{"name":"Okyanus Arenası","price":200,"boxOnly":true,"sky":"#167d9a","skyEnd":"#70f2e4","stand":"#167d9a","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-6",{"name":"Gece Özel Top","price":100,"boxOnly":true,"glow":"#d6a9ff","base":"#263049","edge":"#263849","patch":"#17283b","accent":"#d6a9ff","pattern":"wave"});
shirts.set("box-shirt-6",{"name":"Gece Özel Forma","price":200,"boxOnly":true,"body":"#263049","sleeves":"#25304b","stripe":"#d6a9ff"});
stadiums.set("box-stadium-6",{"name":"Gece Arenası","price":200,"boxOnly":true,"sky":"#263049","skyEnd":"#d6a9ff","stand":"#263049","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-7",{"name":"Güneş Özel Top","price":100,"boxOnly":true,"glow":"#fff5aa","base":"#e9a51b","edge":"#263849","patch":"#17283b","accent":"#fff5aa","pattern":"bolt"});
shirts.set("box-shirt-7",{"name":"Güneş Özel Forma","price":200,"boxOnly":true,"body":"#e9a51b","sleeves":"#25304b","stripe":"#fff5aa"});
stadiums.set("box-stadium-7",{"name":"Güneş Arenası","price":200,"boxOnly":true,"sky":"#e9a51b","skyEnd":"#fff5aa","stand":"#e9a51b","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-8",{"name":"Orman Özel Top","price":100,"boxOnly":true,"glow":"#c5f68a","base":"#36794b","edge":"#263849","patch":"#17283b","accent":"#c5f68a","pattern":"crystal"});
shirts.set("box-shirt-8",{"name":"Orman Özel Forma","price":200,"boxOnly":true,"body":"#36794b","sleeves":"#25304b","stripe":"#c5f68a"});
stadiums.set("box-stadium-8",{"name":"Orman Arenası","price":200,"boxOnly":true,"sky":"#36794b","skyEnd":"#c5f68a","stand":"#36794b","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-9",{"name":"Buz Özel Top","price":100,"boxOnly":true,"glow":"#f6ffff","base":"#82c9ed","edge":"#263849","patch":"#17283b","accent":"#f6ffff","pattern":"stripes"});
shirts.set("box-shirt-9",{"name":"Buz Özel Forma","price":200,"boxOnly":true,"body":"#82c9ed","sleeves":"#25304b","stripe":"#f6ffff"});
stadiums.set("box-stadium-9",{"name":"Buz Arenası","price":200,"boxOnly":true,"sky":"#82c9ed","skyEnd":"#f6ffff","stand":"#82c9ed","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-10",{"name":"Volkan Özel Top","price":100,"boxOnly":true,"glow":"hsl(72,85%,82%)","base":"hsl(12,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(72,85%,82%)","pattern":"star"});
shirts.set("box-shirt-10",{"name":"Volkan Özel Forma","price":200,"boxOnly":true,"body":"hsl(12,65%,48%)","sleeves":"#25304b","stripe":"hsl(72,85%,82%)"});
stadiums.set("box-stadium-10",{"name":"Volkan Arenası","price":200,"boxOnly":true,"sky":"hsl(12,65%,48%)","skyEnd":"hsl(72,85%,82%)","stand":"hsl(12,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-11",{"name":"Kutup Özel Top","price":100,"boxOnly":true,"glow":"hsl(209,85%,82%)","base":"hsl(149,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(209,85%,82%)","pattern":"wave"});
shirts.set("box-shirt-11",{"name":"Kutup Özel Forma","price":200,"boxOnly":true,"body":"hsl(149,65%,48%)","sleeves":"#25304b","stripe":"hsl(209,85%,82%)"});
stadiums.set("box-stadium-11",{"name":"Kutup Arenası","price":200,"boxOnly":true,"sky":"hsl(149,65%,48%)","skyEnd":"hsl(209,85%,82%)","stand":"hsl(149,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-12",{"name":"Neon Özel Top","price":100,"boxOnly":true,"glow":"hsl(346,85%,82%)","base":"hsl(286,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(346,85%,82%)","pattern":"bolt"});
shirts.set("box-shirt-12",{"name":"Neon Özel Forma","price":200,"boxOnly":true,"body":"hsl(286,65%,48%)","sleeves":"#25304b","stripe":"hsl(346,85%,82%)"});
stadiums.set("box-stadium-12",{"name":"Neon Arenası","price":200,"boxOnly":true,"sky":"hsl(286,65%,48%)","skyEnd":"hsl(346,85%,82%)","stand":"hsl(286,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-13",{"name":"Elmas Özel Top","price":100,"boxOnly":true,"glow":"hsl(123,85%,82%)","base":"hsl(63,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(123,85%,82%)","pattern":"crystal"});
shirts.set("box-shirt-13",{"name":"Elmas Özel Forma","price":200,"boxOnly":true,"body":"hsl(63,65%,48%)","sleeves":"#25304b","stripe":"hsl(123,85%,82%)"});
stadiums.set("box-stadium-13",{"name":"Elmas Arenası","price":200,"boxOnly":true,"sky":"hsl(63,65%,48%)","skyEnd":"hsl(123,85%,82%)","stand":"hsl(63,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-14",{"name":"Yakut Özel Top","price":100,"boxOnly":true,"glow":"hsl(260,85%,82%)","base":"hsl(200,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(260,85%,82%)","pattern":"stripes"});
shirts.set("box-shirt-14",{"name":"Yakut Özel Forma","price":200,"boxOnly":true,"body":"hsl(200,65%,48%)","sleeves":"#25304b","stripe":"hsl(260,85%,82%)"});
stadiums.set("box-stadium-14",{"name":"Yakut Arenası","price":200,"boxOnly":true,"sky":"hsl(200,65%,48%)","skyEnd":"hsl(260,85%,82%)","stand":"hsl(200,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-15",{"name":"Ametist Özel Top","price":100,"boxOnly":true,"glow":"hsl(37,85%,82%)","base":"hsl(337,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(37,85%,82%)","pattern":"orbit"});
shirts.set("box-shirt-15",{"name":"Ametist Özel Forma","price":200,"boxOnly":true,"body":"hsl(337,65%,48%)","sleeves":"#25304b","stripe":"hsl(37,85%,82%)"});
stadiums.set("box-stadium-15",{"name":"Ametist Arenası","price":200,"boxOnly":true,"sky":"hsl(337,65%,48%)","skyEnd":"hsl(37,85%,82%)","stand":"hsl(337,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-16",{"name":"Fırtına Özel Top","price":100,"boxOnly":true,"glow":"hsl(174,85%,82%)","base":"hsl(114,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(174,85%,82%)","pattern":"rainbow"});
shirts.set("box-shirt-16",{"name":"Fırtına Özel Forma","price":200,"boxOnly":true,"body":"hsl(114,65%,48%)","sleeves":"#25304b","stripe":"hsl(174,85%,82%)"});
stadiums.set("box-stadium-16",{"name":"Fırtına Arenası","price":200,"boxOnly":true,"sky":"hsl(114,65%,48%)","skyEnd":"hsl(174,85%,82%)","stand":"hsl(114,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-17",{"name":"Çöl Özel Top","price":100,"boxOnly":true,"glow":"hsl(311,85%,82%)","base":"hsl(251,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(311,85%,82%)","pattern":"star"});
shirts.set("box-shirt-17",{"name":"Çöl Özel Forma","price":200,"boxOnly":true,"body":"hsl(251,65%,48%)","sleeves":"#25304b","stripe":"hsl(311,85%,82%)"});
stadiums.set("box-stadium-17",{"name":"Çöl Arenası","price":200,"boxOnly":true,"sky":"hsl(251,65%,48%)","skyEnd":"hsl(311,85%,82%)","stand":"hsl(251,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-18",{"name":"Şafak Özel Top","price":100,"boxOnly":true,"glow":"hsl(88,85%,82%)","base":"hsl(28,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(88,85%,82%)","pattern":"wave"});
shirts.set("box-shirt-18",{"name":"Şafak Özel Forma","price":200,"boxOnly":true,"body":"hsl(28,65%,48%)","sleeves":"#25304b","stripe":"hsl(88,85%,82%)"});
stadiums.set("box-stadium-18",{"name":"Şafak Arenası","price":200,"boxOnly":true,"sky":"hsl(28,65%,48%)","skyEnd":"hsl(88,85%,82%)","stand":"hsl(28,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-19",{"name":"Ay Özel Top","price":100,"boxOnly":true,"glow":"hsl(225,85%,82%)","base":"hsl(165,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(225,85%,82%)","pattern":"bolt"});
shirts.set("box-shirt-19",{"name":"Ay Özel Forma","price":200,"boxOnly":true,"body":"hsl(165,65%,48%)","sleeves":"#25304b","stripe":"hsl(225,85%,82%)"});
stadiums.set("box-stadium-19",{"name":"Ay Arenası","price":200,"boxOnly":true,"sky":"hsl(165,65%,48%)","skyEnd":"hsl(225,85%,82%)","stand":"hsl(165,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-20",{"name":"Mars Özel Top","price":100,"boxOnly":true,"glow":"hsl(2,85%,82%)","base":"hsl(302,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(2,85%,82%)","pattern":"crystal"});
shirts.set("box-shirt-20",{"name":"Mars Özel Forma","price":200,"boxOnly":true,"body":"hsl(302,65%,48%)","sleeves":"#25304b","stripe":"hsl(2,85%,82%)"});
stadiums.set("box-stadium-20",{"name":"Mars Arenası","price":200,"boxOnly":true,"sky":"hsl(302,65%,48%)","skyEnd":"hsl(2,85%,82%)","stand":"hsl(302,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-21",{"name":"Venüs Özel Top","price":100,"boxOnly":true,"glow":"hsl(139,85%,82%)","base":"hsl(79,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(139,85%,82%)","pattern":"stripes"});
shirts.set("box-shirt-21",{"name":"Venüs Özel Forma","price":200,"boxOnly":true,"body":"hsl(79,65%,48%)","sleeves":"#25304b","stripe":"hsl(139,85%,82%)"});
stadiums.set("box-stadium-21",{"name":"Venüs Arenası","price":200,"boxOnly":true,"sky":"hsl(79,65%,48%)","skyEnd":"hsl(139,85%,82%)","stand":"hsl(79,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-22",{"name":"Satürn Özel Top","price":100,"boxOnly":true,"glow":"hsl(276,85%,82%)","base":"hsl(216,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(276,85%,82%)","pattern":"orbit"});
shirts.set("box-shirt-22",{"name":"Satürn Özel Forma","price":200,"boxOnly":true,"body":"hsl(216,65%,48%)","sleeves":"#25304b","stripe":"hsl(276,85%,82%)"});
stadiums.set("box-stadium-22",{"name":"Satürn Arenası","price":200,"boxOnly":true,"sky":"hsl(216,65%,48%)","skyEnd":"hsl(276,85%,82%)","stand":"hsl(216,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-23",{"name":"Bulut Özel Top","price":100,"boxOnly":true,"glow":"hsl(53,85%,82%)","base":"hsl(353,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(53,85%,82%)","pattern":"rainbow"});
shirts.set("box-shirt-23",{"name":"Bulut Özel Forma","price":200,"boxOnly":true,"body":"hsl(353,65%,48%)","sleeves":"#25304b","stripe":"hsl(53,85%,82%)"});
stadiums.set("box-stadium-23",{"name":"Bulut Arenası","price":200,"boxOnly":true,"sky":"hsl(353,65%,48%)","skyEnd":"hsl(53,85%,82%)","stand":"hsl(353,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-24",{"name":"Çelik Özel Top","price":100,"boxOnly":true,"glow":"hsl(190,85%,82%)","base":"hsl(130,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(190,85%,82%)","pattern":"star"});
shirts.set("box-shirt-24",{"name":"Çelik Özel Forma","price":200,"boxOnly":true,"body":"hsl(130,65%,48%)","sleeves":"#25304b","stripe":"hsl(190,85%,82%)"});
stadiums.set("box-stadium-24",{"name":"Çelik Arenası","price":200,"boxOnly":true,"sky":"hsl(130,65%,48%)","skyEnd":"hsl(190,85%,82%)","stand":"hsl(130,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-25",{"name":"Bronz Özel Top","price":100,"boxOnly":true,"glow":"hsl(327,85%,82%)","base":"hsl(267,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(327,85%,82%)","pattern":"wave"});
shirts.set("box-shirt-25",{"name":"Bronz Özel Forma","price":200,"boxOnly":true,"body":"hsl(267,65%,48%)","sleeves":"#25304b","stripe":"hsl(327,85%,82%)"});
stadiums.set("box-stadium-25",{"name":"Bronz Arenası","price":200,"boxOnly":true,"sky":"hsl(267,65%,48%)","skyEnd":"hsl(327,85%,82%)","stand":"hsl(267,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-26",{"name":"İnci Özel Top","price":100,"boxOnly":true,"glow":"hsl(104,85%,82%)","base":"hsl(44,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(104,85%,82%)","pattern":"bolt"});
shirts.set("box-shirt-26",{"name":"İnci Özel Forma","price":200,"boxOnly":true,"body":"hsl(44,65%,48%)","sleeves":"#25304b","stripe":"hsl(104,85%,82%)"});
stadiums.set("box-stadium-26",{"name":"İnci Arenası","price":200,"boxOnly":true,"sky":"hsl(44,65%,48%)","skyEnd":"hsl(104,85%,82%)","stand":"hsl(44,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-27",{"name":"Zeytin Özel Top","price":100,"boxOnly":true,"glow":"hsl(241,85%,82%)","base":"hsl(181,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(241,85%,82%)","pattern":"crystal"});
shirts.set("box-shirt-27",{"name":"Zeytin Özel Forma","price":200,"boxOnly":true,"body":"hsl(181,65%,48%)","sleeves":"#25304b","stripe":"hsl(241,85%,82%)"});
stadiums.set("box-stadium-27",{"name":"Zeytin Arenası","price":200,"boxOnly":true,"sky":"hsl(181,65%,48%)","skyEnd":"hsl(241,85%,82%)","stand":"hsl(181,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-28",{"name":"Limon Özel Top","price":100,"boxOnly":true,"glow":"hsl(18,85%,82%)","base":"hsl(318,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(18,85%,82%)","pattern":"stripes"});
shirts.set("box-shirt-28",{"name":"Limon Özel Forma","price":200,"boxOnly":true,"body":"hsl(318,65%,48%)","sleeves":"#25304b","stripe":"hsl(18,85%,82%)"});
stadiums.set("box-stadium-28",{"name":"Limon Arenası","price":200,"boxOnly":true,"sky":"hsl(318,65%,48%)","skyEnd":"hsl(18,85%,82%)","stand":"hsl(318,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-29",{"name":"Lavanta Özel Top","price":100,"boxOnly":true,"glow":"hsl(155,85%,82%)","base":"hsl(95,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(155,85%,82%)","pattern":"orbit"});
shirts.set("box-shirt-29",{"name":"Lavanta Özel Forma","price":200,"boxOnly":true,"body":"hsl(95,65%,48%)","sleeves":"#25304b","stripe":"hsl(155,85%,82%)"});
stadiums.set("box-stadium-29",{"name":"Lavanta Arenası","price":200,"boxOnly":true,"sky":"hsl(95,65%,48%)","skyEnd":"hsl(155,85%,82%)","stand":"hsl(95,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-30",{"name":"Kobalt Özel Top","price":100,"boxOnly":true,"glow":"hsl(292,85%,82%)","base":"hsl(232,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(292,85%,82%)","pattern":"rainbow"});
shirts.set("box-shirt-30",{"name":"Kobalt Özel Forma","price":200,"boxOnly":true,"body":"hsl(232,65%,48%)","sleeves":"#25304b","stripe":"hsl(292,85%,82%)"});
stadiums.set("box-stadium-30",{"name":"Kobalt Arenası","price":200,"boxOnly":true,"sky":"hsl(232,65%,48%)","skyEnd":"hsl(292,85%,82%)","stand":"hsl(232,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-31",{"name":"Turmalin Özel Top","price":100,"boxOnly":true,"glow":"hsl(69,85%,82%)","base":"hsl(9,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(69,85%,82%)","pattern":"star"});
shirts.set("box-shirt-31",{"name":"Turmalin Özel Forma","price":200,"boxOnly":true,"body":"hsl(9,65%,48%)","sleeves":"#25304b","stripe":"hsl(69,85%,82%)"});
stadiums.set("box-stadium-31",{"name":"Turmalin Arenası","price":200,"boxOnly":true,"sky":"hsl(9,65%,48%)","skyEnd":"hsl(69,85%,82%)","stand":"hsl(9,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
balls.set("box-ball-32",{"name":"Kuzey Özel Top","price":100,"boxOnly":true,"glow":"hsl(206,85%,82%)","base":"hsl(146,65%,48%)","edge":"#263849","patch":"#17283b","accent":"hsl(206,85%,82%)","pattern":"wave"});
shirts.set("box-shirt-32",{"name":"Kuzey Özel Forma","price":200,"boxOnly":true,"body":"hsl(146,65%,48%)","sleeves":"#25304b","stripe":"hsl(206,85%,82%)"});
stadiums.set("box-stadium-32",{"name":"Kuzey Arenası","price":200,"boxOnly":true,"sky":"hsl(146,65%,48%)","skyEnd":"hsl(206,85%,82%)","stand":"hsl(146,65%,48%)","crowd":"#192b39","turf":"#368a59","turfEnd":"#153e2a"});
for(let i=33;i<99;i++){
 const themes=["Atlas","Nova","Meteor","Prizma","Kanyon","Kozmos","Okyanus","Kristal","Şimşek","Ufuk","Ekinoks"];
 const name=themes[(i-33)%11]+" "+(1+Math.floor((i-33)/11));
 const hue=(i*137.508)%360;
 const c="hsl("+hue+", "+(55+i%30)+"%, "+(35+i%25)+"%)",a="hsl("+((hue+65)%360)+", 85%, 82%)";
 balls.set("box-ball-"+i,{name:name+" Top",price:100,boxOnly:true,glow:a,base:c,edge:"#263849",patch:"#17283b",accent:a,pattern:["star","wave","bolt","crystal","stripes","orbit","rainbow"][i%7]});
 shirts.set("box-shirt-"+i,{name:name+" Forma",price:200,boxOnly:true,body:c,sleeves:a,stripe:"#25304b"});
 stadiums.set("box-stadium-"+i,{name:name+" Arenası",price:200,boxOnly:true,sky:c,skyEnd:a,stand:c,crowd:"#192b39",turf:"#368a59",turfEnd:"#153e2a"});
}
function ensureExtraModel(kind,i,auto=false){
 const map=kind==="ball"?balls:kind==="shirt"?shirts:stadiums,id=(auto?"box-auto-":"box-")+kind+"-"+i;
 if(map.has(id))return id;
 const hue=(i*137.508)%360,c="hsl("+hue+", 70%, "+(35+i%25)+"%)",a="hsl("+((hue+65)%360)+", 85%, 82%)";
 const name="Özel Seri "+(i+(auto?1:2));
 map.set(id,kind==="ball"?{name:name+" Top",price:100,boxOnly:true,glow:a,base:c,edge:"#263849",patch:"#17283b",accent:a,pattern:["star","wave","bolt","crystal","stripes","orbit","rainbow"][i%7]}:kind==="shirt"?{name:name+" Forma",price:200,boxOnly:true,body:c,sleeves:a,stripe:"#25304b"}:{name:name+" Arenası",price:200,boxOnly:true,sky:c,skyEnd:a,stand:c,crowd:"#192b39",turf:"#368a59",turfEnd:"#153e2a"});
 return id;
}
function restoreExtraModels(saved){
 for(const [key,kind] of [["owned","ball"],["ownedShirts","shirt"],["ownedStadiums","stadium"]]){
 for(const id of Array.isArray(saved[key])?saved[key]:[]){const m=typeof id==="string"&&id.match(/^box-(auto-)?(ball|shirt|stadium)-(\d+)$/);if(m&&m[2]===kind&&Number.isSafeInteger(Number(m[3]))&&(m[1]||Number(m[3])>=99))ensureExtraModel(kind,Number(m[3]),!!m[1]);}
 }
}
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
  // Stadium-wide ambient illumination, built once rather than each frame.
  g.imageSmoothingEnabled=true;
  const sky=g.createLinearGradient(0,0,0,280);
  sky.addColorStop(0,activeStadium.sky);sky.addColorStop(1,activeStadium.skyEnd);
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
  // Broadcast floodlight beams and layered atmospheric depth, cached on the stadium canvas.
  g.save();
  for(const x of [80,740]){
    const beam=g.createLinearGradient(x,42,410,345);
    beam.addColorStop(0,"#f2ffe330");beam.addColorStop(.45,"#d9ffe50d");beam.addColorStop(1,"#d9ffe500");
    g.fillStyle=beam;
    g.beginPath();g.moveTo(x-32,60);g.lineTo(x+32,60);
    g.lineTo(x===80?490:330,410);g.lineTo(x===80?-50:870,410);
    g.closePath();g.fill();
  }
  const atmosphere=g.createLinearGradient(0,85,0,245);
  atmosphere.addColorStop(0,"#ffffff00");atmosphere.addColorStop(.62,"#d9fff40a");atmosphere.addColorStop(1,"#b7e8d81d");
  g.fillStyle=atmosphere;g.fillRect(0,85,W,160);
  g.restore();
  polygon(g,[[0,99],[146,123],[302,136],[500,136],[682,121],[820,97],[820,239],[0,239]],activeStadium.stand,"#50706a",3);
  polygon(g,[[0,141],[167,152],[330,158],[490,158],[665,153],[820,138],[820,219],[0,219]],activeStadium.crowd);
  let seed=150;
  const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const palette=["#79a698","#335f56","#ddd77b","#9c7664","#52746d","#bcc1a8"];
  for(let i=0;i<1500;i++) {
    const x=rand()*W, y=129+rand()*80+(1-Math.abs((x-410)/410))*17;
    const size=.6+rand()*1.7;
    ellipse(g,x,y,size,size*.63,palette[Math.floor(rand()*palette.length)]);
  }
  for(const y of [160,191,219]) polygon(g,[[0,y-14],[410,y],[W,y-14]],null,"#294744",3);
  // Stadium atmosphere: upper-tier seating, illuminated ribbon boards and depth haze.
  const haze=g.createLinearGradient(0,95,0,250);
  haze.addColorStop(0,"#ffffff00");haze.addColorStop(.75,"#b7e3d012");haze.addColorStop(1,"#e0fff00c");
  g.fillStyle=haze;g.fillRect(0,95,W,155);
  for(let tier=0;tier<3;tier++){
    const y=111+tier*25;
    g.beginPath();g.moveTo(0,y-8);g.quadraticCurveTo(W/2,y+22,W,y-8);
    g.strokeStyle=tier===2?"#bce9d099":"#e1f3df45";g.lineWidth=tier===2?3:1.5;g.stroke();
  }
  for(let x=8;x<W;x+=32){
    const y=208+Math.sin(x/W*Math.PI)*9;
    g.fillStyle=(Math.floor(x/32)%4===0)?"#d9ff94":"#8fe6cd";
    g.globalAlpha=.45;g.fillRect(x,y,19,2);
  }
  g.globalAlpha=1;
  g.fillStyle="#18423b";g.fillRect(0,221,W,26);
  for(let x=13;x<W;x+=105) {
    polygon(g,[[x,226],[x+86,226],[x+80,241],[x,241]],x%2?"#314e46":"#394f38");
    polygon(g,[[x+9,233],[x+71,233]],null,"#c0d68066",2);
  }
  // Advertising-board illumination, small spectator flags and layered seats.
  g.save();
  for(let i=0;i<14;i++){
    const x=i*64-6,y=225+Math.sin(i*.48)*2;
    const panel=g.createLinearGradient(x,y,x,y+18);
    panel.addColorStop(0,i%3===0?"#2a857b":"#1a504b");
    panel.addColorStop(1,"#071f24");
    g.fillStyle=panel;g.fillRect(x,y,62,18);
    g.fillStyle=i%3===0?"#d8ff81":"#a9f3df";
    g.globalAlpha=.85;g.fillRect(x+7,y+6,42,2);
  }
  g.globalAlpha=1;
  for(let i=0;i<20;i++){
    const x=22+i*41,y=172+Math.sin(i*.9)*7;
    g.strokeStyle="#e6ffec55";g.lineWidth=1.2;
    g.beginPath();g.moveTo(x,y);g.lineTo(x,y-9);g.stroke();
    g.fillStyle=i%3===0?"#f4edaa":i%3===1?"#c5e6d6":"#91bdac";
    g.beginPath();g.moveTo(x,y-9);g.lineTo(x+8,y-6);g.lineTo(x,y-3);g.closePath();g.fill();
  }
  g.restore();
  const turf=g.createLinearGradient(0,233,0,510);
  turf.addColorStop(0,activeStadium.turf);turf.addColorStop(1,activeStadium.turfEnd);
  g.fillStyle=turf;g.fillRect(0,246,W,H-246);
  // Subtle broadcast-style pitch mowing stripes and foreground vignette.
  g.save();
  for(let i=0;i<8;i++){
    const top=248+i*35,bottom=top+35;
    g.fillStyle=i%2?"#d8ffca08":"#071f140c";
    g.fillRect(0,top,W,35);
  }
  const pitchLight=g.createRadialGradient(410,305,70,410,355,520);
  pitchLight.addColorStop(0,"#ffffff00");pitchLight.addColorStop(1,"#00180f55");
  g.fillStyle=pitchLight;g.fillRect(0,246,W,H-246);
  g.restore();
  for(let i=-5;i<5;i+=2) polygon(g,[[410+i*72,245],[410+(i+1)*72,245],[410+(i+1)*154,H],[410+i*154,H]],"#7ed06419");
  for(let i=0;i<650;i++) {
    const x=rand()*W,y=250+rand()*260;
    polygon(g,[[x,y],[x+rand()*5,y-2]],null,i%2?"#ace59019":"#0b311e46");
  }
  polygon(g,[[5,283],[815,283]],null,"#e6f4e799",2);
  polygon(g,[[180,284],[116,363],[704,363],[640,284]],null,"#d6f0dbaa",2);
  polygon(g,[[92,284],[-4,476],[824,476],[728,284]],null,"#d6f0dbaa",2.2);
  // Foreground blades and pitch texture, generated only when the stadium changes.
  g.save();
  for(let i=0;i<260;i++){
    const x=rand()*W,y=315+rand()*195;
    g.strokeStyle=i%3===0?"#b6e89d30":"#173d293a";
    g.lineWidth=.7+rand()*.7;
    g.beginPath();g.moveTo(x,y);g.lineTo(x+rand()*3-1.5,y-2-rand()*4);g.stroke();
  }
  g.restore();
  ellipse(g,spot.x,spot.y+3,5,2.5,"#c4dbc4");
  ellipse(g,410,288,210,15,"#112e2480");
  // Pitch boundary highlights and subtle grass reflections.
  g.save();
  g.strokeStyle="#dcffd52b";g.lineWidth=1.5;
  for(let i=0;i<9;i++){
    const y=294+i*24;
    g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();
  }
  g.restore();
  // Turf-edge vignette and pitch floodlight spill.
  g.save();
  const lightPool=g.createRadialGradient(410,315,45,410,340,510);
  lightPool.addColorStop(0,"#e6ffd00e");lightPool.addColorStop(.6,"#d0ffd000");lightPool.addColorStop(1,"#03160b45");
  g.fillStyle=lightPool;g.fillRect(0,247,W,H-247);
  g.restore();
  drawNet(g);
}

function drawNet(g) {
  const {left,right,top,bottom}=goal;
  polygon(g,[[left-3,bottom],[253,265],[567,265],[right+3,bottom]],"#c2e5da20","#c2e5da8a");
  polygon(g,[[left,top],[253,top+20],[253,265],[left,bottom]],"#b2ddd83a","#b2ddd8aa");
  polygon(g,[[right,top],[567,top+20],[567,265],[right,bottom]],"#b2ddd83a","#b2ddd8aa");
  // Goal-mouth contact shadows emphasize the 3D net depth.
  g.save();
  const depthShadow=g.createLinearGradient(left,top,right,bottom);
  depthShadow.addColorStop(0,"#061c1b24");
  depthShadow.addColorStop(.55,"#061c1b00");
  depthShadow.addColorStop(1,"#061c1b38");
  g.fillStyle=depthShadow;
  g.fillRect(left,top,right-left,bottom-top);
  g.restore();
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
  // Extra goal depth: rear net supports and subtle woven threads.
  g.save();
  g.strokeStyle="#ffffff28";g.lineWidth=.7;
  for(let i=0;i<=48;i++){
    const x=mix(left,right,i/48);
    g.beginPath();g.moveTo(x,top);g.lineTo(mix(253,567,i/48),265);g.stroke();
  }
  for(let i=0;i<=22;i++){
    const y=mix(top,bottom,i/22);
    g.beginPath();g.moveTo(left,y);g.lineTo(right,y);g.stroke();
  }
  g.restore();
  polygon(g,[[left,bottom],[left,top],[right,top],[right,bottom]],null,"#123b37",11);
  polygon(g,[[left,bottom],[left,top],[right,top],[right,bottom]],null,"#eff6eb",7);
}

function drawKeeper(x,y,lean,t,ctx=c) {
  const shirt=shirts.get(profile.selectedShirt)??defaultShirt;
  ctx.save();
  const shadow=ctx.createRadialGradient(x,goal.bottom-4,1,x,goal.bottom-4,42);
  shadow.addColorStop(0,"#04150c8c");
  shadow.addColorStop(1,"#04150c00");
  ellipse(ctx,x,goal.bottom-4,42,10,shadow);
  ctx.restore();
  ctx.save();ctx.translate(x,y);ctx.rotate(lean);
  const stride=Math.sin(t*10)*3*(1-Math.min(1,Math.abs(lean)));
  ctx.lineCap="round";
  polygon(ctx,[[-9,9],[-13+stride,25],[-20+stride,38]],null,"#223343",9);
  polygon(ctx,[[8,9],[14-stride,24],[19-stride,38]],null,"#223343",9);
  polygon(ctx,[[-20+stride,38],[-26+stride,39]],null,"#ebf3dd",5);
  polygon(ctx,[[19-stride,38],[25-stride,38]],null,"#ebf3dd",5);
  polygon(ctx,[[-13,-17],[-24,-8],[-28,-14]],null,shirt.sleeves,8);
  polygon(ctx,[[13,-17],[24,-8],[29,-15]],null,shirt.sleeves,8);
  ellipse(ctx,-29,-14,5,6,"#f5eee3");ellipse(ctx,30,-15,5,6,"#f5eee3");
  polygon(ctx,[[-13,-20],[13,-20],[11,6],[-11,6]],shirt.body,"#243a34",1.5);
  if(shirt.national){
    ctx.save();ctx.beginPath();ctx.moveTo(-13,-20);ctx.lineTo(13,-20);ctx.lineTo(11,6);ctx.lineTo(-11,6);ctx.closePath();ctx.clip();
    drawNationalKit(ctx,shirt,-13,-20,26,26);ctx.restore();
  }else{
  polygon(ctx,[[-4,-17],[-1,3],[4,3],[2,-17]],shirt.stripe);
  }
  // Jersey fabric sheen, seams and goalkeeper glove detail.
  ctx.save();
  ctx.globalAlpha=.23;
  polygon(ctx,[[-10,-18],[-4,-16],[-3,2],[-10,3]],"#ffffff");
  polygon(ctx,[[6,-17],[10,-16],[9,2],[6,3]],"#ffffff");
  ctx.restore();
  ctx.strokeStyle="#f4f8e3aa";ctx.lineWidth=1.3;
  ctx.beginPath();ctx.moveTo(-9,-18);ctx.lineTo(-9,-10);ctx.moveTo(9,-18);ctx.lineTo(9,-10);ctx.stroke();
  for(const gx of [-29,30]){
    ctx.save();ctx.translate(gx,-15);
    ctx.strokeStyle="#2d4b47";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(-3,-3);ctx.lineTo(3,3);ctx.moveTo(3,-3);ctx.lineTo(-3,3);ctx.stroke();
    ctx.restore();
  }
  // Highlights on gloves, shin guards and kit give the 2D keeper more depth.
  ctx.save();
  ctx.globalAlpha=.32;
  polygon(ctx,[[-15,11],[-13,23],[-16,29]],"#c8d9e4");
  polygon(ctx,[[12,10],[15,23],[17,29]],"#c8d9e4");
  ellipse(ctx,-29,-17,2,2,"#ffffff");
  ellipse(ctx,30,-18,2,2,"#ffffff");
  ctx.restore();
  ellipse(ctx,0,-28,9,10,"#b56e4f");
  polygon(ctx,[[-9,-30],[-7,-36],[2,-39],[9,-32]],"#3c2e28");
  // Face and shirt finishing touches, scaled with every goalkeeper.
  ctx.restore();
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
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(spin);
  // Layered spherical shading shared by every ball skin.
  const base=ctx.createRadialGradient(-r*.3,-r*.4,r*.05,0,0,r);
  base.addColorStop(0,skin.glow);
  base.addColorStop(.68,skin.base);
  base.addColorStop(1,skin.edge);
  ctx.save();
  ctx.shadowColor="#ffffff55";
  ctx.shadowBlur=Math.min(9,r*.4);
  ellipse(ctx,0,0,r,r,base);
  ctx.restore();
  if(skin.pattern) {
    drawBallPattern(ctx,r,skin);
  } else {
    const patches=[[0,0,.36],[-.76,.25,.23],[.71,.41,.22],[.2,-.77,.24],[-.26,.76,.21]];
    patches.forEach(([px,py,size])=>{
      const points=Array.from({length:5},(_,i)=>{
        const angle=i*Math.PI*2/5-Math.PI/2;
        return [(px+Math.cos(angle)*size)*r,(py+Math.sin(angle)*size)*r];
      });
      polygon(ctx,points,skin.patch);
    });
  }
  ctx.save();
  ctx.beginPath();ctx.arc(0,0,r*.98,0,Math.PI*2);ctx.clip();
  const sheen=ctx.createRadialGradient(-r*.48,-r*.57,0,-r*.23,-r*.31,r*.9);
  sheen.addColorStop(0,"#ffffffa8");
  sheen.addColorStop(.35,"#ffffff22");
  sheen.addColorStop(1,"#ffffff00");
  ellipse(ctx,0,0,r,r,sheen);
  const lowerShade=ctx.createLinearGradient(0,-r,0,r);
  lowerShade.addColorStop(0,"#ffffff00");
  lowerShade.addColorStop(.62,"#00000000");
  lowerShade.addColorStop(1,"#03140b52");
  ellipse(ctx,0,0,r,r,lowerShade);
  ctx.restore();
  ctx.strokeStyle="#ffffff66";
  ctx.lineWidth=Math.max(.65,r*.055);
  ctx.beginPath();ctx.arc(0,0,r*.9,Math.PI*1.12,Math.PI*1.72);ctx.stroke();
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
const initialProfile={gold:0,legacyGold:0,owned:["classic"],selected:"classic",ownedShirts:[],selectedShirt:null,ownedStadiums:["classic"],selectedStadium:"classic"};
let profile=readProfile(initialProfile);
let category="balls";
activeStadium=stadiums.get(profile.selectedStadium)||stadiums.get("classic");
buildStadium();

function readProfile(fallback) {
  try {
    const oldGold=Number(localStorage.getItem(goldKey));
    const legacyGold=Number.isSafeInteger(oldGold)&&oldGold>=0?oldGold:0;
    const saved=JSON.parse(localStorage.getItem(profileKey));
    if(!saved) return {...fallback,gold:Math.max(fallback.gold,legacyGold),legacyGold};
    restoreExtraModels(saved);
    const owned=Array.isArray(saved.owned)?saved.owned.filter(id=>balls.has(id)):[];
    if(!owned.includes("classic")) owned.unshift("classic");
    const selected=owned.includes(saved.selected)?saved.selected:"classic";
    const ownedShirts=Array.isArray(saved.ownedShirts)?saved.ownedShirts.filter(id=>shirts.has(id)):[];
    const selectedShirt=ownedShirts.includes(saved.selectedShirt)?saved.selectedShirt:null;
    const gold=Number.isSafeInteger(saved.gold)&&saved.gold>=0?saved.gold:0;
    const imported=Number.isSafeInteger(saved.legacyGold)?saved.legacyGold:legacyGold;
    const ownedStadiums=Array.isArray(saved.ownedStadiums)?saved.ownedStadiums.filter(id=>stadiums.has(id)):["classic"];
    if(!ownedStadiums.includes("classic"))ownedStadiums.unshift("classic");
    const selectedStadium=ownedStadiums.includes(saved.selectedStadium)?saved.selectedStadium:"classic";
    return {gold:gold+Math.max(0,legacyGold-imported),legacyGold,owned,selected,ownedShirts,selectedShirt,ownedStadiums,selectedStadium,missionGoals:Number.isSafeInteger(saved.missionGoals)?Math.max(0,saved.missionGoals):0,missionClaimed:Array.isArray(saved.missionClaimed)?saved.missionClaimed:[],missionStats:saved.missionStats&&typeof saved.missionStats==='object'?saved.missionStats:{},missionSlots:saved.missionSlots&&typeof saved.missionSlots==='object'?saved.missionSlots:{}};
  } catch {return fallback;}
}

function updateProfile(change) {
  const update=()=>{
    const current=readProfile(profile);
    profile=change(current);
    activeStadium=stadiums.get(profile.selectedStadium)||stadiums.get("classic");
    buildStadium();
    if(profile!==current) {
      try {localStorage.setItem(profileKey,JSON.stringify(profile));} catch {}
    }
    renderShop();
    if(typeof renderMissions==='function')renderMissions();
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
    if(item.boxOnly)return current;
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

function drawNationalKit(ctx,skin,x,y,w,h){
  ctx.save();ctx.translate(x,y);ctx.scale(w,h);
  ctx.fillStyle=skin.stripe;
  switch(skin.national){
    case "argentina":
      for(const u of [.08,.42,.76])ctx.fillRect(u,0,.17,1);
      break;
    case "turkey":
      ctx.fillRect(0,.27,1,.27);
      ellipse(ctx,.43,.405,.075,.075,"#fff");
      ellipse(ctx,.455,.385,.059,.059,skin.stripe);
      polygon(ctx,Array.from({length:10},(_,i)=>{const a=i*Math.PI/5-Math.PI/2,r=i%2?.022:.05;return [.56+Math.cos(a)*r,.405+Math.sin(a)*r]}),"#fff");
      break;
    case "portugal":
      ctx.fillRect(0,.84,1,.16);ctx.fillRect(0,0,.12,.14);ctx.fillRect(.88,0,.12,.14);
      break;
    case "france":
      ctx.fillRect(.42,0,.16,.075);ctx.fillStyle="#fff";ctx.fillRect(.42,.075,.16,.04);
      break;
    default:
      ctx.fillRect(0,0,.12,.13);ctx.fillRect(.88,0,.12,.13);ctx.fillRect(.38,0,.24,.065);
  }
  ctx.restore();
}

function previewShirt(context,skin) {
  ellipse(context,76,112,42,8,"#0918127a");
  polygon(context,[[44,22],[60,14],[68,25],[84,25],[92,14],[108,22],[132,42],
    [114,68],[103,61],[106,105],[46,105],[49,61],[38,68],[20,42]],skin.sleeves,"#101f1e",2);
  polygon(context,[[44,22],[60,14],[68,25],[84,25],[92,14],[108,22],[103,61],[106,105],[46,105],[49,61]],skin.body);
  polygon(context,[[61,26],[69,33],[83,33],[91,26]],null,skin.stripe,4);
  if(skin.national){
    context.save();context.beginPath();context.moveTo(44,22);context.lineTo(108,22);context.lineTo(103,61);context.lineTo(106,105);context.lineTo(46,105);context.lineTo(49,61);context.closePath();context.clip();
    drawNationalKit(context,skin,44,22,64,83);context.restore();
  }else{
  polygon(context,[[69,35],[82,35],[84,101],[69,101]],skin.stripe);
  }
  polygon(context,[[81,38],[92,38],[92,47],[86.5,51],[81,47]],skin.stripe,"#f0f7ed",1);
}

function previewStadium(ctx,skin){
  ctx.fillStyle=skin.sky;ctx.fillRect(0,0,152,70);
  ctx.fillStyle=skin.stand;ctx.fillRect(0,45,152,38);
  ctx.fillStyle=skin.crowd;ctx.fillRect(0,61,152,20);
  ctx.fillStyle=skin.turf;ctx.fillRect(0,81,152,47);
  ctx.strokeStyle="#f2f7eb";ctx.lineWidth=2;ctx.strokeRect(39,63,74,39);
  ctx.strokeRect(56,73,40,18);
  ctx.fillStyle="#f7f8d8";ctx.fillRect(38,60,3,43);ctx.fillRect(111,60,3,43);
  ctx.fillRect(38,60,76,3);
}
function makeShopCards(items,ownedKey,selectedKey,drawPreview) {
  return Array.from(items,([id,skin])=>{
    const card=document.createElement("article");
    card.className="shop-card";
    card.tabIndex=-1;
    const preview=document.createElement("canvas");
    preview.width=152;preview.height=128;
    preview.setAttribute("aria-hidden","true");
    let previewReady=false;
    const ensurePreview=()=>{if(!previewReady){drawPreview(preview.getContext("2d"),skin);previewReady=true;}};
    if(!skin.boxOnly)ensurePreview();
    const title=document.createElement("h3");
    title.textContent=skin.name;
    const price=document.createElement("p");
    const button=document.createElement("button");
    button.type="button";
    button.addEventListener("click",()=>chooseItem(skin,id,ownedKey,selectedKey));
    card.append(preview,title,price,button);
    return {id,card,price,button,skin,ownedKey,selectedKey,ensurePreview};
  });
}

const shopCards={
  balls:makeShopCards(balls,"owned","selected",previewBall),
  shirts:makeShopCards(shirts,"ownedShirts","selectedShirt",previewShirt),
  stadiums:makeShopCards(stadiums,"ownedStadiums","selectedStadium",previewStadium)
};

function renderShop() {
  get("gold").textContent=profile.gold;
  get("shopGold").textContent=profile.gold;
  starterShirt.disabled=profile.selectedShirt===null;
  if(category==="boxes"){renderBoxes();return;}
  for(const {id,card,price,button,skin,ownedKey,selectedKey,ensurePreview} of shopCards[category]) {
    const owned=profile[ownedKey].includes(id);
    card.hidden=!!skin.boxOnly&&!owned;
    card.style.display=card.hidden?'none':'';
    if(card.hidden)continue;
    ensurePreview();
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
let tournament=null;
let tournamentOutcome='';
const tournamentStages=["Çeyrek final","Yarı final","Final"];
function startTournament(){
 tournament={stage:0,wins:0};
 tournamentOutcome='';
 get("tournamentDialog").close();
 startMatch();
}
function updateTournamentUI(){
 const banner=get("tournamentBanner");
 banner.hidden=!tournament;
 if(tournament) banner.textContent="🏆 "+tournamentStages[tournament.stage]+" · "+tournament.wins+"/3 galibiyet";
 get("matchReward").textContent=tournament?"🏆 Turnuva şampiyonluğu: 100 altın":"Kazanan: 30 altın · Beraberlik: 10 altın";
}

const matchLog=get("matchLog");
const matchField=get("matchField");
const mc=matchField.getContext("2d");
const matchDirections=[...document.querySelectorAll("[data-match-direction]")];
const robotNames=["Atlas","RoboGol","Demir","Turbo","Kaptan Bot","Şimşek"];
const matchZones=["Sol","Orta","Sağ"];
const zoneX={Sol:goal.left+65,Orta:410,Sağ:goal.right-65};
let matchGesture=null;
let matchTimer=null;
let matchAnimation=null;

function clearMatchTimer() {
  if(matchTimer!==null) {clearTimeout(matchTimer);matchTimer=null;}
}
function matchLater(callback,delay=850) {
  clearMatchTimer();
  matchTimer=setTimeout(()=>{matchTimer=null;if(matchDialog.open) callback();},delay);
}
function drawMatchKeeper(x,y,lean,t) {
  drawKeeper(x,y,lean,t,mc);
}

function renderMatchField() {
  if(!matchState)return;
  const s=matchState,anim=matchAnimation;
  const travel=anim?clamp((performance.now()-anim.start)/anim.duration,0,1):0;
  const dive=anim?smooth(clamp((travel-.12)/.88,0,1)):0;
  mc.drawImage(background,0,0);
  const keeperEnd=anim?.keeperEnd??410;
  const keeperX=anim?mix(410,keeperEnd,dive):410;
  const keeperY=anim?mix(241,anim.keeperHeight+15,dive):241;
  const lean=anim?clamp((keeperEnd-410)/92,-1,1)*dive*.98:0;
  drawMatchKeeper(keeperX,keeperY,lean,performance.now()/1000);
  if(s.phase==="player"&&!anim){
    mc.strokeStyle="#e2ff69";mc.lineWidth=2;
    mc.beginPath();mc.arc(s.aim.x,s.aim.y,13,0,Math.PI*2);mc.stroke();
  }
  const end=anim?.end??spot;
  const bx=mix(spot.x,end.x,travel);
  const by=mix(spot.y,end.y,travel)-Math.sin(Math.PI*travel)*(anim?.power??power)/4;
  ellipse(mc,bx,mix(spot.y+8,goal.bottom,travel),mix(25,8,travel),mix(6,2,travel),"#142f2478");
  drawBall(mc,bx,by,mix(22,7,travel),travel*13,balls.get(profile.selected));
}
function animateMatch(kind,end,keeperEnd,done,duration=650,keeperHeight=200,shotPower=68) {
  clearMatchTimer();
  const animation={kind,end,keeperEnd,keeperHeight,power:shotPower,start:performance.now(),duration};
  matchAnimation=animation;

  function tick(){
    if(!matchDialog.open||matchAnimation!==animation)return;
    renderMatchField();
    if(performance.now()-animation.start<animation.duration)requestAnimationFrame(tick);
    else {matchAnimation=null;done();}
  }
  requestAnimationFrame(tick);
}
function renderMatch() {
  if(!matchState) return;
  updateTournamentUI();
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
  get("restartMatch").textContent=tournamentOutcome==="advanced"?(tournament.stage===0?"Yarı Finale Geçiş →":"Finale Geçiş →"):tournamentOutcome==="draw"?"Turu tekrar oyna":tournamentOutcome==="champion"?"🏆 Yeni Turnuvaya Geçiş":"Tekrar oyna";
  matchDirections.forEach(button=>button.disabled=s.phase!=="defend");
  if(!matchAnimation)renderMatchField();
}
function startMatch() {
  clearMatchTimer();
  matchAnimation=null;
  matchGesture=null;
  matchState={round:0,playerGoals:0,robotGoals:0,phase:"player",log:[],
    robotName:robotNames[Math.floor(Math.random()*robotNames.length)],
    aim:{x:410,y:195},keeperZone:"Orta",robotShotZone:"Orta",
    status:"Kaleye dokunarak nişan al veya topu yukarı kaydırarak şut çek."};
  if(!matchDialog.open)matchDialog.showModal();
  renderMatch();
  // Respect the shared commentator preference across all modes.
  commentary(tournament?"Turnuvada "+tournamentStages[tournament.stage]+" başlıyor!":"Maç başlıyor! Üç penaltılık heyecan dolu mücadele!");
}
function finishMatch() {
  const s=matchState;
  if(!s||s.phase==="done")return;
  let reward=0,message=s.robotName+" kazandı. Bir dahaki sefere!";
  if(s.playerGoals>s.robotGoals){reward=30;message="Maçı kazandın! 30 altın senin!";}
  else if(s.playerGoals===s.robotGoals){reward=10;message="Berabere! 10 altın kazandın.";}
  s.phase="done";s.status=message;
  if(!tournament&&s.playerGoals>s.robotGoals)recordMission("match");
  tournamentOutcome="";
  if(tournament){
    if(s.playerGoals>s.robotGoals){
      tournament.wins++;
      if(tournament.wins===3){
        recordMission('cup');
        updateProfile(current=>({...current,gold:current.gold+100}));
        s.status="🏆 Şampiyon oldun! 100 altın kazandın!";
        tournament=null;
        tournamentOutcome="champion";
      } else {
        tournamentOutcome="advanced";
        s.status="🏆 Turu kazandın! "+tournamentStages[tournament.stage+1]+" için aşağıdaki düğmeye bas.";
      }
    }else if(s.playerGoals===s.robotGoals){
      s.status="Berabere! Aynı turu tekrar oyna.";
      tournamentOutcome="draw";
    }else{
      s.status="Turnuvadan elendin! Yeniden katılabilirsin.";
      tournamentOutcome="eliminated";
      tournament=null;
    }
  } else if(reward)updateProfile(current=>({...current,gold:current.gold+reward}));
  renderMatch();
  commentary(tournamentOutcome==="champion"?"Şampiyon! Kupayı kazandın!":tournamentOutcome==="advanced"?"Harika! Bir üst tura çıktın!":tournamentOutcome==="eliminated"?"Turnuvaya veda ediyoruz!":tournamentOutcome==="draw"?"Beraberlik! Tur tekrar oynanacak!":s.playerGoals>s.robotGoals?"Maçı kazandın!":s.playerGoals===s.robotGoals?"Maç berabere bitti!":"Maçı robot kazandı!");
}
function aimMatch(x,y) {
  if(!matchState||matchState.phase!=="player")return;
  matchState.aim={x:clamp(x,goal.left-25,goal.right+25),y:clamp(y,goal.top-40,goal.bottom+20)};
  renderMatch();
}
function fireMatch() {
  const s=matchState;
  if(!s||s.phase!=="player")return;
  const matchPower=Number(powerInput.value);
  const shot=makeShot(s.aim,matchPower,410,s.round,Math.random(),true);
  const scored=shot.outcome==="goal";
  // Start speech from the actual tap/click: mobile browsers may block delayed speech.
  commentary(scored?"Gol!":shot.outcome==="save"?"Kaleciden müthiş kurtarış!":"Top dışarı çıktı!");
  const direction=s.aim.x<350?"Sol":s.aim.x>470?"Sağ":"Orta";
  s.phase="playerFlight";s.status="Top kaleye gidiyor…";
  renderMatch();
  animateMatch("player",shot.ends,shot.dive,()=>{
    if(matchState!==s)return;
    s.playerGoals+=Number(scored);
    s.log.push({who:"Sen",direction,goal:scored});
    s.phase="playerResult";
    s.status=scored?"GOL! Şimdi kaleye geç.":shot.outcome==="save"?"Kaleci kurtardı!":"Şut dışarı gitti!";
    renderMatch();
    matchLater(()=>{
      s.phase="defend";s.keeperZone="Orta";
      s.status=s.robotName+" şut çekecek! Kurtarmak için Sol, Orta veya Sağ seç.";
      renderMatch();
    },350);
  },shot.duration*1000,shot.height,matchPower);
}
function defendMatch(direction) {
  const s=matchState;
  if(!s||s.phase!=="defend")return;
  s.keeperZone=direction;
  s.robotShotZone=matchZones[Math.floor(Math.random()*3)];
  const onTarget=Math.random()<0.88;
  const saved=direction===s.robotShotZone&&Math.random()<0.88;
  const scored=onTarget&&!saved;
  commentary(scored?"Gol! Robot gol attı!":saved?"Harika kurtarış!":"Robotun şutu dışarı gitti!");
  const end={x:zoneX[s.robotShotZone],y:onTarget?190:goal.top-30};
  s.phase="robotFlight";s.status=s.robotName+" şut çekiyor…";
  renderMatch();
  animateMatch("robot",end,zoneX[direction],()=>{
    if(matchState!==s)return;
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
    },950);
  },mix(.9,.44,(68-20)/80)*1000,200,68);
}
get("openMatch").addEventListener("click",()=>{tournament=null;tournamentOutcome="";startMatch();});
get("openTournament").addEventListener("click",()=>get("tournamentDialog").showModal());
get("startTournament").addEventListener("click",startTournament);
get("closeMatch").addEventListener("click",()=>matchDialog.close());
matchDialog.addEventListener("close",()=>{clearMatchTimer();matchAnimation=null;matchGesture=null;tournament=null;tournamentOutcome="";});
get("restartMatch").addEventListener("click",()=>{
 if(tournamentOutcome==="champion"){startTournament();return;}
 if(tournamentOutcome==="advanced"&&tournament){tournament.stage++;}
 tournamentOutcome="";
 startMatch();
});
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
  const showStadiums=next==="stadiums";
  get("showBoxes").setAttribute("aria-pressed",String(next==="boxes"));
  get("showBalls").setAttribute("aria-pressed",String(next==="balls"));
  get("showShirts").setAttribute("aria-pressed",String(showShirts));
  get("showStadiums").setAttribute("aria-pressed",String(showStadiums));
  starterShirt.hidden=!showShirts;
  if(next!=="boxes"){
 const configs={balls:[balls,"owned","selected",previewBall],shirts:[shirts,"ownedShirts","selectedShirt",previewShirt],stadiums:[stadiums,"ownedStadiums","selectedStadium",previewStadium]};
 const [map,ownedKey,selectedKey,draw]=configs[next],known=new Set(shopCards[next].map(c=>c.id));
 const extra=new Map([...map].filter(([id])=>profile[ownedKey].includes(id)&&!known.has(id)));
 shopCards[next].push(...makeShopCards(extra,ownedKey,selectedKey,draw));
 }
 shopItems.replaceChildren(...(shopCards[category]||[]).map(({card})=>card));
  shopItems.scrollTop=0;
  shopNote.textContent=showStadiums?"Satın aldığın stadyum oyun sahasında hemen kullanılır.":showShirts?"Her forma 40 altın. Seçtiğin formayı kaleci giyer.":"Aldığın top hemen oyuna girer.";
  renderShop();
}

get("showBoxes").addEventListener("click",()=>showCategory("boxes"));
get("showBalls").addEventListener("click",()=>showCategory("balls"));
get("showShirts").addEventListener("click",()=>showCategory("shirts"));
get("showStadiums").addEventListener("click",()=>showCategory("stadiums"));
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

function makeShot(aim,power,keeper,round,random,keeperBoost=false) {
  const ends={x:aim.x,y:aim.y};
  if(power<33) ends.y+=90-(power-20)*5;
  if(power>93) ends.y-=(power-93)*3.6;
  const inside=ends.x>=goal.left+8&&ends.x<=goal.right-8&&ends.y>=goal.top+8&&ends.y<=goal.bottom-6;
  const reads=random<(keeperBoost?.40:.34)+round*.045;
  const reach=(keeperBoost?147:139)-power*.72+round*4;
  const lateral=ends.x-keeper;
  const guess=random<.78?-reach:reach;
  const stride=reads?clamp(lateral,-reach,reach):guess;
  const dive=clamp(keeper+stride,goal.left+25,goal.right-25);
  const lean=clamp((dive-keeper)/92,-1,1);
  const height=clamp(ends.y,163,239);
  const saved=inside&&Math.abs(ends.x-dive)<(keeperBoost?39:35)&&Math.abs(ends.y-height)<33;
  const postHit=ends.y>=goal.top-11&&ends.y<=goal.bottom+8&&
    (Math.abs(ends.x-goal.left)<12||Math.abs(ends.x-goal.right)<12||Math.abs(ends.y-goal.top)<10);
  const outcome=postHit?"post":inside?saved?"save":"goal":"miss";
  return {ends,keeper,dive,height,lean,outcome,duration:mix(.9,.44,(power-20)/80)};
}

function fire() {
  if(state!=="ready") return;
  const live=makeShot(aim,power,keeperAt(clock),results.length,Math.random(),true);
  shot={...live,begin:clock,skin:balls.get(profile.selected)};
  state="flying";gesture=null;
  if(results.length===4)commentary("Kritik son şut! Herkes nefesini tuttu!");
  get("fieldStatus").textContent=results.length===4?"🔥 KRİTİK SON ŞUT!":"Şut çekildi";
  syncControls();
}

function settle() {
  if(state!=="flying") return;
  const outcome=shot.outcome;
  const caption={goal:"Gol!",save:"Kaleci kurtardı!",miss:"Top dışarıda!",post:"Direkten döndü!"}[outcome];
  commentary(outcome==="goal"?"Gooooool!":outcome==="save"?"Kaleciden müthiş kurtarış!":outcome==="post"?"Top direkten döndü!":"Top dışarı çıktı!");
  results.push(outcome);
  if(outcome==='goal')updateProfile(current=>({...current,missionGoals:(current.missionGoals||0)+1}));
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

function drawShotActors(ctx,travel,origin,end,keeperStart,keeperEnd,keeperHeight,keeperLean,shotPower,skin,time){
  const dive=smooth(clamp((travel-.12)/.88,0,1));
  drawKeeper(mix(keeperStart,keeperEnd,dive),mix(241,keeperHeight+15,dive),keeperLean*dive*.98,time,ctx);
  const bx=mix(origin.x,end.x,travel);
  const by=mix(origin.y,end.y,travel)-Math.sin(Math.PI*travel)*(shotPower/4);
  ellipse(ctx,bx,mix(origin.y+8,goal.bottom,travel),mix(25,8,travel),mix(6,2,travel),"#142f2478");
  // Soft ball trail adds motion without affecting trajectory or scoring.
  if(travel>.04&&travel<.96){
    ctx.save();ctx.globalAlpha=.15*(1-travel*.6);
    const tx=mix(origin.x,end.x,Math.max(0,travel-.055));
    const ty=mix(origin.y,end.y,Math.max(0,travel-.055))-Math.sin(Math.PI*Math.max(0,travel-.055))*(shotPower/4);
    ellipse(ctx,tx,ty,mix(18,6,travel),mix(18,6,travel),"#f0fff2");
    ctx.restore();
  }
  drawBall(ctx,bx,by,mix(22,7,travel),travel*13,skin);
}
function draw() {
  c.drawImage(background,0,0);
  // Subtle broadcast-style light glints; drawn at low opacity.
  c.save();
  c.globalAlpha=.12+.035*Math.sin(clock*1.7);
  for(const x of [80,740]){
    const flare=c.createRadialGradient(x,52,1,x,52,50);
    flare.addColorStop(0,"#fffde7");
    flare.addColorStop(.2,"#e7ffda70");
    flare.addColorStop(1,"#e7ffda00");
    c.fillStyle=flare;c.fillRect(x-50,2,100,100);
  }
  c.restore();
  if(results.length===4&&state!=="done"){
    c.save();c.fillStyle="rgba(105,20,5,.12)";c.fillRect(0,0,W,H);
    c.strokeStyle="#ffb84e";c.lineWidth=9;c.strokeRect(6,6,W-12,H-12);
    c.font="bold 29px system-ui";c.fillStyle="#fff3b3";c.textAlign="center";
    c.fillText("🔥 KRİTİK SON ŞUT",W/2,50);c.restore();
  }
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
  const bounce=shot?.outcome==="post"&&travel>.78;
  const bounceT=clamp((travel-.78)/.22,0,1);
  const impactX=mix(spot.x,end.x,.78),impactY=mix(spot.y,end.y,.78)-Math.sin(Math.PI*.78)*(power/4);
  const bx=bounce?impactX+(end.x<410?95:-95)*bounceT:mix(spot.x,end.x,travel);
  const lift=Math.sin(Math.PI*travel)*(power/4);
  const by=bounce?impactY+105*bounceT*bounceT:mix(spot.y,end.y,travel)-lift;
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
// Yeni seri header button removed; game can still restart through its normal flow.
arrows.forEach(button=>button.addEventListener("click",()=>{
  if(state==="ready") target(aim.x+Number(button.dataset.x)*26,aim.y+Number(button.dataset.y)*19);
}));
powerInput.addEventListener("input",()=>{power=Number(powerInput.value);syncControls();});

function pointOnField(event) {
  const rect=field.getBoundingClientRect();
  const scale=Math.max(rect.width/W,rect.height/H);
  const shownWidth=W*scale,shownHeight=H*scale;
  const offsetX=(rect.width-shownWidth)/2,offsetY=(rect.height-shownHeight)/2;
  return {x:(event.clientX-rect.left-offsetX)/scale,y:(event.clientY-rect.top-offsetY)/scale};
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


// Free-kick mode: independent five-shot challenge with a defensive wall.
const freeDialog=get("freeDialog"),freeCanvas=get("freeField"),fc=freeCanvas.getContext("2d");
let freeShots=0,freeGoals=0,freeAim={x:410,y:185},freePower=68,freeBusy=false;
let freeAnimation=null;
function drawFreeWallPlayer(ctx,x,ground,index,jumping=false){
  // Same detailed footballer proportions and white kit as the corner header.
  ctx.save();
  ctx.translate(x,ground);
  ctx.scale(.94,.94);
  ctx.lineCap="round";ctx.lineJoin="round";
  ctx.save();ctx.globalAlpha=.3;
  ellipse(ctx,0,3,17,4,"#07121b");ctx.restore();
  const limb=(points,width,color,edge="#15222c")=>{
    ctx.beginPath();ctx.moveTo(points[0],points[1]);
    for(let i=2;i<points.length;i+=2)ctx.lineTo(points[i],points[i+1]);
    ctx.strokeStyle=edge;ctx.lineWidth=width+2;ctx.stroke();
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
  };
  limb([-7,-38,-10,-20,-12,-3],8,"#263f74");
  limb([7,-38,10,-20,12,-3],8,"#263f74");
  limb([-10,-17,-12,-4],6,"#f5f5f4");
  limb([10,-17,12,-4],6,"#f5f5f4");
  limb([-12,-4,-17,-2],7,"#f0bb33");
  limb([12,-4,17,-2],7,"#f0bb33");
  limb([-12,-72,-18,-59,-13,-45],8,"#c98a62");
  limb([12,-72,18,-59,13,-45],8,"#c98a62");
  const shirt=ctx.createLinearGradient(-15,-76,15,-39);
  shirt.addColorStop(0,"#ffffff");shirt.addColorStop(.55,"#e6f0fa");shirt.addColorStop(1,"#9db7ce");
  polygon(ctx,[[-13,-76],[13,-76],[17,-63],[11,-38],[-11,-38],[-17,-63]],shirt,"#23354b",2);
  polygon(ctx,[[-11,-39],[11,-39],[10,-33],[-10,-33]],"#1d477a");
  ctx.strokeStyle="#2c6aa2";ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(-13,-74);ctx.lineTo(-16,-62);ctx.moveTo(13,-74);ctx.lineTo(16,-62);ctx.stroke();
  ctx.font="900 16px system-ui";ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.fillStyle="#183c69";ctx.fillText(String(index+2),0,-57);
  ctx.fillStyle="#c98a62";ctx.fillRect(-4,-81,8,8);
  const skin=ctx.createLinearGradient(-12,-102,12,-79);
  skin.addColorStop(0,"#f3c8a4");skin.addColorStop(1,"#b97954");
  ellipse(ctx,0,-91,11,13,skin);
  ellipse(ctx,-11,-90,2.7,3.5,"#d69b76");
  ellipse(ctx,11,-90,2.7,3.5,"#d69b76");
  polygon(ctx,[[-11,-95],[-10,-103],[-4,-106],[5,-105],[11,-100],[10,-95],[4,-100],[-5,-99]],index%2?"#252a32":"#17202a");
  ctx.fillStyle="#26303a";
  ellipse(ctx,-4,-91,1,1,"#26303a");ellipse(ctx,4,-91,1,1,"#26303a");
  ctx.strokeStyle="#9b6248";ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(-3,-84);ctx.quadraticCurveTo(0,-82,3,-84);ctx.stroke();
  ctx.restore();
}
function drawFree(progress=null,freeShot=null){
  fc.clearRect(0,0,W,H);
  fc.drawImage(background,0,0);
  const moving=progress!==null&&freeShot!==null;
  const travel=moving?clamp(progress,0,1):0;
  if(moving&&freeShot.wallBlocked){
    // Follow the original shot until the wall, then bounce down and sideways.
    const hitAt=.57;
    const hitX=mix(spot.x,freeShot.x,hitAt);
    const hitY=mix(spot.y,freeShot.y,hitAt)-Math.sin(Math.PI*hitAt)*(freePower/4);
    const after=clamp((travel-hitAt)/(1-hitAt),0,1);
    const bx=travel<hitAt?mix(spot.x,freeShot.x,travel):hitX+freeShot.bounceDirection*115*after;
    const by=travel<hitAt?mix(spot.y,freeShot.y,travel)-Math.sin(Math.PI*travel)*(freePower/4):hitY-35*Math.sin(Math.PI*after)+175*after*after;
    drawKeeper(410,241,0,performance.now()/1000,fc);
    const skin=balls.get(profile.selected)||balls.get("classic");
    const size=travel<hitAt?mix(22,13,travel/hitAt):mix(13,16,after);
    ellipse(fc,bx,Math.min(H-15,by+12),size,4,"#142f2478");
    drawBall(fc,bx,by,size,travel*16,skin);
    if(travel>=hitAt&&after<.23){
      fc.save();fc.strokeStyle="#fff4a2";fc.lineWidth=3;
      for(let i=0;i<5;i++){
        const angle=i*Math.PI*2/5;
        fc.beginPath();fc.moveTo(hitX+Math.cos(angle)*15,hitY+Math.sin(angle)*15);
        fc.lineTo(hitX+Math.cos(angle)*29,hitY+Math.sin(angle)*29);fc.stroke();
      }
      fc.restore();
    }
  }else if(moving&&freeShot.postHit&&travel>.78){
    const hitX=mix(spot.x,freeShot.x,.78),hitY=mix(spot.y,freeShot.y,.78)-Math.sin(Math.PI*.78)*(freePower/4);
    const t=clamp((travel-.78)/.22,0,1);
    drawKeeper(freeShot.keeperX,clamp(freeShot.y,163,239)+15,0,performance.now()/1000,fc);
    drawBall(fc,hitX+(freeShot.x<410?95:-95)*t,hitY+105*t*t,9+t*4,travel*13,balls.get(profile.selected)||balls.get("classic"));
  }else{
    drawShotActors(fc,travel,spot,moving?{x:freeShot.x,y:freeShot.y}:spot,
      410,moving?freeShot.keeperX:410,moving?clamp(freeShot.y,163,239):241,
      moving?(freeShot.keeperX<410?-1.05:1.05):0,
      freePower,balls.get(profile.selected)||balls.get("classic"),performance.now()/1000);
  }
  // The wall is closer to the camera than the keeper: render it in front,
  // so the goalkeeper's boots never appear on a defender's head.
  // Detailed five-player defensive wall, styled like the corner-mode footballer.
  for(const [i,x] of [335,370,405,440,475].entries()){
    const jump=moving&&travel>.18&&travel<.7?Math.sin((travel-.18)/.52*Math.PI)*15:0;
    drawFreeWallPlayer(fc,x,347-jump,i,jump>0);
  }
  if(!moving){
    // High-contrast aim marker, rendered on the free-kick canvas itself.
    fc.save();
    fc.lineWidth=5;fc.strokeStyle="#12221d";
    fc.beginPath();fc.arc(freeAim.x,freeAim.y,19,0,Math.PI*2);fc.stroke();
    fc.lineWidth=3;fc.strokeStyle="#fff34f";
    fc.beginPath();fc.arc(freeAim.x,freeAim.y,19,0,Math.PI*2);fc.stroke();
    fc.beginPath();
    fc.moveTo(freeAim.x-29,freeAim.y);fc.lineTo(freeAim.x-9,freeAim.y);
    fc.moveTo(freeAim.x+9,freeAim.y);fc.lineTo(freeAim.x+29,freeAim.y);
    fc.moveTo(freeAim.x,freeAim.y-29);fc.lineTo(freeAim.x,freeAim.y-9);
    fc.moveTo(freeAim.x,freeAim.y+9);fc.lineTo(freeAim.x,freeAim.y+29);
    fc.stroke();
    fc.fillStyle="#fff34f";fc.beginPath();fc.arc(freeAim.x,freeAim.y,3.5,0,Math.PI*2);fc.fill();
    fc.restore();
  }
}

function freeStatus(message){
 get("freeScore").textContent="Gol: "+freeGoals+" / "+freeShots+" · Kalan: "+(5-freeShots);
 get("freeStatus").textContent=message;
}
function startFree(){
 if(freeAnimation!==null){cancelAnimationFrame(freeAnimation);freeAnimation=null;}
 freeShots=0;freeGoals=0;freeBusy=false;freeAim={x:410,y:185};
 get("freeOutcome").hidden=true;
 get("freeKick").disabled=false;
 freeStatus("Barajın yanından veya üzerinden nişan al.");
 // Open the dialog before rendering; rendering errors must never prevent opening.
 if(!freeDialog.open)freeDialog.showModal();
 try{drawFree();}catch(error){console.error("Frikik çizimi:",error);get("freeStatus").textContent="Frikik açıldı. Şut çekmeyi deneyebilirsin.";}
}
get("openFree").addEventListener("click",startFree);
get("freePower").addEventListener("input",e=>{freePower=Number(e.target.value);get("freePowerText").textContent="%"+freePower;});
freeCanvas.addEventListener("pointerdown",e=>{
 if(freeBusy||freeShots>=5)return;
 const rect=freeCanvas.getBoundingClientRect();
 const scale=Math.min(rect.width/820,rect.height/510);
 const left=(rect.width-820*scale)/2,top=(rect.height-510*scale)/2;
 freeAim={x:clamp((e.clientX-rect.left-left)/scale,goal.left+12,goal.right-12),y:clamp((e.clientY-rect.top-top)/scale,goal.top+12,goal.bottom-12)};
 drawFree();
});
get("freeKick").addEventListener("click",()=>{
 if(freeBusy||freeShots>=5)return;
 freeBusy=true;get("freeKick").disabled=true;
 if(freeShots===4)commentary("Frikikte kritik son şut!");
 get("freeOutcome").hidden=true;
 const x=freeAim.x+(Math.random()-.5)*(105-freePower)*1.05;
 const y=freeAim.y+(Math.random()-.5)*(105-freePower)*.72;
 const wallBlocked=y>225&&x>322&&x<488;
 // Frikik kalecisi: slightly better at reading the shot, but still beatable.
 // React to the incoming ball's actual direction, not a random prediction.
 // The keeper starts in the centre and dives toward the shot as it approaches.
 const keeperShot=makeShot({x,y},clamp(freePower,33,93),410,freeShots,Math.random(),true);
 const keeperX=keeperShot.dive;
 const saved=keeperShot.outcome==="save";
 const goalIn=x>goal.left+12&&x<goal.right-12&&y>goal.top+10&&y<goal.bottom-10;
 const postHit=!wallBlocked&&y>=goal.top-10&&y<=goal.bottom+8&&
   (Math.abs(x-goal.left)<13||Math.abs(x-goal.right)<13||Math.abs(y-goal.top)<11);
 const scored=goalIn&&!wallBlocked&&!saved&&!postHit;
 const shot={x,y,keeperX,wallBlocked,postHit,bounceDirection:Math.random()<.5?-1:1};
 const start=performance.now();
 freeStatus("⚽ Top kaleye gidiyor...");
 function animate(now){
   if(!freeDialog.open){freeAnimation=null;return;}
   const progress=Math.min(1,(now-start)/(mix(.9,.44,(freePower-20)/80)*1000));
   get("freeStatus").textContent="⚽ Şut hareket ediyor · %"+Math.round(progress*100);
   drawFree(progress,shot);
   if(progress<1){freeAnimation=requestAnimationFrame(animate);return;}
   freeAnimation=null;
   freeShots++;if(scored){freeGoals++;recordMission('free');}
   freeStatus(wallBlocked?"🧱 Top baraja çarptı!":postHit?"🥅 Direkten döndü!":scored?"⚽ GOL!":saved?"🧤 Kaleci kurtardı!":"Şut dışarı gitti!");
   commentary(wallBlocked?"Top barajdan döndü!":postHit?"Top direkten döndü!":scored?"Gooooool!":saved?"Kaleciden kurtarış!":"Şut dışarı çıktı!");
   const outcome=get("freeOutcome");
   outcome.textContent=wallBlocked?"🧱 BARAJ!":postHit?"🥅 DİREK!":scored?"⚽ GOOOL!":saved?"🧤 KURTARIŞ!":"❌ DIŞARI!";
   outcome.hidden=false;
   // Keep the result on screen for a full 2.5 seconds, repainting every frame.
   const resultText=wallBlocked?"BARAJ!":postHit?"DİREK!":scored?"GOOOL!":saved?"KURTARIŞ!":"DIŞARI!";
   function paintResult(){
     fc.save();
     fc.font="900 62px system-ui, sans-serif";
     fc.textAlign="center";fc.textBaseline="middle";
     const labelWidth=Math.min(750,fc.measureText(resultText).width+70);
     fc.fillStyle="rgba(6,22,25,.94)";
     fc.fillRect(410-labelWidth/2,190,labelWidth,105);
     fc.strokeStyle="#ffeb55";fc.lineWidth=5;
     fc.strokeRect(410-labelWidth/2,190,labelWidth,105);
     fc.fillStyle="#ffffff";fc.fillText(resultText,410,244);
     fc.restore();
   }
   paintResult();
   const resultShownAt=performance.now();
   function holdResult(){
     if(!freeDialog.open){freeAnimation=null;return;}
     drawFree(1,shot);
     paintResult();
     if(performance.now()-resultShownAt<2500){
       freeAnimation=requestAnimationFrame(holdResult);
     }else{
       freeAnimation=null;
       if(freeShots<5){freeBusy=false;get("freeKick").disabled=false;outcome.hidden=true;drawFree();}
     }
   }
   freeAnimation=requestAnimationFrame(holdResult);
   if(freeShots===5){
     get("freeStatus").textContent+=" Seri bitti! "+freeGoals+" gol attın.";
   }
 }
 freeAnimation=requestAnimationFrame(animate);
});
get("freeRestart").addEventListener("click",()=>{freeDialog.close();startFree();});


// Turkish match commentary. Prefer a locally available masculine voice when provided
// by the browser/operating system; browser speech voices have no reliable gender API.
let commentaryOn=(()=>{try{return localStorage.getItem("son-penalti-spiker")==="on";}catch{return false;}})();
let commentatorVoice=null;
function chooseCommentatorVoice(){
 if(!("speechSynthesis" in window))return null;
 const voices=speechSynthesis.getVoices();
 const turkish=voices.filter(v=>/^tr([-_]|$)/i.test(v.lang));
 // Web Speech has no standard gender field; prioritize explicitly male-named Turkish voices.
 const maleHints=/(?:^|[^a-zğüşıöç])(male|erkek|cem|tolga|murat|ahmet|mehmet|emre|kerem|yusuf|ali|kaan|barış|baris|onur|hakan|serkan|fatih|osman|can|deniz)(?:$|[^a-zğüşıöç])/i;
 const femaleHints=/(?:^|[^a-zğüşıöç])(female|kadın|kadin|aylin|filiz|zeynep|elif|esra|selin|ayşe|ayse|eda|seda|sibel|melis|gül|gul|dilara)(?:$|[^a-zğüşıöç])/i;
 const preferred=turkish.find(v=>maleHints.test(v.name)&&!femaleHints.test(v.name))
  ||voices.find(v=>maleHints.test(v.name)&&/^tr/i.test(v.lang))
  ||turkish.find(v=>!femaleHints.test(v.name))
  ||turkish[0]||null;
 commentatorVoice=preferred;
 return preferred;
}
if("speechSynthesis" in window){
 chooseCommentatorVoice();
 speechSynthesis.addEventListener?.("voiceschanged",chooseCommentatorVoice);
}
function commentary(message){
 if(!commentaryOn||!("speechSynthesis" in window))return;
 try{
  // Android may silently discard speech immediately following cancel().
  // Resume a paused synthesizer and avoid cancelling on every goal.
  if(speechSynthesis.paused)speechSynthesis.resume();
  // Stretch the goal shout without changing the visible score or other commentary.
  const isGoalShout=/go+l+!|(?:kafa|vole) golü!/i.test(message);
  const spoken=isGoalShout?"Gol!":message;
  const speech=new SpeechSynthesisUtterance(spoken);
  speech.lang="tr-TR";
  speech.voice=chooseCommentatorVoice();
  // Slightly slower, lower-pitched delivery than the old high-pitched voice.
  speech.rate=isGoalShout?1.18:1.14;speech.pitch=isGoalShout?.78:.70;speech.volume=1;
  speech.onerror=event=>console.warn("Spiker seslendirme hatası:",event.error);
  speechSynthesis.speak(speech);
 }catch(error){console.warn("Spiker:",error);}
}
function syncCommentaryButtons(){
 for(const id of ["commentaryToggle","matchCommentaryToggle"]){
  const button=get(id);
  button.textContent=commentaryOn?"🔊 Spiker Açık":"🔇 Spiker Kapalı";
  button.setAttribute("aria-pressed",String(commentaryOn));
 }
}
function toggleCommentary(){
 commentaryOn=!commentaryOn;
 try{localStorage.setItem("son-penalti-spiker",commentaryOn?"on":"off");}catch{}
 syncCommentaryButtons();
 if(commentaryOn)commentary(matchDialog.open?(tournament?"Turnuva spikeri hazır!":"Maç spikeri hazır!"):"Son Penaltı maçına hoş geldiniz! Harika bir mücadele bizi bekliyor.");
 else if("speechSynthesis" in window)speechSynthesis.cancel();
}
get("commentaryToggle").addEventListener("click",toggleCommentary);
get("matchCommentaryToggle").addEventListener("click",toggleCommentary);
syncCommentaryButtons();

// Corner mode: cross to a central attacker, then choose a header or volley.
const cornerDialog=get("cornerDialog"),cornerCanvas=get("cornerField"),cc=cornerCanvas.getContext("2d");
const cornerOrigin={x:85,y:440},attacker={x:410,y:327};
let cornerShots=0,cornerGoals=0,cornerAim={x:410,y:188},cornerPower=68;
let cornerPhase="ready",cornerFrame=null,cornerCross=null,cornerAction=null;
const cornerHead=get("cornerHead"),cornerVolley=get("cornerVolley"),cornerKick=get("cornerKick");
function cornerStatus(message){
 get("cornerScore").textContent="Gol: "+cornerGoals+" / "+cornerShots+" · Kalan: "+(5-cornerShots);
 get("cornerStatus").textContent=message;
}
function cornerButtons(){
 cornerKick.disabled=cornerPhase!=="ready";
 cornerHead.disabled=cornerPhase!=="receive";
 cornerVolley.disabled=cornerPhase!=="receive";
}
function drawCornerPlayer(action="",progress=0){
 const x=attacker.x,y=attacker.y;
 const p=clamp(progress,0,1),kick=Math.sin(Math.PI*p);
 const jump=action==="header"?kick*18:0;
 const legLift=action==="volley"?kick*32:0;
 const c=cc;
 c.save();c.translate(x,y);c.scale(1.65,1.65);
 c.lineCap="round";c.lineJoin="round";
 // Grounding shadow, softened to keep the character readable on mobile.
 c.save();c.globalAlpha=.32;c.fillStyle="#07121b";c.beginPath();c.ellipse(0,50,33-jump*.35,9-jump*.08,0,0,Math.PI*2);c.fill();c.restore();
 c.translate(0,-jump);
 // Legs, socks and studded football boots.
 function limb(points,width,color,edge="#15222c"){
  c.beginPath();c.moveTo(points[0],points[1]);
  for(let i=2;i<points.length;i+=2)c.lineTo(points[i],points[i+1]);
  c.strokeStyle=edge;c.lineWidth=width+3;c.stroke();
  c.strokeStyle=color;c.lineWidth=width;c.stroke();
 }
 limb([-8,11,-12,27,-17,43],11,"#263f74");
 limb([8,11,14,27,18+legLift*.8,43-legLift],11,"#263f74");
 limb([-15,36,-17,44],8,"#f5f5f4");
 limb([16+legLift*.7,35-legLift,18+legLift*.8,43-legLift],8,"#f5f5f4");
 limb([-17,44,-24,46],8,"#f0bb33","#111d25");
 limb([18+legLift*.8,43-legLift,27+legLift*.8,45-legLift],8,"#f0bb33","#111d25");
 // Arms and skin, shaded separately from the jersey.
 limb([-14,-22,-23,-8,-26,6],9,"#c98a62");
 limb([14,-22,23,-9,26,-1-(action==="header"?kick*24:0)],9,"#c98a62");
 c.fillStyle="#f2c19c";
 for(const hand of [[-26,6],[26,-1-(action==="header"?kick*24:0)]]){
  c.beginPath();c.arc(hand[0],hand[1],5,0,Math.PI*2);c.fill();
 }
 // Shirt silhouette with cloth highlights, side seams and number.
 const shirt=c.createLinearGradient(-17,-29,17,13);
 shirt.addColorStop(0,"#ffffff");shirt.addColorStop(.55,"#e6f0fa");shirt.addColorStop(1,"#9db7ce");
 c.beginPath();c.moveTo(-13,-30);c.lineTo(13,-30);c.lineTo(17,-16);c.lineTo(11,13);c.lineTo(-11,13);c.lineTo(-17,-16);c.closePath();
 c.fillStyle=shirt;c.fill();c.strokeStyle="#23354b";c.lineWidth=2.5;c.stroke();
 c.fillStyle="#1d477a";c.fillRect(-11,7,22,6);
 c.strokeStyle="#2c6aa2";c.lineWidth=2.5;
 c.beginPath();c.moveTo(-13,-28);c.lineTo(-15,-16);c.moveTo(13,-28);c.lineTo(15,-16);c.stroke();
 c.font="900 19px system-ui";c.textAlign="center";c.textBaseline="middle";
 c.lineWidth=1.5;c.strokeStyle="#ffffff";c.strokeText("9",0,-8);
 c.fillStyle="#183c69";c.fillText("9",0,-8);
 // Neck, head, ears, face and sculpted hairstyle.
 c.fillStyle="#c98a62";c.fillRect(-5,-34,10,9);
 const skin=c.createLinearGradient(-13,-57,12,-35);
 skin.addColorStop(0,"#f3c8a4");skin.addColorStop(1,"#b97954");
 c.fillStyle=skin;c.beginPath();c.ellipse(0,-45,12.5,15,0,0,Math.PI*2);c.fill();
 c.fillStyle="#d69b76";c.beginPath();c.arc(-12,-44,3.4,0,Math.PI*2);c.arc(12,-44,3.4,0,Math.PI*2);c.fill();
 c.fillStyle="#17202a";c.beginPath();c.moveTo(-12,-49);c.quadraticCurveTo(-14,-64,1,-61);c.quadraticCurveTo(14,-61,13,-48);c.lineTo(9,-53);c.lineTo(4,-51);c.lineTo(-3,-55);c.lineTo(-11,-50);c.closePath();c.fill();
 c.fillStyle="#23313c";c.beginPath();c.arc(-4,-44,1.4,0,Math.PI*2);c.arc(5,-44,1.4,0,Math.PI*2);c.fill();
 c.strokeStyle="#9a573e";c.lineWidth=1.3;c.beginPath();c.moveTo(-3,-37);c.quadraticCurveTo(1,-35,5,-38);c.stroke();
 // Jersey sheen and a tiny badge.
 c.fillStyle="#e0ac37";c.beginPath();c.arc(9,-23,3,0,Math.PI*2);c.fill();
 c.restore();
}
function drawCorner(now=performance.now()){
 cc.drawImage(background,0,0);
 cc.save();cc.strokeStyle="#ffffffaa";cc.lineWidth=3;cc.beginPath();cc.arc(70,445,42,-Math.PI/2,0);cc.stroke();cc.restore();
 const flight=cornerPhase==="cross"&&cornerCross;
 const strike=cornerPhase==="strike"&&cornerAction;
 const keeperX=strike?mix(410,cornerAction.keeperX,smooth(clamp((cornerAction.t-.15)/.85,0,1))):410+Math.sin(now/600)*30;
 drawKeeper(keeperX,241,strike?clamp((cornerAction.keeperX-410)/100,-1,1):0,now/1000,cc);
 drawCornerPlayer(strike?cornerAction.type:"",strike?cornerAction.t:0);
 cc.save();cc.font="900 24px system-ui";cc.textAlign="center";cc.lineWidth=5;
 cc.strokeStyle="#0c2025";cc.fillStyle="#faffb3";
 cc.strokeText("OYUNCU",attacker.x,attacker.y+92);
 cc.fillText("OYUNCU",attacker.x,attacker.y+92);cc.restore();
 let bx=cornerOrigin.x,by=cornerOrigin.y,r=22;
 if(flight){
  const t=clamp((now-cornerCross.begin)/cornerCross.duration,0,1);
  bx=mix(cornerOrigin.x,attacker.x,t)+Math.sin(Math.PI*t)*95;
  by=mix(cornerOrigin.y,attacker.y-43,t)-Math.sin(Math.PI*t)*(80+cornerPower*.3);
  r=mix(22,12,t);
 }else if(strike){
  const t=cornerAction.t;
  bx=mix(attacker.x,cornerAction.x,t);
  by=mix(attacker.y-(cornerAction.type==="header"?58:7),cornerAction.y,t)-Math.sin(Math.PI*t)*(cornerAction.type==="header"?24:35);
  if(cornerAction.post&&t>.83){const d=(t-.83)/.17;bx+=(cornerAction.x<410?95:-95)*d;by+=100*d*d;}
  r=mix(13,7,t);
 }else if(cornerPhase==="ready"){
  cc.save();cc.strokeStyle="#ffed6d";cc.lineWidth=3;cc.beginPath();cc.arc(cornerAim.x,cornerAim.y,19,0,Math.PI*2);cc.stroke();
  cc.beginPath();cc.moveTo(cornerAim.x-25,cornerAim.y);cc.lineTo(cornerAim.x+25,cornerAim.y);cc.moveTo(cornerAim.x,cornerAim.y-25);cc.lineTo(cornerAim.x,cornerAim.y+25);cc.stroke();cc.restore();
 }else if(cornerPhase==="receive"){bx=attacker.x;by=attacker.y-43;r=12;}
 drawBall(cc,bx,by,r,now/75,balls.get(profile.selected)||balls.get("classic"));
 if(cornerShots===4&&cornerPhase!=="done"){
  cc.save();cc.fillStyle="#fff0a8";cc.font="bold 26px system-ui";cc.textAlign="center";cc.fillText("🔥 KRİTİK SON KORNER",410,50);cc.restore();
 }
 if(cornerPhase==="result"||cornerPhase==="done"){
  const label=cornerAction?.label||"";
  cc.save();cc.font="900 53px system-ui";cc.textAlign="center";cc.lineWidth=8;cc.strokeStyle="#12221d";cc.fillStyle="#fff5a1";cc.strokeText(label,410,260);cc.fillText(label,410,260);cc.restore();
 }
}
function stopCornerFrame(){if(cornerFrame!==null){cancelAnimationFrame(cornerFrame);cornerFrame=null;}}
function startCorner(){
 stopCornerFrame();cornerShots=0;cornerGoals=0;cornerAim={x:410,y:188};
 cornerPhase="ready";cornerCross=null;cornerAction=null;
 get("cornerOutcome").hidden=true;cornerButtons();
 cornerStatus("Önce orta aç, sonra gelen topa Kafa veya Vole ile vur!");
 if(!cornerDialog.open)cornerDialog.showModal();
 drawCorner();
}
get("openCorner").addEventListener("click",startCorner);
get("cornerRestart").addEventListener("click",()=>{cornerDialog.close();startCorner();});
cornerDialog.addEventListener("close",()=>{stopCornerFrame();cornerPhase="ready";});
get("cornerPower").addEventListener("input",event=>{
 cornerPower=Number(event.target.value);get("cornerPowerText").textContent="%"+cornerPower;
});
cornerCanvas.addEventListener("pointerdown",event=>{
 if(cornerPhase!=="ready")return;
 const rect=cornerCanvas.getBoundingClientRect(),scale=Math.min(rect.width/W,rect.height/H);
 const left=(rect.width-W*scale)/2,top=(rect.height-H*scale)/2;
 cornerAim={x:clamp((event.clientX-rect.left-left)/scale,goal.left-15,goal.right+15),
 y:clamp((event.clientY-rect.top-top)/scale,goal.top-15,goal.bottom+15)};
 drawCorner();
});
cornerKick.addEventListener("click",()=>{
 if(cornerPhase!=="ready")return;
 cornerPhase="cross";cornerButtons();get("cornerOutcome").hidden=true;
 if(cornerShots===4)commentary("Son korner! Kritik an!");
 cornerStatus("🚩 Orta geliyor... Oyuncu topu alınca Kafa ve Vole açılacak.");
 cornerCross={begin:performance.now(),duration:mix(1350,950,(cornerPower-20)/80)};
 function crossFrame(now){
  if(!cornerDialog.open){cornerFrame=null;return;}
  drawCorner(now);
  if(cornerPhase!=="cross"){cornerFrame=null;return;}
  if(now-cornerCross.begin>=cornerCross.duration){
   cornerFrame=null;cornerPhase="receive";cornerButtons();
   cornerStatus("⚽ Top oyuncuda! Şimdi KAFA veya VOLE tuşuna bas!");
   drawCorner(now);
  }else cornerFrame=requestAnimationFrame(crossFrame);
 }
 cornerFrame=requestAnimationFrame(crossFrame);
});
function finishCorner(scored,message){
 cornerShots++;if(scored){cornerGoals++;recordMission('corner');}
 const endOfSeries=cornerShots>=5;
 const cornerReward=endOfSeries&&cornerGoals>=4?20:0;
 if(cornerReward)updateProfile(current=>({...current,gold:current.gold+cornerReward}));
 cornerStatus(message+(endOfSeries?(cornerReward?" Seri tamamlandı! +20 altın kazandın!":" Seri tamamlandı!"):""));
 get("cornerOutcome").textContent=cornerReward?"🏆 4+ gol! +20 ALTIN":(cornerAction?.label||message);
 get("cornerOutcome").hidden=false;
 cornerPhase=endOfSeries?"done":"result";cornerButtons();drawCorner();
 const currentShots=cornerShots;
 setTimeout(()=>{
  if(!cornerDialog.open||cornerShots!==currentShots||cornerPhase!=="result")return;
  cornerPhase="ready";cornerCross=null;cornerAction=null;
  get("cornerOutcome").hidden=true;cornerButtons();cornerStatus("Yeni orta için Korner Kullan'a bas.");drawCorner();
 },1700);
}
function cornerFinish(type){
 if(cornerPhase!=="receive")return;
 const timing=clamp((performance.now()-cornerCross.begin)/cornerCross.duration,0,1);
 stopCornerFrame();
 const accuracy=0;
 const contact=true;
 const spread=(type==="header"?61:54)+accuracy*95;
 const x=cornerAim.x+(Math.random()-.5)*spread;
 const y=cornerAim.y+(type==="header"?-9:12)+(Math.random()-.5)*spread*.65;
 const post=contact&&y>=goal.top-10&&y<=goal.bottom+8&&(Math.abs(x-goal.left)<12||Math.abs(x-goal.right)<12||Math.abs(y-goal.top)<10);
 const inside=contact&&x>goal.left+8&&x<goal.right-8&&y>goal.top+8&&y<goal.bottom-8;
 const keeperShot=makeShot({x,y},68,410,cornerShots,Math.random(),true);
 const keeperX=keeperShot.dive;
 const saved=inside&&!post&&keeperShot.outcome==="save";
 const scored=inside&&!post&&!saved;
 cornerAction={type,x,y,post,saved,scored,keeperX,t:0,label:""};
 cornerPhase="strike";cornerButtons();
 cornerStatus(type==="header"?"⚽ Kafa vuruşu!":"⚽ Vole vuruşu!");
 const begin=performance.now(),duration=mix(700,420,(cornerPower-20)/80);
 function strikeFrame(now){
  if(!cornerDialog.open){cornerFrame=null;return;}
  cornerAction.t=Math.min(1,(now-begin)/duration);drawCorner(now);
  if(cornerAction.t<1){cornerFrame=requestAnimationFrame(strikeFrame);return;}
  cornerFrame=null;
  cornerAction.label=!contact?"❌ ISKALADI!":post?"🥅 DİREK!":saved?"🧤 KURTARIŞ!":scored?"⚽ GOOOL!":"❌ DIŞARI!";
  commentary(!contact?"Oyuncu topu ıskaladı!":post?"Top direkten döndü!":saved?"Kaleci kurtardı!":scored?"Harika bir "+(type==="header"?"kafa golü!":"vole golü!"):"Şut dışarı gitti!");
  finishCorner(scored,cornerAction.label);
 }
 cornerFrame=requestAnimationFrame(strikeFrame);
}
cornerHead.addEventListener("click",()=>cornerFinish("header"));
cornerVolley.addEventListener("click",()=>cornerFinish("volley"));

const missionList=[[10,10],[25,20],[50,30],[100,70],[200,150],['free',10,15],['free',30,35],['free',50,60],['corner',10,15],['corner',30,35],['corner',50,60],['match',3,20],['match',10,50],['cup',1,30],['cup',3,90]];
function recordMission(key){updateProfile(current=>({...current,missionStats:{...current.missionStats,[key]:(current.missionStats?.[key]||0)+1}}));}
const missionDialog=document.createElement('dialog');
missionDialog.style.cssText='background:#102b26;color:#fff;border:1px solid #52776a;border-radius:18px;padding:20px;width:min(420px,85vw);max-height:80vh;overflow:auto';
missionDialog.innerHTML='<h2>🎯 Görevler</h2><p>Farklı modlarda görevleri tamamla, altın kazan!</p><div id="missionRows"></div><button id="closeMissions" style="margin-top:16px;width:100%">Kapat</button>';
document.body.append(missionDialog);
function renderMissions(){
 const rows=get('missionRows');if(!rows)return;
 rows.replaceChildren();
 for(const [slot,entry] of missionList.entries()){
  const main=entry.length===2,originalKey=main?'main':entry[0],originalTarget=main?entry[0]:entry[1],originalReward=main?entry[1]:entry[2],originalId=main?originalTarget:originalKey+'-'+originalTarget;
  const total=(p,k)=>k==='main'?(p.missionGoals||0):(p.missionStats?.[k]||0);
  const modes=['main','free','corner','match','cup'];
  function replacement(p,g,previousKey){const key=modes[(modes.indexOf(previousKey)+1+slot%4)%5];const target=key==='cup'?1+g%3:key==='match'?2+(g+slot)%7:10+5*((g+slot)%9);return {g,key,target,reward:key==='cup'?target*30:key==='match'?target*6:Math.ceil(target*1.3),base:total(p,key)};}
  const currentSlot=p=>p.missionSlots?.[slot]||((p.missionClaimed||[]).includes(originalId)?{...replacement(p,1,originalKey),base:0}:{g:0,key:originalKey,target:originalTarget,reward:originalReward,base:0});
  const active=currentSlot(profile),{key,target,reward}=active,id=active.g?'slot-'+slot+'-'+active.g:originalId;
  const progress=p=>Math.max(0,total(p,key)-active.base);
  const label=key==='main'?'Ana oyunda '+target+' gol at':key==='free'?'Frikikte '+target+' gol at':key==='corner'?'Kornerde '+target+' gol at':key==='match'?target+' maç kazan':target+' turnuva kazan';
  const count=Math.min(target,progress(profile)),claimed=(profile.missionClaimed||[]).includes(id);
  const row=document.createElement('div');row.style.cssText='padding:12px 0;border-bottom:1px solid #52776a';
  row.innerHTML='<strong>'+label+'</strong><div style="margin:6px 0">'+count+' / '+target+' · 🪙 '+reward+' altın</div><progress style="width:100%;accent-color:#47c981" max="'+target+'" value="'+count+'"></progress>';
  const btn=document.createElement('button');btn.textContent=claimed?'Ödül alındı ✓':count>=target?'Ödülü almak için dokun':'Devam ediyor';btn.disabled=claimed||count<target;btn.style.cssText='margin-top:8px;width:100%';
  btn.onclick=()=>updateProfile(current=>{if(currentSlot(current).g!==active.g||progress(current)<target||(current.missionClaimed||[]).includes(id))return current;return {...current,gold:current.gold+reward,missionClaimed:[...(current.missionClaimed||[]),id],missionSlots:{...current.missionSlots,[slot]:replacement(current,active.g+1,key)}};});
  if(!claimed&&count>=target){
 row.style.cssText+=';background:#174c32;border:1px solid #4ade80;border-radius:12px;padding:12px;margin:6px 0;cursor:pointer';
 row.addEventListener('click',e=>{if(e.target!==btn&&!btn.disabled)btn.click();});
 }
 row.append(btn);rows.append(row);
 }
}
get('openMissions').onclick=()=>{renderMissions();missionDialog.showModal();};
get('closeMissions').onclick=()=>missionDialog.close();

function showBoxReward(items){
 const dialog=document.createElement("dialog");
 dialog.setAttribute("aria-label","Yeni ürün");
 Object.assign(dialog.style,{position:"fixed",inset:"0",margin:"0",width:"100%",height:"100%",maxWidth:"none",maxHeight:"none",border:"0",padding:"0",background:"rgba(0,0,0,.36)",color:"#fff",boxSizing:"border-box"});
 const panel=document.createElement("div");
 Object.assign(panel.style,{display:"flex",height:"100%",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"14px",textAlign:"center"});
 dialog.append(panel);document.body.append(dialog);
 let index=0;
 function draw(){
 const [key,id,map,preview]=items[index],skin=map.get(id);
 const title=document.createElement("h2");title.textContent=key==="owned"?"Yeni Top":key==="ownedShirts"?"Yeni Forma":"Yeni Stadyum";
 const canvas=document.createElement("canvas");canvas.width=304;canvas.height=256;canvas.style.width="min(70vw, 304px)";canvas.style.height="auto";const ctx=canvas.getContext("2d");ctx.scale(2,2);preview(ctx,skin);
 const name=document.createElement("p");name.textContent=skin.name;
 const button=document.createElement("button");button.type="button";button.textContent=index+1<items.length?"Devam etmek için dokun":"Oyuna dönmek için dokun";
 Object.assign(button.style,{background:"transparent",border:"0",color:"#fff",padding:"12px",fontSize:"16px"});
 panel.replaceChildren(title,canvas,name,button);
 }
 function finish(){dialog.close();dialog.remove();const shop=get("shop");if(shop.open)shop.close();}
 dialog.addEventListener("click",()=>{index++;if(index<items.length)draw();else finish();});
 dialog.addEventListener("cancel",e=>{e.preventDefault();finish();});
 draw();dialog.showModal();
}

function renderBoxes(){
 shopItems.replaceChildren();
 for(const box of [{name:"📦 Küçük kutu",cost:100},{name:"🎁 Büyük kutu",cost:200}]){
 const nextSet=p=>{
 let i=box.cost===100&&p.owned.includes("box-emerald")?1:box.cost===200&&p.ownedShirts.includes("box-royal")&&p.ownedStadiums.includes("box-aurora")?1:0;
 if(box.cost===100){while(p.owned.includes("box-ball-"+i)||p.owned.includes("box-auto-ball-"+i))i++;return [["owned",ensureExtraModel("ball",i,true),balls,previewBall]];}
 while((p.ownedShirts.includes("box-shirt-"+i)&&p.ownedStadiums.includes("box-stadium-"+i))||(p.ownedShirts.includes("box-auto-shirt-"+i)&&p.ownedStadiums.includes("box-auto-stadium-"+i)))i++;
 return [["ownedShirts",ensureExtraModel("shirt",i,true),shirts,previewShirt],["ownedStadiums",ensureExtraModel("stadium",i,true),stadiums,previewStadium]];
 };
 const items=nextSet(profile);
 const card=document.createElement("article");card.className="shop-card";
 const title=document.createElement("h3");title.textContent=box.name;card.append(title);
 const info=document.createElement("p");info.textContent=box.cost===200?"👕 Forma + 🏟️ Stadyum":"⚽ Özel top";card.append(info);
 const remaining=document.createElement("p");remaining.textContent="Yeni modeller sırayla açılır";card.append(remaining);

 const b=document.createElement("button");b.type="button";b.textContent=!items?"Tüm modeller sende":box.cost+" altın · Kutuyu al";b.disabled=!items||profile.gold<box.cost;
 b.onclick=()=>updateProfile(p=>{const set=nextSet(p);if(!set||set.map(x=>x[1]).join()!==items.map(x=>x[1]).join()||p.gold<box.cost)return p;const next={...p,gold:p.gold-box.cost};for(const [key,id] of set)next[key]=[...new Set([...p[key],id])];shopNote.textContent="Koleksiyonuna eklendi: "+set.map(([key,id,map])=>map.get(id).name).join(" + ");const added=set.filter(([key,id])=>!p[key].includes(id));if(added.length)queueMicrotask(()=>showBoxReward(added));return next;});
 card.append(b);shopItems.append(card);
 }
}
