"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[587,192],{587:(e,a,t)=>{t.r(a),t.d(a,{default:()=>i});var n=t(540),s=t(946),r=t(550),l=t(926),o=t(192);function c(){const e=(new Date).getFullYear(),{modalSuccessMessage:a,modalErrorMessage:t,setModalErrorMessage:c,setSuccessMessage:m,resetApplicationMessages:i,setLoadingMessage:d,loadingMessage:u}=(0,s.Xn)(),{retrieveSeasons:E}=(0,o.useSeasonCreateContext)(),[g,h]=(0,n.useState)(e),[v,p]=(0,n.useState)(!1),[f,N]=(0,n.useState)(!1);async function y(){i(),d("Loading...");let a=await(0,r.KE)(g,v,f);if(d(!1),a.error)return console.log(error),void c("There was an error creating the season");200===a.status?(m("Season created"),(0,l.tI)(),h(e),p(!1),N(!1),E()):c("Be sure the year of the season is unique")}return n.createElement("div",{className:"custom-modal hidden",id:"season-create-modal",onClick:e=>{e.stopPropagation()}},""!=t&&n.createElement("div",{className:"alert alert-danger my-2"},n.createElement("small",null,t)),""!=a&&n.createElement("div",{className:"alert alert-success my-2"},n.createElement("small",null,a)),u&&n.createElement("div",{className:"alert alert-secondary my-2"},n.createElement("small",null,u)),n.createElement("div",{className:"custom-modal-header justify-content-center"},n.createElement("h5",null,"Create season")),n.createElement("div",{className:"custom-modal-body"},n.createElement("hr",null),n.createElement("div",{className:"d-flex justify-content-center w-100"},n.createElement("input",{className:"input-field",type:"number",min:"1900",max:"2099",step:"1",value:g,onChange:e=>function(e){const a=e.target.value;h(a)}(e),id:"season-year",onKeyUp:e=>enterKeySubmit(e,y)}),n.createElement("div",{className:"ms-2"},n.createElement("div",{className:"form-check"},n.createElement("input",{className:"form-check-input",id:"season-top-independent",type:"checkbox",value:v,onChange:e=>function(e){const a=e.target.checked;p(a)}(e)}),n.createElement("label",{className:"form-check-label",htmlFor:"season-top-independent"},"Top Independent")),n.createElement("div",{className:"form-check"},n.createElement("input",{className:"form-check-input",id:"season-top-rookie",type:"checkbox",value:f,onChange:e=>function(e){const a=e.target.checked;N(a)}(e)}),n.createElement("label",{className:"form-check-label",htmlFor:"season-top-rookie"},"Top Rookie"))))),n.createElement("div",{className:"custom-modal-footer justify-content-center"},n.createElement("button",{id:"submit-data",className:"btn btn-primary rounded-15",onClick:y},"Create season")))}function m(){const{errorMessage:e,successMessage:a,modalErrorMessage:t,modalSuccessMessage:m,setErrorMessage:i,setSuccessMessage:d,setModalErrorMessage:u,setModalSuccesMessage:E,resetApplicationMessages:g}=(0,s.Xn)(),{user:h,isLoggedIn:v,contextLoading:p}=(0,s.Xn)(),{seasons:f,seasonsLoading:N,retrieveSeasons:y}=(0,o.useSeasonCreateContext)(),[w,b]=(0,n.useState)();return(0,n.useEffect)((()=>{g(),y()}),[]),N||p?n.createElement("div",{className:"p-3"},"Loading..."):h.is_admin?n.createElement("div",null,n.createElement("div",{className:"card-header rounded-15-top"},n.createElement("div",{className:"d-flex align-items-center"},n.createElement("h3",{className:"m-0"},"Seasons editor"),f.length>0&&n.createElement("div",{className:"dropdown ms-auto"},n.createElement("button",{className:"btn btn-outline-secondary dropdown-toggle",type:"button",onClick:e=>(0,l.gR)("season-selector-dropdown",e,void 0)},"Current Season"),n.createElement("ul",{className:"dropdown-menu",id:"season-selector-dropdown"},f.map((e=>n.createElement("li",{className:"ms-2",key:`${e.year}`},n.createElement("a",{className:"link-button d-flex align-items-center",id:`${e.year}`,onClick:()=>{!async function(e){let a=await(0,r.rI)(e);if(a.error)return console.log(a.error),void i("There was an error submiting the current season");y()}(e.year)}},e.year,e.current&&n.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"ms-auto me-1 bi bi-check",viewBox:"0 0 16 16"},n.createElement("path",{d:"M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"})))))))),n.createElement("button",{className:"ms-2 btn btn-outline-secondary ms-auto",id:"season-modal-button",onClick:e=>(0,l.YK)("season-create-modal",e,v,h.is_admin)},n.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",fill:"grey",className:"bi bi-plus",viewBox:"0 0 16 16"},n.createElement("path",{d:"M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"}))))),n.createElement("div",{className:"custom-modal hidden",id:"season-delete-modal",onClick:e=>{e.stopPropagation()}},""!=t&&n.createElement("div",{className:"alert alert-danger my-2"},n.createElement("small",null,t)),""!=m&&n.createElement("div",{className:"alert alert-success my-2"},n.createElement("small",null,m)),n.createElement("div",{className:"custom-modal-header justify-content-center"},n.createElement("h5",null,"Are you sure you want to delete this season?")),n.createElement("div",{className:"custom-modal-body"},n.createElement("hr",null)),n.createElement("div",{className:"custom-modal-footer"},n.createElement("button",{id:"season-confirm-delete",className:"btn btn-danger me-auto rounded-15",onClick:e=>async function(e){g(),e.stopPropagation();let a=await(0,r.Hs)(w);a.error?u("There was an error deleting the season"):200==a.status&&((0,l.tI)(),y(),d("Season deleted"))}(e)},"Confirm"),n.createElement("button",{id:"season-cancel-delete",className:"btn btn-secondary ms-auto rounded-15",onClick:l.tI},"Cancel"))),f.map((e=>n.createElement("div",{className:"container my-2",id:`season-${e.year}`,key:`season-${e.year}`},n.createElement("div",{className:"p-2 d-flex"},n.createElement("a",{className:"link-no-decorations",href:`administration/seasons/${e.year}`},"Season ",e.year),n.createElement("div",{className:"ms-auto dropdown-div",onClick:a=>(0,l.gR)(`dropdown-season-${e.year}`,a)},n.createElement("div",null,n.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-three-dots-vertical",viewBox:"0 0 16 16"},n.createElement("path",{d:"M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"}))),n.createElement("div",{id:`dropdown-season-${e.year}`,className:"dropdown-menu"},n.createElement("li",null,n.createElement("a",{className:"dropdown-item",href:`administration/seasons/${e.year}`},"Edit")),n.createElement("li",null,n.createElement("a",{className:"dropdown-item link-button",onClick:a=>{var t,n;t=a,n=e.id,b(n),(0,l.YK)("season-delete-modal",t,v,h.is_admin)}},"Delete")))))))),n.createElement(c,null)):n.createElement("div",null,"You don't have admin permissions")}function i(){const{user:e,contextLoading:a}=(0,s.Xn)();return a?null:e.is_admin?n.createElement("div",{className:"d-flex"},n.createElement("div",{className:"card rounded-15 flex-grow-1 element-background-color element-border-color"},n.createElement(m,null))):n.createElement("div",null,"You don't have admin permissions")}},192:(e,a,t)=>{t.r(a),t.d(a,{default:()=>c,useSeasonCreateContext:()=>m});var n=t(540),s=t(767),r=t(974),l=t(946);const o=(0,n.createContext)();function c(){const{setErrorMessage:e}=(0,l.Xn)(),[a,t]=(0,n.useState)(!1),[c,m]=(0,n.useState)([]);return n.createElement(o.Provider,{value:{seasons:c,seasonsLoading:a,retrieveSeasons:async function(){let a=await(0,r.a)();if(a.error)return console.log(a.error),void e("There was an error loading the seasons");m(a.seasons),t(!1)}}},n.createElement(s.sv,null))}function m(){return(0,n.useContext)(o)}}}]);