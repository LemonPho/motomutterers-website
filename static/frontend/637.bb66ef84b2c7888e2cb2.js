"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[637],{637:(e,t,s)=>{s.r(t),s.d(t,{default:()=>l,useRaceResultsContext:()=>i});var a=s(540),r=s(976),n=s(767),o=s(974),u=s(946);const c=(0,a.createContext)();function l(){const{setErrorMessage:e,setSuccessMessage:t}=(0,u.Xn)(),[s,l]=(0,a.useState)(),[i,d]=(0,a.useState)(),[R,h]=(0,a.useState)(!1),[S,f]=(0,a.useState)(),[w,g]=(0,a.useState)(),[m,v]=(0,a.useState)(),[C,L]=(0,a.useState)(),[T,k]=(0,a.useState)(),[y,p]=(0,a.useState)(!1),[x,D]=(0,a.useState)(1),[E]=(0,r.ok)();return a.createElement(c.Provider,{value:{raceResults:s,raceResultsLoading:i,raceResultDetails:R,raceResultDetailsLoading:S,seasonList:C,seasonListLoading:T,selectedSeason:y,setSelectedSeason:p,raceResultComments:w,raceResultCommentsLoading:m,retrieveRaceResults:async function(){d(!0);const t=E.get("season");if(null==t)return;const s=await(0,o.aG)(t);s.error?e("There was an error loading the race results"):404!==s.status?200==s.status?(l(s.raceResults),d(!1)):e("Be sure your request is valid"):e("Be sure to select a valid season")},retrieveRaceResultDetails:async function(t){f(!0);const s=await(0,o.YY)(t);s.error?e("There was an error loading the race result"):404!==s.status?200==s.status?(h(s.race),f(!1)):e("There was an error loading the race result"):e("Race result was not found")},retrieveSeasonList:async function(){k(!0);const t=await(0,o.zV)();t.error||200!=t.status?e("There was an error loading the season list"):(L(t.seasons),k(!1))},retrieveRaceResultComments:async function(t){v(!0);const s=await(0,o.oH)(t);s.error?e("There was an error loading the race result"):404!==s.status?200==s.status?(g(s.comments),v(!1)):e("There was an error loading the race comments"):e("Race result was not found")}}},a.createElement(n.sv,null))}function i(){return(0,a.useContext)(c)}}}]);