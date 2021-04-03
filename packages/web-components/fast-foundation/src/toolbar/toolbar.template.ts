import { elements, html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { Toolbar } from "./toolbar";

/**
 * The template for the {@link @microsoft/fast-foundation#(Toolbar:class)} component.
 *
 * @public
 */
export const ToolbarTemplate: ViewTemplate<Toolbar> = html`
    <template
        aria-label="${x => x.ariaLabel}"
        aria-labelledby="${x => x.ariaLabelledby}"
        aria-orientation="${x => x.orientation}"
        orientation="${x => x.orientation}"
        role="toolbar"
        @click="${(x, c) => x.handleClick(c.event as MouseEvent)}"
        @focusin="${(x, c) => x.handleFocusin(c.event as FocusEvent)}"
        @keydown="${(x, c) => x.handleKeydown(c.event as KeyboardEvent)}"
    >
        <slot name="label"></slot>
        <div class="positioning-region" part="positioning-region">
            <slot
                ${slotted({
                    filter: elements(),
                    property: "slottedItems",
                })}
            ></slot>
        </div>
    </template>
`;
