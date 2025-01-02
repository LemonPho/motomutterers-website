"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[192,587],{587:(e,a,t)=>{t.r(a),t.d(a,{default:()=>d});var s=t(540),n=t(946),l=t(398),r=t(926),o=t(192);function c(){const e=(new Date).getFullYear(),{modalSuccessMessage:a,modalErrorMessage:t,setModalErrorMessage:c,setSuccessMessage:m,resetApplicationMessages:d,setLoadingMessage:i,loadingMessage:u}=(0,n.Xn)(),{retrieveSeasons:E}=(0,o.useSeasonCreateContext)(),[v,g]=(0,s.useState)(e),[h,p]=(0,s.useState)(!1),[f,N]=(0,s.useState)(!1);async function y(){d(),i("Loading...");let a=await(0,l.KE)(v,h,f);if(i(!1),a.error)return console.log(error),void c("There was an error creating the season");200===a.status?(m("Season created"),(0,r.tI)(),g(e),p(!1),N(!1),E()):c("Be sure the year of the season is unique")}return s.createElement("div",{className:"custom-modal hidden",id:"season-create-modal",onClick:e=>{e.stopPropagation()}},""!=t&&s.createElement("div",{className:"alert alert-danger my-2"},s.createElement("small",null,t)),""!=a&&s.createElement("div",{className:"alert alert-success my-2"},s.createElement("small",null,a)),u&&s.createElement("div",{className:"alert alert-secondary my-2"},s.createElement("small",null,u)),s.createElement("div",{className:"custom-modal-header justify-content-center"},s.createElement("h5",null,"Create season")),s.createElement("div",{className:"custom-modal-body"},s.createElement("hr",null),s.createElement("div",{className:"d-flex justify-content-center w-100"},s.createElement("input",{className:"input-field",type:"number",min:"1900",max:"2099",step:"1",value:v,onChange:e=>function(e){const a=e.target.value;g(a)}(e),id:"season-year",onKeyUp:e=>enterKeySubmit(e,y)}),s.createElement("div",{className:"ms-2"},s.createElement("div",{className:"form-check"},s.createElement("input",{className:"form-check-input",id:"season-top-independent",type:"checkbox",value:h,onChange:e=>function(e){const a=e.target.checked;p(a)}(e)}),s.createElement("label",{className:"form-check-label",htmlFor:"season-top-independent"},"Top Independent")),s.createElement("div",{className:"form-check"},s.createElement("input",{className:"form-check-input",id:"season-top-rookie",type:"checkbox",value:f,onChange:e=>function(e){const a=e.target.checked;N(a)}(e)}),s.createElement("label",{className:"form-check-label",htmlFor:"season-top-rookie"},"Top Rookie"))))),s.createElement("div",{className:"custom-modal-footer justify-content-center"},s.createElement("button",{id:"submit-data",className:"btn btn-primary rounded-15",onClick:y},"Create season")))}function m(){const{errorMessage:e,successMessage:a,modalErrorMessage:t,modalSuccessMessage:m,setErrorMessage:d,setSuccessMessage:i,setModalErrorMessage:u,setModalSuccesMessage:E,resetApplicationMessages:v}=(0,n.Xn)(),{user:g,isLoggedIn:h,contextLoading:p}=(0,n.Xn)(),{seasons:f,seasonsLoading:N,retrieveSeasons:y}=(0,o.useSeasonCreateContext)(),[b,w]=(0,s.useState)();return(0,s.useEffect)((()=>{v(),y()}),[]),N||p?s.createElement("div",{className:"p-3"},"Loading..."):g.is_admin?s.createElement("div",null,s.createElement("div",{className:"card-header rounded-15-top"},s.createElement("div",{className:"d-flex align-items-center"},s.createElement("h3",{className:"m-0"},"Seasons editor"),s.createElement("button",{className:"ms-2 btn btn-outline-secondary ms-auto rounded-15",id:"season-modal-button",onClick:e=>(0,r.YK)("season-create-modal",e,h,g.is_admin)},s.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",fill:"grey",className:"bi bi-plus",viewBox:"0 0 16 16"},s.createElement("path",{d:"M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"}))))),s.createElement("div",{className:"custom-modal hidden",id:"season-delete-modal",onClick:e=>{e.stopPropagation()}},""!=t&&s.createElement("div",{className:"alert alert-danger my-2"},s.createElement("small",null,t)),""!=m&&s.createElement("div",{className:"alert alert-success my-2"},s.createElement("small",null,m)),s.createElement("div",{className:"custom-modal-header justify-content-center"},s.createElement("h5",null,"Are you sure you want to delete this season?")),s.createElement("div",{className:"custom-modal-body"},s.createElement("hr",null)),s.createElement("div",{className:"custom-modal-footer"},s.createElement("button",{id:"season-confirm-delete",className:"btn btn-danger me-auto rounded-15",onClick:e=>async function(e){v(),e.stopPropagation();let a=await(0,l.Hs)(b);a.error?u("There was an error deleting the season"):200==a.status&&((0,r.tI)(),y(),i("Season deleted"))}(e)},"Confirm"),s.createElement("button",{id:"season-cancel-delete",className:"btn btn-secondary ms-auto rounded-15",onClick:r.tI},"Cancel"))),f.map((e=>s.createElement("div",{className:"container my-2",id:`season-${e.year}`,key:`season-${e.year}`},s.createElement("div",{className:"p-2 d-flex"},s.createElement("a",{className:"link-no-decorations",href:`administration/seasons/${e.year}`},"Season ",e.year),s.createElement("div",{className:"ms-auto dropdown-div",onClick:a=>(0,r.gR)(`dropdown-season-${e.year}`,a)},s.createElement("div",null,s.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-three-dots-vertical",viewBox:"0 0 16 16"},s.createElement("path",{d:"M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"}))),s.createElement("div",{id:`dropdown-season-${e.year}`,className:"dropdown-menu"},s.createElement("li",null,s.createElement("a",{className:"dropdown-item",href:`administration/seasons/${e.year}`},"Edit")),s.createElement("li",null,s.createElement("a",{className:"dropdown-item link-button",onClick:a=>{var t,s;t=a,s=e.id,w(s),(0,r.YK)("season-delete-modal",t,h,g.is_admin)}},"Delete")))))))),s.createElement(c,null)):s.createElement("div",null,"You don't have admin permissions")}function d(){const{user:e,contextLoading:a}=(0,n.Xn)();return a?null:e.is_admin?s.createElement("div",{className:"d-flex"},s.createElement("div",{className:"card rounded-15 flex-grow-1 element-background-color element-border-color"},s.createElement(m,null))):s.createElement("div",null,"You don't have admin permissions")}},192:(e,a,t)=>{t.r(a),t.d(a,{default:()=>c,useSeasonCreateContext:()=>m});var s=t(540),n=t(767),l=t(974),r=t(946);const o=(0,s.createContext)();function c(){const{setErrorMessage:e}=(0,r.Xn)(),[a,t]=(0,s.useState)(!1),[c,m]=(0,s.useState)([]);return s.createElement(o.Provider,{value:{seasons:c,seasonsLoading:a,retrieveSeasons:async function(){let a=await(0,l.a)();if(a.error)return console.log(a.error),void e("There was an error loading the seasons");m(a.seasons),t(!1)}}},s.createElement(n.sv,null))}function m(){return(0,s.useContext)(o)}}}]);