/**
 * List of HTML tags that we want to ignore when finding the top level readable elements
 * These elements should not be chosen while rendering the hover player
 */
const IGNORE_LIST = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "BUTTON",
  "LABEL",
  "SPAN",
  "IMG",
  "PRE",
  "SCRIPT",
];

/**
 * @param {HTMLElement} element
 */
const hasNonEmptyTextNode = (element: HTMLElement): boolean => {
  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim() !== '') {
      return true;
    }
  }
  return false;
};

/**
 * @param {HTMLElement} element
 */
const isIgnoredElement = (element: HTMLElement): boolean => {
  return IGNORE_LIST.includes(element.tagName.toUpperCase());
}

/**
 * @param {HTMLElement} element
 */
const isOnlyChild = (element: HTMLElement): boolean => {
  const parent = element.parentElement;
  return parent && parent.children.length === 1;
};

/**
 *  **TBD:** Implement a function that returns all the top level readable elements on the page, keeping in mind the ignore list.
 *  A top level readable element is defined as follows:
 *    - The text node contained in the element should not be empty
 *    - The element should not be in the ignore list
 *    - The element should not be a child of another element that has only one child.
 *      For example: <div><blockquote>Some text here</blockquote></div>. div is the top level readable element and not blockquote
 */
export function getTopLevelReadableElementsOnPage(): HTMLElement[] {
  const allElements: HTMLCollectionOf<Element> = document.body.getElementsByTagName('*');
  const topLevelElements: HTMLElement[] = [];

  for (const element: HTMLElement of allElements) {
    if (
        hasNonEmptyTextNode(element) &&
        !isIgnoredElement(element)
    ) {
      if (isOnlyChild(element) && element.parentElement) {
        if (!isIgnoredElement(element.parentElement) && !topLevelElements.includes(element.parentElement)) {
          topLevelElements.push(element.parentElement);
        }
      } else {
        topLevelElements.push(element);
      }
    }
  }

  return topLevelElements;
}
