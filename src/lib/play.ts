function getWordRange(element: Element, charIndex: number, charLength: number) {
  const range = document.createRange();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
  let currentLength = 0;
  let foundStart = false;
  let foundEnd = false;

  while (walker.nextNode()) {
    const textNode = walker.currentNode;
    const textLength = (textNode.textContent || "").length;

    if (!foundStart && currentLength + textLength >= charIndex) {
      range.setStart(textNode, charIndex - currentLength);
      foundStart = true;
    }

    if (foundStart && currentLength + textLength >= charIndex + charLength) {
      range.setEnd(textNode, charIndex + charLength - currentLength);
      foundEnd = true;
      break;
    }

    currentLength += textLength;
  }

  return range;
}

export function speechify(element: HTMLElement) {
  const speechSynthesis = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(element.textContent || "");

  speechSynthesis.cancel();
  CSS.highlights.clear();

  utterance.onboundary = (event) => {
    const startIndex = event.charIndex;
    const endIndex = event.charIndex + event.charLength;
    const wordRange = getWordRange(element, startIndex, endIndex - startIndex);
    const highlight = new Highlight(wordRange);
    CSS.highlights.set("speechify-word-highlight", highlight);
  };

  utterance.onend = () => {
    CSS.highlights.clear();
  };

  const wholeElementRange = document.createRange();
  wholeElementRange.selectNode(element);
  const highlight = new Highlight(wholeElementRange);
  CSS.highlights.set("speechify-paragraph-highlight", highlight);

  speechSynthesis.speak(utterance);
}
