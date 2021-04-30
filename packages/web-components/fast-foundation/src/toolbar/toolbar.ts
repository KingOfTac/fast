import { attr, FASTElement, observable, Observable } from "@microsoft/fast-element";
import { ArrowKeys, Direction, Orientation } from "@microsoft/fast-web-utilities";
import { clamp } from "lodash-es";
import { isFocusable } from "tabbable";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { getDirection } from "../utilities/direction";
import { OrientationKeyMapping } from "./toolbar.options";
import type { DirectionalIncrement, Increment } from "./toolbar.options";

/**
 * A Tree view Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria-practices/#Toolbar|ARIA Toolbar}.
 *
 * @public
 */
export class Toolbar extends FASTElement {
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
            this.focusableElements = this.slottedItems.reduce(
                Toolbar.reduceFocusableItems,
                []
            );
            this.setFocusableElements();
        }
    }

    /**
     * The elements in the label slot.
     *
     * @internal
     */
    @observable
    public slottedLabel: HTMLElement[];

    /**
     * Set the activeIndex when a focusable element in the toolbar is clicked.
     *
     * @internal
     */
    public clickHandler(e: MouseEvent): boolean | void {
        const activeIndex = this.focusableElements?.indexOf(e.target as HTMLElement);
        if (activeIndex > -1 && this.activeIndex !== activeIndex) {
            this.setFocusedElement(activeIndex);
        }

        return true;
    }

    /**
     * @internal
     */
    public connectedCallback() {
        super.connectedCallback();
        this.direction = getDirection(this);
    }

    /**
     * When the toolbar receives focus, set the currently active element as focused.
     *
     * @internal
     */
    public focusinHandler(e: FocusEvent): boolean | void {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget || this.contains(relatedTarget)) {
            return;
        }

        this.setFocusedElement();
    }

    /**
     * Determines a value that can be used to iterate a list with the arrow keys.
     *
     * @param this - An element with an orientation and direction
     * @param key - The event key value
     * @internal
     */
    private getDirectionalIncrementer(key: ArrowKeys | string): number {
        const keyMap: DirectionalIncrement | Increment =
            OrientationKeyMapping[key][this.orientation] ?? 0;
        return keyMap?.[this.direction] ?? keyMap;
    }

    /**
     * Handle keyboard events for the toolbar.
     *
     * @internal
     */
    public keydownHandler(e: KeyboardEvent): boolean | void {
        const key = e.key;

        if (!(key in ArrowKeys) || e.defaultPrevented || e.shiftKey) {
            return true;
        }

        const incrementer = this.getDirectionalIncrementer(key);
        if (!incrementer) {
            return !(e.target as HTMLElement).closest("[role=radiogroup]");
        }

        const nextIndex = this.activeIndex + incrementer;
        if (this.focusableElements[nextIndex]) {
            e.preventDefault();
        }

        this.setFocusedElement(nextIndex);

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
        this.focusableElements[this.activeIndex]?.focus();
    }

    /**
     * Reduce a collection to only its focusable elements.
     *
     * @param elements - Collection of elements to reduce
     * @param element - The current element
     *
     * @internal
     */
    private static reduceFocusableItems(elements: HTMLElement[], element: HTMLElement) {
        const isRoleRadio = element.getAttribute("role") === "radio";
        const hasFocusableShadow =
            element.shadowRoot &&
            Array.from(element.shadowRoot.querySelectorAll("*")).some(isFocusable);

        if (isFocusable(element) || isRoleRadio || hasFocusableShadow) {
            elements.push(element);
            return elements;
        }

        if (element.childElementCount) {
            return elements.concat(
                Array.from(element.children).reduce(Toolbar.reduceFocusableItems, [])
            );
        }

        return elements;
    }

    /**
     * @internal
     */
    private setFocusableElements(): void {
        if (this.$fastController.isConnected && this.focusableElements.length > 0) {
            this.focusableElements.forEach((element, index) => {
                element.tabIndex = this.activeIndex === index ? 0 : -1;
            });
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
