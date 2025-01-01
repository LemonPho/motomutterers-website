"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[99],{99:(e,t,a)=>{a.r(t),a.d(t,{default:()=>g});var n=a(540),r=a(926),l=a(398),s=a(946);function o(){const[e,t]=(0,n.useState)(null),[a,o]=(0,n.useState)(!1),[c,i]=(0,n.useState)(),[m,d]=(0,n.useState)(null),{user:u,contextLoading:p,modalErrorMessage:g,setModalErrorMessage:E,setSuccessMessage:h,retrieveUserData:v,resetApplicationMessages:f}=(0,s.Xn)();return(0,n.useEffect)((()=>{if(!a)return void i(void 0);const e=new FileReader;e.onload=()=>{const t=new Image;t.onload=()=>{const e=document.createElement("canvas"),n=e.getContext("2d");let r,l,s,o;t.width>t.height?(r=t.height,l=t.height,s=(t.width-t.height)/2,o=0):(r=t.width,l=t.width,o=(t.height-t.width)/2,s=0),e.width=r,e.height=l,n.drawImage(t,s,o,r,l,0,0,r,l);const c=e.toDataURL(a.type);i(c)},t.src=e.result},e.readAsDataURL(a)}),[a]),p?null:n.createElement("div",null,n.createElement("div",{className:"p-3 d-flex justify-content-center"},n.createElement("div",null,n.createElement("div",null,n.createElement("strong",{style:{fontSize:"20px"}},"Profile photo")),n.createElement("div",null,""!=u.profile_picture_data&&n.createElement("img",{id:"profile-picture-div",style:{width:"7rem",height:"7rem"},className:"rounded-circle",src:`data: image/${u.profile_picture_format}; base64, ${u.profile_picture_data}`,alt:u.username}))),n.createElement("button",{id:"profile-picture-button",className:"btn btn-outline-secondary rounded-15 align-self-center ms-auto",onClick:e=>{f(),(0,r.YK)("profile-picture-modal",e)}},"Change"),n.createElement("div",{className:"custom-modal hidden",id:"profile-picture-modal",onClick:e=>{e.stopPropagation()}},n.createElement("div",{className:"custom-modal-header"},n.createElement("h5",null,"Change profile picture"),n.createElement("button",{type:"button",className:"btn btn-link link-no-decorations ms-auto",id:"close-modal"},n.createElement("span",{onClick:e=>{f(),(0,r.tI)(),i(void 0)},id:"close-modal","aria-hidden":"true"},"×"))),n.createElement("div",{className:"custom-modal-body"},n.createElement("div",{style:{position:"relative"}},g&&n.createElement("div",{className:"alert alert-danger"},n.createElement("small",null,g)),m&&n.createElement("div",{className:"alert alert-secondary"},"Loading..."),n.createElement("div",{className:"d-flex justify-content-center"},n.createElement("div",{style:{position:"relative"}},n.createElement("label",null,!1===a&&n.createElement("img",{className:"rounded-circle",id:"edit-profile-photo",style:{width:"14rem",height:"14rem"},src:`data: image/${u.profile_picture_format}; base64, ${u.profile_picture_data}`}),a&&n.createElement("img",{className:"rounded-circle",id:"edit-profile-photo",style:{width:"14rem",height:"14rem"},src:c}),n.createElement("input",{type:"file",accept:"image/*",onChange:function(e){e.target.files&&0!==e.target.files.length?o(e.target.files[0]):o(!1)}}),n.createElement("div",{className:"d-flex justify-content-center align-content-center"},n.createElement("div",{className:"edit-image-overlay rounded-circle",style:{backgroundColor:"rgba(0, 0, 0, 0.8)"}},n.createElement("div",{className:"w-100 h-100 d-flex justify-content-center align-items-center"},n.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",style:{width:"10rem",height:"10rem"},width:"16",height:"16",fill:"white",className:"bi bi-images",viewBox:"0 0 16 16"},n.createElement("path",{d:"M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"}),n.createElement("path",{d:"M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z"})))))))))),n.createElement("div",{className:"custom-modal-footer justify-content-center"},n.createElement("button",{id:"submit-data",className:"btn btn-primary",onClick:e=>{e.stopPropagation(),f(),async function(){d(!0);const e=(0,r.Xz)(c,"new-profile-picture"),t=e.type.match(/\/([a-zA-Z]+)/)[1],a=new FormData;a.append("profile_picture",e);const n=await(0,l.sZ)(a,t);n.error?(E("There was an error while submiting the new profile picture"),console.log(n.error),d(!1)):400===n.status?(E("File format or another factor is invalid for a picture, be sure to use any common picture extensions"),d(!1)):200===n.status?(h("Profile picture changed"),(0,r.tI)(),d(!1),v(),o(!1)):(E("There was an error when submiting the new profile picutre"),d(!1))}()}},"Save changes")))))}function c(){const[e,t]=(0,n.useState)(!1),[a,o]=(0,n.useState)(null),[c,i]=(0,n.useState)(null),[m,d]=(0,n.useState)(null),[u,p]=(0,n.useState)(null),[g,E]=(0,n.useState)(!1),{user:h,contextLoading:v,modalErrorMessage:f,setErrorMessage:w,setModalErrorMessage:b,setSuccessMessage:y,resetApplicationMessages:N,retrieveUserData:C}=(0,s.Xn)(),[k,S]=(0,n.useState)(null);async function x(){E(!0);const e=document.getElementById("username-input").value,t=document.getElementById("password-username-input").value,a=await(0,l.Lv)(t,e);if(a.error)return b("There was an error while submiting the new username"),void E(!1);if(400===a.status){let e=a.newUsernameValid?"":"Username is not valid, make sure to only use numbers and letters\n";return e+=a.newUsernameUnique?"":"Username is already in use\n",e+=a.userCanChangeUsername?"":"You must wait 30 days in between switching usernames\n",e+=a.currentPasswordCorrect?"":"Password is incorrect\n",E(!1),void b(e)}if(200===a.status)return y("The new username has been saved"),E(!1),(0,r.tI)(),void C();b("There has been an error while submiting the new username"),E(!1)}return v?null:n.createElement("div",null,n.createElement("div",{className:"p-3 d-flex justify-content-center"},n.createElement("div",null,n.createElement("strong",{style:{fontSize:"20px"}},"Username"),n.createElement("div",null,h.username)),n.createElement("button",{id:"username-button",className:"btn btn-outline-secondary rounded-15 align-self-center ms-auto",onClick:e=>(0,r.YK)("username-modal",e)},"Change"),n.createElement("div",{className:"custom-modal hidden",id:"username-modal",onClick:e=>{e.stopPropagation()}},n.createElement("div",{className:"custom-modal-header"},n.createElement("h5",null,"Change username"),n.createElement("button",{type:"button",className:"btn btn-link link-no-decorations ms-auto",id:"close-modal",onClick:e=>{(0,r.tI)(),N()}},n.createElement("span",{id:"close-modal","aria-hidden":"true"},"×"))),n.createElement("div",{className:"custom-modal-body"},f&&n.createElement("div",{className:"alert alert-danger",style:{whiteSpace:"pre-line"}},n.createElement("small",null,f)),!0===g&&n.createElement("div",{className:"alert alert-secondary"},n.createElement("div",{className:"d-flex justify-content-center align-items-center"},"Loading...")),n.createElement("input",{type:"password",placeholder:"Current password",className:"form-control",id:"password-username-input",onKeyUp:e=>(0,r.ac)(e,x)}),n.createElement("input",{type:"text",placeholder:"New username",className:"form-control mt-2",id:"username-input",onKeyUp:e=>(0,r.ac)(e,x)})),n.createElement("div",{className:"custom-modal-footer"},n.createElement("button",{id:"submit-data",className:"btn btn-primary mr-auto",onClick:e=>{e.stopPropagation(),N(),x()}},"Save changes")))))}function i(){const[e,t]=(0,n.useState)(null),{user:a,contextLoading:o,setModalErrorMessage:c,modalErrorMessage:i,setSuccessMessage:m,retrieveUserData:d,resetApplicationMessages:u}=(0,s.Xn)();async function p(){u(),t(!0);const e=document.getElementById("email-input").value,a=document.getElementById("password-email-input").value,n=await(0,l.Xc)(a,e);if(n.error)return c("There was an error while submiting the new email"),void t(!1);if(d(),200===n.status)return m("Email changed, check your inbox for the verification link"),(0,r.tI)(),void t(!1);let s=n.newEmailUnique?"":"Email is not unique\n";s+=n.newEmailValid?"":"Email is not valid\n",s+=n.currentPasswordCorrect?"":"Password is not correct\n",c(s),t(!1)}return o?null:n.createElement("div",null,n.createElement("div",{className:"p-3 d-flex justify-content-center"},n.createElement("div",null,n.createElement("strong",{style:{fontSize:"20px"}},"Email"),n.createElement("div",null,a.email)),n.createElement("button",{id:"email-button",className:"btn btn-outline-secondary rounded-15 align-self-center ms-auto",onClick:e=>{(0,r.YK)("email-modal",e)}},"Change"),n.createElement("div",{className:"custom-modal hidden",id:"email-modal",onClick:e=>{e.stopPropagation()}},n.createElement("div",{className:"custom-modal-header"},n.createElement("h5",null,"Change email"),n.createElement("button",{type:"button",className:"btn btn-link link-no-decorations ms-auto",id:"close-modal",onClick:()=>{(0,r.tI)()}},n.createElement("span",{"aria-hidden":"true"},"×"))),n.createElement("div",{className:"custom-modal-body"},i&&n.createElement("div",{className:"alert alert-danger",style:{whiteSpace:"pre-line"}},i),!0===e&&n.createElement("div",{className:"alert alert-secondary"},n.createElement("div",{className:"d-flex justify-content-center align-items-center"},"Loading...")),n.createElement("input",{type:"password",placeholder:"Current password",className:"form-control",id:"password-email-input",onKeyUp:e=>(0,r.ac)(e,p)}),n.createElement("input",{type:"text",placeholder:"New email",className:"form-control mt-2",id:"email-input",onKeyUp:e=>(0,r.ac)(e,p)})),n.createElement("div",{className:"custom-modal-footer"},n.createElement("button",{id:"submit-data",className:"btn btn-primary mr-auto",onClick:e=>{e.stopPropagation(),p()}},"Save changes")))))}var m=a(974);function d(){const[e,t]=(0,n.useState)(null),{setLogout:a,retrieveUserData:o,contextLoading:c,modalErrorMessage:i,setModalErrorMessage:d,setSuccessMessage:u,resetApplicationMessages:p}=(0,s.Xn)();async function g(){t(!0);const e=document.getElementById("password-input").value,n=document.getElementById("password-password-input").value,s=await(0,m.gf)();let o;if(s.error)return d("There was an error while submiting the new password"),console.log(error),void t(!1);o=s.token;const c=await(0,l.sD)(o,n,e);if(c.error)return d("There was an error submiting the new password"),void t(!1);if(400===c.status){let e=c.newPasswordValid?"":"The password must be at least 8 characters and not easy to guess\n";return e+=c.currentPasswordCorrect?"":"The current password is not correct\n",d(e),void t(!1)}if(200===c.status)return t(!1),u("The new password has been saved, log into your account again"),(0,r.tI)(),void a();d("There was an error submiting the new password"),t(!1)}return c?null:n.createElement("div",null,n.createElement("div",{className:"p-3 d-flex justify-content-center"},n.createElement("div",null,n.createElement("strong",{style:{fontSize:"20px"}},"Password"),n.createElement("div",null,"••••••••••")),n.createElement("button",{id:"password-button",className:"btn btn-outline-secondary rounded-15 align-self-center ms-auto",onClick:e=>{p(),(0,r.YK)("password-modal",e)}},"Change"),n.createElement("div",{className:"custom-modal hidden",id:"password-modal",onClick:e=>{e.stopPropagation()}},n.createElement("div",{className:"custom-modal-header"},n.createElement("h5",null,"Change password"),n.createElement("button",{type:"button",className:"ms-auto btn btn-link link-no-decorations",id:"close-modal",onClick:()=>{(0,r.tI)(),p()}},n.createElement("span",{"aria-hidden":"true"},"×"))),n.createElement("div",{className:"custom-modal-body"},i&&n.createElement("div",{className:"alert alert-danger",style:{whiteSpace:"pre-line"}},n.createElement("small",null,i)),!0===e&&n.createElement("div",{className:"alert alert-secondary"},n.createElement("div",{className:"d-flex justify-content-center align-items-center"},"Loading...")),n.createElement("input",{type:"password",placeholder:"Current password",className:"form-control",id:"password-password-input",onKeyUp:e=>(0,r.ac)(e,g)}),n.createElement("input",{type:"password",placeholder:"New password",className:"form-control mt-2",id:"password-input",onKeyUp:e=>(0,r.ac)(e,g)})),n.createElement("div",{className:"custom-modal-footer"},n.createElement("button",{id:"submit-data",className:"btn btn-primary mr-auto",onClick:e=>{e.stopPropagation(),p(),g()}},"Save changes")))))}var u=a(767);function p(){const{user:e,setErrorMessage:t,setSuccessMessage:a,retrieveUserData:o}=(0,s.Xn)(),[c,i]=(0,n.useState)(""),m=(0,u.Zp)();return n.createElement("div",null,n.createElement("div",{className:"p-3 d-flex align-items-center"},n.createElement("strong",{style:{fontSize:"20px"}},"Delete Account"),n.createElement("button",{className:"ms-auto btn btn-outline-danger",onClick:t=>{(0,r.YK)("delete-account-modal",t,e.is_logged_in)}},"Delete Account")),n.createElement("div",{className:"custom-modal hidden",id:"delete-account-modal",onClick:e=>{e.stopPropagation()}},n.createElement("div",{className:"custom-modal-header justify-content-center"},n.createElement("h5",null,"Delete Account")),n.createElement("div",{className:"custom-modal-body"},n.createElement("input",{type:"text",className:"input-field w-100",placeholder:"Write your username here",value:c,onChange:e=>{i(e.target.value)}})),n.createElement("div",{className:"custom-modal-footer justify-content-center",style:{flexDirection:"column"}},n.createElement("button",{className:"btn btn-danger w-100",onClick:async function(){if(c!=e.username)return void t("Username inputted isn't correct");const n=await(0,l.Dl)();404!=n.status?200!=n.status||n.error?t("There was an error deleting your account"):(a("Account deleted"),o(),(0,r.tI)(),m("/")):t("Account not found")}},"Delete Account"),n.createElement("button",{className:"btn btn-light mt-2"},"Cancel"))))}function g(){const{user:e,userLoading:t,setErrorMessage:a}=(0,s.Xn)();return t?null:t||e.is_logged_in?n.createElement("div",null,n.createElement("div",{className:"card rounded-15 element-background-color element-border-color"},n.createElement(o,null),n.createElement("hr",null),n.createElement(c,null),n.createElement("hr",null),n.createElement(i,null),n.createElement("hr",null),n.createElement(d,null),n.createElement("hr",null),n.createElement(p,null),n.createElement("hr",null))):(a("You must be logged in to use this page"),null)}}}]);