"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[368,807,98],{807:(e,t,n)=>{n.r(t),n.d(t,{default:()=>o});var a=n(540);class l extends a.Component{constructor(e){super(e)}render(){return a.createElement("p",null,"Error page not found")}}const o=l},368:(e,t,n)=>{n.r(t),n.d(t,{default:()=>d});var a=n(540),l=n(98),o=n(767),c=n(946),s=n(926);function r(){const{user:e,loggedIn:t,contextLoading:n}=(0,c.Xn)(),{comments:r,retrieveComment:i,announcementLoading:m,commentsErrorMessage:d,setCommentsErrorMessage:u,resetAnnouncementMessages:g,editComment:E,createCommentReply:p,createComment:h,deleteComment:f}=(0,l.useAnnouncementContext)(),[y,b]=(0,a.useState)(null),v=(0,o.zy)();function w(e){null!==e?document.getElementById(`comment-reply-div-${e}`).classList.toggle("hidden"):console.log("commentid is null")}function N(e){const t=document.getElementById(`comment-${e}-text`);if(null==t)return;const n=document.getElementById(`comment-${e}-save-button`),a=document.getElementById(`comment-${e}-cancel-button`);t.contentEditable="false"===t.contentEditable,t.classList.toggle("input-field"),n.classList.toggle("hidden"),a.classList.toggle("hidden")}function x(e){const t=document.getElementById(`reply-${e}-text`);if(null==t)return;const n=document.getElementById(`reply-${e}-save-button`),a=document.getElementById(`reply-${e}-cancel-button`);t.contentEditable="false"===t.contentEditable,t.classList.toggle("input-field"),n.classList.toggle("hidden"),a.classList.toggle("hidden")}return(0,a.useEffect)((()=>{!function(){if(null===y)return;const e=document.getElementById(`comment-replies-${y}`);e.classList.contains("hidden")&&e.classList.toggle("hidden"),b(null)}()}),[y]),(0,a.useEffect)((()=>{m||function(){let e=new URLSearchParams(v.search);const t=e.get("comment"),n=e.get("response");if(null!=t&&null!==n){const e=document.getElementById(`comment-replies-${t}`),a=document.getElementById(`reply-${n}`);if(null==e||null==a)return;return e.classList.toggle("hidden"),a.scrollIntoView({behavior:"smooth"}),void a.classList.add("div-highlight")}if(null!==t){const e=document.getElementById(`comment-${t}`);if(console.log(e),null==e)return;e.scrollIntoView({behavior:"smooth",block:"start"}),e.classList.toggle("div-highlight")}}()}),[m]),m||n?null:a.createElement("div",{className:"card rounded-15 mt-2 p-3 element-background-color element-border-color",id:"comments-card"},a.createElement("h5",null,"Comments"),a.createElement("hr",null),a.createElement("div",{id:"comments-view"},!0===t?a.createElement("div",{className:"flex-box align-items-center"},e.profile_picture_data?a.createElement("img",{className:"rounded-circle",style:{width:"3rem",height:"3rem"},src:`data: image/${e.profile_picture_format}; base64, ${e.profile_picture_data}`,alt:""}):a.createElement("div",null,"Error"),a.createElement("div",{contentEditable:!0,id:"comment-text",className:"input-field ms-2 w-100",role:"textbox","data-placeholder":"Write a comment...",onClick:()=>(0,s.Gd)("comment-text")}),a.createElement("button",{className:"btn btn-outline-secondary ms-2",onClick:async function(){const e=document.getElementById("comment-text").innerHTML;h(e)&&(document.getElementById("comment-text").innerHTML="")}},a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-send",viewBox:"0 0 16 16"},a.createElement("path",{d:"M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"})))):a.createElement("div",{className:"d-flex justify-content-center"},a.createElement("span",null,"Login in to write a comment")),a.createElement("hr",null),d&&a.createElement("div",{className:"alert alert-danger m-2"},d),r?r.map((n=>null===n.parent_comment&&a.createElement("div",{id:`comment-${n.id}`,key:`comment-${n.id}`},a.createElement("div",{className:"d-flex align-items-start"},a.createElement("img",{className:"rounded-circle",style:{width:"2.5rem",height:"2.5rem"},src:`data: image/${n.user.profile_picture_format}; base64, ${n.user.profile_picture_data}`,alt:""}),a.createElement("div",{className:"dynamic-container ms-2",style:{maxWidth:"calc(100% - 48px)"}},a.createElement("div",{className:"d-flex align-items-center"},a.createElement("a",{className:"link-no-decorations",href:`/users/${n.user.username}?page=1`},a.createElement("strong",null,n.user.username)),a.createElement("span",{className:"flex-item ms-2",style:{fontSize:"0.75rem"}},new Date(n.date_created).toISOString().substring(0,10)," ",new Date(n.date_created).toLocaleTimeString().substring(0,5)),n.edited&&a.createElement("small",{className:"ms-1"},"(edited)"),(e.id===n.user.id||1==e.is_admin)&&a.createElement("div",{className:"ms-auto dropdown-div d-flex align-items-start"},a.createElement("button",{id:"announcement-dropdown-button",className:"btn btn-link link-no-decorations ms-auto",style:{padding:"0"},onClick:e=>(0,s.gR)(`comment-${n.id}-dropdown`,e)},a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-three-dots-vertical",viewBox:"0 0 16 16"},a.createElement("path",{d:"M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"}))),a.createElement("div",{id:`comment-${n.id}-dropdown`,className:"dropdown-menu"},a.createElement("li",null,a.createElement("button",{className:"dropdown-item",onClick:()=>N(n.id)},"Edit")),a.createElement("li",null,a.createElement("a",{className:"dropdown-item",onClick:()=>f(n.id)},"Delete"))))),a.createElement("div",{className:"break-line-text"},a.createElement("span",{id:`comment-${n.id}-text`,style:{overflow:"visible"},className:"",contentEditable:!1},n.text)),e.id===n.user.id&&a.createElement("div",{className:"d-flex"},a.createElement("button",{id:`comment-${n.id}-save-button`,className:"btn btn-primary ms-auto me-2 mt-2 hidden",onClick:()=>async function(e){const t=document.getElementById(`comment-${e}-text`);null!=t&&await E(t.innerHTML,e)&&N(e)}(n.id)},"Save"),a.createElement("button",{id:`comment-${n.id}-cancel-button`,className:"btn btn-outline-secondary mt-2 hidden",onClick:()=>async function(e){const t=document.getElementById(`comment-${e}-text`);if(null==t)return;const n=await i(e);n&&(t.innerHTML=n,N(e))}(n.id)},"Cancel")),a.createElement("div",{className:"d-flex mb-3"},parseInt(n.amount_replies)>0&&a.createElement("button",{className:"btn btn-link link-no-decorations p-0 pe-1",style:{color:"blue"},onClick:()=>{var e;null!==(e=n.id)&&document.getElementById(`comment-replies-${e}`).classList.toggle("hidden")}},a.createElement("small",null,"Show ",n.amount_replies," replies")),!0===t?a.createElement("button",{className:"btn btn-link link-no-decorations p-0",onClick:()=>w(n.id)},a.createElement("small",null,"Reply")):a.createElement("div",{className:"my-2"})))),a.createElement("div",{id:`comment-reply-div-${n.id}`,className:"hidden",style:{marginBottom:"0.5rem",marginLeft:"3.4rem"}},a.createElement("div",{className:"d-flex justify-content-center"},a.createElement("div",{id:`comment-reply-text-${n.id}`,role:"textbox",contentEditable:!0,className:"input-field w-100","data-placeholder":"Add a reply...",onClick:()=>(0,s.Gd)(`comment-reply-text-${n.id}`)}),a.createElement("button",{id:`comment-reply-button-${n.id}`,className:"btn btn-outline-secondary p-1 ms-2",onClick:()=>{!async function(e){const t=document.getElementById(`comment-reply-text-${e}`).innerHTML;w(e),p(t,e)&&(b(e),document.getElementById(`comment-reply-text-${e}`).innerHTML="")}(n.id)}},a.createElement("small",null,"Reply")))),a.createElement("div",{id:`comment-replies-${n.id}`,className:"dynamic-container hidden mb-3",style:{marginLeft:"2.7rem"}},n.replies.length>0&&n.replies.map((t=>a.createElement("div",{id:`reply-${t.id}`,key:`reply-${t.id}`,className:"dynamic-container mb-2",style:{marginLeft:"0px",maxWidth:"calc(100% - 2.7rem)"}},a.createElement("div",{className:"d-flex align-items-start"},a.createElement("img",{className:"rounded-circle",style:{width:"1.5rem",height:"1.5rem",marginTop:"6px"},src:`data: image/${t.user.profile_picture_format}; base64, ${t.user.profile_picture_data}`,alt:""}),a.createElement("div",{className:"dynamic-container"},a.createElement("div",{className:"d-flex align-items-center"},a.createElement("a",{className:"link-no-decorations ms-2",href:`/users/${t.user.username}?page=1`},a.createElement("small",null,a.createElement("strong",null,t.user.username))),a.createElement("span",{className:"ms-2",style:{fontSize:"0.75rem"}},new Date(t.date_created).toISOString().substring(0,10)," ",new Date(t.date_created).toLocaleTimeString().substring(0,5)),t.edited&&a.createElement("small",{className:"ms-1"},"(edited)"),e.id===t.user.id&&a.createElement("div",{className:"ms-auto dropdown-div d-flex align-items-start"},a.createElement("button",{id:"reply-dropdown-button",className:"btn btn-link link-no-decorations ms-auto",style:{padding:"0"},onClick:e=>(0,s.gR)(`reply-${t.id}-dropdown`,e)},a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-three-dots-vertical",viewBox:"0 0 16 16"},a.createElement("path",{d:"M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"}))),a.createElement("div",{id:`reply-${t.id}-dropdown`,className:"dropdown-menu"},a.createElement("li",null,a.createElement("button",{className:"dropdown-item",onClick:()=>x(t.id)},"Edit")),a.createElement("li",null,a.createElement("a",{className:"dropdown-item",onClick:()=>f(t.id)},"Delete"))))),a.createElement("div",{className:"break-line-text my-1"},a.createElement("span",{id:`reply-${t.id}-text`,className:"",contentEditable:!1},t.text)))),e.id===t.user.id&&a.createElement("div",{className:"d-flex mt-2"},a.createElement("button",{id:`reply-${t.id}-save-button`,className:"btn btn-primary ms-auto me-2 hidden",onClick:()=>async function(e){const t=document.getElementById(`reply-${e}-text`);null!=t&&await E(t.innerHTML,e)&&x(e)}(t.id)},"Save"),a.createElement("button",{id:`reply-${t.id}-cancel-button`,className:"btn btn-outline-secondary hidden",onClick:()=>async function(e){const t=document.getElementById(`reply-${e}-text`);if(null==t)return;const n=await i(e);result&&(t.innerHTML=n,x(e))}(t.id)},"Cancel"))))))))):a.createElement("div",{className:"d-flex justify-content-center"},a.createElement("span",null,"No comments have been posted yet"))))}var i=n(807);function m(){const{user:e,contextLoading:t}=(0,c.Xn)(),{announcement:n,editAnnouncement:o,retrieveAnnouncement:r,deleteAnnouncement:i}=(0,l.useAnnouncementContext)(),[m,d]=(0,a.useState)(!1);function u(){const e=document.getElementById("announcement-title"),t=document.getElementById("announcement-text"),n=document.getElementById("save-edit-announcement"),a=document.getElementById("cancel-edit-announcement");e.contentEditable="false"===e.contentEditable,t.contentEditable="false"===t.contentEditable,t.classList.toggle("input-field"),e.classList.toggle("input-field"),n.classList.toggle("hidden"),a.classList.toggle("hidden")}return t?null:a.createElement("div",null,m&&a.createElement("div",{className:"alert alert-secondary"},"Loading..."),a.createElement("div",{className:"card rounded-15 element-background-color element-border-color",id:"announcement-card"},a.createElement("div",{className:"p-3"},a.createElement("div",{className:"d-flex align-items-center"},a.createElement("h3",{id:"announcement-title",className:"",contentEditable:!1},n.title),a.createElement("span",{className:"ms-2 me-2"},"•"),a.createElement("a",{href:`/users/${n.user.username}?page=1`,className:"link-no-decorations"},n.user.profile_picture_data?a.createElement("img",{className:"rounded-circle",style:{width:"2.75rem",height:"2.75rem"},src:`data: image/${n.user.profile_picture_format}; base64, ${n.user.profile_picture_data}`,alt:""}):a.createElement("div",null,"Error"),a.createElement("span",{className:"ms-2"},a.createElement("strong",null,n.user.username))),e.is_admin&&a.createElement("div",{className:"ms-auto dropdown-div"},a.createElement("button",{id:"announcement-dropdown-button",className:"btn btn-link link-no-decorations ms-auto",onClick:e=>(0,s.gR)("dropdown-announcement",e)},a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-three-dots-vertical",viewBox:"0 0 16 16"},a.createElement("path",{d:"M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"}))),a.createElement("div",{id:"dropdown-announcement",className:"dropdown-menu"},a.createElement("li",null,a.createElement("button",{className:"dropdown-item",onClick:u},"Edit")),a.createElement("li",null,a.createElement("a",{className:"dropdown-item",onClick:function(){d(!0),i(n.id),d(!1)}},"Delete"))))),a.createElement("hr",null),a.createElement("div",{className:"break-line-text"},a.createElement("div",{id:"announcement-text",className:"",contentEditable:!1},n.text)),a.createElement("div",{className:"d-flex mt-1"},a.createElement("button",{id:"save-edit-announcement",className:"ms-auto btn btn-primary me-1 hidden",onClick:function(){d(!0);const e=document.getElementById("announcement-title").innerHTML,t=document.getElementById("announcement-text").innerHTML;o(e,t,n.id),d(!1)}},"Save"),a.createElement("button",{id:"cancel-edit-announcement",className:"btn btn-secondary hidden",onClick:function(){u(),r();const e=document.getElementById("announcement-title"),t=document.getElementById("announcement-text");e.innerHTML=n.title,t.innerHTML=n.text}},"Cancel")))))}function d(){const{announcement:e,announcementLoading:t,retrieveAnnouncement:n}=(0,l.useAnnouncementContext)();return(0,a.useEffect)((()=>{n()}),[]),t?null:e?a.createElement("div",{id:"announcement-view",className:"my-3"},a.createElement(m,null),a.createElement(r,null)):a.createElement(i.default,null)}},98:(e,t,n)=>{n.r(t),n.d(t,{default:()=>i,useAnnouncementContext:()=>m});var a=n(540),l=n(946),o=n(974),c=n(767),s=n(606);const r=(0,a.createContext)();function i(){const{setErrorMessage:e,setSuccessMessage:t,setModalErrorMessage:n,resetApplicationMessages:i}=(0,l.Xn)(),{announcementId:m}=(0,c.g)(),[d,u]=(0,a.useState)({}),[g,E]=(0,a.useState)({}),[p,h]=(0,a.useState)(!0),[f,y]=(0,a.useState)(!1);function b(){y(!1)}async function v(){if(h(!0),null===m)return void u(!1);const t=await(0,o.c$)(m);return 404==t.status?(u(!1),void h(!1)):t.error||200!=t.status?(console.log(t.error),e("There was an error loading the announcement"),void h(!1)):(u(t.announcement),E(t.comments),void h(!1))}return a.createElement(r.Provider,{value:{announcement:d,comments:g,retrieveAnnouncement:v,editAnnouncement:async function(n,a,l){const o=await(0,s.Q8)(n,a,l);if(o.error)return console.log(o.error),void e("There was an error saving the changes");400!==o.status?200!==o.status?e("There was an error saving the changes"):t("Announcement changes saved"):e("Be sure the title has a limit of 128 characters and the text 2048")},deleteAnnouncement:async function(n){const a=await(0,s.bt)(n);if(a.error||200!=a.status)return console.log(a.error),void e("There was an error deleting the announcement");t("Announcement successfully deleted")},announcementLoading:p,retrieveComment:async function(e){b();const t=await(0,o.dG)(e);return t.error||200!=t.status?(y("There was an error retrieving the comment"),console.log(t.error),!1):t.comment.text},commentsErrorMessage:f,setCommentsErrorMessage:y,resetAnnouncementsMessages:b,editComment:async function(e,t){b();const n=await(0,s.d1)(e,t);return console.log(n),n.error?(y("There was an error editing the comment"),console.log(n.error),!1):200==n.status||(y("Comments have a max character count of 2048 characters"),!1)},deleteComment:async function(e){b();const t=await(0,s.US)(e);if(t.error||200!=t.status)return y("There was an error deleting the comment"),void console.log(t.error);v()},createCommentReply:async function(e,t){b();const n=await(0,s.pg)(e,t,d.id);return n.error||200!=n.status?(y("Error submiting the comment"),console.log(n.error),!1):(v(),!0)},createComment:async function(e){i();const t=await(0,s.rw)(e,d.id);return t.error?(y("There was an error posting the comment"),console.log(t.error),!1):200!=t.status?(y("Comment is invalid"),!1):(v(),!0)}}},a.createElement(c.sv,null))}function m(){return(0,a.useContext)(r)}},926:(e,t,n)=>{function a(e,t,n){let a,l={pageNumbers:[],nextPage:"",previousPage:""},o=Math.ceil(e/t),c=0;if(e%t==0&&o++,a=o,e<=t)return null;for(l.previousPage=n>1?"page-item":"page-item disabled",l.nextPage=n<o?"page-item":"page-item disabled",n>5&&(o>n+5?(c=n-5,a=n+5):(c=10-(o-n),a=c+10));c<a;c++)l.pageNumbers.push(c+1);return l}function l(e,t){for(var n=e.split(","),a=n[0].match(/:(.*?);/)[1],l=atob(n[n.length-1]),o=l.length,c=new Uint8Array(o);o--;)c[o]=l.charCodeAt(o);return t=`${t}.${a.split("/")[1]}`,new File([c],t,{type:a})}function o(){return{width:window.innerWidth,height:window.innerHeight}}function c(){const e=document.getElementsByClassName("custom-modal"),t=document.getElementById("background-blur"),n=document.querySelectorAll('[data-category="input-field"]');Array.prototype.forEach.call(e,(e=>{e.classList.contains("hidden")||e.classList.toggle("hidden")})),Array.prototype.forEach.call(n,(e=>{"INPUT"===e.tagName?(e.value=null,e.checked=!1):e.innerHTML=""})),t.classList.contains("hidden")||t.classList.toggle("hidden")}function s(e,t,n,a){const l=document.getElementById(e),o=document.getElementById("background-blur");t.stopPropagation(),l.classList.contains("hidden")?void 0!==n&&!0!==n||void 0!==a&&!0!==a||(r(),c(),l.classList.toggle("hidden"),o.classList.toggle("hidden")):c()}function r(){const e=document.getElementsByClassName("dropdown-menu"),t=document.getElementsByClassName("menu-dropdown-content");Array.prototype.forEach.call(e,(e=>{e.classList.contains("show")&&e.classList.toggle("show")})),Array.prototype.forEach.call(t,(e=>{e.classList.contains("show")&&e.classList.toggle("show")}))}function i(e,t,n){t.stopPropagation();const a=document.getElementById(e);a.classList.contains("show")?r():(r(),null==e||null!=n&&1!=n||a.classList.toggle("show"))}function m(e,t){e.stopPropagation(),"Enter"==e.key&&(e.preventDefault(),t())}function d(e){const t=document.getElementById(e);t&&t.focus()}n.d(t,{Gd:()=>d,Tc:()=>r,X$:()=>a,Xz:()=>l,YK:()=>s,ac:()=>m,gR:()=>i,qT:()=>o,tI:()=>c})}}]);