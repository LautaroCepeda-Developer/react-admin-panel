import { useEffect } from "react"
import { createPortal } from "react-dom"

interface IEditPrivateFieldOverlay {
    cancelFunction : () => Promise<void>,
    continueFunction : () => Promise<void>
}

export default function EditPrivateFieldOverlay({cancelFunction,continueFunction}: IEditPrivateFieldOverlay) {
    return (
        <div id="UPDATE-PRIVATE-FIELD-OVERLAY" className="flex-center top-0 left-0 w-full h-full z-500 absolute flex-1 bg-black/50">
            <div className="flex flex-col justify-between items-center p-5 gap-5 bg-gray-300">
                <p className="text-black flex text-lg font-bold">Are you sure you want to update this field?</p>

                <div className="flex flex-row justify-between w-full">
                    <button className="flex-center bg-red-900 hover:bg-red-950 transition-colors text-white px-5 py-3 outline-2 outline-pink-950 cursor-pointer" 
                    onClick={async () => cancelFunction()}>CANCEL</button>
                    <button className="flex-center bg-green-800 hover:bg-green-950 outline-2 outline-lime-950 transition-colors text-white px-5 py-3 cursor-pointer"
                    onClick={async () => continueFunction()}>CONTINUE</button>
                </div>
            </div>
        </div>
    )
}