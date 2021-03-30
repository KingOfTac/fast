import { attr, FASTElement, observable, Observable } from "@microsoft/fast-element";
import { ArrowKeys, Direction, Orientation } from "@microsoft/fast-web-utilities";
import { clamp } from "lodash-es";
import { isFocusable } from "tabbable";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { getDirection } from "../utilities/direction";
import { DirectionInverter, OrientationKeyMapping } from "./toolbar.options";

/**
 * A Tree view Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria-practices/#Toolbar|ARIA Toolbar}.
 *
 * @public
 */
export class Toolbar extends FASTElement {
    /**
     * The text direction of the toolbar.
     *
     * @internal
     */
    @observable
    public direction: Direction = Direction.ltr;

    /**
     * The disabled state of the toolbar.
     *
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr
    public disabled: boolean;

    /**
     * The collection of focusable toolbar controls.
     *
     * @internal
     */
    private focusableElements: Array<HTMLElement | SVGElement>;

    /**
     * @internal
     */
    private _activeIndex: number = 0;

    /**
     * The index of the currently focused element, clamped between 0 and the last element.
     *
     * @internal
     */
    get activeIndex(): number {
        Observable.track(this, "activeIndex");
        return this._activeIndex;
    }

    set activeIndex(value: number) {
        this._activeIndex = clamp(value, 0, this.lastFocusableElementIndex);
        Observable.notify(this, "activeIndex");

        this.setFocusableElements();
    }

    /**
     * Returns the index of the last focusable element.
     *
     * @internal
     */
    private get lastFocusableElementIndex(): number {
        return this.focusableElements.length - 1;
    }

    /**
     * The orientation of the toolbar.
     *
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    @attr
    public orientation: Orientation = Orientation.horizontal;

    /**
     * The elements in the label slot.
     *
     * @internal
     */
    @observable
    public slottedLabel: HTMLElement[];

    /**
     * The elements in the default slot.
     *
     * @internal
     */
    @observable
    public slottedToolbarItems: HTMLElement[];

    /**
     * Prepare the slotted elements which can be focusable.
     *
     * @param prev - The previous list of slotted elements.
     * @param next - The new list of slotted elements.
     */
    protected slottedToolbarItemsChanged(prev: unknown, next: HTMLElement[]): void {
        this.focusableElements = next.filter(n => isFocusable(n));
        this.setFocusableElements();
    }

    /**
     * @internal
     */
    public connectedCallback() {
        super.connectedCallback();
        this.direction = getDirection(this);
        this._activeIndex = 0;
    }

    /**
     * Determines a value that can be used to iterate a list with the arrow keys.
     *
     * @param this - An element with an orientation and direction
     * @param key - The event key value
     * @internal
     */
    private getDirectionalIncrementerForArrowKey = (key: ArrowKeys): number =>
        OrientationKeyMapping[this.orientation][key] *
            DirectionInverter[this.direction] || 0;

    /**
     * @internal
     */
    public handleFocusin(e: FocusEvent): boolean | void {
        const relatedTarget = e.relatedTarget as HTMLElement;

        if (!relatedTarget || this.isSameNode(relatedTarget)) {
            return;
        }

        if (!e.defaultPrevented) {
            this.setFocusedElement();
        }

        return true;
    }

    /**
     *
     * @internal
     */
    public handleClick(e: MouseEvent): boolean | void {
        this.setFocusedElement(this.focusableElements.indexOf(e.target as HTMLElement));

        return true;
    }

    /**
     * @internal
     */
    public handleKeydown(e: KeyboardEvent): boolean | void {
        const key = e.key;

        if (
            key in ArrowKeys &&
            !e.defaultPrevented &&
            this.contains(document.activeElement)
        ) {
            const incrementer = this.getDirectionalIncrementerForArrowKey(
                key as ArrowKeys
            );

            if (incrementer !== 0) {
                this.setFocusedElement(this.activeIndex + incrementer);
            }
        }

        return true;
    }

    /**
     * @internal
     */
    private setFocusedElement(activeIndex: number = this.activeIndex) {
        this.activeIndex = activeIndex;
        if (this.focusableElements[this.activeIndex]) {
            this.focusableElements[this.activeIndex].focus();
        }
    }

    /**
     * @internal
     */
    private setFocusableElements() {
        if (this.focusableElements.length) {
            this.focusableElements.forEach(f => (f.tabIndex = -1));
            this.focusableElements[this.activeIndex].tabIndex = 0;
        }
    }
}

/**
 * Includes ARIA states and properties relating to the ARIA toolbar role
 *
 * @public
 */
export class DelegatesARIAToolbar {
    /**
     * The id of the element labeling the toolbar.
     * @public
     * @remarks
     * HTML Attribute: aria-labelledby
     */
    @attr({ attribute: "aria-labelledby" })
    public ariaLabelledby: string;

    /**
     * The label surfaced to assistive technologies.
     *
     * @public
     * @remarks
     * HTML Attribute: aria-label
     */
    @attr({ attribute: "aria-label" })
    public ariaLabel: string;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface DelegatesARIAToolbar extends ARIAGlobalStatesAndProperties {}
applyMixins(DelegatesARIAToolbar, ARIAGlobalStatesAndProperties);

/**
 * @internal
 */
export interface Toolbar extends StartEnd, DelegatesARIAToolbar {}
applyMixins(Toolbar, StartEnd, DelegatesARIAToolbar);
