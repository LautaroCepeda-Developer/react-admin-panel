import { ISetCloudSavingState } from "@/Interfaces/StatesInterfaces";
import { TableHeader, User } from "@/types/Entities";
import { SaveState } from "@/types/States";
import { Row } from "@tanstack/react-table";
import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { createPortal } from "react-dom";


const changeSaveState = (state:SaveState, {setCloudSavingState} : ISetCloudSavingState) => {
    setCloudSavingState(state);
}

const getEndpoint = (tableHeader : TableHeader) => 
    `${process.env.NEXT_PUBLIC_API_URL}/people/${tableHeader}/`

interface IEditablePrivateCellProps {
    row : any,
    field: string,
    tableHeader: TableHeader,
    setCloudSavingState : Dispatch<SetStateAction<SaveState>>,
    customClassName?: string
}

function getCurrentFormatedDate() : string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function UpdateUpdatedAtValue(row : Row<User>) : void {
    row.original["updated_at"] = getCurrentFormatedDate();

    const dateOptions : Intl.DateTimeFormatOptions = {
        year:"numeric", day:"2-digit","month":"2-digit"
    }

    document.querySelector(`td[data-row-id="${CSS.escape(row.id)}"][data-header-id="updated_at"]`)!.firstElementChild!.innerHTML = `${new Date(row.original["updated_at"]).toLocaleDateString('es-ar',dateOptions)}`
}

export default function EditablePrivateCell({row, field, tableHeader, setCloudSavingState, customClassName} :IEditablePrivateCellProps) {
    const [modal, setModal] = useState<ReactNode>(null);

    const [startValue, setStartValue] : [string, Dispatch<SetStateAction<string>>] = useState("••••••");
    const [value, setValue] : [string, Dispatch<SetStateAction<string>>] = useState("••••••");

    const [start_updated_at_value, setStart_updated_at_value] : [string, Dispatch<SetStateAction<string>>] = useState(row.original["updated_at"])

    const [editing, setEditing] = useState(false);

    let endpoint = getEndpoint(tableHeader);

    const openOverlay = async () => {
        // Block request if value doesn't change
        if (value.trim() === startValue) return;

        // Block request and reset the field, if the value is empty
        if (value.trim() === "") {setValue(startValue); return;}

        setEditing(false);
        
        const overlay = createPortal(<ConfirmationModal type="update" cancelFunction={revertChanges} continueFunction={saveChange}/>, document.body);

        setModal(overlay);
    }

    const revertChanges = async () => {
        setModal(null);

        // Reverting the changes
        setValue(startValue.trim());

        // Reverting the 'updated at field' (if exists)
        if (row.original["updated_at"]) {
            row.original["updated_at"] = start_updated_at_value;
        }
    }

    const saveChange = async () => {
        setModal(null);
        setValue(value.trim());
        setEditing(false);

        // Prevent fetching
        if (value.trim() === startValue) return;

        try {

            changeSaveState("SAVING", {setCloudSavingState});

            const response = await fetch(`${endpoint}${row.original.id}`, {
                method: "PATCH",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({[field]: value.trim()}),
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error();
            }

            changeSaveState("SAVED", {setCloudSavingState});
            
            // Visual update of the 'updated at' field (if exists)
            if (row.original["updated_at"]) {
                UpdateUpdatedAtValue(row);
                setStart_updated_at_value(row.original["updated_at"])
            }

            // Setting a new "Default value"
            setStartValue("••••••");
            setValue("••••••")

        } catch (error) {
            changeSaveState("ERROR", {setCloudSavingState});
            // Reverting the changes
            setValue(startValue.trim());

            // Reverting the 'updated at field' (if exists)
            if (row.original["updated_at"]) {
                row.original["updated_at"] = start_updated_at_value;
            }

        }
    };

    if (editing) {
        return (
            <input type="text" className="py-2 px-3 m-0 field-sizing-content w-full"
            spellCheck="false"
            autoComplete="false"
            autoCapitalize="false"
            name={field + " input"}
            value={value}
            onFocus={() => setValue("")}
            onChange={(evt) => setValue(evt.target.value)}
            onBlur={openOverlay}
            onKeyDown={(evt)=> evt.key === "Enter" && openOverlay()}
            autoFocus/>
        )
    }

    return <><span className={`flex py-2 px-3 w-full h-fit m-0 box-border text-nowrap ${customClassName}`} onClick={() => setEditing(true)}>{value}</span>{modal}</>
}