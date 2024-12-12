"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[849],{849:(e,t,a)=>{a.r(t),a.d(t,{default:()=>r});var s=a(540),n=a(767),l=a(974),o=a(946),c=a(926);function r(){const{setErrorMessage:e,setLoadingMessage:t,modalErrorMessage:a,setModalErrorMessage:r,contextLoading:i}=(0,o.Xn)(),[m,d]=(0,s.useState)(),[p,u]=(0,s.useState)(null),[g,E]=(0,s.useState)([]),[h,N]=(0,s.useState)(!0),[f,y]=(0,s.useState)(null),w=(0,n.zy)();return(0,s.useEffect)((()=>{!async function(){await async function(){t("Loading race results...");let a=new URLSearchParams(w.search).get("season");d(a);const s=await(0,l.o9)(a);s.error&&(e("There was an error loading the race results."),t(!1)),200===s.status&&E(s.races)}(),await async function(){let t=await(0,l.zV)();if(t.error)return console.log(t.error),void e("There was an error loading the seasons");u(t.seasons)}(),N(!1)}()}),[]),i||h?null:s.createElement("div",{className:"mt-2"},s.createElement("div",{className:"d-flex align-items-center mt-1"},0==g.length&&s.createElement("h4",null,"No race results have been added for this season..."),s.createElement("div",{className:"dropdown ms-auto"},s.createElement("button",{className:"btn btn-outline-secondary dropdown-toggle",type:"button",onClick:e=>(0,c.gR)("season-selector-dropdown",e,void 0)},m),s.createElement("ul",{className:"dropdown-menu",id:"season-selector-dropdown"},p.map((e=>s.createElement("li",{className:"ms-2",key:`${e.year}`},s.createElement("a",{className:"d-flex align-items-center",href:`/raceresults?season=${e.year}`,id:`${e.year}`},e.year,e.year==m&&s.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"ms-auto me-1 bi bi-check",viewBox:"0 0 16 16"},s.createElement("path",{d:"M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"}))))))))),g.map((e=>s.createElement("div",{className:"card mt-2 mb-2 rounded-15 clickable",key:`race-result-${e.id}`,onClick:t=>function(e,t){y(t),(0,c.YK)("race-result-modal",e)}(t,e)},s.createElement("div",{className:"rounded-15-top card-header"},s.createElement("div",{className:"d-flex align-items-center"},s.createElement("h3",null,e.title,e.is_sprint&&" (Sprint)"),s.createElement("div",{className:"ms-auto"},s.createElement("div",{className:"container"},e.finalized&&s.createElement("span",{className:"badge rounded-pill text-bg-success"},"Final"),!e.finalized&&s.createElement("span",{className:"badge rounded-pill text-bg-secondary"},"Upcoming"))))),s.createElement("div",{className:"card-body"},e.finalized&&s.createElement("div",null,s.createElement("div",{className:"row g-0",style:{marginRight:"0px",padding:"0px"}},s.createElement("strong",{className:"col-1"},"Pos."),s.createElement("strong",{className:"col-5"},"# Name")),e.competitors_positions.map((e=>s.createElement("div",{className:"row g-0",key:`competitor-${e.competitor_points.competitor.id}`,style:{marginRight:"0px"}},0==e.position&&s.createElement("span",{className:"col-1"},"DNF"),0!=e.position&&s.createElement("span",{className:"col-1"},e.position),s.createElement("span",{className:"col-5"},s.createElement("small",null,"#",e.competitor_points.competitor.number)," ",e.competitor_points.competitor.first," ",e.competitor_points.competitor.last))))))))),s.createElement("div",{className:"custom-modal hidden",id:"race-result-modal"},null!=f&&s.createElement("div",null,a&&s.createElement("div",{className:"alert alert-danger my-3"},s.createElement("small",null,a)),s.createElement("div",{className:"custom-modal-header d-flex align-items-center"},s.createElement("h3",null,f.track," ",f.is_sprint&&" (Sprint)"),s.createElement("div",{className:"ms-auto"},s.createElement("div",{className:"container"},f.finalized&&s.createElement("span",{className:"badge rounded-pill text-bg-success"},"Final"),!f.finalized&&s.createElement("span",{className:"badge rounded-pill text-bg-secondary"},"Upcoming")))),s.createElement("div",{className:"custom-modal-body"},f.finalized&&s.createElement("div",null,s.createElement("div",{className:"row g-0",style:{marginRight:"0px",padding:"0px"}},s.createElement("strong",{className:"col-2"},"Pos."),s.createElement("strong",{className:"col-6"},"Name")),f.competitors_positions.map((e=>s.createElement("div",{className:"row g-0",key:`competitor-${e.competitor_points.competitor.id}`,style:{marginRight:"0px"}},0==e.position&&s.createElement("span",{className:"col-2"},"DNF"),0!=e.position&&s.createElement("span",{className:"col-2"},e.position),s.createElement("span",{className:"col-6"},s.createElement("small",null,"#",e.competitor_points.competitor.number)," ",e.competitor_points.competitor.first," ",e.competitor_points.competitor.last)))))))))}},926:(e,t,a)=>{function s(e,t,a){let s,n={pageNumbers:[],nextPage:"",previousPage:""},l=Math.ceil(e/t),o=0;if(e%t==0&&l++,s=l,e<=t)return null;for(n.previousPage=a>1?"page-item":"page-item disabled",n.nextPage=a<l?"page-item":"page-item disabled",a>5&&(l>a+5?(o=a-5,s=a+5):(o=10-(l-a),s=o+10));o<s;o++)n.pageNumbers.push(o+1);return n}function n(e,t){for(var a=e.split(","),s=a[0].match(/:(.*?);/)[1],n=atob(a[a.length-1]),l=n.length,o=new Uint8Array(l);l--;)o[l]=n.charCodeAt(l);return t=`${t}.${s.split("/")[1]}`,new File([o],t,{type:s})}function l(){return{width:window.innerWidth,height:window.innerHeight}}function o(){const e=document.getElementsByClassName("custom-modal"),t=document.getElementById("background-blur"),a=document.querySelectorAll('[data-category="input-field"]');Array.prototype.forEach.call(e,(e=>{e.classList.contains("hidden")||e.classList.toggle("hidden")})),Array.prototype.forEach.call(a,(e=>{"INPUT"===e.tagName?(e.value=null,e.checked=!1):e.innerHTML=""})),t.classList.contains("hidden")||t.classList.toggle("hidden")}function c(e,t,a,s){const n=document.getElementById(e),l=document.getElementById("background-blur");t.stopPropagation(),n.classList.contains("hidden")?void 0!==a&&!0!==a||void 0!==s&&!0!==s||(r(),o(),n.classList.toggle("hidden"),l.classList.toggle("hidden")):o()}function r(){const e=document.getElementsByClassName("dropdown-menu"),t=document.getElementsByClassName("menu-dropdown-content");Array.prototype.forEach.call(e,(e=>{e.classList.contains("show")&&e.classList.toggle("show")})),Array.prototype.forEach.call(t,(e=>{e.classList.contains("show")&&e.classList.toggle("show")}))}function i(e,t,a){t.stopPropagation();const s=document.getElementById(e);s.classList.contains("show")?r():(r(),null==e||null!=a&&1!=a||s.classList.toggle("show"))}function m(e,t){e.stopPropagation(),"Enter"==e.key&&(e.preventDefault(),t())}function d(e){const t=document.getElementById(e);t&&t.focus()}a.d(t,{Gd:()=>d,Tc:()=>r,X$:()=>s,Xz:()=>n,YK:()=>c,ac:()=>m,gR:()=>i,qT:()=>l,tI:()=>o})}}]);