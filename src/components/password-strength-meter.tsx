import { useEffect, useState } from "react";
import zxcvbn from "zxcvbn";

type PasswordStrengthMeterProps = {
  password: string;
};

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const [strength, setStrength] = useState<{
    score: number;
    feedback: { suggestions: string[] };
  } | null>(null);

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setStrength(result);
    } else {
      setStrength(null);
    }
  }, [password]);

  if (!strength) return null;

  const { score, feedback } = strength;
  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const label = labels[score];

  const colors = ["#dc2626", "#fb923c", "#facc15", "#86efac", "#22c55e"];
  const color = colors[score];

  const widthPercentage = ((score + 1) / 5) * 100;

  return (
    <div className="mt-3">
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300 ease-in-out rounded-full"
          style={{
            width: `${widthPercentage}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Strength Label */}
      <div className="text-sm font-semibold mt-2" style={{ color }}>
        Password Strength: {label}
      </div>

      {/* Suggestions */}
      {feedback && feedback.suggestions.length > 0 && (
        <ul className="text-xs text-gray-600 mt-2 pl-5 list-disc space-y-1">
          {feedback.suggestions.map((suggestion: string, index: number) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
