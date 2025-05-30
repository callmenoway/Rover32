'use client';

//? Import dei moduli e delle dipendenze necessarie
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

//! Chiave pubblica per Cloudflare Turnstile
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string;

//? Schema di validazione per il form di login usando Zod
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
  const router = useRouter(); //? Hook per la navigazione
  const [isThirdPartyLogin, setIsThirdPartyLogin] = useState(false); //? Stato per login tramite provider esterni
  const [captchaToken, setCaptchaToken] = useState<string>(''); //? Stato per il token CAPTCHA
  const turnstileRef = useRef(null); //? Ref per il componente Turnstile

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

  //? Gestione della verifica del CAPTCHA
  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    setValue('captchaToken', token);
    clearErrors('captchaToken');
  };

  //? Gestione della scadenza del CAPTCHA
  const handleCaptchaExpire = () => {
    setCaptchaToken('');
    setValue('captchaToken', '');
    setError('captchaToken', { 
      type: 'manual', 
      message: 'CAPTCHA has expired, please verify again' 
    });
  };

  //? Gestione del login tramite provider OAuth (Google, GitHub, Discord)
  const handleOAuthSignIn = (provider: string) => {
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA verification first");
      return;
    }
    
    clearErrors(); //? Pulisce eventuali errori del form
    setIsThirdPartyLogin(true); //? Disabilita il form durante il login esterno
    
    //? Avvia il login con il provider selezionato
    signIn(provider, { callbackUrl: `${window.location.origin}/vehicles` });
  };

  //? Gestione dell'invio del form di login classico
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    //? Evita l'invio se è in corso un login con provider terzo
    if (isThirdPartyLogin) return;
    
    try {
      //? Invia i dati di login, incluso il token CAPTCHA
      const signInData = await signIn('credentials', {
        email: data.email,
        password: data.password,
        captchaToken: data.captchaToken,
        redirect: false,
      });

      if (signInData?.error) {
        toast.error(signInData.error); //? Mostra errore se presente
        setValue('password', '');
        
        //? Reset del CAPTCHA in caso di errore
        if (turnstileRef.current) {
          // @ts-expect-error - Il type definition non include il metodo reset
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
      
      //? Reset del CAPTCHA in caso di errore
      if (turnstileRef.current) {
        // @ts-expect-error - Il type definition non include il metodo reset
        turnstileRef.current.reset();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 relative">
      {/* //! Video di sfondo */}
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

      {/* //? Navbar in alto */}
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

      {/* //? Card principale del form */}
      <Card className="w-full max-w-md z-10">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {/* //? Form di login */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* //? Campo email */}
            <div>
              <Input placeholder="Email" {...register('email')} disabled={isThirdPartyLogin} />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* //? Campo password */}
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

            {/* //? CAPTCHA Cloudflare Turnstile */}
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

            {/* //? Bottone di invio */}
            <Button className="w-full mt-2" type="submit" disabled={isThirdPartyLogin || !captchaToken}>
              Sign in
            </Button>

            {/* //? Separatore tra login classico e OAuth */}
            <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
              or
            </div>
          </form>
          
          {/* //? Pulsanti per login tramite provider esterni */}
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
            
            {/* //? Link per la registrazione */}
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