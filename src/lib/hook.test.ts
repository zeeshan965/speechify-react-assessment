import { beforeAll, beforeEach, describe, expect, test } from "vitest";

import { renderHook, act } from "@testing-library/react";

import {
  getElementBounds,
  getLineHeightOfFirstLine,
  isPointInsideElement,
  useHoveredParagraphCoordinate,
} from "./hook";
import { getTopLevelReadableElementsOnPage } from "./parser";

const testElement = document.createElement("div");

beforeAll(() => {
  window.document.body.append(testElement);
});

beforeEach(() => {
  testElement.innerHTML = "";
});

const getPointInsideElement = (element: HTMLElement) => {
  const boundsOfDiv = getElementBounds(element);
  return {
    x: boundsOfDiv.x + boundsOfDiv.width / 2,
    y: boundsOfDiv.y + boundsOfDiv.height / 2,
  };
};

const getPointOutsideElement = (element: HTMLElement) => {
  const boundsOfDiv = getElementBounds(element);
  return {
    x: boundsOfDiv.x - 1,
    y: boundsOfDiv.y - 1,
  };
};

describe("isPointInBounds", () => {
  test("Returns true if point is inside bounds", () => {
    testElement.innerHTML = `
    <div id="container"><blockquote>hello world</blockquote></div>
    `;

    const div = testElement.querySelector("#container")! as HTMLDivElement;
    const pointInside = getPointInsideElement(div);

    expect(isPointInsideElement(pointInside, div)).toBe(true);
  });

  test("Returns false if point is outside bounds", () => {
    testElement.innerHTML = `
    <div id="container"><blockquote>hello world</blockquote></div>
    `;

    const div = testElement.querySelector("#container")! as HTMLDivElement;
    const pointOutside = getPointOutsideElement(div);
    expect(isPointInsideElement(pointOutside, div)).toBe(false);
  });
});

describe("getLineHeightOfFirstLine", () => {
  test("Should return the correct word height for the element", () => {
    const styleForDiv = "margin: 0; padding: 0; line-height: 1;";
    const styleForSpan =
      "font-size: 20px; line-height: 1; margin: 0; padding: 0;";
    testElement.innerHTML = `
      <div id="container" style="${styleForDiv}"><span style="${styleForSpan}">hello world</span></div>
    `;
    const div = testElement.querySelector("#container")! as HTMLDivElement;
    expect(getLineHeightOfFirstLine(div)).toBe(20);
  });

  test("Should return correct word height for paragraph", () => {
    const styleForDiv =
      "margin: 0; padding: 0; line-height: 1; font-size:16px;";
    const styleForParagraph =
      "font-size: 32px; line-height: 1; margin: 0; padding: 0;";
    testElement.innerHTML = `
      <div id="container" style="${styleForDiv}">
        <p id="paragraph" style="${styleForParagraph}">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text
          ever since the 1500s, when an unknown printer took a galley of
          type and scrambled it to make a type specimen book. It has
          survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged. It was
          popularised in the 1960s with the release of Letraset sheets
          containing Lorem Ipsum passages, and more recently with desktop
          publishing software like <span style="font-size: 40px">Aldus PageMaker</span> including versions of
          Lorem Ipsum.
        </p>
      </div>
    `;
    const p = testElement.querySelector("#paragraph")! as HTMLParagraphElement;
    expect(getLineHeightOfFirstLine(p)).toBe(32);
  });
});

describe("useHoveredParagraphCoordinate Hook", () => {
  test("Returns null when no element is hovered", () => {
    testElement.innerHTML = `
    <div id="container"><blockquote>hello world</blockquote></div><p>some other text</p>
    `;

    const div = testElement.querySelector("#container")! as HTMLDivElement;
    const pointOutside = getPointOutsideElement(div);
    const { result } = renderHook(() =>
      useHoveredParagraphCoordinate(getTopLevelReadableElementsOnPage()),
    );
    act(() =>
      dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: pointOutside.x,
          clientY: pointOutside.y,
        }),
      ),
    );

    expect(result.current).toBe(null);
  });

  test("Returns the correct element when its hovered", () => {
    testElement.innerHTML = `
    <div id="container"><blockquote>hello world</blockquote></div><p>some other text</p>
    `;

    const div = testElement.querySelector("#container")! as HTMLDivElement;
    const pointInside = getPointInsideElement(div);
    const { result } = renderHook(() =>
      useHoveredParagraphCoordinate(getTopLevelReadableElementsOnPage()),
    );

    act(() =>
      dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: pointInside.x,
          clientY: pointInside.y,
        }),
      ),
    );

    expect(result.current?.element.isSameNode(div)).toBe(true);
  });

  test("Returns correct bounds of element when its hovered", () => {
    testElement.innerHTML = `
    <div id="container"><blockquote>hello world</blockquote></div><p>some other text</p>
    `;

    const div = testElement.querySelector("#container")! as HTMLDivElement;
    const boundsOfDiv = getElementBounds(div);
    const pointInside = getPointInsideElement(div);

    const { result } = renderHook(() =>
      useHoveredParagraphCoordinate(getTopLevelReadableElementsOnPage()),
    );

    act(() =>
      dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: pointInside.x,
          clientY: pointInside.y,
        }),
      ),
    );

    expect(result.current?.top).toBe(boundsOfDiv.top);
    expect(result.current?.left).toBe(boundsOfDiv.left);
    expect(result.current?.heightOfFirstLine).toBe(
      getLineHeightOfFirstLine(div),
    );
  });
});
