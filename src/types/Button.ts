export type ButtonKind = 0 | 1 | 2 | 3;
export type ButtonCallback = (event: Event) => void;

export interface Button {
    label?: string;
    title?: string;
    icon?: string;
    kind?: ButtonKind;
    close?: boolean;
    callback?: ButtonCallback;
    className?: string;
    markup?: "button" | "a";
    type?: string;
    form?: string;
    href?: string;
    [attribute: `aria-${string}`]: string | undefined;
    [attribute: `data-${string}`]: string | undefined;
}
