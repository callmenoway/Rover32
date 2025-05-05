'use client';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import GoogleButton from '../buttons/GoogleButton';
import GithubButton from '../buttons/GithubButton';
import DiscordButton from '../buttons/DiscordButton';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { toast } from "sonner"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from "@/src/components/ui/navigation-menu";
import { useState, useRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

// Your Cloudflare Turnstile site key (replace with your actual key)
const TURNSTILE_SITE_KEY = '0x4AAAAAABaVTxn_QOkTDwiB';

//? Schema di validazione per il form di login
const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have at least 8 characters'),
  captchaToken: z.string().min(1, 'Please complete the CAPTCHA verification')
});

//? Componente principale del form di login
export function SignInForm() {
  const router = useRouter();
  const [isThirdPartyLogin, setIsThirdPartyLogin] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const turnstileRef = useRef(null);

  //? Configurazione del form con react-hook-form e validazione zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      captchaToken: '',
    }
  });

  // Handle Turnstile CAPTCHA verification
  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    setValue('captchaToken', token);
    clearErrors('captchaToken');
  };

  // Handle Turnstile CAPTCHA expiration
  const handleCaptchaExpire = () => {
    setCaptchaToken('');
    setValue('captchaToken', '');
    setError('captchaToken', { 
      type: 'manual', 
      message: 'CAPTCHA has expired, please verify again' 
    });
  };

  const handleOAuthSignIn = (provider: string) => {
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA verification first");
      return;
    }
    
    // Clear any existing form errors
    clearErrors();
    setIsThirdPartyLogin(true);
    
    // Sign in with the provider
    signIn(provider, { callbackUrl: '/vehicles' });
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    //? Evita l'invio se è in corso un login con provider terzo
    if (isThirdPartyLogin) return;
    
    try {
      // Include the CAPTCHA token in the sign-in data
      const signInData = await signIn('credentials', {
        email: data.email,
        password: data.password,
        captchaToken: data.captchaToken,
        redirect: false,
      });

      if (signInData?.error) {
        toast.error(signInData.error);
        setValue('password', '');
        
        // Reset the CAPTCHA if there's an error
        if (turnstileRef.current) {
          // @ts-expect-error - The type definition doesn't include reset method
          turnstileRef.current.reset();
        }
      } else {
        //? Login riuscito, reindirizza alla dashboard
        toast.success('Login successful! Redirecting...');
        router.push('/vehicles');
      }
    } catch (error) {
      //! Gestione degli errori inaspettati
      console.error("Unexpected error:", error);
      toast.error('Unexpected error, try again.');
      
      // Reset the CAPTCHA on error
      if (turnstileRef.current) {
        // @ts-expect-error - The type definition doesn't include reset method
        turnstileRef.current.reset();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 relative">
      <video
        id="background-video"
        loop
        autoPlay
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        <source src="/muci.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <nav className="w-full fixed top-0 left-0 z-20 shadow-md" style={{ backgroundColor: 'transparent' }}>
        <div className="container mx-auto flex justify-between items-center px-4 py-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" className={navigationMenuTriggerStyle()}>
                  Home
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      <Card className="w-full max-w-md z-10">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Add noValidate to prevent browser validation */}
            <div>
              <Input placeholder="Email" {...register('email')} disabled={isThirdPartyLogin} />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Password"
                type="password"
                {...register('password')}
                disabled={isThirdPartyLogin}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Cloudflare Turnstile CAPTCHA */}
            <div className="flex justify-center my-4">
              <Turnstile
                ref={turnstileRef}
                siteKey={TURNSTILE_SITE_KEY}
                onSuccess={handleCaptchaVerify}
                onExpire={handleCaptchaExpire}
              />
            </div>
            {errors.captchaToken && (
              <p className="text-sm text-red-500 mt-1 text-center">{errors.captchaToken.message}</p>
            )}

            <Button className="w-full mt-2" type="submit" disabled={isThirdPartyLogin || !captchaToken}>
              Sign in
            </Button>

            <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
              or
            </div>
          </form>
          
          {/* Move OAuth buttons outside the form */}
          <div className="flex flex-col space-y-2 mt-4">
            <GoogleButton 
              onClick={() => handleOAuthSignIn('google')}
            >
              Sign in with Google
            </GoogleButton>
            <GithubButton 
              onClick={() => handleOAuthSignIn('github')}
            >
              Sign in with GitHub
            </GithubButton>
            <DiscordButton 
              onClick={() => handleOAuthSignIn('discord')}
            >
              Sign in with Discord
            </DiscordButton>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link href="/sign-up" className="text-blue-500 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}