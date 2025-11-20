import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface SignInPromptProps {
  action: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function SignInPrompt({ 
  action, 
  children, 
  onClick,
  className 
}: SignInPromptProps) {
  const { user } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      e.stopPropagation();
      setShowDialog(true);
    } else if (onClick) {
      onClick();
    }
  };

  const handleSignIn = () => {
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    navigate('/login');
  };

  return (
    <>
      <div onClick={handleClick} className={className} data-testid={`signin-prompt-${action.replace(/\s+/g, '-')}`}>
        {children}
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent data-testid="dialog-signin-required">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in to continue</AlertDialogTitle>
            <AlertDialogDescription>
              You need to sign in to {action} on this platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-signin">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignIn} data-testid="button-confirm-signin">
              Sign In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
