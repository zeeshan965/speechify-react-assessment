// This is a simple play button SVG that you can use in your hover player
import {useRef} from "react";
import {useHoveredParagraphCoordinate} from "./hook.ts";
import {getTopLevelReadableElementsOnPage} from "./parser.ts";

const PlayButton = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    id="play-button"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      cursor: "pointer",
      background: "#6B78FC",
      borderRadius: "50%",
    }}
    {...props}
  >
    <path
      d="M16.3711 11.3506C16.8711 11.6393 16.8711 12.361 16.3711 12.6497L10.3711 16.1138C9.87109 16.4024 9.24609 16.0416 9.24609 15.4642L9.24609 8.53603C9.24609 7.95868 9.87109 7.59784 10.3711 7.88651L16.3711 11.3506Z"
      fill="white"
    />
  </svg>
);

/**
 * **TBD:**
 * Implement a hover player that appears next to the paragraph when the user hovers over it
 * The hover player should contain a play button that when clicked, should play the text of the paragraph
 * This component should make use of the useHoveredParagraphCoordinate hook to get information about the hovered paragraph
 */
export default function HoverPlayer() {
    const parsedElements = getTopLevelReadableElementsOnPage();
    const hoveredParagraph = useHoveredParagraphCoordinate(parsedElements);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlayText = () => {
        if (hoveredParagraph?.element) {
            const text = hoveredParagraph.element.innerText;
            const utterance = new SpeechSynthesisUtterance(text);
            console.log(utterance)
            window.speechSynthesis.speak(utterance);
        }
    };

    if (!hoveredParagraph) {
        return null;
    }

    const { top, left, heightOfFirstLine } = hoveredParagraph;

    return (
        <div
            style={{
                position: 'absolute',
                top: `${top - 12}px`,
                left: `${left - 10}px`, // Adjust position as needed
                transform: `translateY(${heightOfFirstLine / 2}px)`,
                zIndex: 1000,
            }}
        >
            <PlayButton onClick={handlePlayText} />
        </div>
    );

}
