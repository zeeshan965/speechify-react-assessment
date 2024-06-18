/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * Checks if a point is inside an element
 */
export function isPointInsideElement(
    coordinate: { x: number; y: number },
    element: HTMLElement
): boolean {
  const bounds = getElementBounds(element);
  return (
      coordinate.x >= bounds.left &&
      coordinate.x <= bounds.left + bounds.width &&
      coordinate.y >= bounds.top &&
      coordinate.y <= bounds.top + bounds.height
  );
}

/**
 * Returns the height of the first line of text in an element
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  const computedStyle = window.getComputedStyle(element);
  const lineHeight = parseFloat(computedStyle.lineHeight);

  // If line-height is 'normal', calculate it manually
  if (isNaN(lineHeight)) {
    const fontSize = parseFloat(computedStyle.fontSize);
    return fontSize * 1.2; // A common heuristic for normal line height
  }

  return lineHeight;
}

export type HoveredElementInfo = {
  element: HTMLElement;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */
import { useState, useEffect } from 'react';

export function useHoveredParagraphCoordinate(
    parsedElements: HTMLElement[]
): HoveredElementInfo | null {
  const [hoveredElement, setHoveredElement] = useState<HoveredElementInfo | null>(null);

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      const { clientX, clientY } = event;
      const hovered = parsedElements.find((element) =>
          isPointInsideElement({ x: clientX, y: clientY }, element)
      );

      if (hovered) {
        const bounds = getElementBounds(hovered);
        const heightOfFirstLine = getLineHeightOfFirstLine(hovered);

        setHoveredElement({
          element: hovered,
          top: bounds.top,
          left: bounds.left,
          heightOfFirstLine,
        });
      } else {
        setHoveredElement(null);
      }
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [parsedElements]);

  return hoveredElement;
}
