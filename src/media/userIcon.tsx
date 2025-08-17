'use client'

import SVGIconProps from "@/Interfaces/SVGIcon";

export default function UserIcon({iconId, iconColor, iconWidth, iconHeight, iconViewBox}:SVGIconProps) {
    return (
    <svg strokeWidth="2" stroke={iconColor || ""} xmlns="http://www.w3.org/2000/svg" id={iconId || ""} viewBox={iconViewBox || "0 0 24 24"} width={iconWidth||"512"} height={iconHeight || "512"}><path d="M16.043,14H7.957A4.963,4.963,0,0,0,3,18.957V24H21V18.957A4.963,4.963,0,0,0,16.043,14Z"/><circle cx="12" cy="6" r="6"/></svg>
    )
}