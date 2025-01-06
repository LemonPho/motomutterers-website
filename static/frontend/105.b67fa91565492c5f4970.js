"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[105],{105:(e,t,o)=>{o.r(t),o.d(t,{default:()=>s});var n=o(540),r=o(974),i=o(946),c=o(926),a=o(398);function s(){const{setErrorMessage:e,addErrorMessage:t,setSuccessMessage:o,setLoadingMessage:s,currentSeason:d,currentSeasonLoading:l,loggedIn:p,user:m,userLoading:u,selectPicksState:k,selectPicksStateLoading:E}=(0,i.Xn)(),[b,g]=(0,n.useState)([0,0,0,0,0]),[f,_]=(0,n.useState)(!0),[v,w]=(0,n.useState)(!1),[N,y]=(0,n.useState)([0,0,0,0,0]),[h,x]=(0,n.useState)(!1),[P,S]=(0,n.useState)(!1),[C,$]=(0,n.useState)(!1),[R,j]=(0,n.useState)(!1),[H,I]=(0,n.useState)(["1st","2nd","3rd","4th","5th"]),[L,Y]=(0,n.useState)(!1),[M,T]=(0,n.useState)();function A(e,t){y((o=>{const n=[...o];return n[e]=t,n}))}return(0,n.useEffect)((()=>{_(!0),async function(){if(l)return;if(!u&&!m.is_logged_in)return void e("You need to be logged in to select your picks");const t=await(0,r.wu)(d.id,m.id);if(console.log(t),t.error)return e("There has been an error loading the selected picks"),void console.log(t.error);if(t.userPicks){const e=t.userPicks.picks.sort(((e,t)=>e.position-t.position)).map((e=>e));y(e),null!=t.userPicks.independent_pick&&x(t.userPicks.independent_pick),null!=t.userPicks.rookie_pick&&$(t.userPicks.rookie_pick)}}(),async function(){if(L||l)return;T(!0);const t=await(0,r.oK)(d.year);t.error?e("There was an error retrieving the current season"):200==t.status&&(Y(t.season),T(!1))}(),_(!1),s(!1)}),[l,u]),L?n.createElement("div",{className:"card rounded-15 element-background-color element-border-color"},n.createElement("div",{className:"card-header d-flex justify-content-center"},n.createElement("h3",null,"Season: ",L.year)),n.createElement("div",{className:"card-body"},!f&&N.map(((e,t)=>1==b[t]?n.createElement("div",{className:"col d-flex justify-content-center",key:`${H[t]}-pick-dropdown-div`},n.createElement("div",{className:"card text-center mb-2 rounded-15"},n.createElement("div",{className:"card-header"},n.createElement("h5",{className:"card-title text-muted"},H[t]," Pick")),n.createElement("div",{className:"card-body",style:{padding:"8px"}},n.createElement("div",{className:"dropdown p-2"},n.createElement("button",{className:"btn btn-outline-danger dropdown-toggle rounded-15",id:`${H[t]}-pick-button`,onClick:e=>(0,c.gR)(`${H[t]}-pick-dropdown`,e,p)},0!=N[t]&&n.createElement("span",null,N[t].competitor_points.competitor.first," ",N[t].competitor_points.competitor.last),0==N[t]&&n.createElement("span",null,H[t]," Pick")),n.createElement("ul",{className:"dropdown-menu",id:`${H[t]}-pick-dropdown`,style:{overflowY:"scroll",maxHeight:"15rem"}},!M&&L.competitors_sorted_number.map((e=>n.createElement("li",{key:`competitor-${e.competitor_points.competitor.id}`},n.createElement("a",{className:"dropdown-item",onClick:()=>{A(t,e)}},e.competitor_points.competitor.first," ",e.competitor_points.competitor.last))))))))):n.createElement("div",{className:"col d-flex justify-content-center",key:`${H[t]}-pick-dropdown-div`},n.createElement("div",{className:"card text-center mb-2 rounded-15"},n.createElement("div",{className:"card-header"},n.createElement("h5",{className:"card-title text-muted"},H[t]," Pick")),n.createElement("div",{className:"card-body",style:{padding:"8px"}},n.createElement("div",{className:"dropdown p-2"},n.createElement("button",{className:"btn btn-outline-secondary dropdown-toggle rounded-15",id:`${H[t]}-pick-button`,onClick:e=>(0,c.gR)(`${H[t]}-pick-dropdown`,e,p)},0!=N[t]&&n.createElement("span",null,N[t].competitor_points.competitor.first," ",N[t].competitor_points.competitor.last),0==N[t]&&n.createElement("span",null,H[t]," Pick")),n.createElement("ul",{className:"dropdown-menu",id:`${H[t]}-pick-dropdown`,style:{overflowY:"scroll",maxHeight:"15rem"}},!M&&L.competitors_sorted_number.map((e=>n.createElement("li",{key:`competitor-${e.competitor_points.competitor.id}`},n.createElement("a",{className:"dropdown-item",onClick:()=>{A(t,e)}},n.createElement("small",null,"#",e.competitor_points.competitor.number)," ",e.competitor_points.competitor.first," ",e.competitor_points.competitor.last))))))))))),!f&&d.top_independent&&n.createElement("div",{className:"col d-flex justify-content-center",key:"independent-pick-dropdown-div"},n.createElement("div",{className:"card text-center mb-2 rounded-15"},n.createElement("div",{className:"card-header"},n.createElement("h5",{className:"card-title text-muted"},"Independent Pick")),n.createElement("div",{className:"card-body",style:{padding:"8px"}},n.createElement("div",{className:"dropdown p-2"},1==P&&n.createElement("button",{className:"btn btn-outline-danger dropdown-toggle rounded-15",id:"independent-pick-button",onClick:e=>(0,c.gR)("independent-pick-dropdown",e,p)},0!=h&&n.createElement("span",null,h.competitor_points.competitor.first," ",h.competitor_points.competitor.last),0==h&&n.createElement("span",null,"Independent Pick")),0==P&&n.createElement("button",{className:"btn btn-outline-secondary dropdown-toggle rounded-15",id:"independent-pick-button",onClick:e=>(0,c.gR)("independent-pick-dropdown",e,p)},0!=h&&n.createElement("span",null,h.competitor_points.competitor.first," ",h.competitor_points.competitor.last),0==h&&n.createElement("span",null,"Independent Pick")),n.createElement("ul",{className:"dropdown-menu",id:"independent-pick-dropdown",style:{overflowY:"scroll",maxHeight:"15rem"}},!M&&L.competitors_sorted_number.map((e=>e.independent&&n.createElement("li",{key:`competitor-${e.competitor_points.competitor.id}`},n.createElement("a",{className:"dropdown-item",onClick:()=>{x(e)}},n.createElement("small",null,"#",e.competitor_points.competitor.number)," ",e.competitor_points.competitor.first," ",e.competitor_points.competitor.last))))))))),!f&&d.top_rookie&&n.createElement("div",{className:"col d-flex justify-content-center",key:"rookie-pick-dropdown-div"},n.createElement("div",{className:"card text-center mb-2 rounded-15"},n.createElement("div",{className:"card-header"},n.createElement("h5",{className:"card-title text-muted"},"Rookie Pick")),n.createElement("div",{className:"card-body",style:{padding:"8px"}},n.createElement("div",{className:"dropdown p-2"},1==R&&n.createElement("button",{className:"btn btn-outline-danger dropdown-toggle rounded-15",id:"rookie-pick-button",onClick:e=>(0,c.gR)("rookie-pick-dropdown",e,p)},0!=C&&n.createElement("span",null,C.competitor_points.competitor.first," ",C.competitor_points.competitor.last),0==C&&n.createElement("span",null,"Rookie Pick")),0==R&&n.createElement("button",{className:"btn btn-outline-secondary dropdown-toggle rounded-15",id:"rookie-pick-button",onClick:e=>(0,c.gR)("rookie-pick-dropdown",e,p)},0!=C&&n.createElement("span",null,C.competitor_points.competitor.first," ",C.competitor_points.competitor.last),0==C&&n.createElement("span",null,"Rookie Pick")),n.createElement("ul",{className:"dropdown-menu",id:"rookie-pick-dropdown",style:{overflowY:"scroll",maxHeight:"15rem"}},!M&&L.competitors_sorted_number.map((e=>e.rookie&&n.createElement("li",{key:`competitor-${e.competitor_points.competitor.id}`},n.createElement("a",{className:"dropdown-item",onClick:()=>{$(e)}},n.createElement("small",null,"#",e.competitor_points.competitor.number)," ",e.competitor_points.competitor.first," ",e.competitor_points.competitor.last)))))))))),n.createElement("div",{className:"card-footer d-flex justify-content-center"},v&&n.createElement("button",{className:"btn btn-primary rounded-15",disabled:!0},"Loading..."),!v&&n.createElement("button",{className:"btn btn-primary rounded-15",onClick:()=>async function(){w(!0);let n,r=N.map((e=>e.competitor_points.competitor.id));if(n=L.top_independent&&L.top_rookie?await(0,a.Et)(r,h.competitor_points.competitor.id,C.competitor_points.competitor.id):L.top_independent?await(0,a.Et)(r,h.competitor_points.competitor.id):L.top_rookie?await(0,a.Et)(r,C.competitor_points.competitor.id):await(0,a.Et)(r),g([0,0,0,0,0]),j(!1),S(!1),w(!1),n.error)return e("There has been an error submiting the picks."),void console.log(n.error);if(201!==n.status){if(400===n.status){if(n.picksAlreadySelected)return void e("Another user already has the same picks and order.");if(n.invalidPicks){for(let t=0;t<n.invalidPicks.length;t++)!0===n.invalidPicks[t]&&e("Highlighted picks are invalid");!function(e){g((()=>[...e]))}(n.invalidPicks)}n.invalidIndependent&&(S(!0),t("Selected independent rider is not an independent rider")),n.invalidRookie&&(j(!0),t("Selected rookie is not rookie"))}}else o("The picks have been successfully submited.")}()},"Submit"))):null}}}]);