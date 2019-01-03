import { TDomoElementsTypes, TDomoElementType } from "./Domo.d";
import { DomoEvent } from "./DomoEvent.js";

export class DomoElement {
    private static _limbo
        : HTMLTemplateElement['content']
        = document.createElement('template').content

    private _tagname
        : string

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
        if (tagOrNode instanceof HTMLElement) {
            this._domElement = tagOrNode
            this._tagname = tagOrNode.tagName
        } else {
            this._tagname = tagOrNode
            this._domElement = document.createElement(tagOrNode)
        }
        this._elements = elements
        this._create()
    }

    private _create() {
        DomoElement._limbo.appendChild(this._domElement)
        this._elements.forEach(el => {
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
        })
    }

    get raw(): HTMLElement {
        return this._domElement
    }

    get attr() {
        return this._domElement.attributes
    }

    cloneNode() {
        let clonedNodes: TDomoElementsTypes = []
        let domClone = <HTMLElement>this._domElement.cloneNode()
        clonedNodes = this._clonableNodes.map(el => <TDomoElementType>el.cloneNode())
        return new DomoElement(domClone, ...clonedNodes)
    }
}