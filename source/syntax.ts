import { TDomoElementType } from "./Domo.d";
import { Creator } from "./Creators.js";
import { DomoEvent } from "./DomoEvent";
import { DomoElement } from "./DomoElement";

// -----------------------------------------------------------------------------
// --- ELEMENTS ----------------------------------------------------------------
// -----------------------------------------------------------------------------

export const template =
    Creator.template

export const domo =
    (strs: TemplateStringsArray, ...vals: any[]) =>
        (...p: Array<TDomoElementType | string>): DomoElement => {
            let str = String.raw(strs, ...vals)
            let tag = <string[]>str.match(/([\w-]*)[\.\#]{0,1}/)
            let id = <string[]>str.match(/#([\w-]*)/)
            let cl = <string[]>str.match(/\.([\w-.]*)/)
            let at
            let ats = /\[['"]{0,1}([\w\s-]+?)['"]{0,1}=['"]{0,1}([\w\s-]+?)['"]{0,1}\]/gm

            if (id)
                p.push(attr`id``${id[1]}`)

            if (cl)
                p.push(attr`class``${cl[1].replace(/\./g, ' ')}`)

            while (at = ats.exec(str))
                p.push(attr`${at[1]}``${at[2]}`)

            return Creator.domo(tag[1], ...p)
        }

export const css =
    (strs: TemplateStringsArray, ...vals: any[])
        : DomoElement => Creator.domo(
            'style',
            attr`type``text/css`,
            text`${String.raw(strs, ...vals)}`
        )

// -----------------------------------------------------------------------------
// --- ATTRIBUTES --------------------------------------------------------------
// -----------------------------------------------------------------------------

export const text =
    (strs: TemplateStringsArray, ...vals: any[]): Text =>
        Creator.text(String.raw(strs, ...vals))

export const attr =
    (astrs: TemplateStringsArray, ...avals: any[]) =>
        (bstrs: TemplateStringsArray, ...bvals: any[]): Attr =>
            Creator.attr(
                String.raw(astrs, ...avals),
                String.raw(bstrs, ...bvals)
            )

export const data =
    (astrs: TemplateStringsArray, ...avals: any[]) =>
        (bstrs: TemplateStringsArray, ...bvals: any[]): Attr =>
            Creator.attr(
                `data-${String.raw(astrs, ...avals)}`,
                String.raw(bstrs, ...bvals)
            )

export const evnt =
    (astrs: TemplateStringsArray, ...avals: any[]) =>
        (_: any, callback: EventListener, captureOrOptions: any | boolean = false): DomoEvent =>
            Creator.evnt(
                String.raw(astrs, ...avals),
                callback,
                captureOrOptions
            )