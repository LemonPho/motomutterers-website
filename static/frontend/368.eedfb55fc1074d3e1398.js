"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[98,368,807],{807:(e,t,n)=>{n.r(t),n.d(t,{default:()=>r});var a=n(540);class l extends a.Component{constructor(e){super(e)}render(){return a.createElement("p",null,"Error page not found")}}const r=l},368:(e,t,n)=>{n.r(t),n.d(t,{default:()=>d});var a=n(540),l=n(98),r=n(767),c=n(946),o=n(926);function s(){const{user:e,contextLoading:t}=(0,c.Xn)(),{comments:n,retrieveComment:s,announcementLoading:m,commentsErrorMessage:i,setCommentsErrorMessage:d,resetAnnouncementMessages:u,editComment:g,createCommentReply:E,createComment:p,deleteComment:f}=(0,l.useAnnouncementContext)(),[h,y]=(0,a.useState)(null),b=(0,r.zy)();function v(e){null!==e&&document.getElementById(`comment-reply-div-${e}`).classList.toggle("hidden")}function w(e){const t=document.getElementById(`comment-${e}-text`);if(null==t)return;const n=document.getElementById(`comment-${e}-save-button`),a=document.getElementById(`comment-${e}-cancel-button`);t.contentEditable="false"===t.contentEditable,t.classList.toggle("input-field"),n.classList.toggle("hidden"),a.classList.toggle("hidden")}function N(e){const t=document.getElementById(`reply-${e}-text`);if(null==t)return;const n=document.getElementById(`reply-${e}-save-button`),a=document.getElementById(`reply-${e}-cancel-button`);t.contentEditable="false"===t.contentEditable,t.classList.toggle("input-field"),n.classList.toggle("hidden"),a.classList.toggle("hidden")}return(0,a.useEffect)((()=>{!function(){if(null===h)return;const e=document.getElementById(`comment-replies-${h}`);e.classList.contains("hidden")&&e.classList.toggle("hidden"),y(null)}()}),[h]),(0,a.useEffect)((()=>{m||function(){let e=new URLSearchParams(b.search);const t=e.get("comment"),n=e.get("response");if(null!=t&&null!==n){const e=document.getElementById(`comment-replies-${t}`),a=document.getElementById(`reply-${n}`);if(null==e||null==a)return;return e.classList.toggle("hidden"),a.scrollIntoView({behavior:"smooth"}),void a.classList.add("div-highlight")}if(null!==t){const e=document.getElementById(`comment-${t}`);if(null==e)return;e.scrollIntoView({behavior:"smooth",block:"start"}),e.classList.toggle("div-highlight")}}()}),[m]),m||t?null:a.createElement("div",{className:"card rounded-15 mt-2 element-background-color element-border-color",id:"comments-card"},a.createElement("div",{className:"card-header"},a.createElement("h5",null,"Comments")),a.createElement("div",{className:"card-body",id:"comments-view"},!0===e.is_logged_in?a.createElement("div",{className:"flex-box align-items-center"},e.profile_picture_data?a.createElement("img",{className:"rounded-circle",style:{width:"3rem",height:"3rem"},src:`data: image/${e.profile_picture_format}; base64, ${e.profile_picture_data}`,alt:""}):a.createElement("div",null,"Error"),a.createElement("textarea",{id:"comment-text",className:"input-field textarea-expand ms-2 w-100",rows:1,placeholder:"Write a comment...",onChange:e=>{(0,o.QL)(e.target)}}),a.createElement("button",{className:"btn btn-outline-secondary ms-2",onClick:async function(){const e=document.getElementById("comment-text").innerHTML;p(e)&&(document.getElementById("comment-text").innerHTML="")}},a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-send",viewBox:"0 0 16 16"},a.createElement("path",{d:"M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"})))):a.createElement("div",{className:"d-flex justify-content-center"},a.createElement("span",null,"Login in to write a comment")),a.createElement("hr",null),i&&a.createElement("div",{className:"alert alert-danger m-2"},i),n?n.map((t=>null===t.parent_comment&&a.createElement("div",{id:`comment-${t.id}`,key:`comment-${t.id}`},a.createElement("div",{className:"d-flex align-items-start"},a.createElement("img",{className:"rounded-circle",style:{width:"2.5rem",height:"2.5rem"},src:`data: image/${t.user.profile_picture_format}; base64, ${t.user.profile_picture_data}`,alt:""}),a.createElement("div",{className:"dynamic-container ms-2",style:{maxWidth:"calc(100% - 48px)"}},a.createElement("div",{className:"d-flex align-items-center"},a.createElement("a",{className:"link-no-decorations",href:`/users/${t.user.username}?page=1`},a.createElement("strong",null,t.user.username)),a.createElement("span",{className:"flex-item ms-2",style:{fontSize:"0.75rem"}},new Date(t.date_created).toISOString().substring(0,10)," ",new Date(t.date_created).toLocaleTimeString().substring(0,5)),t.edited&&a.createElement("small",{className:"ms-1"},"(edited)"),(e.id===t.user.id||1==e.is_admin)&&a.createElement("div",{className:"ms-auto dropdown-div d-flex align-items-start"},a.createElement("button",{id:"announcement-dropdown-button",className:"btn btn-link link-no-decorations ms-auto",style:{padding:"0"},onClick:e=>(0,o.gR)(`comment-${t.id}-dropdown`,e)},a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-three-dots-vertical",viewBox:"0 0 16 16"},a.createElement("path",{d:"M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"}))),a.createElement("div",{id:`comment-${t.id}-dropdown`,className:"dropdown-menu"},a.createElement("li",null,a.createElement("button",{className:"dropdown-item",onClick:()=>w(t.id)},"Edit")),a.createElement("li",null,a.createElement("a",{className:"dropdown-item",onClick:()=>f(t.id)},"Delete"))))),a.createElement("div",{className:"break-line-text"},a.createElement("span",{id:`comment-${t.id}-text`,style:{overflow:"visible"},className:"",contentEditable:!1},t.text)),e.id===t.user.id&&a.createElement("div",{className:"d-flex"},a.createElement("button",{id:`comment-${t.id}-save-button`,className:"btn btn-primary ms-auto me-2 mt-2 hidden",onClick:()=>async function(e){const t=document.getElementById(`comment-${e}-text`);null!=t&&await g(t.innerHTML,e)&&w(e)}(t.id)},"Save"),a.createElement("button",{id:`comment-${t.id}-cancel-button`,className:"btn btn-outline-secondary mt-2 hidden",onClick:()=>async function(e){const t=document.getElementById(`comment-${e}-text`);if(null==t)return;const n=await s(e);n&&(t.innerHTML=n,w(e))}(t.id)},"Cancel")),a.createElement("div",{className:"d-flex mb-3"},parseInt(t.amount_replies)>0&&a.createElement("button",{className:"btn btn-link link-no-decorations p-0 pe-1",style:{color:"blue"},onClick:()=>{var e;null!==(e=t.id)&&document.getElementById(`comment-replies-${e}`).classList.toggle("hidden")}},a.createElement("small",null,"Show ",t.amount_replies," replies")),!0===e.is_logged_in?a.createElement("button",{className:"btn btn-link link-no-decorations p-0",onClick:()=>v(t.id)},a.createElement("small",null,"Reply")):a.createElement("div",{className:"my-2"})))),a.createElement("div",{id:`comment-reply-div-${t.id}`,className:"hidden",style:{marginBottom:"0.5rem",marginLeft:"3.4rem"}},a.createElement("div",{className:"d-flex justify-content-center"},a.createElement("div",{id:`comment-reply-text-${t.id}`,role:"textbox",contentEditable:!0,className:"input-field w-100","data-placeholder":"Add a reply...",onClick:()=>(0,o.Gd)(`comment-reply-text-${t.id}`)}),a.createElement("button",{id:`comment-reply-button-${t.id}`,className:"btn btn-outline-secondary p-1 ms-2",onClick:()=>{!async function(e){const t=document.getElementById(`comment-reply-text-${e}`).innerHTML;v(e),E(t,e)&&(y(e),document.getElementById(`comment-reply-text-${e}`).innerHTML="")}(t.id)}},a.createElement("small",null,"Reply")))),a.createElement("div",{id:`comment-replies-${t.id}`,className:"dynamic-container hidden mb-3",style:{marginLeft:"2.7rem"}},t.replies.length>0&&t.replies.map((t=>a.createElement("div",{id:`reply-${t.id}`,key:`reply-${t.id}`,className:"dynamic-container mb-2",style:{marginLeft:"0px",maxWidth:"calc(100% - 2.7rem)"}},a.createElement("div",{className:"d-flex align-items-start"},a.createElement("img",{className:"rounded-circle",style:{width:"1.5rem",height:"1.5rem",marginTop:"6px"},src:`data: image/${t.user.profile_picture_format}; base64, ${t.user.profile_picture_data}`,alt:""}),a.createElement("div",{className:"dynamic-container"},a.createElement("div",{className:"d-flex align-items-center"},a.createElement("a",{className:"link-no-decorations ms-2",href:`/users/${t.user.username}?page=1`},a.createElement("small",null,a.createElement("strong",null,t.user.username))),a.createElement("span",{className:"ms-2",style:{fontSize:"0.75rem"}},new Date(t.date_created).toISOString().substring(0,10)," ",new Date(t.date_created).toLocaleTimeString().substring(0,5)),t.edited&&a.createElement("small",{className:"ms-1"},"(edited)"),e.id===t.user.id&&a.createElement("div",{className:"ms-auto dropdown-div d-flex align-items-start"},a.createElement("button",{id:"reply-dropdown-button",className:"btn btn-link link-no-decorations ms-auto",style:{padding:"0"},onClick:e=>(0,o.gR)(`reply-${t.id}-dropdown`,e)},a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-three-dots-vertical",viewBox:"0 0 16 16"},a.createElement("path",{d:"M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"}))),a.createElement("div",{id:`reply-${t.id}-dropdown`,className:"dropdown-menu"},a.createElement("li",null,a.createElement("button",{className:"dropdown-item",onClick:()=>N(t.id)},"Edit")),a.createElement("li",null,a.createElement("a",{className:"dropdown-item",onClick:()=>f(t.id)},"Delete"))))),a.createElement("div",{className:"break-line-text my-1"},a.createElement("span",{id:`reply-${t.id}-text`,className:"",contentEditable:!1},t.text)))),e.id===t.user.id&&a.createElement("div",{className:"d-flex mt-2"},a.createElement("button",{id:`reply-${t.id}-save-button`,className:"btn btn-primary ms-auto me-2 hidden",onClick:()=>async function(e){const t=document.getElementById(`reply-${e}-text`);null!=t&&await g(t.innerHTML,e)&&N(e)}(t.id)},"Save"),a.createElement("button",{id:`reply-${t.id}-cancel-button`,className:"btn btn-outline-secondary hidden",onClick:()=>async function(e){const t=document.getElementById(`reply-${e}-text`);if(null==t)return;const n=await s(e);result&&(t.innerHTML=n,N(e))}(t.id)},"Cancel"))))))))):a.createElement("div",{className:"d-flex justify-content-center"},a.createElement("span",null,"No comments have been posted yet"))))}var m=n(807);function i(){const{user:e,contextLoading:t}=(0,c.Xn)(),{announcement:n,editAnnouncement:r,retrieveAnnouncement:s,deleteAnnouncement:m}=(0,l.useAnnouncementContext)(),[i,d]=(0,a.useState)(!1);function u(){const e=document.getElementById("announcement-title"),t=document.getElementById("announcement-text"),n=document.getElementById("save-edit-announcement"),a=document.getElementById("cancel-edit-announcement");e.contentEditable="false"===e.contentEditable,t.contentEditable="false"===t.contentEditable,t.classList.toggle("input-field"),e.classList.toggle("input-field"),n.classList.toggle("hidden"),a.classList.toggle("hidden")}return t?null:a.createElement("div",null,i&&a.createElement("div",{className:"alert alert-secondary"},"Loading..."),a.createElement("div",{className:"card rounded-15 element-background-color element-border-color",id:"announcement-card"},a.createElement("div",{className:"card-header d-flex align-items-center p-3"},a.createElement("h3",{id:"announcement-title",className:"",contentEditable:!1},n.title),a.createElement("span",{className:"ms-2 me-2"},"•"),a.createElement("a",{href:`/users/${n.user.username}?page=1`,className:"link-no-decorations"},n.user.profile_picture_data?a.createElement("img",{className:"rounded-circle",style:{width:"2.75rem",height:"2.75rem"},src:`data: image/${n.user.profile_picture_format}; base64, ${n.user.profile_picture_data}`,alt:""}):a.createElement("div",null,"Error"),a.createElement("span",{className:"ms-2"},a.createElement("strong",null,n.user.username))),e.is_admin&&a.createElement("div",{className:"ms-auto dropdown-div"},a.createElement("button",{id:"announcement-dropdown-button",className:"btn btn-link link-no-decorations ms-auto",onClick:e=>(0,o.gR)("dropdown-announcement",e)},a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-three-dots-vertical",viewBox:"0 0 16 16"},a.createElement("path",{d:"M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"}))),a.createElement("div",{id:"dropdown-announcement",className:"dropdown-menu"},a.createElement("li",null,a.createElement("button",{className:"dropdown-item",onClick:u},"Edit")),a.createElement("li",null,a.createElement("a",{className:"dropdown-item",onClick:function(){d(!0),m(n.id),d(!1)}},"Delete"))))),a.createElement("div",{className:"break-line-text card-body"},a.createElement("div",{id:"announcement-text",className:"",contentEditable:!1},n.text)),a.createElement("div",{className:"d-flex mt-1"},a.createElement("button",{id:"save-edit-announcement",className:"btn btn-primary hidden m-2 rounded-15",onClick:function(){d(!0);const e=document.getElementById("announcement-title").innerHTML,t=document.getElementById("announcement-text").innerHTML;r(e,t,n.id),d(!1)}},"Save"),a.createElement("button",{id:"cancel-edit-announcement",className:"me-auto btn btn-secondary hidden m-2 rounded-15",onClick:function(){u(),s();const e=document.getElementById("announcement-title"),t=document.getElementById("announcement-text");e.innerHTML=n.title,t.innerHTML=n.text}},"Cancel"))))}function d(){const{announcement:e,announcementLoading:t,retrieveAnnouncement:n}=(0,l.useAnnouncementContext)();return(0,a.useEffect)((()=>{n()}),[]),t?null:e?a.createElement("div",{id:"announcement-view",className:"my-3"},a.createElement(i,null),a.createElement(s,null)):a.createElement(m.default,null)}},98:(e,t,n)=>{n.r(t),n.d(t,{default:()=>m,useAnnouncementContext:()=>i});var a=n(540),l=n(946),r=n(974),c=n(767),o=n(398);const s=(0,a.createContext)();function m(){const{setErrorMessage:e,setSuccessMessage:t,setModalErrorMessage:n,resetApplicationMessages:m}=(0,l.Xn)(),{announcementId:i}=(0,c.g)(),[d,u]=(0,a.useState)({}),[g,E]=(0,a.useState)({}),[p,f]=(0,a.useState)(!0),[h,y]=(0,a.useState)(!1);function b(){y(!1)}async function v(){if(f(!0),null===i)return void u(!1);const t=await(0,r.c$)(i);return 404==t.status?(u(!1),void f(!1)):t.error||200!=t.status?(console.log(t.error),e("There was an error loading the announcement"),void f(!1)):(u(t.announcement),E(t.comments),void f(!1))}return a.createElement(s.Provider,{value:{announcement:d,comments:g,retrieveAnnouncement:v,editAnnouncement:async function(n,a,l){const r=await(0,o.Q8)(n,a,l);if(r.error)return console.log(r.error),void e("There was an error saving the changes");400!==r.status?200!==r.status?e("There was an error saving the changes"):t("Announcement changes saved"):e("Be sure the title has a limit of 128 characters and the text 2048")},deleteAnnouncement:async function(n){const a=await(0,o.bt)(n);if(a.error||200!=a.status)return console.log(a.error),void e("There was an error deleting the announcement");t("Announcement successfully deleted")},announcementLoading:p,retrieveComment:async function(e){b();const t=await(0,r.dG)(e);return t.error||200!=t.status?(y("There was an error retrieving the comment"),console.log(t.error),!1):t.comment.text},commentsErrorMessage:h,setCommentsErrorMessage:y,resetAnnouncementsMessages:b,editComment:async function(e,t){b();const n=await(0,o.d1)(e,t);return n.error?(y("There was an error editing the comment"),console.log(n.error),!1):200==n.status||(y("Comments have a max character count of 2048 characters"),!1)},deleteComment:async function(e){b();const t=await(0,o.US)(e);if(t.error||200!=t.status)return y("There was an error deleting the comment"),void console.log(t.error);v()},createCommentReply:async function(e,t){b();const n=await(0,o.pg)(e,t,d.id);return n.error||200!=n.status?(y("Error submiting the comment"),console.log(n.error),!1):(v(),!0)},createComment:async function(e){m();const t=await(0,o.rw)(e,d.id);return t.error?(y("There was an error posting the comment"),console.log(t.error),!1):200!=t.status?(y("Comment is invalid"),!1):(v(),!0)}}},a.createElement(c.sv,null))}function i(){return(0,a.useContext)(s)}}}]);