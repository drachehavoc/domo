import {
    TDomoElementsTypes,
    TEventCallback
} from "./Domo.d";

import {
    template as func_template,
    domo as fn_element,
    text as fn_text,
    attr as fn_attr,
    evnt as fn_evnt,
    data as fn_data
} from "./functions.js";

export const template = func_template

export const domo =
    (strs: TemplateStringsArray, ...vals: any[]) =>
        (...p: TDomoElementsTypes) => fn_element(String.raw(strs, ...vals), ...p)

export const text =
    (strs: TemplateStringsArray, ...vals: any[]) =>
        fn_text(String.raw(strs, ...vals))

export const attr =
    (strs: TemplateStringsArray, val: string) =>
        fn_attr(strs[0].trim(), val)

export const data =
    (strs: TemplateStringsArray, val: string) =>
        fn_data(strs[0].trim(), val)

export const evnt =
    (strs: TemplateStringsArray, callback: TEventCallback, captureOrOptions: any | boolean = false) =>
        fn_evnt(strs[0].trim(), callback, captureOrOptions)