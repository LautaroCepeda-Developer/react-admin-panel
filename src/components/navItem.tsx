import { ReactElement } from "react";

interface NavItemProps {
  text: string;
  viewComponent: ReactElement;
  changeView: (viewName: string, view: ReactElement) => void;
}

export default function NavItem({text, viewComponent, changeView} : NavItemProps) {
    return(
    <li className="flex-center border-2 box-border uppercase">
        <a onClick={() => changeView(text, viewComponent)} className="flex-center box-border px-3 py-1.5 font-bold uppercase cursor-pointer no-select hover:border-stone-300 hover:text-black hover:bg-stone-200 transition-colors ease-in-out"
        >{text}</a>
    </li>)
}