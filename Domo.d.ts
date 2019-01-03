import { DomoEvent } from "./DomoEvent.js";
import { DomoElement } from "./DomoElement.js";

export declare type TEventCallback = (ev: Event) => any
export declare type TDomoElementType = DomoElement | DomoEvent | Attr | Text 
export declare type TDomoElementsTypes = Array<TDomoElementType>
export declare type TDomoAnchorTarget = { [n: string]: TDomoElementType }