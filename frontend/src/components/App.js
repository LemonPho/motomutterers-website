import React, { useEffect, useState, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import LayoutPage from "./layout-page-components/LayoutPage.js";
import { useApplicationContext } from "./ApplicationContext.js";
import LoadingPage from "./util-components/LoadingPage.js";
import Admin from "./admin-page-components/AdminPage.js";
import SeasonEdit from "./admin-page-components/season-edit-components/SeasonEdit.js"
import StandingsContextProvider from "./standings-page-components/StandingsContext.js";
import UsersIndexPage from './UsersIndexPage.js';
import HomePage from './HomePage.js';
import PageNotFound from './PageNotFound.js';
import LoginPage from './LoginPage.js';
import RegisterPage from "./RegisterPage.js";
import StandingsPage from "./standings-page-components/StandingsPage.js";
import UserPage from "./user-page-components/UserPage.js";
import Announcements from "./announcement-page-components/AnnouncementsPage.js";
import AccountActivation from "./AccountActivationPage.js";
import FindAccount from "./FindAccountPage.js";
import Contact from "./ContactPage.js";
import ChangePassword from "./ChangePasswordPage.js";
import EmailActivation from "./EmailActivationPage.js";
import Announcement from "./announcement-page-components/Announcement.js";
import SeasonContextProvider from "./admin-page-components/season-edit-components/SeasonContext.js";
import AnnouncementContextProvider from "./announcement-page-components/AnnouncementContext.js";
import SeasonCreateContextProvider from "./admin-page-components/SeasonCreateContext.js";
import UserPicksSelector from "./UserPicksSelector.js";
import UserSettings from "./user-settings-page-components/UserSettingsPage.js"
import RaceWeekendsHandler from "./race-weekends-components/RaceWeekendsHandler.js";
import RaceWeekendsContextProvider from "./race-weekends-components/RaceWeekendsContext.js";
import Home from "./home-page-components/Home.js";

export default function App() {
    const { retrieveApplicationContextData } = useApplicationContext();

    useEffect(() => {
        retrieveApplicationContextData();
    }, []);
    
    return (
        <Suspense fallback={<LoadingPage />}>
            <Routes>
                <Route path="/" element={<LayoutPage />}>
                    <Route index element={<Home />}/>
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
                    <Route path="race-weekends" element={<RaceWeekendsContextProvider/>}>
                        <Route index element={<RaceWeekendsHandler />}/>
                        <Route path=":raceWeekendId" element={<RaceWeekendsHandler/>}/>
                    </Route>
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="select-picks" element={<UserPicksSelector />}/>
                    <Route path="settings" element={<UserSettings />}/>
                    <Route path="standings" element={<StandingsContextProvider />}>
                        <Route index element={<StandingsPage />}/>
                    </Route>
                    <Route path="users/" element={<UsersIndexPage />} />
                    <Route path="users/:username" element={<UserPage />} />
                    <Route path="*" element={<PageNotFound />}/>
                </Route>
            </Routes>
        </Suspense>
    );
    
}