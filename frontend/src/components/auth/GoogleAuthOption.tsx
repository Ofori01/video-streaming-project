import { getSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type GoogleAuthOptionProps = {
  mode: "signin" | "signup";
};

const modeLabelMap: Record<GoogleAuthOptionProps["mode"], string> = {
  signin: "or sign in with",
  signup: "or sign up with",
};

export default function GoogleAuthOption({ mode }: GoogleAuthOptionProps) {
  const onGoogleAuth = async () => {
    try {
      const supabase = getSupabaseClient();
      const redirectTo = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to start Google auth",
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          {modeLabelMap[mode]}
        </span>
        <Separator className="flex-1" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-11"
        onClick={onGoogleAuth}
        aria-label={
          mode === "signin" ? "Sign in with Google" : "Sign up with Google"
        }
      >
        <img src="/google_logo.png" alt="Google"  className="w-5 h-5" />
      </Button>
    </div>
  );
}
