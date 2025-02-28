import React, { useState, useEffect } from "react";

import { useApplicationContext } from "../../../../../ApplicationContext";
import { useSeasonContext } from "../../../SeasonContext";
import RaceDetailsCreateModal from "./RaceDetailsCreateModal";
import RaceResultsCreateModal from "./RaceResultsCreateModal";
import RaceSelectCompetitorsCreateModal from "./RaceSelectCompetitorsCreateModal";
import Modal from "../../../../../util-components/Modal";
import { useOpenersContext } from "../../../../../OpenersContext";

export default function RaceCreateManual(){

    const { openedModal } = useOpenersContext();
    const { contextLoading, } = useApplicationContext();
    const { seasonLoading } = useSeasonContext();


    if(seasonLoading || contextLoading){
        return;
    }

    return (
        <div>

            
            
            {/* 
            <Modal isOpen={openedModal == "race-create"}>
                <RaceResultsCreateModal/>
            </Modal>
            */}
        </div>
        
    )
}