import { attr, FASTElement, observable, Observable } from "@microsoft/fast-element";
import { ArrowKeys, Direction, keyTab, Orientation } from "@microsoft/fast-web-utilities";
import { clamp } from "lodash-es";
import { isFocusable } from "tabbable";
import type { Anchor } from "../anchor/anchor";
import type { Button } from "../button/button";
import type { Combobox } from "../combobox/combobox";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { StartEnd } from "../patterns/start-end";
import type { TextArea } from "../text-area/text-area";
import type { TextField } from "../text-field/text-field";
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
     * The collection of focusable toolbar controls.
     *
     * @internal
     */
    private focusableElements: HTMLElement[];

    /**
     * The internal index of the currently focused element.
     *
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
        if (this.$fastController.isConnected) {
            this._activeIndex = clamp(value, 0, this.lastFocusableElementIndex);
            Observable.notify(this, "activeIndex");
        }
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
     * HTML Attribute: `orientation`
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
    public slottedItems: HTMLElement[];

    /**
     * Prepare the slotted elements which can be focusable.
     *
     * @param prev - The previous list of slotted elements.
     * @param next - The new list of slotted elements.
     * @internal
     */
    protected slottedItemsChanged(prev: unknown, next: HTMLElement[]): void {
        if (this.$fastController.isConnected) {
            this.setFocusableElements();
        }
    }

    /**
     * @internal
     */
    public connectedCallback() {
        super.connectedCallback();
        this.direction = getDirection(this);
    }

    /**
     * Determines a value that can be used to iterate a list with the arrow keys.
     *
     * @param this - An element with an orientation and direction
     * @param key - The event key value
     * @internal
     */
    private getDirectionalIncrementerForArrowKey = (key: ArrowKeys | string): number =>
        OrientationKeyMapping[this.orientation][key] *
            DirectionInverter[this.direction] || 0;

    /**
     * When the toolbar receives focus, set the currently active element as focused.
     *
     * @internal
     */
    public handleFocusin(e: FocusEvent): boolean | void {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget || this.contains(relatedTarget)) {
            return;
        }

        if (!e.defaultPrevented) {
            this.setFocusedElement();
        }
    }

    /**
     * Set the activeIndex when a focusable element in the toolbar is clicked.
     *
     * @internal
     */
    public handleClick(e: MouseEvent): boolean | void {
        const captured = e.target as HTMLElement;
        const activeIndex = this.focusableElements?.indexOf(captured);
        if (activeIndex > -1 && this.activeIndex !== activeIndex) {
            this.setFocusedElement(activeIndex);
        }

        return true;
    }

    /**
     * Handle keyboard events for the toolbar.
     *
     * @internal
     */
    public handleKeydown(e: KeyboardEvent): boolean | void {
        const key = e.key;

        if (e.shiftKey && key !== keyTab) {
            e.preventDefault();
        }

        if (!e.defaultPrevented && key in ArrowKeys) {
            const incrementer = this.getDirectionalIncrementerForArrowKey(key);
            if (incrementer !== 0) {
                this.setFocusedElement(this.activeIndex + incrementer);
            }
        }

        return true;
    }

    /**
     * Set the activeIndex and focus the corresponding control.
     *
     * @param activeIndex - The new index to set
     * @internal
     */
    private setFocusedElement(activeIndex: number = this.activeIndex): void {
        this.activeIndex = activeIndex;
        this.setFocusableElements();
        if (this.focusableElements[this.activeIndex]) {
            this.focusableElements[this.activeIndex].focus();
        }
    }

    private static reduceItems(
        elements: HTMLElement[],
        element: Anchor | Button | Combobox | TextArea | TextField
    ) {
        if (element.getAttribute("role") === "radiogroup") {
            return elements.concat(Array.from(element.querySelectorAll("[role=radio]")));
        }

        if (isFocusable(element) || (element.control && isFocusable(element.control))) {
            elements.push(element);
        }

        return elements;
    }

    /**
     * @internal
     */
    private setFocusableElements(): void {
        if (this.$fastController.isConnected) {
            this.focusableElements = this.slottedItems.reduce(Toolbar.reduceItems, []);
            if (this.focusableElements.length > 0) {
                this.focusableElements.forEach((element, index) => {
                    element.tabIndex = this.activeIndex === index ? 0 : -1;
                });
            }
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
