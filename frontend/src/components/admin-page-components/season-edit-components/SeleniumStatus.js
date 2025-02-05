import React from "react";
import { useSeasonContext } from "./SeasonContext";
import ProfilePictureLazyLoader from "../../util-components/ProfilePictureLazyLoader";
import { submitTerminateSelenium } from "../../fetch-utils/fetchPost";
import { useApplicationContext } from "../../ApplicationContext";

export default function SeleniumStatus(){
    const { season, retrieveSeason } = useSeasonContext();
    const { setErrorMessage, setSuccessMessage } = useApplicationContext();

    async function terminateSelenium(pid){
        const terminateResponse = await submitTerminateSelenium(pid);

        if(terminateResponse.error){
            setErrorMessage("There was an error stopping the selenium service");
            return;
        }

        if(terminateResponse.status === 404){
            setErrorMessage("Service not found, it might have finished");
            return;
        }

        if(terminateResponse.status == 400){
            setErrorMessage("There was an error trying to terminate the service");
            return;
        }

        setSuccessMessage("Service terminated");
        retrieveSeason();
    }

    return(
        <>
        <div className="card-header">
            <h5>Retrieval in progress</h5>
        </div>
        <div className="card-body">
            {season.selenium_status.map((selenium) => (
                <div key={selenium.pid}>
                    {console.log(selenium)}
                    <div className="card rounded-15 p-2">
                        <div className="d-flex align-items-center ">
                            <ProfilePictureLazyLoader username={selenium.user.username} height={"2.5rem"} width={"2.5rem"}/>
                            <strong className="ms-2 me-2">{selenium.user.username}</strong>
                            <span>{selenium.message}</span>
                            <button className="ms-auto btn btn-outline-danger rounded-15" onClick={() => terminateSelenium(selenium.pid)}>Stop</button>
                        </div>
                    </div>
                    <hr />
                </div>
                
            ))}
        </div>
        </>
        
    );
}