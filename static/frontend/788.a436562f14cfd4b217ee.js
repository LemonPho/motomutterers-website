"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[788],{788:(e,t,a)=>{a.r(t),a.d(t,{default:()=>o});var n=a(540),s=a(767),l=a(946),r=a(974),c=a(606),i=a(926);function o(){const[e,t]=(0,n.useState)([]),[a,o]=(0,n.useState)(!0),[m,d]=(0,n.useState)(0),[u,g]=(0,n.useState)(!1),{user:p,contextLoading:h,setErrorMessage:E,modalErrorMessage:f,setModalErrorMessage:y,setSuccessMessage:N,resetApplicationMessages:v}=(0,l.Xn)(),[b,w]=(0,n.useState)(!1),[k,$]=(0,n.useState)(1),[L,x]=(0,n.useState)(""),[S,I]=(0,n.useState)(""),[P,_]=(0,n.useState)([]),[B,C]=(0,n.useState)(!0),T=(0,s.zy)();async function A(){let e=new URLSearchParams(T.search).get("page");$(e);const a=await(0,r.jP)(e);if(a.error||200!==a.status)return E("There was an error while loading the announcements"),void console.log(a.error);t(a.announcements),d(a.amountAnnouncements)}return(0,n.useEffect)((()=>{let e=(0,i.X$)(m,10,k);null!==e&&(I(e.nextPage),x(e.previousPage),_(e.pageNumbers),w(!0)),C(!1)}),[m]),(0,n.useEffect)((()=>{A(),o(!1)}),[]),a||B||h?n.createElement("div",null,"Loading..."):n.createElement("div",null,!0===p.is_admin&&n.createElement("div",{className:"d-flex justify-content-center mt-3"},n.createElement("button",{id:"announcement-button",className:"btn btn-primary rounded-15",onClick:e=>(0,i.YK)("announcement-create-modal",e,void 0,p.is_admin)},"Create announcement"),n.createElement("div",{className:"custom-modal hidden",id:"announcement-create-modal",style:{width:"50%"},onClick:e=>{e.stopPropagation()}},n.createElement("div",{className:"custom-modal-header justify-content-center"},n.createElement("h5",{className:"m-0"},"Create announcement")),n.createElement("div",{className:"custom-modal-body"},n.createElement("hr",{className:"m-1"}),u&&n.createElement("div",{className:"alert alert-secondary"},n.createElement("small",null,"Loading...")),f&&n.createElement("div",{className:"alert alert-danger"},n.createElement("small",null,f)),n.createElement("div",{className:"d-flex align-items-center"},n.createElement("img",{className:"rounded-circle",style:{width:"3rem",height:"3rem",marginRight:"0.5rem"},src:`data: image/${p.profile_picture_format}; base64, ${p.profile_picture_data}`,alt:""}),n.createElement("strong",null,p.username)),n.createElement("div",{id:"announcement-title",className:"input-field mt-2",contentEditable:!0,"data-placeholder":"Title...","data-category":"input-field"}),n.createElement("div",{id:"break-line-text",className:"input-field mt-2",contentEditable:!0,"data-placeholder":"Text...","data-category":"input-field"})),n.createElement("div",{className:"custom-modal-footer"},n.createElement("button",{id:"submit-data",className:"btn btn-primary me-auto rounded-15",onClick:async function(){if(g(!0),v(),!p.is_admin)return y("You do not have permission to do that"),g("false"),void(0,i.tI)();let e=document.getElementById("announcement-title").innerHTML,t=document.getElementById("break-line-text").innerHTML;const a=await(0,c.wS)(e,t);return a.error?(y("There was an error submiting the announcement"),void g(!1)):400===a.status?(y("Be sure the title has less than 128 characters and the text 2048 characters"),void g(!1)):200===a.status?(N("Announcement posted"),A(),void(0,i.tI)()):void y("There was a server error while submiting the announcement")}},"Post announcement")))),n.createElement("div",{id:"announcements-view"},0==e.length&&n.createElement("div",null,"No announcements posted yet."),0!=e.lenght&&e.map((e=>n.createElement("div",{className:"clickable card mx-auto my-3 rounded-15 w-100 element-background-color element-border-color",key:e.id},n.createElement("a",{className:"link-no-decorations",href:`/announcements/${e.id}`},n.createElement("div",{className:"p-3",id:`announcement-${e.id}`},n.createElement("div",{className:"d-flex"},n.createElement("small",null,n.createElement("img",{className:"rounded-circle",style:{width:"2rem",height:"2rem",marginRight:"0.5rem"},src:`data: image/${e.user.profile_picture_format}; base64, ${e.user.profile_picture_data}`,alt:""}),e.user.username),n.createElement("small",{className:"ms-auto"},new Date(e.date_created).toISOString().substring(0,10))),n.createElement("div",{className:"d-flex w-100"},n.createElement("h5",{className:"mt-1"},e.title)),n.createElement("hr",{className:"mt-2 mb-1"}),n.createElement("p",null,e.text))))))),b&&n.createElement("nav",{id:"pagination-view "},n.createElement("ul",{className:"pagination justify-content-center"},n.createElement("li",{id:"previous-page",className:`${L}`},n.createElement("a",{id:"previous-page-link",href:"announcements?page="+(parseInt(k)-1),className:"page-link"},"Previous")),P.map((e=>parseInt(k)!==e?n.createElement("li",{id:`page-${e}`,key:`page-${e}`,className:"page-item"},n.createElement("a",{id:`page-link-${e}`,href:`announcements?page=${e}`,className:"page-link"},e)):n.createElement("li",{id:`page-${e}`,key:`page-${e}`,className:"page-item disabled"},n.createElement("a",{id:`page-link-${e}`,href:`announcements?page=${e}`,className:"page-link"},e)))),n.createElement("li",{id:"next-page",className:`${S}`},n.createElement("a",{id:"next-page-link",href:`announcements?page=${parseInt(k)+1}`,className:"page-link"},"Next")))))}},926:(e,t,a)=>{function n(e,t,a){let n,s={pageNumbers:[],nextPage:"",previousPage:""},l=Math.ceil(e/t),r=0;if(e%t==0&&l++,n=l,e<=t)return null;for(s.previousPage=a>1?"page-item":"page-item disabled",s.nextPage=a<l?"page-item":"page-item disabled",a>5&&(l>a+5?(r=a-5,n=a+5):(r=10-(l-a),n=r+10));r<n;r++)s.pageNumbers.push(r+1);return s}function s(e,t){for(var a=e.split(","),n=a[0].match(/:(.*?);/)[1],s=atob(a[a.length-1]),l=s.length,r=new Uint8Array(l);l--;)r[l]=s.charCodeAt(l);return t=`${t}.${n.split("/")[1]}`,new File([r],t,{type:n})}function l(){return{width:window.innerWidth,height:window.innerHeight}}function r(){const e=document.getElementsByClassName("custom-modal"),t=document.getElementById("background-blur"),a=document.querySelectorAll('[data-category="input-field"]');Array.prototype.forEach.call(e,(e=>{e.classList.contains("hidden")||e.classList.toggle("hidden")})),Array.prototype.forEach.call(a,(e=>{"INPUT"===e.tagName?(e.value=null,e.checked=!1):e.innerHTML=""})),t.classList.contains("hidden")||t.classList.toggle("hidden")}function c(e,t,a,n){const s=document.getElementById(e),l=document.getElementById("background-blur");t.stopPropagation(),s.classList.contains("hidden")?void 0!==a&&!0!==a||void 0!==n&&!0!==n||(i(),r(),s.classList.toggle("hidden"),l.classList.toggle("hidden")):r()}function i(){const e=document.getElementsByClassName("dropdown-menu"),t=document.getElementsByClassName("menu-dropdown-content");Array.prototype.forEach.call(e,(e=>{e.classList.contains("show")&&e.classList.toggle("show")})),Array.prototype.forEach.call(t,(e=>{e.classList.contains("show")&&e.classList.toggle("show")}))}function o(e,t,a){t.stopPropagation();const n=document.getElementById(e);n.classList.contains("show")?i():(i(),null==e||null!=a&&1!=a||n.classList.toggle("show"))}function m(e,t){e.stopPropagation(),"Enter"==e.key&&(e.preventDefault(),t())}function d(e){const t=document.getElementById(e);t&&t.focus()}a.d(t,{Gd:()=>d,Tc:()=>i,X$:()=>n,Xz:()=>s,YK:()=>c,ac:()=>m,gR:()=>o,qT:()=>l,tI:()=>r})}}]);