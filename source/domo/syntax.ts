import { TDomoElementsTypes, TEventCallback, TDomoElementType } from "./Domo.d";
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
        (...p: TDomoElementsTypes)
            : DomoElement => Creator.domo(String.raw(strs, ...vals), ...p)

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
        (_: any, callback: TEventCallback, captureOrOptions: any | boolean = false): DomoEvent =>
            Creator.evnt(
                String.raw(astrs, ...avals),
                callback,
                captureOrOptions
            )