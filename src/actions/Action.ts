import Dialog from "../control/Dialog/AbstractDialog.js";
import ExtGPFDialog from "geopf-extensions-openlayers/src/packages/Controls/Toggle/Dialog.js";
import type { Button, ButtonCallback } from "../types/Button.js";

export type ActionCallback = ButtonCallback;
export type ActionLifecycleCallback = (event: unknown) => void;
export type BeforeOpenFunction = () => boolean | void;

export interface ActionButton extends Button {
    label: string;
}

export interface ActionOptions {
    id: string;
    title: string;
    content: string | HTMLElement;
    icon?: string;
    buttons?: ActionButton[];
    items?: ActionButton[];
    beforeOpen?: BeforeOpenFunction;
    onOpen?: ActionLifecycleCallback;
    onClose?: ActionLifecycleCallback;
    size?: string;
}

export interface ExtGpfDialogInstance {
    close(): void;
    getElement(): HTMLElement;
    setContent(content: { title: string; icon: string; content: string | HTMLElement; items: ActionButton[]; footer: ActionButton[] }): void;
    setOnOpen(callback: ActionLifecycleCallback): void;
    setOnClose(callback: ActionLifecycleCallback): void;
    show(): void;
}

export interface ExtGpfDialogConstructor {
    new (...args: never[]): ExtGpfDialogInstance;
    getDialog(id: string): ExtGpfDialogInstance;
}

export const ExtGpfDialogClass = ExtGPFDialog as unknown as ExtGpfDialogConstructor;

export interface ActionOpenEvent {
    target?: EventTarget | null;
    detail?: {
        target?: EventTarget | null;
    };
    preventDefault?(): void;
    stopPropagation?(): void;
    stopImmediatePropagation?(): void;
}

/* Action list */
const actions: Record<string, Action> = {};

/**
 * Lie une action à un dialog ext-gpf, met à jour son contenu et l'ouvre.
 * Inspiré de setAction() d'AbstractDialog, sans dispatch interne CHANGE_CONTENT.
 * @param {ExtGPFDialog} dialog
 * @param {Action} action
 * @returns {boolean} false si le dialog ne possède pas les méthodes requises
 */
function setExtGpfAction(dialog: ExtGpfDialogInstance, action: Action): boolean {
    action.dialog = dialog;
    dialog.getElement().dataset.actionId = action.id;

    dialog.setContent({
        title: action.title,
        icon: action.icon,
        content: action.content,
        items: action.items,
        footer: action.buttons,
    });

    dialog.setOnOpen(action.onOpen);
    dialog.setOnClose(action.onClose);

    dialog.show();
    return true;
}

/**
 * Classe représentant une action complète pour une modale (titre, contenu, pied de page et action à l'ouverture)
 */
class Action {
    private _buttons: ActionButton[] = [];
    private _content: string | HTMLElement = "";
    private _emitter: HTMLElement | undefined;
    private _id = "";
    private _items: ActionButton[] = [];
    private _title = "";
    beforeOpen: BeforeOpenFunction;
    dialog: Dialog | ExtGpfDialogInstance | undefined;
    icon: string;
    onClose: ActionLifecycleCallback;
    onOpen: ActionLifecycleCallback;
    size: string | undefined;

    /**
     * @param options  Options de configuration de l'action
     */
    constructor(options: ActionOptions) {
        if (!options.id) {
            throw new Error("L'id de l'action est obligatoire");
        }
        if (actions[options.id]) {
            throw new Error(`L'action ${options.id} existe déjà`);
        }
        this.id = options.id;
        this.title = options.title;
        this.content = options.content;
        this.buttons = options.buttons ?? [];
        this.items = options.items ?? [];
        this.beforeOpen = typeof options.beforeOpen === "function" ? options.beforeOpen : () => true;
        this.onOpen = typeof options.onOpen === "function" ? options.onOpen : () => {};
        this.onClose = typeof options.onClose === "function" ? options.onClose : () => {};
        this.icon = options.icon || "";
        this.size = options.size;
        actions[options.id] = this;
    }

    /**
     *
     * @param id Id de l'action
     * @returns Action avec l'id correspondant
     */
    static getAction(id: string): Action {
        const action = actions[id];
        if (!action) {
            throw new Error(`L'action ${id} n'existe pas`);
        }
        return action;
    }

