import { ISetCloudSavingState } from "@/Interfaces/StatesInterfaces"
import { Entity, TableHeader } from "@/types/Entities"
import { SaveState } from "@/types/States"
import { Dispatch, ReactNode, SetStateAction, useState } from "react"
import { createPortal } from "react-dom"
import { Tooltip } from 'react-tooltip'
import AddRowFormModal from "./addRowFormModal"

interface IAddRowButtonProps {
    tableHeader : TableHeader,
    setCloudSavingState : Dispatch<SetStateAction<SaveState>>
}

const changeSaveState = (state:SaveState, {setCloudSavingState} : ISetCloudSavingState) => {
    setCloudSavingState(state);
}

const getEndpoint = (tableHeader : TableHeader) => 
    `${process.env.NEXT_PUBLIC_API_URL}/people/${tableHeader}/`

export default function AddRowButton({tableHeader, setCloudSavingState}:IAddRowButtonProps) {
    const [modal, setModal] = useState<ReactNode>(null);

    let endpoint = getEndpoint(tableHeader);

    const createEntity = async (entity : Entity) => {

    }

    const closeOverlay = async() => {
        setModal(null);
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