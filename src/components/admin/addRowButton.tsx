import { ISetCloudSavingState } from "@/Interfaces/StatesInterfaces"
import { BackendError, PostEntity, TableHeader } from "@/types/Entities"
import { SaveState } from "@/types/States"
import React, { Dispatch, ReactNode, SetStateAction, useState } from "react"
import { createPortal } from "react-dom"
import { Tooltip } from 'react-tooltip'
import AddRowFormModal from "./addRowFormModal"
import { useNotify } from "../notificationProvider"

interface IAddRowButtonProps {
    tableHeader : TableHeader,
    setCloudSavingState : Dispatch<SetStateAction<SaveState>>,
    reloadDataFunc : () => Promise<void>
}

const changeSaveState = (state:SaveState, {setCloudSavingState} : ISetCloudSavingState) => {
    setCloudSavingState(state);
}


const getEndpoint = (tableHeader : TableHeader) => {
    if (tableHeader == "roles") return `${process.env.NEXT_PUBLIC_API_URL}/people/${tableHeader}/`;

    return `${process.env.NEXT_PUBLIC_API_URL}/auth/register/`;
}

export default function AddRowButton({tableHeader, setCloudSavingState, reloadDataFunc}:IAddRowButtonProps) {
    const notify = useNotify();
    const [modal, setModal] = useState<ReactNode>(null);

    let endpoint = getEndpoint(tableHeader);

    const createEntity = async (entity : PostEntity | null) => {
        if (entity == null) return;
        
        try {
            changeSaveState("SAVING", {setCloudSavingState})
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                credentials: "include",
                body: JSON.stringify(entity)
            });

            if (!response.ok && response.status === 400) {
                const error = JSON.parse(await response.json().then((e) => e.message)) as BackendError[];
   
                error.forEach((err) => {
                    notify("ERROR",`Field[${err.path[0]}]: ${err.message}`, "ERROR");
                })
                
                changeSaveState("SAVING", {setCloudSavingState})
                return;
            }
            else if (!response.ok) {
                throw new Error(`An error ocurred creating the ${tableHeader.substring(0, tableHeader.length - 1)}`)
            }
            setModal(null);
            
            changeSaveState("SAVED", {setCloudSavingState})
            reloadDataFunc();
        } catch (error) {
            setModal(null);
            changeSaveState("ERROR", {setCloudSavingState})
        }
    }

    const closeOverlay = async() => {
        setModal(null);
        changeSaveState("SAVED", {setCloudSavingState})
    }
 
    const openOverlay = async() => {
        const overlay = createPortal(<AddRowFormModal tableHeader={tableHeader}
        cancelFunction={closeOverlay} continueFunction={createEntity}/>, document.body);
        setModal(overlay);
    }

    return (<>
    <button onClick={openOverlay} data-tooltip-id="ADD-ROW-BUTTON-TOOLTIP" data-tooltip-content={`Add new ${tableHeader.substring(0, tableHeader.length - 1)}`} data-tooltip-place="bottom-end" type="button" className="flex-center cursor-pointer size-10 text-3xl text-center w-full h-full p-0 m-0 font-bold text-green-700 hover:text-green-500">+</button>
    <Tooltip id="ADD-ROW-BUTTON-TOOLTIP"/>
    {modal}
    </>)
}