import { ICloudIconProps } from "@/Interfaces/IconsInterfaces";

export default function CloudArrowUpIcon({size=28, color = "#FFF", strokeWidth=1}:ICloudIconProps) {
    return(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9.5v6m0-6-2 2m2-2 2 2M8.4 19C5.418 19 3 16.604 3 13.65 3 11.2 4.8 8.937 7.5 8.5 8.347 6.486 10.351 5 12.69 5c2.994 0 5.442 2.323 5.61 5.25 1.59.695 2.7 2.4 2.7 4.247A4.5 4.5 0 0 1 16.5 19z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/></svg>)
}