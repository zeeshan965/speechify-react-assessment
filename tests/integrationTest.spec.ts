import { expect, test } from "@playwright/test";

const playwrightServerUrl = "http://localhost:4242";

const PARAGRAPH_ID = "#paragraph-lorem-ipsum";

test("Should render hover player element when user hovers over a paragraph element", async ({
  page,
}) => {
  await page.goto(playwrightServerUrl);
  await page.hover("blockquote");
  const hoverPlayer = await page.$("#hover-player");
  expect(hoverPlayer).not.toBeNull();
});

test("Should not render hover player element when user hovers over a non-paragraph element", async ({
  page,
}) => {
  await page.goto(playwrightServerUrl);
  await page.hover("h1");
  const hoverPlayer = await page.$("#hover-player");
  expect(hoverPlayer).toBeNull();
});

test("Should not render hover player element when user is not hovering over any elements", async ({
  page,
}) => {
  await page.goto(playwrightServerUrl);
  const hoverPlayer = await page.$("#hover-player");
  expect(hoverPlayer).toBeNull();
});

test("Should not mutate the DOM to render the hover player", async ({
  page,
}) => {
  await page.goto(playwrightServerUrl);
  const initialHtml = await page.innerHTML(PARAGRAPH_ID);
  await page.hover(PARAGRAPH_ID);
  const finalHtml = await page.innerHTML(PARAGRAPH_ID);
  expect(initialHtml).toBe(finalHtml);
});

test("Should render a play svg icon close to the first word of paragraph when hovered", async ({
  page,
}) => {
  await page.goto(playwrightServerUrl);
  await page.hover(PARAGRAPH_ID);
  const svgHeight = await page.$eval(PARAGRAPH_ID, (el) => {
    const { x, y } = el.getBoundingClientRect();
    const elements = document.elementsFromPoint(
      window.scrollX + x,
      window.scrollY + y,
    );
    const elementsContainingSvg = elements.filter((el) =>
      el.querySelector("svg#play-icon") ? true : false,
    );
    if (elementsContainingSvg.length === 0) return 0;
    const svgElement = elementsContainingSvg[0].querySelector("svg#play-icon");
    return svgElement!.clientHeight;
  });
  expect(svgHeight).toBeGreaterThan(0);
});
