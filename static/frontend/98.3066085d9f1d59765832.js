"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[98],{98:(e,n,t)=>{t.r(n),t.d(n,{default:()=>i,useAnnouncementContext:()=>m});var r=t(540),o=t(946),s=t(974),a=t(767),c=t(606);const u=(0,r.createContext)();function i(){const{setErrorMessage:e,setSuccessMessage:n,setModalErrorMessage:t,resetApplicationMessages:i}=(0,o.Xn)(),{announcementId:m}=(0,a.g)(),[l,d]=(0,r.useState)({}),[g,h]=(0,r.useState)({}),[f,v]=(0,r.useState)(!0),[w,C]=(0,r.useState)(!1);function y(){C(!1)}async function p(){if(v(!0),null===m)return void d(!1);const n=await(0,s.c$)(m);return 404==n.status?(d(!1),void v(!1)):n.error||200!=n.status?(console.log(n.error),e("There was an error loading the announcement"),void v(!1)):(d(n.announcement),h(n.comments),void v(!1))}return r.createElement(u.Provider,{value:{announcement:l,comments:g,retrieveAnnouncement:p,editAnnouncement:async function(t,r,o){const s=await(0,c.Q8)(t,r,o);if(s.error)return console.log(s.error),void e("There was an error saving the changes");400!==s.status?200!==s.status?e("There was an error saving the changes"):n("Announcement changes saved"):e("Be sure the title has a limit of 128 characters and the text 2048")},deleteAnnouncement:async function(t){const r=await(0,c.bt)(t);if(r.error||200!=r.status)return console.log(r.error),void e("There was an error deleting the announcement");n("Announcement successfully deleted")},announcementLoading:f,retrieveComment:async function(e){y();const n=await(0,s.dG)(e);return n.error||200!=n.status?(C("There was an error retrieving the comment"),console.log(n.error),!1):n.comment.text},commentsErrorMessage:w,setCommentsErrorMessage:C,resetAnnouncementsMessages:y,editComment:async function(e,n){y();const t=await(0,c.d1)(e,n);return console.log(t),t.error?(C("There was an error editing the comment"),console.log(t.error),!1):200==t.status||(C("Comments have a max character count of 2048 characters"),!1)},deleteComment:async function(e){y();const n=await(0,c.US)(e);if(n.error||200!=n.status)return C("There was an error deleting the comment"),void console.log(n.error);p()},createCommentReply:async function(e,n){y();const t=await(0,c.pg)(e,n,l.id);return t.error||200!=t.status?(C("Error submiting the comment"),console.log(t.error),!1):(p(),!0)},createComment:async function(e){i();const n=await(0,c.rw)(e,l.id);return n.error?(C("There was an error posting the comment"),console.log(n.error),!1):200!=n.status?(C("Comment is invalid"),!1):(p(),!0)}}},r.createElement(a.sv,null))}function m(){return(0,r.useContext)(u)}}}]);