"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[928],{928:(e,t,a)=>{a.r(t),a.d(t,{default:()=>r});var n=a(540),c=a(550),s=a(767);const r=function(){const[e,t]=(0,n.useState)(!1),[a,r]=(0,n.useState)(null),u=(0,s.zy)();return(0,n.useEffect)((()=>{const e=new URLSearchParams(u.search),a=e.get("uid"),n=e.get("token"),s=e.get("email");!async function(){const e=await(0,c.zY)(a,n,s);t(e.error),r(e.emailActivated)}()}),[]),a?n.createElement("div",null,"Email was successfully activated, you may continue to use the website"):e?n.createElement("div",null,"There was an error during activation, please try again or contact admin"):void 0}}}]);