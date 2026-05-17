import { GoogleIcon } from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { ticketsPath } from "@/path";
import { useState } from "react";

const SignInProviderForm = () => {
  const [loadingProvider, setLoadingProvider] = useState<"google" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocialSignIn = async (provider: "google") => {
    setError(null);
    setLoadingProvider(provider);

    const { error } = await signIn.social({
      provider,
      callbackURL: ticketsPath(),
    });

    setLoadingProvider(null);

    if (error) setError(error.message || "Something went wrong.");
  };

  return (
    <div>
      <div className="w-full">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleSocialSignIn("google")}
          disabled={loadingProvider !== null}
        >
          {loadingProvider === "google" ? (
            <span className="mr-2 animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full align-middle" />
          ) : (
            <GoogleIcon width="0.98em" height="1em" />
          )}
          {loadingProvider === "google"
            ? "Signing in..."
            : "Sign in with Google"}
        </Button>
        {error && (
          <div role="alert" className="text-sm text-red-500 text-center mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInProviderForm;
