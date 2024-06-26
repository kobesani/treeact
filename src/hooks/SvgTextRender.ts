export interface LongestSvgTextProps {
  textsToRender: string[];
  fontSize: number;
}

export const useLongestSvgText = ({
  textsToRender,
  fontSize,
}: LongestSvgTextProps) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.position = "absolute";
  svg.style.visibility = "hidden";

  document.body.appendChild(svg);

  const maxLength = Math.max(
    ...textsToRender.map((text) => {
      const textElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      textElement.textContent = text;
      textElement.setAttribute("font-size", fontSize.toString());

      svg.appendChild(textElement);

      return textElement.getComputedTextLength();
    })
  );

  document.body.removeChild(svg);

  return maxLength;
};
