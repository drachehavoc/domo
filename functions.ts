import { TDomoElementsTypes, TEventCallback, TDomoAnchorTarget } from './Domo.d'
import { DomoElement } from './DomoElement.js'
import { DomoEvent } from './DomoEvent.js';

export const template =
    (...domos: DomoElement[]) => {
        let template = document.createElement('template')
        domos.forEach(domo => template.content.appendChild(domo.raw))
        return template
    }

export const domo =
    (tagname: string, ...elements: TDomoElementsTypes) =>
        new DomoElement(tagname, ...elements)

export const attr =
    (key: string, value: string | null = null): Attr => {
        let attr = document.createAttribute(key)
        if (value) attr.value = <string>value
        return attr
    }

export const data = 
    (key: string, value: string | null = null) => 
        attr(`data-${key}`, value) 

export const text =
    (text: string): Text =>
        document.createTextNode(text)

export const evnt =
    (eventname: string, callback: TEventCallback, captureOrOptions: any | boolean = false) =>
        new DomoEvent(eventname, callback, captureOrOptions)