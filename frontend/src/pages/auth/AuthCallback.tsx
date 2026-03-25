import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { USER_ROLE } from "@/types/User";
import { setCredentials } from "@/store/auth/authSlice";
import { getSupabaseClient } from "@/lib/supabase";
import authService from "@/backend/auth.Service";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = getSupabaseClient();

        const authCode = searchParams.get("code");
        if (authCode) {
          const { error } =
            await supabase.auth.exchangeCodeForSession(authCode);
          if (error) {
            throw new Error(error.message);
          }
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          throw new Error(
            sessionError?.message || "Google authentication failed",
          );
        }

        const response = await authService.googleExchange(session.access_token);

        dispatch(
          setCredentials({
            token: response.data.token,
            userId: response.data.user.id,
            role: response.data.user.role,
            email: response.data.user.email,
            username: response.data.user.username,
          }),
        );

        toast.success(response.message || "Google login successful");

        if (response.data.user.role === USER_ROLE.ADMIN) {
          navigate("/admin", { replace: true, viewTransition: true });
          return;
        }

        navigate("/", { replace: true, viewTransition: true });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Google authentication failed";
        toast.error(errorMessage);
        navigate("/", { replace: true, viewTransition: true });
      }
    };

    void handleCallback();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="min-h-screen w-full bg-black text-secondary flex items-center justify-center">
      <p className="text-sm text-gray-300">Completing Google sign in...</p>
    </div>
  );
};

export default AuthCallback;