    /**
     * @param e Événement du clic ou dialog
     * @param actionId Id de l'action à ouvrir
     * @param pressed Si l'action est un toggle, indique si le toggle est activé ou non
     */
    static open(
        e: ActionOpenEvent | Dialog | ExtGpfDialogInstance,
        actionId?: string,
        pressed: boolean | string | null = null
    ): { action: Action; dialog: Dialog | ExtGpfDialogInstance } | undefined {
        let dialogId: string | null = null;
        let dialog: Dialog | ExtGpfDialogInstance;
        let action: Action;
        const isDialog = e instanceof Dialog || e instanceof ExtGpfDialogClass;
        if (isDialog) {
            // Cas d'une ouverture classique
            if (!actionId) {
                throw new Error("L'id de l'action est obligatoire pour ouvrir directement un dialogue");
            }
            action = Action.getAction(actionId);
        } else {
            // Pour gérer le cas du toggle
            const target = e.target || e.detail?.target;
            if (!(target instanceof HTMLElement)) return;
            dialogId = target.getAttribute("aria-controls");
            const targetActionId = target.dataset.action;
            if (!targetActionId) return;
            action = Action.getAction(targetActionId);
            pressed = target.ariaPressed;
        }

        if (isDialog) {
            dialog = e;
        } else {
            if (!dialogId) return;
            try {
                dialog = Dialog.getDialog(dialogId);
            } catch {
                // Dialog est de type ExtGPFDialog
                dialog = ExtGpfDialogClass.getDialog(dialogId);
            }
        }

        if (!dialog || !action) return;

        // Empêche la propagation de l'événement
        if (action.beforeOpen?.() === false) {
            if (!(e instanceof Dialog) && !(e instanceof ExtGpfDialogClass)) {
                e.preventDefault?.();
                e.stopPropagation?.();
                e.stopImmediatePropagation?.();
            }
            return;
        }

        // Modifie l'emitter
        if (!(e instanceof Dialog) && !(e instanceof ExtGpfDialogClass)) {
            const emitter = e.target || e.detail?.target;
            if (emitter instanceof HTMLElement) action.emitter = emitter;
        }

        if (pressed === false || pressed === "false") {
            dialog.close();
        } else if (dialog instanceof Dialog) {
            dialog.setAction(action, isDialog);
        } else if (dialog instanceof ExtGpfDialogClass) {
            setExtGpfAction(dialog, action);
        }

        return { action: action, dialog: dialog };
    }

    /** Identifiant unique de l'action. */
    get id(): string {
        return this._id;
    }

    /**
     * Modifie l'identifiant unique de l'action.
     * @param value Nouvel identifiant
     */
    set id(value: string) {
        this._id = value;
    }

    /** Titre affiché dans le dialogue. */
    get title(): string {
        return this._title;
    }

    /**
     * Modifie le titre affiché dans le dialogue.
     * @param value Nouveau titre
     */
    set title(value: string) {
        this._title = value;
    }

    /** Contenu affiché dans le dialogue. */
    get content(): string | HTMLElement {
        return this._content;
    }

    /**
     * Modifie le contenu affiché dans le dialogue.
     * @param value Nouveau contenu
     */
    set content(value: string | HTMLElement) {
        this._content = value;
    }

    /** Boutons affichés dans le pied du dialogue. */
    get buttons(): ActionButton[] {
        return this._buttons;
    }

    /**
     * Remplace les boutons affichés dans le pied du dialogue.
     * @param buttons Nouveaux boutons
     */
    set buttons(buttons: ActionButton[]) {
        if (!Array.isArray(buttons)) return;
        this._buttons = buttons;
    }

    /** Éléments complémentaires affichés dans le dialogue. */
    get items(): ActionButton[] {
        return this._items;
    }

    /**
     * Remplace les éléments complémentaires du dialogue.
     * @param items Nouveaux éléments
     */
    set items(items: ActionButton[]) {
        if (!Array.isArray(items)) return;
        this._items = items;
    }

    /** Élément HTML ayant émis l'action, lorsqu'il est disponible. */
    get emitter(): HTMLElement | undefined {
        return this._emitter;
    }

    /**
     * Modifie l'élément HTML ayant émis l'action.
     * @param value Nouvel élément émetteur
     */
    set emitter(value: HTMLElement | undefined) {
        this._emitter = value;
    }

    /** Retourne le dialogue associé à une action */
    getDialog(): Dialog | ExtGpfDialogInstance | undefined {
        return this.dialog;
    }

    /**
     * Ajoute un bouton dans le buttons
     * @param {ActionButton} button
     */
    addButton(button: ActionButton): void {
        this._buttons.push(button);
    }

    /**
     * Récupère le bouton à un index donné
     * @param {number} index
     * @returns {ActionButton|undefined}
     */
    getButton(index: number): ActionButton | undefined {
        return this._buttons[index];
    }
}

export default Action;
