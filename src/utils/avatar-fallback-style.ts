const gradients = [
  "135deg,#f59e0b,#ef4444",
  "135deg,#06b6d4,#6366f1",
  "135deg,#10b981,#3b82f6",
  "135deg,#8b5cf6,#ec4899",
  "135deg,#f97316,#eab308",
  "135deg,#14b8a6,#6366f1",
];

export const avatarGradient = (name: string) => {
  const i =
    [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % gradients.length;
  return `linear-gradient(${gradients[i]})`;
};
