import type { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { Orientation } from "@microsoft/fast-web-utilities";

export const fastToolbarDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-toolbar",
            title: "Toolbar",
            description: "The FAST Toolbar element",
            attributes: [
                {
                    name: "orientation",
                    title: "Orientation",
                    description: "The visual orientation of the toolbar",
                    default: Orientation.horizontal,
                    values: Object.values(Orientation).map(o => ({ name: o })),
                    required: false,
                    type: DataType.string,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The toolbar content",
                },
                {
                    name: "label",
                    title: "Default slot",
                    description: "The toolbar content",
                },
            ],
        },
    ],
};
