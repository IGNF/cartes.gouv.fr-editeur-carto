import ol_ext_element from "ol-ext/util/element.js";
import Utils from "geopf-extensions-openlayers/src/packages/Utils/Helper.js";
import BaseObject from "ol/Object.js";
import type { Button, ButtonCallback } from "../../types/Button.js";
import type Action from "../../actions/Action.js";
import type { EventsKey } from "ol/events.js";

export type DialogCallback = ButtonCallback;
export type DialogOnOpen = (dialog: AbstractDialog) => void;
export type DialogOnClose = (dialog: AbstractDialog) => void;

export interface DialogButton extends Button {
    click?: DialogCallback;
}

export interface DialogOptions {
    id: string;
    className: string;
    dialogClass?: string;
    title?: string;
    icon?: string;
    content?: string | HTMLElement | null;
    buttons?: DialogButton[];
    onOpen?: DialogOnOpen;
    onClose?: DialogOnClose;
    parent?: Element;
    html?: string | Element;
    [attribute: `aria-${string}`]: string | undefined;
}

export interface DialogContentOptions {
    title?: string;
    icon?: string;
    content?: string | HTMLElement | null;
    buttons?: DialogButton[];
}

export interface DialogEvent {
    target: AbstractDialog;
}

export type DialogEventName = "dialog:open" | "dialog:change:content" | "dialog:close";

type DialogEventListener = (event: DialogEvent) => unknown;
type DialogOnSignature<Return> = {
    (type: DialogEventName, listener: DialogEventListener): Return;
    (type: DialogEventName[], listener: DialogEventListener): Return extends void ? void : Return[];
};

export interface DialogSelectors {
    TITLE: string;
    BUTTON_GROUP: string;
    BUTTONS: string;
    BTN_CLOSE: string;
    ICON: string;
    CONTENT: string;
    OPEN_EVENT: "dialog:open";
    CHANGE_CONTENT: "dialog:change:content";
    CLOSE_EVENT: "dialog:close";
}

type DialogInternalOptions = Partial<DialogOptions> & {
    className: string;
    parent: Element;
};

const dsfrPrefix = "fr-icon";
const dsfrClasses = ["fr-icon", "fr-icon--sm"];
const remixIconPrefix = "ri-";
const remixIconClasses = ["ri-1x"];

const buttonKind = {
    0: "fr-btn",
    1: "fr-btn--secondary",
    2: "fr-btn--tertiary",
    3: "fr-btn--tertiary-no-outline",
};

const dialogs = {};

/**
 * @abstract
 */
class AbstractDialog extends BaseObject {
    declare on: BaseObject["on"] & DialogOnSignature<EventsKey>;
    declare once: BaseObject["once"] & DialogOnSignature<EventsKey>;
    declare un: BaseObject["un"] & DialogOnSignature<void>;
    action: Action | undefined;
    closeBtn: HTMLElement | null = null;
    dialog!: HTMLDialogElement;
    dialogClass: string;
    dialogContent!: HTMLElement;
    dialogIcon!: HTMLElement;
    dialogTitle!: HTMLElement;
    onCloseFn: (event: unknown) => void = () => {};
    onOpenFn: (event: unknown) => void = () => {};
    options!: DialogInternalOptions;
    selectors!: DialogSelectors;

    /**
     * Renvoie le dialog correspondant à l'id donné
     * @param id Id du dialog
     * @returns Instance du dialog avec l'id correspondant
     * @throws Si aucun dialogue n'existe
     * @static
     */
    static getDialog(id: any) {
        if (id in dialogs) {
            return dialogs[id];
        } else {
            throw new Error(`Aucun dialogue n'existe avec cet id : ${id}`);
        }
    }

