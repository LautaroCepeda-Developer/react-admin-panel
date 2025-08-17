'use client'

import LogoutButton from "@/components/admin/logoutButton";
import Footer from "@/components/footer";
import NavItem from "@/components/navItem";
import { lazy, Suspense, JSX, useState } from "react";

// Views Lazy Loading
const UsersView = lazy(()=> import("@/views/admin/usersView"));
const RolesView = lazy(()=> import("@/views/admin/rolesView"));

// Views List
const viewsList = [
    {name: "users", component: <UsersView/>},
    {name: "roles", component: <RolesView/> }
]

export default function Dashboard() {
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
            <LogoutButton/>
        </nav>
    </header>
    <main id="DASHBOARD-VIEW-RENDER" className="flex flex-1 flex-col w-full p-5">
        <Suspense fallback={<div className="text-left">Loading...</div>}>
            {currentView}
        </Suspense>
    </main>

    <Footer/>
    </>)
}