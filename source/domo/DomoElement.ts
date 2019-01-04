import { TDomoElementsTypes, TDomoElementType } from "./Domo.d";
import { DomoEvent } from "./DomoEvent.js";

export class DomoElement {
    private static _limbo
        : HTMLTemplateElement['content']
        = document.createElement('template').content

    private _domElement
        : HTMLElement

    private _children
        : DomoElement[]
        = []

    private _elements
        : TDomoElementsTypes

    private _clonableNodes
        : TDomoElementsTypes
        = []

    constructor(
        tagOrNode: string | HTMLElement,
        ...elements: TDomoElementsTypes
    ) {
        tagOrNode instanceof HTMLElement
            ? this._domElement = tagOrNode
            : this._domElement = document.createElement(tagOrNode)
        this._elements = elements
        DomoElement._limbo.appendChild(this._domElement)
        this._elements.forEach(el => this.append(el))
    }

    get raw(): HTMLElement {
        return this._domElement
    }

    get attr(): NamedNodeMap {
        return this._domElement.attributes
    }

    append(el: TDomoElementType) {
        switch (el.constructor) {
            case DomoElement:
                let domo = <DomoElement>el
                this._children.push(domo)
                this._clonableNodes.push(el)
                this._domElement.appendChild(domo.raw)
                break

            case DomoEvent:
                let evt = <DomoEvent>el
                this._clonableNodes.push(el)
                this._domElement.addEventListener(evt.name, evt.callback, evt.capturing)
                break

            case Text:
                let txt = <Text>el
                this._clonableNodes.push(el)
                this._domElement.appendChild(txt)
                break

            case Attr:
                let attr = <Attr>el
                this._domElement.setAttributeNode(attr)
                break
        }
    }

    cloneNode(): DomoElement {
        let clonedNodes: TDomoElementsTypes = []
        let domClone = <HTMLElement>this._domElement.cloneNode()
        clonedNodes = this._clonableNodes.map(el => <TDomoElementType>el.cloneNode())
        return new DomoElement(domClone, ...clonedNodes)
    }
}