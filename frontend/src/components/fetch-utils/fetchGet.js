//for getting cookies, but only used for csrftoken
export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

//gets the user data
export async function getCurrentUser(){
    let response = {
        error: false,
        user: {},
        status: null,
    };

    try{
        const apiResponse = await fetch("/api/get-current-user/");
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.user = apiResponse.status === 200 ? apiResult : false;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    };

    return response;
}

export async function getUser(username){
    let response = {
        error: false,
        user: {},
        status: null,
    }

    try{
        //this method is post, but we are doing it to send context for the backend to get the user we are requesting
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch("/api/get-user/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                username: username,
            }),
        });
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.user = apiResponse.status === 200 ? apiResult : null;
        response.status = apiResponse.status;

    } catch(error){
        response.error = error;
    }

    return response;
}

export async function getUserProfilePicture(username){
    let response = {
        error: false,
        profilePicture: [],
        status: null,
    };

    try{
        const apiResponse = await fetch(`/api/get-profile-picture?username=${username}`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.profilePicture = apiResponse.status === 200 ? apiResult.profile_picture : null;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response
}

export async function getUserComments(username, page){
    let response = {
        error: false,
        comments: {},
        amountComments: 0,
        status: null,
    }

    try{
        const csrftoken = getCookie("csrftoken");
        const apiResponse = await fetch(`/api/get-user-comments?page=${page}`, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-type": "application/json",
            },
            mode: "same-origin",
            body: JSON.stringify({
                username: username,
            }),
        });
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.comments = apiResponse.status === 200 ? apiResult.comments : null;
        response.amountComments = apiResponse.status === 200 ? apiResult.amount_comments : null;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    }

    return response;
}

//for seeing if a user is logged in or not
export async function getLoggedIn(){
    let response = {
        error: false,
        loggedIn: null,
        status: null,
    };

    try{
        const apiResponse = await fetch("/api/get-logged-in/");

        response.error = apiResponse.status === 405 || apiResponse.status === 500 ? apiResponse : false;
        response.loggedIn = apiResponse.status === 200;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    };

    return response;
}

export async function getNotifications(){
    let response = {
        error: false,
        notifications: {},
        status: null,
    }

    try{
        const apiResponse = await fetch("/api/get-notifications/");
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.notifications = apiResponse.status === 200 ? apiResult : false;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    }

    return response;
}

