declare type TEventAttacher = { event: string, callback: TEventCallback }
declare type TEventCallback = (ev: Event) => any
declare type TEls = PrimalElement | Text | Attr | EventAttacher | string
declare type TElsNodes = PrimalElement | Text | Attr | EventAttacher

export declare type TElsNodeList = { [name: string]: TElsNodes }
export declare type PrimalElementList = { [name: string]: PrimalElement }

export class EventAttacher {
    constructor(
        public event: string,
        public callback: TEventCallback
    ) {
        // ...
    }

    cloneNode() {
        return this
    }
}

export class PrimalElement {
    protected static _wizzle: any = {}
    protected static _masterTemplate = document.createElement('template')

    protected _htmlElement: HTMLElement = document.createElement(this._tagName)
    protected _attr: Attr[] = []
    protected _children: PrimalElement[] = []
    protected _properties: TElsNodes[] = []
    protected _events: EventAttacher[] = []
    protected _owner: PrimalElement | null = null
    protected _palaceholder: HTMLElement = document.createElement('a')

    constructor(
        protected _tagName: string,
        ...children: Array<TEls>
    ) {
        PrimalElement._masterTemplate.content.append(this._htmlElement)
        children.forEach(child => this.append(child))
    }

    get children() {
        return this._children
    }

    get raw(): HTMLElement {
        return this._htmlElement
    }

    get owner(): PrimalElement | null {
        return this._owner
    }

    private _setRoot(primal: PrimalElement) {
        this._owner = primal
    }

    private _append(child: TEls, el: HTMLElement = this._htmlElement) {
        if (child instanceof PrimalElement) {
            child._setRoot(this)
            this._children.push(child)
            this._properties.push(child)
            el.appendChild(child.raw)
            return
        }

        if (child instanceof Text) {
            this._properties.push(child)
            el.appendChild(child)
            return
        }

        if (child instanceof Attr) {
            this._properties.push(child)
            el.setAttributeNode(child)
            return
        }

        if (child instanceof EventAttacher) {
            this._properties.push(child)
            el.addEventListener(child.event, child.callback)
            return
        }

        child = document.createTextNode(child)
        this._properties.push(child)
        this._htmlElement.appendChild(child)
    }

    append(child: TEls) {
        this._append(child)
    }

    clone(): PrimalElement {
        let properties = this._properties.map(e => {
            if (e instanceof PrimalElement)
                return e.clone()
            return e.cloneNode()
        })
        // @ts-ignore
        return new PrimalElement(this._tagName, ...properties)
    }

    edit() {
        this.raw.replaceWith(this._palaceholder)
        PrimalElement._masterTemplate.content.appendChild(this.raw)
    }

    commit() {
        this._palaceholder.replaceWith(this.raw)
    }
}

// --- DECORATORS --------------------------------------------------------------

export const component =
    (options = {}) =>
        (constructor: any) => {
            let name = constructor.name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
            window.customElements.define(name, constructor, options)
        }

export const observeAttribute =
    (target: Object, key: string, descriptor: PropertyDescriptor) => {
        let constructor = <any>target.constructor
        if (constructor.observedAttributes instanceof Array) {
            constructor.observedAttributes.push(key)
        } else {
            constructor.observedAttributes = [key]
            let proto = constructor.prototype
            let origFunc = proto.attributeChangedCallback || null

            proto.attributeChangedCallback = function (name: string, oldValue: any, newValue: any) {
                if (this[name] && this[name] instanceof Function)
                    this[name](oldValue, newValue)
                if (origFunc)
                    origFunc.bind(this)(name, oldValue, newValue)
            }
        }
    }
    
// -----------------------------------------------------------------------------

export const template = (...itens: Array<PrimalElement>) => {
    let template = document.createElement('template')
    itens.forEach(primal => template.content.appendChild(primal.raw))
    return template
}

export const element =
    (strings: TemplateStringsArray, ...values: any[]) =>
        (...children: Array<TEls>) => {
            let tagName = strings[0].trim()
            let primal = new PrimalElement(tagName, ...children)
            if (values[0] instanceof Object && strings.length == 2)
                values[0][strings[1].trim()] = primal
            return primal
        }

export const css =
    (strings: TemplateStringsArray, ...values: any[]) => {
        let text = String.raw(strings, ...values)
        let primal = new PrimalElement('style', text)
        return primal
    }

const genAttr = (attrName: string, attrValue: any) => {
    let attr = document.createAttribute(attrName)
    if (attrValue)
        attr.value = attrValue
    return attr
}

export const attr =
    (strings: TemplateStringsArray, ...values: any[]) => genAttr(strings[0].trim(), values[0])


export const text =
    (strings: TemplateStringsArray, ...values: any[]): Text =>
        document.createTextNode(String.raw(strings, ...values))

export const evnt =
    (strings: TemplateStringsArray, ...values: any[]) =>
        new EventAttacher(strings[0].trim(), values[0])
