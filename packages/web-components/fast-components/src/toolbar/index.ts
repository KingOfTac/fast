import { customElement } from "@microsoft/fast-element";
import { Toolbar, ToolbarTemplate } from "@microsoft/fast-foundation";
import { ToolbarStyles } from "./toolbar.styles";

@customElement({
    name: "fast-toolbar",
    template: ToolbarTemplate,
    styles: ToolbarStyles,
})
export class FASTToolbar extends Toolbar {}

export { ToolbarStyles };