export async function getRaceResults(seasonYear){
    let response = {
        error: false,
        raceResults: {},
        amountRaceResults: null,
        status: null,
    };

    try{
        const apiResponse = await fetch(`/api/get-race-results?season=${seasonYear}`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.raceResults = apiResult.races;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

//retrieves the announcements from a given page
export async function getAnnouncements(page){
    let response = {
        error: false,
        announcements: null,
        amountAnnouncements: null,
        status: null,
    };

    try{
        const apiResponse = await fetch(`/api/get-announcements?page=${page}`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.announcements = apiResponse.status === 200 ? apiResult.announcements : false;
        response.amountAnnouncements = apiResponse.status === 200 ? apiResult.amount_announcements : false;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    };

    return response;
}

export async function getAnnouncement(id){
    let response = {
        error: false,
        announcement: {},
        status: null,
    }

    try{
        const apiResponse = await fetch(`/api/get-announcements?id=${id}`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;
        
        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.announcement = apiResponse.status === 200 ? apiResult.announcement : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function getAnnouncementComments(id){
    let response = {
        error: false,
        comments: {},
        status: null,
    }

    try{
        const apiResponse = await fetch(`/api/get-announcement-comments?id=${id}`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.comments = apiResponse.status === 200 ? apiResult : false;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    }

    return response;
}

export async function getCommentReplies(commentId){
    let response = {
        error: false,
        comments: [],
        status: null,
    };

    try{
        const apiResponse = await fetch(`/api/get-comment-replies?commentId=${commentId}`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.comments = apiResponse.status === 200 ? apiResult : false;
        response.status = apiResponse.status;

        if(response.comments.length === 0){
            response.comments = false;
        }
    } catch(error) {
        response.error = error;
    }

    return response
}

//gets a newely generated account token from the api for changing something
export async function getToken(){
    let response = {
        error: false,
        token: null,
    };

    try{
        const apiResponse = await fetch("/api/get-token/");
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false; 
        response.token = apiResponse.status === 200 ? apiResult.token : false;
    } catch(error) {
        response.error = error;
    };

    return response;
}

export async function getSeasonsSimple(){
    let response = {
        error: false,
        seasons: [],
        status: null,
    };

    try{
        const apiResponse = await fetch("/api/get-seasons-simple/");
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse: false;
        response.seasons = apiResponse.status === 200 ? apiResult.seasons : false;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    };

    return response;
}

export async function getSeason(seasonYear){
    let response = {
        error: false,
        season: null,
        status: null,
    }

    try{
        const apiResponse = await fetch(`/api/get-season?season=${seasonYear}`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.season = apiResponse.status === 200 ? apiResult.season : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function getSeasonSimple(seasonYear){
    let response = {
        error: false,
        season: null,
        status: null,
    }

    try{
        const apiResponse = await fetch(`/api/get-season-simple?season=${seasonYear}`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.season = apiResponse.status === 200 ? apiResult.season : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function getSeasonsSimpleYear(){
    let response = {
        error: false,
        seasons: null,
        status: null,
    }

    try{
        const apiResponse = await fetch(`/api/get-seasons-simple-year/`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.seasons = apiResponse.status === 200 ? apiResult.seasons : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function getCurrentSeason(){
    let response = {
        error: false,
        season: null,
        competitorsSortedNumber: null,
        status: null,
    }

    try{
        const apiResponse = await fetch(`/api/get-current-season/`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        if(apiResponse.status == 404){
            response.competitorsSortedNumber = false;
            response.season = false;
        } else {
            response.competitorsSortedNumber = apiResponse.status === 200 ? apiResult.competitors_sorted_number : false;
            response.season = apiResponse.status === 200 ? apiResult.current_season : false;
        }

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function getSeasonCompetitor(competitorId){
    let response = {
        error: false,
        competitor: null,
        status: null,
    }

    try{
        const apiResponse = await fetch(`/api/get-season-competitor?id=${competitorId}`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.competitor = apiResponse.status === 200 ? apiResult.competitor : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function getCompetitors(){
    let response = {
        error: false,
        competitors: [],
        status: null,
    }

    try{
        const apiResponse = await fetch("/api/get-competitors/");
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.competitors = apiResponse.status == 200 ? apiResult.competitors : false;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    }

    return response
}

export async function getSeasonCompetitors(year){
    let response = {
        error: false,
        competitors: [],
        status: null,
    }

    try{
        const apiResponse = await fetch(`/api/get-season-competitors?season=${year}`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.competitors = apiResponse.status === 200 ? apiResult.competitors : false;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    }

    return response;
}

export async function getRace(raceId){
    let response = {
        error: false,
        race: {},
        status: null,
    }

    try{
        let apiResponse = await fetch(`/api/get-race?race=${raceId}`);
        let apiResult = await apiResponse.json();

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.race = apiResponse.status === 200 ? apiResult.race : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function getRaceComments(raceId){
    let response = {
        error: false,
        comments: [],
        status: null,
    }

    try{
        let apiResponse = await fetch(`/api/get-race-comments?race=${raceId}`);
        let apiResult = await apiResponse.json();

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.comments = apiResponse.status === 200 ? apiResult.comments : false;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    }

    return response;
}

export async function getSeasonRaces(year){
    let response = {
        error: false,
        races: [],
        status: null,
    }

    try{
        const apiResponse = await fetch(`/api/get-season-races?season=${year}`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.races = apiResponse.status === 200 ? apiResult.races : false;
        response.status = apiResponse.status;
    } catch(error){
        response.error = error;
    }

    return response;
}

export async function getUserPicks(seasonId, userId){
    let response = {
        error: false,
        userPicks: null,
        status: null,
    }

    try{
        const apiResponse = await fetch(`/api/get-user-picks?season=${seasonId}&uid=${userId}`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.userPicks = apiResponse.status === 200 ? apiResult.user_picks : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}

export async function getUserPicksSimple(seasonId, userId){
    let response = {
        error: false,
        userPicks:null,
        status: null,
    }

    try{
        const apiResponse = await fetch(`/api/get-user-picks-simple?season=${seasonId}&uid=${userId}`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.userPicks = apiResponse.status === 200 ? apiResult.user_picks : false;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response
}

export async function getSelectPicksState(){
    let response = {
        error: false,
        selectPicksState: null,
        status: null,
    }

    try{
        const apiResponse = await fetch(`/api/get-users-picks-state/`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.selectPicksState = apiResponse.status === 200 ? apiResult.users_picks_state : null;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
} 

export async function getSeasonStandings(year){
    let response = {
        error: false,
        standings: false,
        status: null,
    }

    try{
        const apiResponse = await fetch(`/api/get-standings?season=${year}`);
        const apiResult = apiResponse.status === 200 ? await apiResponse.json() : false;

        response.error = apiResponse.status === 500 ? apiResponse : false;
        response.standings = apiResponse.status === 200 ? apiResult.standings : null;
        response.status = apiResponse.status;
    } catch(error) {
        response.error = error;
    }

    return response;
}