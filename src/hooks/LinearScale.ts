interface LinearScaleProps {
  domain: [number, number];
  range: [number, number];
}

export const useLinearScale = ({
  domain,
  range,
}: LinearScaleProps): ((n: number) => number) => {
  return (n: number) =>
    range[0] + ((range[1] - range[0]) / (domain[1] - domain[0])) * (n - domain[0]);
};