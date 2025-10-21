'use client'

import CustomPopup from "@/components/admin/customPopup";
import LogoutButton from "@/components/admin/logoutButton";
import Footer from "@/components/footer";
import CloudArrowUpIcon from "@/components/Icons/cloudArrowUpIcon";
import CloudCheckIcon from "@/components/Icons/cloudCheckIcon";
import CloudExclamationIcon from "@/components/Icons/cloudExclamationIcon";
import NavItem from "@/components/navItem";
import { NotificationProvider } from "@/components/notificationProvider";
import { SaveState } from "@/types/States";
import { lazy, Suspense, JSX, useState, useEffect, ReactElement } from "react";
import { Tooltip } from 'react-tooltip'

// Views Lazy Loading
const UsersView = lazy(()=> import("@/views/admin/usersView"));
const RolesView = lazy(()=> import("@/views/admin/rolesView"));



export default function Dashboard() {
    const [cloudSavingState, setCloudSavingState] = useState<SaveState>("SAVED");

    let cloudSavingMessage! : string;
    let cloudSavingTooltipMessage! : string;
    let cloudSavingIcon! : ReactElement;

    const UpdateCloudSavingMessage = () => {
        switch (cloudSavingState) {
            case ("SAVED"):
                cloudSavingMessage = "Saved";
                cloudSavingTooltipMessage = "The changes was saved sucessfully.";
                cloudSavingIcon = <CloudCheckIcon/>
                break;
            case ("SAVING"):
                cloudSavingMessage = "Saving...";
                cloudSavingTooltipMessage = "Saving the new changes...";
                cloudSavingIcon = <CloudArrowUpIcon />
                break;
            case ("ERROR"):
                cloudSavingMessage = "Error";
                cloudSavingTooltipMessage = "An error ocurred saving the changes."
                cloudSavingIcon = <CloudExclamationIcon />
                break;
        }
    }
    // Init call
    UpdateCloudSavingMessage();

    // Automatic update
    useEffect(() => {
        UpdateCloudSavingMessage();
    },[cloudSavingState])



    // Views List
    const viewsList = [
        {name: "users", component: <UsersView setCloudSavingState={setCloudSavingState}/>},
        {name: "roles", component: <RolesView setCloudSavingState={setCloudSavingState}/> }
    ]

    const [currentView, setCurrentView] = useState<JSX.Element>();
    const [viewsCache, setViewsCache] = useState<Record<string, JSX.Element>>({});

    const changeView = (viewName: string, viewComponent: JSX.Element) => {
    if (!viewsCache[viewName]) {
        setViewsCache(prev => ({
            ...prev,
            [viewName]: viewComponent
        }));
    }
    setCurrentView(viewsCache[viewName] || viewComponent);
  };

  


    return(<>
    <NotificationProvider>
    <title>Admin Panel</title>
    <header className="flex flex-row w-full">
        <nav className="flex w-full flex-row p-3.5">
            <ul className="flex w-full flex-row gap-5">
                {viewsList.map(view => (
                    <NavItem
                    key={view.name}
                    text={view.name}
                    viewComponent={view.component}
                    changeView={changeView}/>
                ))}
            </ul>
            <div className="flex-center flex-row">
                <div>
                    <div data-tooltip-id="save-state-tooltip" data-tooltip-content={cloudSavingTooltipMessage} className="flex-center flex-row gap-1 font-regular text-white opacity-40">
                        {cloudSavingIcon}
                        {cloudSavingMessage}
                    </div>
                    <Tooltip id="save-state-tooltip"/>
                </div>
                <LogoutButton/>
            </div>
        </nav>
    </header>
    <main id="DASHBOARD-VIEW-RENDER" className="flex flex-1 flex-col w-full p-5">
        <Suspense fallback={<div className="text-left">Loading...</div>}>
            {currentView}
        </Suspense>
    </main>
    <Footer/>
    </NotificationProvider>
    </>)
}