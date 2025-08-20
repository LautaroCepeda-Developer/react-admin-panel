import { SaveState } from "@/types/States";
import { Dispatch, SetStateAction } from "react";

export interface ISetCloudSavingState {
    setCloudSavingState : Dispatch<SetStateAction<SaveState>>
}