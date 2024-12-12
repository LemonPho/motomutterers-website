"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[105],{105:(e,t,n)=>{n.r(t),n.d(t,{default:()=>s});var o=n(540),i=n(974),c=n(946),a=n(926),r=n(606);function s(){const{setErrorMessage:e,addErrorMessage:t,setSuccessMessage:n,setLoadingMessage:s,currentSeason:l,competitorsSortedNumber:d,loggedIn:m,user:p,contextLoading:u,selectPicksState:k}=(0,c.Xn)(),[g,E]=(0,o.useState)([0,0,0,0,0]),[f,h]=(0,o.useState)(!0),[y,b]=(0,o.useState)([0,0,0,0,0]),[w,v]=(0,o.useState)(!1),[N,P]=(0,o.useState)(!1),[_,x]=(0,o.useState)(!1),[L,S]=(0,o.useState)(!1),[C,$]=(0,o.useState)(["1st","2nd","3rd","4th","5th"]);function I(e,t){b((n=>{const o=[...n];return o[e]=t,o}))}return(0,o.useEffect)((()=>{s("Loading..."),async function(){const t=await(0,i.wu)(l.id,p.id);if(t.error)return e("There has been an error loading the selected picks"),void console.log(t.error);if(console.log(t),null!=t.userPicks){const e=t.userPicks.picks.sort(((e,t)=>e.position-t.position)).map((e=>e.competitor_points.competitor));b(e),null!=t.userPicks.independent_pick&&v(t.userPicks.independent_pick.competitor_points.competitor),null!=t.userPicks.rookie_pick&&x(t.userPicks.rookie_pick.competitor_points.competitor)}}(),h(!1),s(!1)}),[]),f||u?null:m?k?o.createElement("div",{className:"card mt-4 rounded-15"},o.createElement("div",{className:"card-header d-flex justify-content-center"},o.createElement("h3",null,"Season: ",l.year)),o.createElement("div",{className:"card-body"},y.map(((e,t)=>1==g[t]?o.createElement("div",{className:"col d-flex justify-content-center",key:`${C[t]}-pick-dropdown-div`},o.createElement("div",{className:"card text-center mb-2"},o.createElement("div",{className:"card-header"},o.createElement("h5",{className:"card-title text-muted"},C[t]," Pick")),o.createElement("div",{className:"card-body",style:{padding:"8px"}},o.createElement("div",{className:"dropdown p-2"},o.createElement("button",{className:"btn btn-outline-danger dropdown-toggle",id:`${C[t]}-pick-button`,onClick:e=>(0,a.gR)(`${C[t]}-pick-dropdown`,e,m)},0!=y[t]&&o.createElement("span",null,y[t].first," ",y[t].last),0==y[t]&&o.createElement("span",null,C[t]," Pick")),o.createElement("ul",{className:"dropdown-menu",id:`${C[t]}-pick-dropdown`,style:{overflowY:"scroll",maxHeight:"15rem"}},d.map((e=>o.createElement("li",{key:`competitor-${e.competitor_points.competitor.id}`},o.createElement("a",{className:"dropdown-item",onClick:()=>{I(t,e.competitor_points.competitor)}},e.competitor_points.competitor.first," ",e.competitor_points.competitor.last))))))))):o.createElement("div",{className:"col d-flex justify-content-center",key:`${C[t]}-pick-dropdown-div`},o.createElement("div",{className:"card text-center mb-2"},o.createElement("div",{className:"card-header"},o.createElement("h5",{className:"card-title text-muted"},C[t]," Pick")),o.createElement("div",{className:"card-body",style:{padding:"8px"}},o.createElement("div",{className:"dropdown p-2"},o.createElement("button",{className:"btn btn-outline-secondary dropdown-toggle",id:`${C[t]}-pick-button`,onClick:e=>(0,a.gR)(`${C[t]}-pick-dropdown`,e,m)},0!=y[t]&&o.createElement("span",null,y[t].first," ",y[t].last),0==y[t]&&o.createElement("span",null,C[t]," Pick")),o.createElement("ul",{className:"dropdown-menu",id:`${C[t]}-pick-dropdown`,style:{overflowY:"scroll",maxHeight:"15rem"}},d.map((e=>o.createElement("li",{key:`competitor-${e.competitor_points.competitor.id}`},o.createElement("a",{className:"dropdown-item",onClick:()=>{I(t,e.competitor_points.competitor)}},o.createElement("small",null,"#",e.competitor_points.competitor.number)," ",e.competitor_points.competitor.first," ",e.competitor_points.competitor.last))))))))))),l.top_independent&&o.createElement("div",{className:"col d-flex justify-content-center",key:"independent-pick-dropdown-div"},o.createElement("div",{className:"card text-center mb-2"},o.createElement("div",{className:"card-header"},o.createElement("h5",{className:"card-title text-muted"},"Independent Pick")),o.createElement("div",{className:"card-body",style:{padding:"8px"}},o.createElement("div",{className:"dropdown p-2"},1==N&&o.createElement("button",{className:"btn btn-outline-danger dropdown-toggle",id:"independent-pick-button",onClick:e=>(0,a.gR)("independent-pick-dropdown",e,m)},0!=w&&o.createElement("span",null,w.first," ",w.last),0==w&&o.createElement("span",null,"Independent Pick")),0==N&&o.createElement("button",{className:"btn btn-outline-secondary dropdown-toggle",id:"independent-pick-button",onClick:e=>(0,a.gR)("independent-pick-dropdown",e,m)},0!=w&&o.createElement("span",null,w.first," ",w.last),0==w&&o.createElement("span",null,"Independent Pick")),o.createElement("ul",{className:"dropdown-menu",id:"independent-pick-dropdown",style:{overflowY:"scroll",maxHeight:"15rem"}},d.map((e=>o.createElement("li",{key:`competitor-${e.competitor_points.competitor.id}`},o.createElement("a",{className:"dropdown-item",onClick:()=>{v(e.competitor_points.competitor)}},o.createElement("small",null,"#",e.competitor_points.competitor.number)," ",e.competitor_points.competitor.first," ",e.competitor_points.competitor.last))))))))),l.top_rookie&&o.createElement("div",{className:"col d-flex justify-content-center",key:"rookie-pick-dropdown-div"},o.createElement("div",{className:"card text-center mb-2"},o.createElement("div",{className:"card-header"},o.createElement("h5",{className:"card-title text-muted"},"Rookie Pick")),o.createElement("div",{className:"card-body",style:{padding:"8px"}},o.createElement("div",{className:"dropdown p-2"},1==L&&o.createElement("button",{className:"btn btn-outline-danger dropdown-toggle",id:"rookie-pick-button",onClick:e=>(0,a.gR)("rookie-pick-dropdown",e,m)},0!=_&&o.createElement("span",null,_.first," ",_.last),0==_&&o.createElement("span",null,"Rookie Pick")),0==L&&o.createElement("button",{className:"btn btn-outline-secondary dropdown-toggle",id:"rookie-pick-button",onClick:e=>(0,a.gR)("rookie-pick-dropdown",e,m)},0!=_&&o.createElement("span",null,_.first," ",_.last),0==_&&o.createElement("span",null,"Rookie Pick")),o.createElement("ul",{className:"dropdown-menu",id:"rookie-pick-dropdown",style:{overflowY:"scroll",maxHeight:"15rem"}},d.map((e=>o.createElement("li",{key:`competitor-${e.competitor_points.competitor.id}`},o.createElement("a",{className:"dropdown-item",onClick:()=>{x(e.competitor_points.competitor)}},o.createElement("small",null,"#",e.competitor_points.competitor.number)," ",e.competitor_points.competitor.first," ",e.competitor_points.competitor.last)))))))))),o.createElement("div",{className:"card-footer d-flex justify-content-center"},o.createElement("button",{className:"btn btn-primary",onClick:()=>async function(){s("Loading...");let o=y.map((e=>e.id));const i=await(0,r.Et)(o,w.id,_.id);if(E([0,0,0,0,0]),S(!1),P(!1),s(!1),i.error)return e("There has been an error submiting the picks."),void console.log(i.error);if(201!==i.status){if(400===i.status){if(i.picksAlreadySelected)return void e("Another user already has the same picks and order.");if(i.invalidPicks){for(let t=0;t<i.invalidPicks.length;t++)!0===i.invalidPicks[t]&&e("Highlighted picks are invalid");!function(e){E((()=>[...e]))}(i.invalidPicks)}i.invalidIndependent&&(P(!0),t("Selected independent rider is not an independent rider")),i.invalidRookie&&(S(!0),t("Selected rookie is not rookie"))}}else n("The picks have been successfully submited.")}()},"Submit"))):o.createElement("div",null,"You can not select your picks at this moment."):o.createElement("div",null,"You need to be logged in to select your picks.")}},926:(e,t,n)=>{function o(e,t,n){let o,i={pageNumbers:[],nextPage:"",previousPage:""},c=Math.ceil(e/t),a=0;if(e%t==0&&c++,o=c,e<=t)return null;for(i.previousPage=n>1?"page-item":"page-item disabled",i.nextPage=n<c?"page-item":"page-item disabled",n>5&&(c>n+5?(a=n-5,o=n+5):(a=10-(c-n),o=a+10));a<o;a++)i.pageNumbers.push(a+1);return i}function i(e,t){for(var n=e.split(","),o=n[0].match(/:(.*?);/)[1],i=atob(n[n.length-1]),c=i.length,a=new Uint8Array(c);c--;)a[c]=i.charCodeAt(c);return t=`${t}.${o.split("/")[1]}`,new File([a],t,{type:o})}function c(){return{width:window.innerWidth,height:window.innerHeight}}function a(){const e=document.getElementsByClassName("custom-modal"),t=document.getElementById("background-blur"),n=document.querySelectorAll('[data-category="input-field"]');Array.prototype.forEach.call(e,(e=>{e.classList.contains("hidden")||e.classList.toggle("hidden")})),Array.prototype.forEach.call(n,(e=>{"INPUT"===e.tagName?(e.value=null,e.checked=!1):e.innerHTML=""})),t.classList.contains("hidden")||t.classList.toggle("hidden")}function r(e,t,n,o){const i=document.getElementById(e),c=document.getElementById("background-blur");t.stopPropagation(),i.classList.contains("hidden")?void 0!==n&&!0!==n||void 0!==o&&!0!==o||(s(),a(),i.classList.toggle("hidden"),c.classList.toggle("hidden")):a()}function s(){const e=document.getElementsByClassName("dropdown-menu"),t=document.getElementsByClassName("menu-dropdown-content");Array.prototype.forEach.call(e,(e=>{e.classList.contains("show")&&e.classList.toggle("show")})),Array.prototype.forEach.call(t,(e=>{e.classList.contains("show")&&e.classList.toggle("show")}))}function l(e,t,n){t.stopPropagation();const o=document.getElementById(e);o.classList.contains("show")?s():(s(),null==e||null!=n&&1!=n||o.classList.toggle("show"))}function d(e,t){e.stopPropagation(),"Enter"==e.key&&(e.preventDefault(),t())}function m(e){const t=document.getElementById(e);t&&t.focus()}n.d(t,{Gd:()=>m,Tc:()=>s,X$:()=>o,Xz:()=>i,YK:()=>r,ac:()=>d,gR:()=>l,qT:()=>c,tI:()=>a})}}]);