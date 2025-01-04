"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[628,993],{628:(e,t,s)=>{s.r(t),s.d(t,{default:()=>o,useStandingsContext:()=>c});var a=s(540),r=s(767),n=s(974),i=s(946);const l=(0,a.createContext)();function o(){const{setErrorMessage:e}=(0,i.Xn)(),[t,s]=(0,a.useState)({}),[o,c]=(0,a.useState)(!0),[d,m]=(0,a.useState)(!0),[u,p]=(0,a.useState)({}),[f,g]=(0,a.useState)(!0),[k,h]=(0,a.useState)([]),[E,v]=(0,a.useState)(!0),[w,_]=(0,a.useState)({}),[N,S]=(0,a.useState)(!0);return a.createElement(l.Provider,{value:{retrieveStandings:async function(){c(!0);const t=new URLSearchParams(location.search).get("season"),a=await(0,n.bO)(t);a.error?e("There was an error retrieving the standings"):200===a.status&&(s(a.standings),c(!1))},retrieveSelectedSeason:async function(){S(!0);const t=new URLSearchParams(location.search).get("season"),s=await(0,n.cv)(t);s.error?e("There was an error retrieving season data"):200==s.status?(_(s.season),S(!1)):e("Be sure to select a valid season")},retrieveSeasonList:async function(){v(!0);const t=await(0,n.a)();t.error||200!=t.status?e("There was an error retrieving the season list"):(h(t.seasons),v(!1))},retrieveUserPicks:async function(t){g(!0);const s=await(0,n.i)(w.id,t);if(s.error)e("There was an error retrieving the user picks");else if(404!=s.status){if(200==s.status){const t=await(0,n.HD)(s.userPicks.user);if(t.error)return void e("There was an error loading the profile picture");if(404==t.status)return void e("User profile picture was not found");200==t.status&&(s.userPicks.user.profile_picture=t.users[0].profile_picture,p(s.userPicks),g(!1))}}else e("The user picks was not found")},retrieveProfilePictures:async function(){if(!t||0==Object.keys(t).length||0==t.users_picks.length)return;const a=t.users_picks.map((e=>e.user)),r=await(0,n.HD)(a);if(200!==r.status)return void e("There was an error loading the profile pictures");const i=t.users_picks.map(((e,t)=>{const s={...e.user,profile_picture:r.users[t].profile_picture};return{...e,user:s}}));let l=t;l.users_picks=i,s(l),m(!1)},standings:t,userPicksDetailed:u,seasonList:k,selectedSeason:w,standingsLoading:o,userPicksDetailedLoading:f,seasonListLoading:E,selectedSeasonLoading:N,profilePicturesLoading:d}},a.createElement(r.sv,null))}function c(){return(0,a.useContext)(l)}},993:(e,t,s)=>{s.r(t),s.d(t,{default:()=>c});var a=s(540),r=s(926),n=s(447),i=s(628),l=s(946);function o(){const{errorMessage:e}=(0,l.Xn)(),{userPicksDetailed:t,userPicksDetailedLoading:s,selectedSeason:r}=(0,i.useStandingsContext)();return a.createElement("div",{className:"custom-modal hidden",id:"user-picks-detailed-modal",onClick:e=>{e.stopPropagation()}},e&&a.createElement("div",{className:"alert alert-danger"},a.createElement("small",null,e)),!s&&a.createElement("a",{className:"p-2 custom-modal-header d-flex align-items-center link-no-decorations clickable rounded-15",href:`/users/${t.user.username}?page=1`},a.createElement(n.A,{width:"5rem",height:"5rem",format:t.user.profile_picture.profile_picture_format,base64:t.user.profile_picture.profile_picture_data}),a.createElement("h3",{className:"ms-4"},t.user.username," - ",t.points)),s&&a.createElement("div",{className:"p-2 custom-modal-header d-flex align-items-center"},a.createElement(n.A,{width:"5rem",height:"5rem",format:!1,base64:!1}),a.createElement("h3",{className:"w-100 ms-4 fade-in-out"},"                                ")),a.createElement("hr",null),s&&a.createElement("ul",{className:"list-group"},a.createElement("li",{className:"list-group-item fade-in-out"}),a.createElement("li",{className:"list-group-item fade-in-out"}),a.createElement("li",{className:"list-group-item fade-in-out"}),a.createElement("li",{className:"list-group-item fade-in-out"}),a.createElement("li",{className:"list-group-item fade-in-out"}),a.createElement("li",{className:"list-group-item fade-in-out"}),a.createElement("li",{className:"list-group-item fade-in-out"})),!s&&a.createElement("ul",{className:"custom-modal-body d-flex list-group"},t.picks.map((e=>a.createElement("li",{className:"list-group-item",id:`pick-${e.position}`,key:`pick-${e.position}`},a.createElement("strong",null,e.position,". "),e.first," ",e.last," - ",e.points))),r.top_independent&&a.createElement("li",{className:"list-group-item",id:"pick-independent"},a.createElement("strong",null,"Independent. ")," ",t.independent_pick.first," ",t.independent_pick.last," - ",t.independent_pick.points),r.top_rookie&&a.createElement("li",{className:"list-group-item",id:"pick-rookie"},a.createElement("strong",null,"Rookie. ")," ",t.rookie_pick.first," ",t.rookie_pick.last," - ",t.rookie_pick.points)))}function c(){const{retrieveStandings:e,retrieveSelectedSeason:t,retrieveSeasonList:s,retrieveProfilePictures:l,selectedSeason:c,seasonList:d,standings:m,standingsLoading:u,selectedSeasonLoading:p,seasonListLoading:f,profilePicturesLoading:g,retrieveUserPicks:k}=(0,i.useStandingsContext)();return(0,a.useEffect)((()=>{!async function(){await e(),await s(),await t()}()}),[]),(0,a.useEffect)((()=>{!async function(){await l()}()}),[u]),a.createElement("div",{className:"card rounded-15 align-middle element-background-color element-border-color"},a.createElement("div",{className:"rounded-15-top card-header"},a.createElement("div",{className:"d-flex align-items-center"},a.createElement("h5",{className:"m-0"},"Standings"),!p&&c.finalized&&a.createElement("small",null,"‎ (finalized)"),a.createElement("div",{className:"ms-auto btn-group"},a.createElement("button",{className:"btn btn-outline-secondary dropdown-toggle","data-bs-toggle":"dropdown",type:"button","aria-expanded":"false",onClick:e=>{(0,r.gR)("season-selector-dropdown",e)}},c.year),a.createElement("ul",{className:"dropdown-menu dropdown-menu-end",id:"season-selector-dropdown",style:{top:"100%",right:"0"}},!f&&d.map((e=>a.createElement("li",{key:`${e.year}`},a.createElement("a",{className:"dropdown-item",href:`/standings?season=${e.year}`,id:`${e.year}`},e.year,e.year==c.year&&a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"ms-auto me-1 bi bi-check",viewBox:"0 0 16 16"},a.createElement("path",{d:"M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"})))))))))),a.createElement("div",{className:"card-body"},m?0==u&&m.users_picks.map(((e,t)=>a.createElement("div",{key:`standings-user-${e.user.username}`},a.createElement("div",{className:"p-2 clickable rounded-15",onClick:t=>{t.stopPropagation(),(0,r.YK)("user-picks-detailed-modal",t),k(e.user.id)}},a.createElement("div",{className:"d-flex align-items-center"},g&&a.createElement(n.A,{width:"3.5rem",height:"3.5rem",format:!1,base64:!1}),!g&&a.createElement(n.A,{width:"3.5rem",height:"3.5rem",format:e.user.profile_picture.profile_picture_format,base64:e.user.profile_picture.profile_picture_data}),a.createElement("div",{className:"ms-1"},a.createElement("strong",null,t+1,". ",e.user.username," - ",e.points))),a.createElement("div",{className:"d-flex align-items-center"},e.picks.map((t=>a.createElement("div",{className:"me-1",style:{fontSize:"0.75rem"},key:`user-${e.user.id}-pick-${t.competitor_id}`},a.createElement("strong",null,t.first[0],". ",t.last.slice(0,3))," - ",t.points))),!p&&c.top_independent&&a.createElement("div",{className:"me-1",style:{fontSize:"0.75rem"}},a.createElement("strong",null,"| I: ",e.independent_pick.first[0],". ",e.independent_pick.last.slice(0,3))," - ",e.independent_pick.points),!p&&c.top_rookie&&a.createElement("div",{className:"me-1",style:{fontSize:"0.75rem"}},a.createElement("strong",null,"| R: ",e.rookie_pick.first[0],". ",e.rookie_pick.last.slice(0,3))," - ",e.rookie_pick.points))),a.createElement("hr",null)))):a.createElement("div",null,"There are no standings for this season")),a.createElement(o,null))}},447:(e,t,s)=>{s.d(t,{A:()=>r});var a=s(540);function r({format:e,base64:t,width:s,height:r}){return e&&t?a.createElement("img",{className:"rounded-circle",style:{width:s,height:r},src:`data: image/${e}; base64, ${t}`,alt:""}):a.createElement("span",{className:"fading-circle",style:{width:s,height:r}})}}}]);