    /**
     * Ajoute un dialogue au registre interne.
     * @param id Id du dialogue
     * @private
     */
    #addDialog(id: any) {
        if (!id) {
            throw new Error("Un id doit être donné au dialogue");
        } else if (id in dialogs) {
            throw new Error(`Un dialogue avec l'id '${id}' existe déjà`);
        } else {
            dialogs[id] = this;
        }
    }

    /**
     * Crée un dialogue.
     * @param options Options du dialogue
     */
    constructor(options: any) {
        super();

        // Abstract class
        if (this.constructor === AbstractDialog) {
            throw new Error("AbstractDialog is an abstract you have to extent.");
        }

        /**
         * @private Nom générique de la classe du dialog
         */
        this.dialogClass = options.dialogClass || "ign-dialog";

        this.initialize();

        options = options || {};

        // Attribut à garder pour la création du dialog
        let optionsToKeep = {};
        if (options.id) optionsToKeep.id = options.id;
        if (options.className) optionsToKeep.className = `${this.options.className} ${options.className}`;
        if (options.html) optionsToKeep.html = options.html;
        if (options.parent) optionsToKeep.parent = options.parent;
        for (const attr in options) {
            // Ajoute les attributs aria au dialog
            if (attr.startsWith("aria-")) {
                optionsToKeep[attr] = options[attr];
            }
        }

        this.#addDialog(options.id);

        const dialogOptions = Utils.assign(this.options, optionsToKeep);

        this.dialog = ol_ext_element.create("DIALOG", dialogOptions);

        let createOptions = Utils.assign(this.options, options);

        this._createDialog(createOptions);
    }

    /**
     * Initie les sélecteurs CSS utiles dans le reste
     */
    initialize() {
        this.options = {
            className: this.dialogClass,
            parent: document.body,
        };

        const btnGroup = `.${this.dialogClass}__btns-group`;

        this.selectors = {
            TITLE: `.${this.dialogClass}__title-name`,
            BUTTON_GROUP: btnGroup,
            BUTTONS: `${btnGroup} button`,
            BTN_CLOSE: `.${this.dialogClass}__close-btn`,
            ICON: `.${this.dialogClass}__title-icon`,
            CONTENT: `.${this.dialogClass}__content`,
            OPEN_EVENT: "dialog:open",
            CHANGE_CONTENT: "dialog:change:content",
            CLOSE_EVENT: "dialog:close",
        };
    }

    /**
     * Créé le dialog en instanciant les éléments utiles
     *
     * @param options Options de création du panneau
     */
    _createDialog(options: any) {
        this.closeBtn = this.querySelector(this.selectors.BTN_CLOSE) as HTMLElement;
        if (this.closeBtn) {
            this.closeBtn.setAttribute("aria-controls", this.getId());
            // Permet de laisser les sous-classes surcharger
            // la fonction de fermeture du dialog
            this.closeBtn.addEventListener("click", () => {
                this.close();
            });
        }

        // Titre et contenu du dialog
        this.dialogTitle = this.querySelector(this.selectors.TITLE) as HTMLElement;
        this.dialogIcon = this.querySelector(this.selectors.ICON) as HTMLElement;
        this.dialogContent = this.querySelector(this.selectors.CONTENT) as HTMLElement;

        if (options.title) {
            this.dialogTitle.innerHTML = options.title;
        }
        if (options.icon) {
            this.setIcon(options.icon, this.dialogIcon);
        }
        this.onOpenFn = typeof options.onOpen === "function" ? options.onOpen.bind(this) : () => {};
        this.onCloseFn = typeof options.onClose === "function" ? options.onClose.bind(this) : () => {};
        this.on(this.selectors.CLOSE_EVENT, () => {
            this.un(this.selectors.OPEN_EVENT, this.onOpenFn);
        });
    }

    /**
     * Retourne l'élement dialog de l'objet.
     * @returns Élément dialog
     */
    getDialog(): HTMLDialogElement {
        return this.dialog;
    }

    /**
     * Retourne l'id du dialog.
     * @returns Id du dialog
     */
    getId(): string {
        return this.dialog.id;
    }

    /**
     * Sélectionne le premier élément du dialog correspondant
     * au sélecteur CSS.
     *
     * @param selector Sélecteur CSS
     * @returns Premier élément correspondant au sélecteur
     */
    querySelector(selector: string): Element | null {
        return this.dialog.querySelector(selector);
    }

    /**
     * Sélectionne tous les éléments du dialog correspondant
     * au selecteur CSS.
     *
     * @param selector Sélecteur CSS
     * @returns Liste des élements correspondant au sélecteur
     */
    querySelectorAll(selector: string): NodeListOf<Element> {
        return this.dialog.querySelectorAll(selector);
    }

    /**
     * Ajoute une icône à un élément.
     * Par défaut, l'ajoute à l'icône du dialog.
     * Si aucune icône n'est fournie, cache l'élément si celui-ci
     * est l'icône du dialog.
     *
     * @param icon Icône à ajouter
     * @param element Élément auquel ajouter l'icône.
     * Par défaut, l'ajoute à l'icône du dialog.
     */
    setIcon(icon: string, element: Element = this.dialogIcon) {
        let classes;
        if (!icon && element === this.dialogIcon) {
            element.classList.add("fr-hidden");
        }

        // Retrait des classes
        this._removeClasses(element, remixIconPrefix);
        this._removeClasses(element, dsfrPrefix);

        switch (true) {
            // Icône DSFR
            case icon.startsWith(dsfrPrefix):
                classes = dsfrClasses.concat([icon]);
                element.classList.add(...classes);
                break;

            // Icône RemixIcon
            case icon.startsWith(remixIconPrefix):
                classes = remixIconClasses.concat([icon]);
                element.classList.add(...classes);
                break;
            default:
                element.className = icon;
        }
    }

    /**
     * Enlève les classes d'un élément commençant par un préfix.
     *
     * @param element Élément sur lequel enlever les classes
     * @param prefix Préfix de la classe à enlever
     */
    _removeClasses(element: Element, prefix: string) {
        if (!(element instanceof Element)) return;
        for (let i = element.classList.length - 1; i > 0; i--) {
            const c = element.classList[i];
            if (c?.startsWith(prefix)) {
                element.classList.remove(c);
            }
        }
    }

    /**
     * Fonction utilitaire pour paramétrer facilement le dialog.
     * Les sous-fonctions sont à développer.
     *
     * @param options Élements du dialog
     * @param options.title Titre
     * @param options.icon Icône
     * @param options.content Contenu du dialog.
     * Les interactions ne sont pas implémentées dans cette classe.
     * @param options.buttons Boutons à ajouter.
     */
    setContent(options: any) {
        this.setDialogTitle(options.title);
        this.setIcon(options.icon);
        this.setDialogContent(options.content);
        this.setButtons(options.buttons);
    }

    /**
     * Retourne le titre du dialog (contenu).
     * @returns Contenu du titre
     */
    getDialogTitle() {
        return this.dialogTitle ? this.dialogTitle.textContent : "";
    }

    /**
     * Ajoute un titre au dialog.
     * @param title Titre à remplacer
     */
    setDialogTitle(title: string) {
        if (this.dialogTitle) {
            this.dialogTitle.textContent = title;
        }
    }

    /**
     * Retourne le contenu du dialog.
     *
     * @returns Élément contenant le contenu du dialog
     */
    getDialogContent() {
        return this.dialogContent;
    }

    /**
     * Ajoute un contenu au dialog.
     *
     * @param content Contenu du dialog
     */
    setDialogContent(content: Element | string | null) {
        if (!this.dialogContent) return;

        this.dialogContent.innerHTML = "";

        if (typeof content === "string") {
            this.dialogContent.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            this.dialogContent.appendChild(content);
        }
    }

    /**
     * Ajoute un bouton au dialog.
     *
     * @param button Bouton à ajouter au dialog
     */
    addButton(button: DialogButton) {
        let buttonGroup = this.querySelector(this.selectors.BUTTON_GROUP);

        if (!buttonGroup) {
            return;
        }

        if (!button) {
            buttonGroup.replaceChildren();
        } else {
            const markup = ["button", "a"].includes(button.markup) ? button.markup : "button";
            const btn = document.createElement(markup);
            btn.type = button.type ? button.type : "button";
            btn.classList.add("fr-btn");

            for (const attr in button) {
                const value = button[attr];

                if (attr === "markup") continue;

                switch (attr) {
                    case "className":
                        (value || "").split(" ").forEach((v: any) => btn.classList.add(v));
                        break;

                    case "label":
                        btn.textContent = value || "";
                        break;

                    case "title":
                        btn.setAttribute("title", value);
                        btn.setAttribute("aria-label", value);
                        break;

                    case "kind":
                        if (Object.keys(buttonKind).includes(value.toString())) {
                            btn.classList.add(buttonKind[button.kind]);
                        }
                        break;

                    case "icon":
                        this.setIcon(button.icon, btn);
                        break;

                    case "callback":
                    case "click":
                        if (typeof value === "function") {
                            btn.addEventListener("click", value);
                        }
                        break;

                    case "close":
                        if (value) {
                            btn.setAttribute("aria-controls", this.getId());
                            btn.setAttribute("data-fr-opened", "false");
                        }
                        break;

                    default:
                        // Ajout d'autres attributs
                        btn.setAttribute(attr, value);
                        break;
                }
            }

            buttonGroup.appendChild(btn, this.querySelector(this.selectors.BUTTONS));
        }
    }

    /**
     * Ajoute des boutons au dialog.
     *
     * @param buttons Boutons à ajouter
     */
    setButtons(buttons: DialogButton[]) {
        if (Array.isArray(buttons)) {
            let buttonGroup = this.querySelector(this.selectors.BUTTON_GROUP);
            if (!buttonGroup) {
                return;
            }
            buttonGroup.replaceChildren();
            buttons.forEach((button) => {
                this.addButton(button);
            });
        } else {
            this.addButton(buttons);
        }
    }

    /**
     * Retourne les boutons du groupe de bouton.
     *
     * @returns Liste des boutons
     */
    getButtons(): NodeListOf<HTMLButtonElement> {
        return this.querySelectorAll(this.selectors.BUTTONS) as NodeListOf<HTMLButtonElement>;
    }

    /**
     * Retourne le bouton du groupe de bouton à un indice donné.
     *
     * @param index Indice du bouton
     * @returns Bouton à l'indice donné
     */
    getButton(index: number): HTMLButtonElement | null {
        let buttons = this.getButtons();
        return buttons.item(index);
    }

    /**
     * Méthode utilitaire pour récupérer le bouton de fermeture du
     * dialog
     *
     * @returns Bouton de fermeture du dialog
     */
    getCloseButton(): HTMLButtonElement {
        return this.querySelector(this.selectors.BTN_CLOSE) as HTMLButtonElement;
    }

    /**
     * Fonction de fermeture du dialog.
     * Peut-être override dans les sous-classes.
     *
     * @param dialog Dialogue à fermer
     */
    _close(dialog: any) {
        dialog.getDialog().close();
    }

    /**
     * Ferme le dialog en simulant un click sur le bouton de fermeture.
     * Envoie un événement de fermeture.
     *
     * @param self Dialogue à fermer
     *
     * @fires Dialog#dialog:close
     */
    close(self = this) {
        self._close(self);
        self.dispatchEvent(self.selectors.CLOSE_EVENT);
        self.setAction();
    }

    /**
     * Fonction d'ouverture du dialog.
     * Peut-être override dans les sous-classes.
     */
    _open() {
        this.dialog.show();
    }

    /**
     * Ouvre le dialog et envoie un événement sur le dialog.
     *
     * @fires Dialog#dialog:open
     */
    open() {
        this._open();
        this.dispatchEvent(this.selectors.OPEN_EVENT);
    }

    /**
     * Ajoute ou remplace la fonction lancée à l'ouverture
     * du dialog.
     *
     * @param onOpen Fonction à l'ouverture du dialog
     */
    setOnOpen(onOpen: any) {
        this.un(this.selectors.OPEN_EVENT, this.onOpenFn);
        if (typeof onOpen === "function") {
            this.onOpenFn = onOpen.bind(this);
            this.on(this.selectors.OPEN_EVENT, this.onOpenFn);
        }
    }

    /**
     * Ajoute ou remplace la fonction lancée à la fermeture
     * du dialog.
     *
     * @param onClose Fonction à la fermeture du dialog
     */
    setOnClose(onClose: any) {
        this.un([this.selectors.CLOSE_EVENT, this.selectors.CHANGE_CONTENT], this.onCloseFn);
        if (typeof onClose === "function") {
            this.onCloseFn = onClose.bind(this);
            this.on(this.selectors.CLOSE_EVENT, this.onCloseFn);
            this.on(this.selectors.CHANGE_CONTENT, this.onCloseFn);
        }
    }

    onOpen(callback: any, once: any) {
        if (once) {
            this.once(this.selectors.OPEN_EVENT, callback.bind(this));
        } else {
            this.on(this.selectors.OPEN_EVENT, callback.bind(this));
        }
    }

    onClose(callback: any, once: any) {
        if (once) {
            this.once(this.selectors.CLOSE_EVENT, callback.bind(this));
        } else {
            this.on(this.selectors.CLOSE_EVENT, callback.bind(this));
        }
    }

    /** Lie une action à une modale
     * @param action Action à lier
     * @param force Force l'ouverture de la modale même si l'action est déjà liée à un evenement
     */
    setAction(action: any, force: any) {
        if (this.action && action) {
            this.dispatchEvent(this.selectors.CHANGE_CONTENT);
        }
        this.action = action;
        if (action) {
            // Link dialog
            action.dialog = this;
            // Action id pour debuggage
            this.dialog.dataset.actionId = action.id;
            // Simule une fermeture du dialogue
            // Dialog content
            this.setContent({
                title: action.title,
                icon: action.icon,
                content: action.content,
                buttons: action.buttons,
                items: action.items,
            });
            this.setOnOpen(action.onOpen, force);
            this.setOnClose(action.onClose);
            this.open();
        }
    }
}

export default AbstractDialog;
