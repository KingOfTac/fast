import { css, ElementStyles } from "@microsoft/fast-element";
import { display, focusVisible } from "@microsoft/fast-foundation";
import {
    neutralFillCardRestBehavior,
    neutralOutlineFocusBehavior,
} from "../styles/recipes";

/**
 * Styles for the {@link (FASTToolbar:class)|FASTToolbar component}.
 *
 * @public
 */
export const ToolbarStyles: ElementStyles = css`
    ${display("inline-flex")} :host {
        --grid-gap: calc((var(--design-unit) + calc(var(--density) + 2)) * 1px);
        align-items: center;
        background-color: ${neutralFillCardRestBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        grid-gap: var(--grid-gap);
        padding: var(--grid-gap);
    }

    :host(:focus-within),
    :host(${focusVisible}) {
        outline: calc(var(--outline-width) * 1px) solid ${neutralOutlineFocusBehavior.var};
    }

    :host *:focus {
        outline: 1px solid #f0f;
    }

    :host([orientation="vertical"]) ::slotted(:not([slot])) {
        margin: var(--grid-gap) 0;
    }

    ::slotted(:not([slot])) {
        margin: 0 var(--grid-gap);
    }

    .positioning-region {
        display: flex;
        flex-flow: row wrap;
    }

    :host([orientation="vertical"]) .positioning-region {
        flex-direction: column;
    }
`.withBehaviors(neutralFillCardRestBehavior, neutralOutlineFocusBehavior);
