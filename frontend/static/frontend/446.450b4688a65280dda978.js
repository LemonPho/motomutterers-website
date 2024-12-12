"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[446],{446:(e,r,t)=>{t.r(r),t.d(r,{default:()=>u,useSeasonContext:()=>d});var o=t(540),s=t(974),a=t(767),n=t(606),i=t(946);const c=(0,o.createContext)();function u(){const{setErrorMessage:e,setSuccessMessage:r,setModalErrorMessage:t,resetApplicationMessages:u}=(0,i.Xn)(),d=(0,a.g)().seasonYear,[l,h]=(0,o.useState)(null),[g,w]=(0,o.useState)(!1);async function f(){const r=await(0,s.oK)(d);let t={};return 404===r.status?(h(!1),void w(!1)):r.error||200!=r.status?(e("There was an error loading the season"),w(!1),void console.log(r.error)):(t=r.season,t.competitorsSortedNumber=r.competitorsSortedNumber,t.competitorsSortedPoints=r.competitorsSortedPoints,h(t),void w(!1))}return o.createElement(c.Provider,{value:{season:l,seasonLoading:g,retrieveSeason:f,createSeasonRace:async function(e){u();const o=await(0,n.Ir)(e);return o.error||200!=o.status?(t("There was an error creating the race"),console.log(o.error),!1):(r("Race created"),f(),!0)},addSeasonRaceResults:async function(e){u();const o=await(0,n.yN)(e);return o.error?(t("There was an error adding the results"),console.log(o.error),!1):200!=o.status?(t("Be sure that the information inputted is correct"),!1):(r("Race result saved"),f(),!0)},editSeasonRace:async function(e){u();let o=await(0,n._O)(e);return o.error?(t("There was an error editing the race"),console.log(o.error),!1):200!=o.status?(t("Be sure the information is valid"),!1):(r("Changes saved"),f(),!0)},deleteSeasonRace:async function(o){u();let s=await(0,n.DK)(o,d);if(s.error||200!=s.status)return console.log(s.error),t("There was an error deleting the race"),void e("There was an error deleting the race");r("Race deleted"),f()},createSeasonCompetitor:async function(e){u();const o=await(0,n.To)(e);return o.error?(t("There was an error submiting the competitor"),console.log(o.error),!1):o.riderExists?(t("A rider with that number already exists"),!1):o.seasonNotFound?(t("The season was not found of which you want to add the competitor"),!1):201!=o.status?(t("Make sure the information is correct and valid"),!1):(r("Rider created"),f(),!0)},editSeasonCompetitor:async function(e){u();const o=await(0,n.qZ)(e);return o.error?(console.log(o.error),t("There was an error editing the rider"),!1):200!=o.status?(t("Make sure the information is valid"),!1):(r("Changes saved"),f(),!0)},deleteSeasonCompetitor:async function(e,o){u();const s=await(0,n.Se)(e,o);return s.error||200!=s.status?(t("There was an error deleting the rider"),console.log(s.error),!1):(r("Rider deleted"),f(),!0)}}},o.createElement(a.sv,null))}function d(){return(0,o.useContext)(c)}}}]);