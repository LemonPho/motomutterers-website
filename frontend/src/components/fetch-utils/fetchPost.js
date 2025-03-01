import { getCookie } from "./fetchGet";
import axios from "axios";

//used to send user registration data to server to then send activation link to user email
export async function submitRegistration(username, email, password1, password2){
    let response = {
        error: false,
        usernameUnique: null,
        usernameValid: null,
        emailUnique: null,
        emailValid: null,
        passwordsMatch: null,
        passwordValid: null,
        invalidData: null,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/register/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-Type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                username: username,
                email: email,
                password1: password1,
                password2: password2,
            })
        });
        const apiResult = apiResponse.status === 200 || apiResponse.status === 400 ? await apiResponse.json() : false;

        if(apiResult){
            response.usernameUnique = apiResult.username_unique;
            response.usernameValid = apiResult.username_valid;
            response.emailUnique = apiResult.email_unique;
            response.emailValid = apiResult.email_valid;
            response.passwordsMatch = apiResult.passwords_match;
            response.passwordValid = apiResult.password_valid;
            response.invalidData = apiResult.invalid_data;
        }
        response.status = apiResponse.status;
        
    } catch(error){
        response.error = error;
    } 

    return response;
}

export async function submitLogout(){
    let response = {
        error: false,
        status: null,
    }

    try{
        const apiResponse = await fetch("/api/logout/");
        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function submitLogin(isUsername, loginKey, password){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch("/api/login/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-Type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                is_username: isUsername,
                login_key: loginKey,
                password: password,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function requestAccountActivationToken(uid){
    let response = {
        error: false,
        status: null,
    };

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/request-activation-token/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-Type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                uid: uid,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;

}

//used for when user clicks on account activation link
export async function submitAccountActivation(uid, token){
    let response = {
        error: false,
        status: null,
    }

    try{
        const apiResponse = await fetch(`/api/activate?uid=${uid}&token=${token}`);
        if(apiResponse.status === 500){
            response.error = apiResponse;
        }
        response.status = apiResponse.status;

    } catch(error) {
        response.error = error;
    }

    return response;
}

//used when password is forgotten
export async function submitNewPassword(password1, password2, uid64, token){
    const response = {
        error: false,
        passwordsMatch: null,
        passwordValid: null,
        tokenValid: null,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch("/api/reset-password/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                password1: password1,
                password2: password2,
                uid64: uid64,
                token: token,
            })
        });

        let apiResult = false;

        if(apiResponse.status === 200 || apiResponse.status === 400){
            apiResult = await apiResponse.json();
        }

        if(apiResult){
            response.passwordsMatch = apiResult.passwords_match;
            response.passwordValid = apiResult.password_valid;
            response.tokenValid = apiResult.token_valid;
        }

        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

//user changes password in user settings
export async function submitChangePassword(token, currentPassword, newPassword){
    let response = {
        error: false,
        currentPasswordCorrect: null,
        newPasswordValid: null,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch("/api/change-password/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                token: token,
                currentPassword: currentPassword,
                newPassword: newPassword,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
        const apiResult = await apiResponse.json();

        response.currentPasswordCorrect = apiResult.current_password_correct;
        response.newPasswordValid = apiResult.new_password_valid;
    } catch(error){
        response.error = error;
    }

    return response;
}

//user changes username in user settings
export async function submitChangeUsername(currentPassword, newUsername){
    let response = {
        error: false,
        currentPasswordCorrect: null,
        newUsernameValid: null,
        newUsernameUnique: null,
        userCanChangeUsername: null,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch("/api/change-username/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                currentPassword: currentPassword,
                newUsername: newUsername,
            }),
        });

        response.status = apiResponse.status;
        response.error = apiResponse.status === 500 ? apiResponse : false;
        const apiResult = await apiResponse.json();

        response.currentPasswordCorrect = apiResult.current_password_correct;
        response.newUsernameValid = apiResult.new_username_valid;
        response.newUsernameUnique = apiResult.new_username_unique;
        response.userCanChangeUsername = apiResult.user_can_change_username;
    } catch(error){
        response.error = error;
    }

    return response;
}

//user changes email from user settings
export async function submitChangeEmail(currentPassword, newEmail){
    let response = {
        error: false,
        currentPasswordCorrect: null,
        newEmailValid: null,
        newEmailUnique: null,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch("/api/change-email/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                currentPassword: currentPassword,
                newEmail: newEmail,
            }),
        });

        response.status = apiResponse.status;
        response.error = apiResponse.status === 500 ? apiResponse : false;

        const apiResult = await apiResponse.json();
        response.currentPasswordCorrect = apiResult.current_password_correct;
        response.newEmailValid = apiResult.new_email_valid;
        response.newEmailUnique = apiResult.new_email_unique;
    } catch(error){
        response.error = error;
    }

    return response;
}

//user clicks on the link in their email to confirm their new email
export async function submitEmailActivation(uid, token, newEmail){
    let response = {
        error: false,
        emailActivated: false,
    }

    try{
        const apiResponse = await fetch(`/api/activate-email?uid=${uid}&token=${token}&email=${newEmail}`);
        response.emailActivated = apiResponse.ok;
        response.error = apiResponse.status === 500 ? apiResponse : false;

    } catch(error) {
        response.error = error;
    }

    return response;
}

