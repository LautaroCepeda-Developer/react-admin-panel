import { ISetCloudSavingState } from "@/Interfaces/StatesInterfaces";
import { TableHeader } from "@/types/Entities";
import { SaveState } from "@/types/States";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { createPortal } from "react-dom";
import ConfirmationModal from "./ConfirmationModal";
import { Tooltip } from "react-tooltip";

interface IDeleteRowButtonProps {
    row: any,
    field: string,
    tableHeader: TableHeader,
    setCloudSavingState:Dispatch<SetStateAction<SaveState>>,
    reloadDataFunc : () => Promise<void>
}

const changeSaveState = (state:SaveState, {setCloudSavingState} : ISetCloudSavingState) => {
    setCloudSavingState(state);
}

const getEndpoint = (tableHeader : TableHeader) => 
    `${process.env.NEXT_PUBLIC_API_URL}/people/${tableHeader}/`

export default function DeleteRowButton({row,field,tableHeader,setCloudSavingState, reloadDataFunc}:IDeleteRowButtonProps) {
    const [modal, setModal] = useState<ReactNode>(null);

    let endpoint = getEndpoint(tableHeader);
    
    const deleteRow = async () => {


        setModal(null);
        try {
            changeSaveState("SAVING", {setCloudSavingState});

            const response = await fetch(`${endpoint}${row.original.id}`, {
                method: "DELETE",
                headers: {"Content-Type":"application/json"},
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error();
            }

            changeSaveState("SAVED", {setCloudSavingState});
            
            await reloadDataFunc();
        } 
        catch {
            changeSaveState("ERROR", {setCloudSavingState});
        }
    }

    const openOverlay = async () => {
        const overlay = createPortal(<ConfirmationModal type="delete" continueFunction={deleteRow} cancelFunction={async () => setModal(null)} />, document.body)

        setModal(overlay);
    }

    return(
    <>
    <input data-tooltip-id={`DELETE-${tableHeader.substring(0, tableHeader.length - 1)}-BUTTON-TOOLTIP`} data-tooltip-content={`Delete ${tableHeader.substring(0, tableHeader.length - 1)}`} type="button" className="flex-center flex-1  cursor-pointer flex font-bold text-red-950 hover:text-red-900 no-select field-sizing-content p-full size-10" onClick={openOverlay} value="X"/>
    <Tooltip id={`DELETE-${tableHeader.substring(0, tableHeader.length - 1)}-BUTTON-TOOLTIP`} />
    {modal}
    </>)

}