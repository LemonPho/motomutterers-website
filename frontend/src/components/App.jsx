import React, { useEffect, useState, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import LayoutPage from "./layout-page-components/LayoutPage.jsx";
import { useApplicationContext } from "./ApplicationContext.jsx";
import LoadingPage from "./util-components/LoadingPage.jsx";
import Admin from "./admin-page-components/AdminPage.jsx";
import SeasonEdit from "./admin-page-components/season-edit-components/SeasonEdit.jsx"
import StandingsContextProvider from "./standings-page-components/StandingsContext.jsx";
import UsersIndexPage from './UsersIndexPage.jsx';
import HomePage from './HomePage.jsx';
import PageNotFound from './PageNotFound.jsx';
import LoginPage from './LoginPage.jsx';
import RegisterPage from "./RegisterPage.jsx";
import StandingsPage from "./standings-page-components/StandingsPage.jsx";
import UserPage from "./user-page-components/UserPage.jsx";
import Announcements from "./announcement-page-components/AnnouncementsPage.jsx";
import AccountActivation from "./AccountActivationPage.jsx";
import FindAccount from "./FindAccountPage.jsx";
import Contact from "./ContactPage.jsx";
import ChangePassword from "./ChangePasswordPage.jsx";
import EmailActivation from "./EmailActivationPage.jsx";
import Announcement from "./announcement-page-components/Announcement.jsx";
import SeasonContextProvider from "./admin-page-components/season-edit-components/SeasonContext.jsx";
import AnnouncementContextProvider from "./announcement-page-components/AnnouncementContext.jsx";
import SeasonCreateContextProvider from "./admin-page-components/SeasonCreateContext.jsx";
import UserPicksSelector from "./UserPicksSelector.jsx";
import UserSettings from "./user-settings-page-components/UserSettingsPage.jsx"
import RaceWeekendsHandler from "./race-weekends-components/RaceWeekendsHandler.jsx";
import RaceWeekendsContextProvider from "./race-weekends-components/RaceWeekendsContext.jsx";
import Home from "./home-page-components/Home.jsx";

export default function App() {
    const { retrieveApplicationContextData } = useApplicationContext();

    useEffect(() => {
        retrieveApplicationContextData();
    }, []);
    
    return (
        <Suspense fallback={<LoadingPage />}>
            <Routes>
                <Route path="/" element={<LayoutPage />}>
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