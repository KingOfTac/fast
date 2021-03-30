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
  return await fixture<FASTToolbar>("fast-toolbar");
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
