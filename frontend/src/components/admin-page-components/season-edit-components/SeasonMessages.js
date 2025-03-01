import React, { useState } from "react";
import { useSeasonContext } from "./SeasonContext";
import { useOpenersContext } from "../../OpenersContext";
import Modal from "../../util-components/Modal";
import SeasonMessageModal from "./SeasonMessageModal";
import { submitDeleteSeasonMessage } from "../../fetch-utils/fetchPost";
import { useApplicationContext } from "../../ApplicationContext";

export default function SeasonMessages(){
    const { setErrorMessage } = useApplicationContext();
    const { season, setSeason } = useSeasonContext();
    const { openedModal, openModal, closeModal } = useOpenersContext();

    const [ selectedSeasonMessage, setSelectedSeasonMessage ] = useState();

    async function deleteSeasonMessage(id){
        const seasonMessageResponse = await submitDeleteSeasonMessage(id);

        console.log(seasonMessageResponse);

        if(seasonMessageResponse.error || seasonMessageResponse.status != 201){
            setErrorMessage("There was an error deleting the season message");
            return;
        }

        setSeason(prevSeason => ({
            ...prevSeason,
            season_messages: prevSeason.season_messages.filter(msg => msg.id !== id)
        }));        
    }

    return(
        <div className="card rounded-15 col-md mb-2 element-background-color element-border-color" style={{padding: "0px"}}>
            <div className="card-header">
                <h5>Season messages</h5>
            </div>
            <div className="card-body">
                {console.log(openedModal)}
                {season.season_messages && season.season_messages.map((seasonMessage) => (
                    <div key={seasonMessage.id}>
                        <div className="d-flex">
                            <div className="truncate d-flex align-items-center clickable rounded-15 p-1" onClick={() => {setSelectedSeasonMessage(seasonMessage); openModal("season-message")}}>
                                {seasonMessage.message}
                            </div>
                            <button className="btn btn-link" onClick={() => deleteSeasonMessage(seasonMessage.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="red">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#CD5C5C"/>
                                </svg>
                            </button>
                        </div>
                        <hr />
                    </div>
                ))}
                <Modal isOpen={openedModal == "season-message"}>
                    <SeasonMessageModal seasonMessage={selectedSeasonMessage} closeModal={closeModal} deleteSeasonMessage={deleteSeasonMessage}/>
                </Modal>
            </div>
        </div>
        );
}