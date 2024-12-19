"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[125],{125:(e,t,a)=>{a.r(t),a.d(t,{default:()=>c});var n=a(540),s=a(767),o=a(606),l=a(946),r=a(926);function c(){const{loggedIn:e,contextLoading:t,setErrorMessage:a,setSuccessMessage:c,setLoadingMessage:i,resetApplicationMessages:m}=(0,l.Xn)(),[d,u]=(0,n.useState)(!1);async function p(){if(d)return;m(),u(!0),i("Loading...");const e=document.getElementById("username").value,t=document.getElementById("email").value,n=document.getElementById("password").value,s=document.getElementById("password-confirm").value,l=await(0,o.qm)(e,t,n,s);if(l.error)return a("An error ocurred while submiting the account"),u(!1),void i(!1);if(400===l.status){let e=l.usernameUnique?"":"Username is already taken\n";return e+=l.usernameValid?"":"Username isn't valid, be sure to use only numbers and letters\n",e+=l.emailUnique?"":"Email is already in use\n",e+=l.emailValid?"":"Email isn't valid\n",e+=l.passwordsMatch?"":"Passwords don't match\n",e+=l.passwordValid?"":"Passwords need at least 8 characters and can't be 'simple'\n",a(e),u(!1),void i(!1)}if(200===l.status)return c("Account created, check your email to finalize the creation"),u(!1),void i(!1);a("There was an error while submiting the account information"),u(!1),i(!1)}return t?null:e?n.createElement("div",null,n.createElement(s.C5,{replace:!0,to:"/"})):n.createElement("div",null,n.createElement("div",{className:"card shadow mx-auto my-5 rounded-15 element-background-color element-border-color",style:{width:"21rem"}},n.createElement("div",{className:"my-3",style:{display:"flex"}},n.createElement("h6",{style:{margin:"auto",fontSize:"40px"}},"Sign up")),n.createElement("hr",{className:"mt-2"}),n.createElement("div",{className:"input-group mt-3 px-3 mx-auto"}),n.createElement("div",{className:"input-group px-3  mx-auto"},n.createElement("input",{type:"text",className:"form-control",placeholder:"Username",id:"username",onKeyUp:e=>(0,r.ac)(e,p)})),n.createElement("div",{className:"input-group mt-3 px-3  mx-auto"},n.createElement("input",{type:"text",className:"form-control",placeholder:"Email",id:"email",onKeyUp:e=>(0,r.ac)(e,p)})),n.createElement("div",{className:"input-group mt-3 px-3  mx-auto"},n.createElement("input",{type:"password",className:"form-control",placeholder:"Password",id:"password",onKeyUp:e=>(0,r.ac)(e,p)})),n.createElement("div",{className:"input-group mt-3 px-3 mx-auto"},n.createElement("input",{type:"password",className:"form-control",placeholder:"Confirm password",id:"password-confirm",onKeyUp:e=>(0,r.ac)(e,p)})),d&&n.createElement("div",{className:"input-group mt-3 px-3 mx-auto"},n.createElement("button",{className:"btn btn-primary w-100",disabled:!0},"Loading...")),!d&&n.createElement("div",{className:"input-group mt-3 px-3 mx-auto"},n.createElement("button",{className:"btn btn-primary w-100",onClick:p},"Sign up")),n.createElement("hr",null),n.createElement("div",{className:"input-group mb-3 px-3 mx-auto"},n.createElement("a",{href:"/login",className:"btn btn-success w-100"},"Login to an account"))))}},926:(e,t,a)=>{function n(e,t,a){let n,s={pageNumbers:[],nextPage:"",previousPage:""},o=Math.ceil(e/t),l=0;if(e%t==0&&o++,n=o,e<=t)return null;for(s.previousPage=a>1?"page-item":"page-item disabled",s.nextPage=a<o?"page-item":"page-item disabled",a>5&&(o>a+5?(l=a-5,n=a+5):(l=10-(o-a),n=l+10));l<n;l++)s.pageNumbers.push(l+1);return s}function s(e,t){for(var a=e.split(","),n=a[0].match(/:(.*?);/)[1],s=atob(a[a.length-1]),o=s.length,l=new Uint8Array(o);o--;)l[o]=s.charCodeAt(o);return t=`${t}.${n.split("/")[1]}`,new File([l],t,{type:n})}function o(){return{width:window.innerWidth,height:window.innerHeight}}function l(){const e=document.getElementsByClassName("custom-modal"),t=document.getElementById("background-blur"),a=document.querySelectorAll('[data-category="input-field"]');Array.prototype.forEach.call(e,(e=>{e.classList.contains("hidden")||e.classList.toggle("hidden")})),Array.prototype.forEach.call(a,(e=>{"INPUT"===e.tagName?(e.value=null,e.checked=!1):e.innerHTML=""})),t.classList.contains("hidden")||t.classList.toggle("hidden")}function r(e,t,a,n){const s=document.getElementById(e),o=document.getElementById("background-blur");t.stopPropagation(),s.classList.contains("hidden")?void 0!==a&&!0!==a||void 0!==n&&!0!==n||(c(),l(),s.classList.toggle("hidden"),o.classList.toggle("hidden")):l()}function c(){const e=document.getElementsByClassName("dropdown-menu"),t=document.getElementsByClassName("menu-dropdown-content");Array.prototype.forEach.call(e,(e=>{e.classList.contains("show")&&e.classList.toggle("show")})),Array.prototype.forEach.call(t,(e=>{e.classList.contains("show")&&e.classList.toggle("show")}))}function i(e,t,a){t.stopPropagation();const n=document.getElementById(e);n.classList.contains("show")?c():(c(),null==e||null!=a&&1!=a||n.classList.toggle("show"))}function m(e,t){e.stopPropagation(),"Enter"==e.key&&(e.preventDefault(),t())}function d(e){const t=document.getElementById(e);t&&t.focus()}a.d(t,{Gd:()=>d,Tc:()=>c,X$:()=>n,Xz:()=>s,YK:()=>r,ac:()=>m,gR:()=>i,qT:()=>o,tI:()=>l})}}]);