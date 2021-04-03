import { customElement } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { expect } from "chai";
import { fixture } from "../fixture";
import { Toolbar, ToolbarTemplate } from "./index";

@customElement({
  name: "fast-toolbar",
  template: ToolbarTemplate,
})
class FASTToolbar extends Toolbar {}

async function setup() {
  const { element, connect, disconnect, parent } = await fixture<FASTToolbar>(
    "fast-toolbar"
  );
  return { element, connect, disconnect, document, parent };
}

describe("Toolbar", () => {
  it("should have a role of `toolbar`", async () => {
    const { element, connect, disconnect } = await setup();

    await connect();

    expect(element.getAttribute("role")).to.equal("toolbar");

    await disconnect();
  });

  it("should have a default orientation of `horizontal`", async () => {
    const { element, connect, disconnect } = await setup();

    await connect();

    expect(element.getAttribute("orientation")).to.equal(Orientation.horizontal);

    await disconnect();
  });
});