//user changes profile picture in user settings
export async function submitChangeProfilePicture(newProfilePictureForm){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await axios.post("/api/change-profile-picture/", newProfilePictureForm, {
            headers: {
                "X-CSRFToken": csrftoken,
            },
        });
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    }
    return response;
}

export async function submitDeleteAccount(){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch("/api/delete-account/", {
            method: "POST",
            mode: "same-origin",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
            },
        });

        response.status = apiResponse.status;
        response.error = apiResponse.status === 500 ? apiResponse : false;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function submitAnnouncement(title, text){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch("/api/post-announcement/", {
            method: "POST",
            mode: "same-origin",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
                title: title,
                text: text,
            }),
        });
        response.status = apiResponse.status;
        response.error = apiResponse.status === 500 ? apiResponse : false;
    } catch(error){
        response.error = error;
    }

    return response;
}

export async function submitEditAnnouncement(title, text, announcementId){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/edit-announcement/`, {
            method: "POST",
            headers: {
                "Content-tyep": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
                announcementId: announcementId,
                text: text,
                title: title,
            }),
            mode: "same-origin",
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function submitDeleteAnnouncement(announcementId){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/delete-announcement/`, {
            method: "POST",
            headers: {
                "X-CSRFToken" : csrftoken,
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                announcementId: announcementId,
            }),
            mode: "same-origin",
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function submitComment(text, parentElement, commentId){
    let response = {
        error: false,
        status: null,
    };

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/post-comment/`, {
            method: "POST",
            headers:{
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
                id: parentElement.id,
                parentElement: parentElement.type,
                text: text,
                commentId: commentId,
            })
        })

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
        
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function submitEditComment(text, commentId){
    let response = {
        error: false,
        status: null,
    };

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch("/api/edit-comment/", {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
                text: text,
                commentId: commentId,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function submitDeleteComment(commentId){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch("/api/delete-comment/", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
                commentId,
            }),
            mode: "same-origin",
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function readNotification(notificationId){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/read-notification/`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
                notification_id: notificationId,
                read: true,
            }),
            mode: "same-origin",
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    }

    return response;
}

export async function sendNewPasswordEmail(accountUsername){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/send-reset-email?username=${accountUsername}`, {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                username: accountUsername,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
        
    } catch(error){
        response.error = error;
    }

    return response;
}

export async function submitDeleteSeasonMessage(seasonMessageId){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch('/api/delete-season-message/', {
            method: "PUT",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                season_message_id: seasonMessageId,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function submitCompetitor(newCompetitorPosition){
    let response = {
        error: false,
        riderExists: false,
        seasonNotFound: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/create-competitor/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                competitor_position: newCompetitorPosition,
            }),
        });

        const apiResult = await apiResponse.json();

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.riderExists = apiResult.rider_exists;
        response.seasonNotFound = apiResult.season_not_found;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    }

    return response;
}

export async function submitSeasonCompetitorsLink(link, year){
    let response = {
        error: false,
        invalidLink: false,
        invalidSeason: false,
        timeout: false,
        seleniumAvailable: true,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/create-season-competitors-link/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                url: link,
                year: year,
            }),
        });

        const apiResult = await apiResponse.json();

        response.invalidLink = apiResult.invalidLink;
        response.invalidSeason = apiResult.invalidSeason;
        response.timeout = apiResult.timeout;
        response.seleniumAvailable = apiResult.selenium_available;
        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function submitEditSeasonCompetitor(newCompetitorPosition){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/edit-season-competitor/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                competitor_points: newCompetitorPosition.competitorPoints,
                id: newCompetitorPosition.id,
                independent: newCompetitorPosition.independent,
                rookie: newCompetitorPosition.rookie,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response
}

export async function submitDeleteCompetitor(competitorId, seasonId){
    let response = {
        error: false,
        status: null,
    };

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/delete-competitor/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                competitor_id: competitorId,
                season_id: seasonId,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    }

    return response;
}

export async function submitDeleteCompetitors(competitorsIds, seasonId){
    let response = {
        error: false,
        status: null,
    };

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/delete-competitors/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                competitors_ids: competitorsIds,
                season_id: seasonId,
            }),
        });

        response.error = apiResponse.status == 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function submitDeleteAllCompetitors(seasonId){
    let response = {
        error: false,
        status: null,
    };

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/delete-all-competitors/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                season_id: seasonId,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    };

    return response;
}

export async function submitSeason(year, topIndependent, topRookie){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/create-season/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                year: year,
                top_independent: topIndependent,
                top_rookie: topRookie,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    }

    return response;
}

export async function submitCurrentSeason(year){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/set-current-season/`, {
            method: "PUT",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                year: year,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    }

    return response;
}

