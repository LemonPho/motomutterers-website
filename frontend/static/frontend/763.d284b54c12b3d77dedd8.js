"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[763,807,637],{807:(e,a,t)=>{t.r(a),t.d(a,{default:()=>n});var s=t(540);class l extends s.Component{constructor(e){super(e)}render(){return s.createElement("p",null,"Error page not found")}}const n=l},637:(e,a,t)=>{t.r(a),t.d(a,{default:()=>i,useRaceResultsContext:()=>m});var s=t(540),l=t(976),n=t(767),r=t(974),c=t(946);const o=(0,s.createContext)();function i(){const{setErrorMessage:e,setSuccessMessage:a}=(0,c.Xn)(),[t,i]=(0,s.useState)(),[m,d]=(0,s.useState)(),[u,E]=(0,s.useState)(!1),[N,p]=(0,s.useState)(),[g,f]=(0,s.useState)(),[v,h]=(0,s.useState)(),[R,b]=(0,s.useState)(!1),[y,w]=(0,s.useState)(1),[x]=(0,l.ok)();return s.createElement(o.Provider,{value:{raceResults:t,raceResultsLoading:m,raceResultDetails:u,raceResultDetailsLoading:N,seasonList:g,seasonListLoading:v,selectedSeason:R,setSelectedSeason:b,retrieveRaceResults:async function(){d(!0);const a=x.get("season");if(null==a)return;const t=await(0,r.aG)(a);t.error?e("There was an error loading the race results"):404!==t.status?200==t.status?(i(t.raceResults),d(!1)):e("Be sure your request is valid"):e("Be sure to select a valid season")},retrieveRaceResultDetails:async function(a){p(!0);const t=await(0,r.YY)(a);t.error?e("There was an error loading the race result"):404!==t.status?200==t.status?(E(t.race),p(!1)):e("There was an error loading the race result"):e("Race result was not found")},retrieveSeasonList:async function(){h(!0);const a=await(0,r.zV)();a.error||200!=a.status?e("There was an error loading the season list"):(f(a.seasons),h(!1))}}},s.createElement(n.sv,null))}function m(){return(0,s.useContext)(o)}},763:(e,a,t)=>{t.r(a),t.d(a,{default:()=>d});var s=t(540),l=t(767),n=t(976),r=t(637);function c({raceId:e}){const{raceResultDetails:a,raceResultDetailsLoading:t,retrieveRaceResultDetails:l}=(0,r.useRaceResultsContext)();return(0,s.useEffect)((()=>{!async function(){await l(e)}()}),[e]),t||!a?s.createElement("div",null,s.createElement("div",{className:"card element-background-color element-border-color",id:"race-result-card"},s.createElement("div",{className:"card-header rounded-15-top"},s.createElement("h5",{className:"fade-in-out"})),s.createElement("div",{className:"card-body"},s.createElement("ul",null,s.createElement("li",{className:"fade-in-out"}),s.createElement("li",{className:"fade-in-out"}),s.createElement("li",{className:"fade-in-out"}),s.createElement("li",{className:"fade-in-out"}),s.createElement("li",{className:"fade-in-out"}),s.createElement("li",{className:"fade-in-out"})))),s.createElement("div",{className:"card element-background-color element-border-color",id:"standings-card"},s.createElement("div",{className:"card-header rounded-15-top"},s.createElement("h5",{className:"fade-in-out"})),s.createElement("div",{className:"card-body"},s.createElement("ul",null,s.createElement("li",{className:"fade-in-out"}),s.createElement("li",{className:"fade-in-out"}),s.createElement("li",{className:"fade-in-out"}),s.createElement("li",{className:"fade-in-out"}),s.createElement("li",{className:"fade-in-out"}),s.createElement("li",{className:"fade-in-out"}))))):s.createElement("div",null,s.createElement("div",{className:"card rounded-15 element-background-color element-border-color",id:"race-result-card"},s.createElement("div",{className:"card-header rounded-15-top"},s.createElement("div",{className:"d-flex align-items-center"},s.createElement("h5",{className:"p-2"},a.title,a.is_sprint&&" (Sprint)"),s.createElement("div",{className:"ms-auto"},s.createElement("div",{className:"container"},a.finalized&&s.createElement("span",{className:"badge rounded-pill text-bg-success"},"Final"),!a.finalized&&s.createElement("span",{className:"badge rounded-pill text-bg-secondary"},"Upcoming"))))),s.createElement("div",{className:"card-body"},a.finalized&&s.createElement("div",null,s.createElement("div",{className:"row g-0",style:{marginRight:"0"}},s.createElement("strong",{className:"col-2"},"Pos"),s.createElement("strong",{className:"col-2"},"#"),s.createElement("strong",{className:"col-6"},"Name"),s.createElement("strong",{className:"col-2"},"Points")),a.competitors_positions.map((e=>s.createElement("div",{className:"row g-0",key:`competitor-${e.competitor_id}`,style:{marginRight:"0px"}},0==e.position&&s.createElement("span",{className:"col-2"},"-"),0!=e.position&&s.createElement("span",{className:"col-2"},e.position),s.createElement("span",{className:"col-2"},"#",e.number),s.createElement("span",{className:"col-6"},e.first," ",e.last),s.createElement("span",{className:"col-2"},e.points))))))))}t(946);var o=t(926);function i({seasonYear:e}){const{retrieveRaceResults:a,retrieveRaceResultsDetails:t,retrieveSeasonList:l,raceResults:n,raceResultsLoading:c,selectedSeason:i,seasonList:m,seasonListLoading:d}=(0,r.useRaceResultsContext)();return(0,s.useEffect)((()=>{!async function(){await a(),await l()}()}),[]),s.createElement("div",null,s.createElement("div",{className:"card rounded-15 element-background-color element-border-color"},s.createElement("div",{className:"card-header d-flex align-items-center"},s.createElement("h5",null,"Race results"),s.createElement("div",{className:"dropdown ms-auto"},s.createElement("button",{className:"btn btn-outline-secondary dropdown-toggle",type:"button",onClick:e=>(0,o.gR)("season-selector-dropdown",e,void 0)},e),s.createElement("ul",{className:"dropdown-menu",id:"season-selector-dropdown"},!d&&m.map((a=>s.createElement("li",{className:"ms-2",key:`${a.year}`},s.createElement("a",{className:"d-flex align-items-center",href:`/raceresults?season=${a.year}`,id:`${a.year}`},a.year,a.year==e&&s.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"ms-auto me-1 bi bi-check",viewBox:"0 0 16 16"},s.createElement("path",{d:"M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"}))))))))),s.createElement("div",{className:"card-body"},!c&&null!=n&&0==n.length&&s.createElement("h5",null,"No race results have been added for this season."),!c&&null!=n&&n.map((e=>s.createElement("div",{className:"p-2 clickable rounded-15",key:`race-result-${e.id}`},s.createElement("a",{className:"link-no-decorations",href:`/raceresults/${e.id}`},s.createElement("div",null,s.createElement("div",{className:"d-flex align-items-center"},s.createElement("h3",{className:"p-2"},e.title,e.is_sprint&&" (Sprint)"),s.createElement("div",{className:"ms-auto"},s.createElement("div",{className:"container"},e.finalized&&s.createElement("span",{className:"badge rounded-pill text-bg-success"},"Final"),!e.finalized&&s.createElement("span",{className:"badge rounded-pill text-bg-secondary"},"Upcoming"))))),s.createElement("div",{className:"card-body"},e.finalized&&s.createElement("div",null,s.createElement("div",{className:"row g-0",style:{marginRight:"0px",padding:"0px"}},s.createElement("strong",{className:"col-2"},"Pos."),s.createElement("strong",{className:"col-2"},"#"),s.createElement("strong",{className:"col-6"},"Name")),e.competitors_positions.map((e=>s.createElement("div",{className:"row g-0",key:`competitor-${e.competitor_id}`,style:{marginRight:"0px"}},0==e.position&&s.createElement("span",{className:"col-2"},"-"),0!=e.position&&s.createElement("span",{className:"col-2"},e.position),s.createElement("span",{className:"col-2"},s.createElement("small",null,s.createElement("strong",null,"#",e.number))),s.createElement("span",{className:"col-6"},e.first," ",e.last)))))))))))))}var m=t(807);function d(){const{raceId:e}=(0,l.g)(),[a]=(0,n.ok)(),{retrieveSeasonList:t,seasonList:o,seasonListLoading:d,setSelectedSeason:u,selectedSeason:E}=(0,r.useRaceResultsContext)(),N=a.get("season");return e?s.createElement(c,{raceId:e}):N?((0,s.useEffect)((()=>{!async function(){await t()}()}),[]),(0,s.useEffect)((()=>{if(!d&&null!=o)for(let e=0;e<o.length;e++)o[e].year==N&&u(o[e])}),[o]),E?s.createElement(i,{seasonYear:N}):s.createElement(m.default,null)):s.createElement(m.default,null)}}}]);