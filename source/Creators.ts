import { TDomoElementsTypes } from './Domo.d'
import { DomoElement } from './DomoElement.js'
import { DomoEvent } from './DomoEvent.js';

export class Creator {
    static template(
        ...domos: DomoElement[]
    ) {
        let template = document.createElement('template')
        domos.forEach(domo => template.content.appendChild(domo.raw))
        return template
    }

    static domo(
        tagname: string,
        ...elements: TDomoElementsTypes
    ) {
        return new DomoElement(tagname, ...elements)
    }

    static attr(
        key: string,
        value: string | null = null
    ): Attr {
        let attr = document.createAttribute(key)
        if (value) attr.value = <string>value
        return attr
    }

    static text(
        text: string
    ): Text {
        return document.createTextNode(text)
    }

    static evnt(
        eventname: string,
        callback: EventListener,
        captureOrOptions: any | boolean = false
    ): DomoEvent {
        return new DomoEvent(eventname, callback, captureOrOptions)
    }
}