export async function submitDeleteSeason(seasonId){
    let response = {
        error: false,
        status: null,
    };

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/delete-season/`, {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                seasonId: seasonId,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    }

    return response;
}

export async function submitRace(newRace){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/create-race/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json"
            },
            mode: "same-origin",
            body: JSON.stringify({
                seasonYear: newRace.seasonYear,
                track: newRace.track,
                timestamp: newRace.timestamp,
                is_sprint: newRace.isSprint,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function retrieveRaceResult(raceId){
    let response = {
        error: false,
        status: null,
    }

    try{
        let csrftoken = getCookie("csrftoken");
        let apiResponse = await fetch("/api/retrieve-race-result/", {
            method: "PUT",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                race_id: raceId,
            })
        });

        response.error = apiResponse.status == 500 ? apiResponse : false;
        response.status = apiResponse.status;

    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function submitRaceResultLink(link, raceDate, raceType, seasonYear){
    let response = {
        error: false,
        competitorNumbersNotFound: [],
        invalidLink: false,
        timeout: false,
        invalidSeason: false,
        invalidType: false,
        seleniumAvailable: true,
        status: null,
    }

    try{
        let csrftoken = getCookie("csrftoken");
        let apiResponse = await fetch("/api/create-race-link/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                link: link,
                timestamp: raceDate,
                race_type: raceType,
                season_year: seasonYear,
            }),
        });

        const apiResult = await apiResponse.json();

        response.competitorNumbersNotFound = apiResult.competitors_not_found;
        response.invalidLink = apiResult.invalidLink;
        response.invalidSeason = apiResult.invalidSeason;
        response.invalidType = apiResult.invalidType;
        response.timeout = apiResult.timeout;
        response.seleniumAvailable = apiResult.selenium_available;
        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;

    } catch(error){
        response.error = error;
    }

    return response;
}

export async function submitRaceResults(newRace){
    let response = {
        error: false,
        status: null,
    }

    try{
        let csrftoken = getCookie("csrftoken");
        let apiResponse = await fetch("/api/add-race-results/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                raceId: newRace.id,
                //ensures the data is sent as an integer
                competitors_positions: newRace.competitorsPositions.map(competitorPosition => ({
                    competitorId: parseInt(competitorPosition.competitorId),
                    position: parseInt(competitorPosition.position),
                })),
                finalized: newRace.finalized,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function submitFullRace(newRace, seasonYear){
    let response = {
        error: false,
        status: null,
        competitorsNotFound: [],
        invalidCompetitorsPositionsSpacing: [],
        invalidCompetitorsPositions: false,
        invalidSeason: false,
        invalidRaceData: false,
    }

    try{
        let csrftoken = getCookie("csrftoken");
        let apiResponse = await fetch("/api/create-complete-race/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                race: newRace.race,
                competitors_positions: newRace.competitors_positions,
                season_year: seasonYear,
            }),
        });

        let apiResult = await apiResponse.json()

        response.competitorsNotFound = apiResult.competitors_not_found;
        response.invalidCompetitorsPositionsSpacing = apiResult.invalid_competitors_positions_spacing;
        response.invalidCompetitorsPositions = apiResult.invalid_competitors_positions;
        response.invalidSeason = apiResult.invalid_season;
        response.invalidRaceData = apiResult.invalid_race_data;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    }

    return response
}

export async function submitEditRace(newRace){
    let response = {
        error: false,
        status: null,
    }

    try{
        let csrftoken = getCookie("csrftoken");
        let apiResponse = await fetch("/api/edit-race/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                raceId: newRace.id,
                seasonYear: newRace.seasonYear,
                track: newRace.track,
                title: newRace.title,
                timestamp: newRace.timestamp,
                is_sprint: newRace.isSprint,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function submitDeleteRace(raceId, seasonYear){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch("/api/delete-race/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                raceId: raceId,
                year: seasonYear,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function submitToggleUsersPicksState(){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch("/api/toggle-users-picks/", {
            method: "PUT",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) { 
        response.error = error;
    }

    return response;
}

export async function submitToggleSeasonFinalize(year){
    let response = {
        error: false,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch("/api/finalize-season/", {
            method: "PUT",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                year: year,
            }),
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function submitUserPicks(picks, independentPick, rookiePick){
    let response = {
        error: false,
        status: null,
        picksAlreadySelected: false,
        invalidPicks: false,
        invalidIndependent: false,
        invalidRookie: false,
        cantSelectPicks: false,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch("/api/set-user-picks/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                picks_ids: picks,
                independent_pick_id: independentPick,
                rookie_pick_id: rookiePick,
            }),
        });

        const apiResult = apiResponse.status === 400 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.picksAlreadySelected = apiResponse.status === 400 ? apiResult.picks_already_selected : false;
        response.invalidPicks = apiResponse.status === 400 ? apiResult.invalid_picks : false;
        response.invalidIndependent = apiResponse.status === 400 ? apiResult.invalid_independent : false;
        response.invalidRookie = apiResponse.status === 400 ? apiResult.invalid_rookie : false;
        response.cantSelectPicks = apiResponse.status === 400 ? apiResult.cant_select_picks : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function submitTerminateSelenium(pid){
    let response = {
        error: false,
        status: null,
    };

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/terminate-selenium/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                pid: pid,
            })
        });

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}