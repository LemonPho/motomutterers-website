import React, { useRef } from "react";
import { useSeasonContext } from "./SeasonContext";
import ProfilePictureLazyLoader from "../../util-components/ProfilePictureLazyLoader";
import { submitTerminateSelenium } from "../../fetch-utils/fetchPost";
import { useApplicationContext } from "../../ApplicationContext";

export default function SeleniumStatus(){
    const { season, retrieveSeason } = useSeasonContext();
    const { setErrorMessage, setSuccessMessage } = useApplicationContext();

    const stopButton = useRef(null);

    async function terminateSelenium(pid){
        if(stopButton.current){
            stopButton.current.classList.toggle("disabled");
            stopButton.current.innerHTML = "Loading...";
        }
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
        <div className="card rounded-15 col-md mb-2 element-background-color element-border-color" style={{padding: "0px"}}>
            <div className="card-header nested-element-color rounded-15 m-2">
                <h5>Retrieval in progress</h5>
            </div>
            <div className="card-body p-0 m-2">
                {season.selenium_status.map((selenium) => (
                    <div key={selenium.pid}>
                        <div className="card rounded-15 p-2 nested-element-color">
                            <div className="d-flex align-items-center ">
                                <ProfilePictureLazyLoader username={selenium.user.username} height={"2.5rem"} width={"2.5rem"}/>
                                <strong className="ms-2 me-2">{selenium.user.username}</strong>
                                <span>{selenium.message}</span>
                                <button ref={stopButton} className="ms-auto btn btn-outline-danger rounded-15" onClick={() => terminateSelenium(selenium.pid)}>Stop</button>
                            </div>
                        </div>
                    </div>
                    
                ))}
            </div>
        </div>
        
    );
}