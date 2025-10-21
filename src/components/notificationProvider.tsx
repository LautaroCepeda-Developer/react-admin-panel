'use client'
import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {createPortal} from "react-dom";

type NotificationType = "SUCESS" | "WARNING" | "ERROR"
type NotificationData = {
    id: string,
    type: NotificationType,
    title: string,
    message: string,
    appearing?: boolean
}
type NotificationContextType = (
    title:string,
    message:string,
    type: NotificationType,
    duration?: number,
) => void;

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotify = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error("Hook useNotify only can be used inside NotificationProvider");
    }

    return context;
}

export function NotificationProvider({children}:PropsWithChildren) {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    },[]);

    const notify : NotificationContextType = (title, message, type, duration = 5000) => {
        const id = crypto.randomUUID();
        setNotifications((prev) => [...prev, {id,title,message,type, appearing: false}]);

        setTimeout(() => {
            setNotifications((prev) => prev.map((n) => (n.id === id ? {...n, appearing:true} : n)))
        }, 50)


        setTimeout(() => {
            setNotifications((prev) => prev.map((n) => (n.id === id) ? {...n, appearing: false} : n))
        }, duration - 300)

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
    };

    return (
    <NotificationContext.Provider value={notify}>
        {children}

        {mounted && createPortal((<div className="h-auto gap-1.5 flex flex-col fixed bottom-0 right-0 m-2.5 w-65 text-white z-550 no-select">
            {notifications.map((n) => (
                <div key={n.id} onClick={() => setNotifications((prev) => prev.filter((x) => x.id !== n.id))}
                className={`flex flex-col border-2 shadow text-white transform transition-all duration-300 ease-in-out cursor-pointer
                ${n.appearing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                ${n.type === "SUCESS" ? "bg-green-800 border-green-950" : n.type === "ERROR" ? "bg-red-900 border-red-950" : "bg-yellow-800 border-yellow-950"}`}>
                    <p className="px-1 py-2 font-semibold">{n.title}</p>
                    <p className={`flex w-full px-2 py-1  ${n.type === "SUCESS" ? "bg-green-700" : n.type === "ERROR" ? "bg-red-500" : "bg-yellow-700"}`}>{n.message}</p>
                </div>
        ))}
        </div>), document.body)}
    </NotificationContext.Provider>)
}