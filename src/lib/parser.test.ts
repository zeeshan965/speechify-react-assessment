import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest';

import { getTopLevelReadableElementsOnPage } from './parser';

const testElement = document.createElement("div");

beforeAll(() => {
  window.document.body.append(testElement);
});

beforeEach(() => {
  testElement.innerHTML = "";
});

describe("getTopLevelReadableElementsOnPage", () => {
  test("should return top level element where the descendant is a text node", () => {
    testElement.innerHTML = `
            <div><blockquote>hello world</blockquote></div>
        `;
    const paragraphs = getTopLevelReadableElementsOnPage();
    expect(paragraphs.length).toBe(1);
    expect(paragraphs[0]).toBeExpectedElement({
      tagName: "DIV",
      textContent: "hello world",
    });
  });

  test("should return top level element where the only descendant is a paragraph element", () => {
    testElement.innerHTML = `
          <article>
            <blockquote>
              <div>
                  <p>hello world</p>
              </div>
            </blockquote>
          </article>
          <div>
              <p>paragraph 2</p>
              <p>paragraph 3</p>
          </div>
      `;
    const paragraphs = getTopLevelReadableElementsOnPage();
    expect(paragraphs.length).toBe(3);
    expect(paragraphs[0]).toBeExpectedElement({
      tagName: "ARTICLE",
      textContent: "hello world",
    });
    expect(paragraphs[1]).toBeExpectedElement({
      tagName: "P",
      textContent: "paragraph 2",
    });
    expect(paragraphs[2]).toBeExpectedElement({
      tagName: "P",
      textContent: "paragraph 3",
    });
  });

  test("should not include any elements inside blocklist", () => {
    testElement.innerHTML = `
    <script>console.log("Speechify!")</script>
    <img src="https://example.com/image.jpg" alt="image" />
    <button><span>Purchase</span> Speechify premium subscription today!</button>
    <div>
        <h1>heading 1</h1>
        <p>Paragraph 1</p>
        <h2>heading 2</h2>
        <p>Paragraph 2</p>
        <h3>heading 3</h3>
        <p>Paragraph 3</p>
        <h4>heading 4</h4>
        <p>Paragraph 4</p>
        <h5>heading 5</h5>
        <p>Paragraph 5</p>
        <h6>heading 6</h6>
        <p>Paragraph 6</p>
    </div>
      `;
    const paragraphs = getTopLevelReadableElementsOnPage();
    expect(paragraphs.length).toBe(6);
    expect(paragraphs).toBeExpectedElements([
      {tagName: "P", textContent: "Paragraph 1"},
      {tagName: "P", textContent: "Paragraph 2"},
      {tagName: "P", textContent: "Paragraph 3"},
      {tagName: "P", textContent: "Paragraph 4"},
      {tagName: "P", textContent: "Paragraph 5"},
      {tagName: "P", textContent: "Paragraph 6"},
    ]);
  });

  test("should ignore empty text nodes", () => {
    testElement.innerHTML = `
      <p></p>
    `;
    const paragraphs = getTopLevelReadableElementsOnPage();
    expect(paragraphs.length).toBe(0);
  });
});
