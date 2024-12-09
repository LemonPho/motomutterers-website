import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import { useApplicationContext } from "./ApplicationContext.js";

//import SeasonEdit from "./admin-page-components/season-edit-components/SeasonEdit.js";
//import Admin from "./admin-page-components/AdminPage.js";
//import UserPicksSelector from "./UserPicksSelector.js";
//import UserSettings from "./user-settings-page-components/UserSettingsPage.js";
const Admin = React.lazy(() => import("./admin-page-components/AdminPage.js"));
const SeasonEdit = React.lazy(() => import("./admin-page-components/season-edit-components/SeasonEdit.js"));
const UserPicksSelector = React.lazy(() => import("./UserPicksSelector.js"));
const UserSettings = React.lazy(() => import("./user-settings-page-components/UserSettingsPage.js"));

import UsersIndexPage from './UsersIndexPage.js';
import HomePage from './HomePage.js';
import PageNotFound from './PageNotFound.js';
import LayoutPage from './layout-page-components/LayoutPage.js';
import LoginPage from './LoginPage.js';
import RaceResults from "./RaceResultsPage.js";
import RegisterPage from "./RegisterPage.js";
import StandingsPage from "./StandingsPage.js";
import UserPage from "./UserPage.js";
import Announcements from "./AnnouncementsPage.js";
import AccountActivation from "./AccountActivationPage.js";
import FindAccount from "./FindAccountPage.js";
import Contact from "./ContactPage.js";
import ChangePassword from "./ChangePasswordPage.js";
import EmailActivation from "./EmailActivationPage.js";
import Announcement from "./announcement-page-components/Announcement.js";
import SeasonContextProvider from "./admin-page-components/season-edit-components/SeasonContext.js";
import AnnouncementContextProvider from "./announcement-page-components/AnnouncementContext.js";
import SeasonCreateContextProvider from "./admin-page-components/SeasonCreateContext.js";

export default function App() {
    const { retrieveApplicationContextData, contextLoading } = useApplicationContext();

    useEffect(() => {
        retrieveApplicationContextData();
    }, [])

    if(contextLoading){
        return null;
    }

    return (
        <Routes>
            <Route path="/" element={<LayoutPage />}>
                <Route index element={<HomePage />}/>
                <Route path="activate" element={<AccountActivation />}/>
                <Route path="administration" element={<SeasonCreateContextProvider />}>
                    <Route index element={<Admin />}/>
                </Route>
                <Route path="administration/seasons/:seasonYear" element={<SeasonContextProvider/>}>
                    <Route index element={<SeasonEdit />}/>
                </Route>
                <Route path="announcements" element={<Announcements />}/>
                <Route path="announcements/:announcementId" element={<AnnouncementContextProvider />}>
                    <Route index element={<Announcement />}/>
                </Route>
                <Route path="contact" element={<Contact />}/>
                <Route path="change-password" element={<ChangePassword />}/>
                <Route path="change-email" element={<EmailActivation />}/>
                <Route path="find-account" element={<FindAccount />}/>
                <Route path="login" element={<LoginPage />} />
                <Route path="raceresults" element={<RaceResults />}/>
                <Route path="register" element={<RegisterPage />} />
                <Route path="select-picks" element={<UserPicksSelector />}/>
                <Route path="settings" element={<UserSettings />}/>
                <Route path="standings" element={<StandingsPage />}/>
                <Route path="users/" element={<UsersIndexPage />} />
                <Route path="users/:username" element={<UserPage />} />
                <Route path="*" element={<PageNotFound />}/>
            </Route>
        </Routes>
    );
    
}