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
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from "@/src/components/ui/navigation-menu";
import { useState, useRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { signIn } from 'next-auth/react';

//! Schema di validazione del form con Zod
const FormSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100), //? Username obbligatorio, max 100 caratteri
    email: z.string().min(1, 'Email is required').email('Invalid email'), //? Email obbligatoria e valida
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have at least 8 characters'), //? Password obbligatoria, minimo 8 caratteri
    confirmPassword: z.string().min(1, 'Password confirmation is required'), //? Conferma password obbligatoria
    captchaToken: z.string().optional() //? Token CAPTCHA opzionale nello schema
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match', //? Controllo che le password coincidano
  });

//! Componente principale del form di registrazione
const SignUpForm = () => {
  //? Stato per il token del CAPTCHA
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const turnstileRef = useRef(null);

  //? Hook per la gestione del form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const router = useRouter();

  //! Funzione chiamata al submit del form
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    });

    if (response.ok) {
      toast.success('Registration successful! Please sign in.'); //? Notifica di successo
      router.push('/sign-in'); //? Redirect alla pagina di login
    } else {
      toast.error('Registration failed. Please try again.'); //? Notifica di errore
    }
  };

  //! Gestione della verifica del CAPTCHA
  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    form.setValue('captchaToken', token);
    form.clearErrors('captchaToken');
  };

  //! Gestione della scadenza del CAPTCHA
  const handleCaptchaExpire = () => {
    setCaptchaToken('');
    form.setValue('captchaToken', '');
    form.setError('captchaToken', { 
      type: 'manual', 
      message: 'CAPTCHA has expired, please verify again' 
    });
  };

  //! Gestione del login OAuth (Google, GitHub, Discord)
  const handleOAuthSignIn = (provider: string) => {
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA verification first"); //? Mostra errore se CAPTCHA non completato
      return;
    }
    form.clearErrors();
    signIn(provider, { 
      callbackUrl: `${window.location.origin}/vehicles`,
      redirect: true
    });
  };

  //? Destrutturazione delle funzioni e degli errori dal form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 relative">
      {/* //? Video di sfondo */}
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
      <Card className="w-full max-w-md z-10">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your details below to sign up</CardDescription>
        </CardHeader>
        <CardContent>
          {/* //? Navbar in alto */}
          <nav className="w-full fixed top-0 left-0 z-20 bg-black" style={{backgroundColor: 'transparent'}}>
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

          {/* //? Form di registrazione */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* //? Campo Username */}
            <div>
              <Input placeholder="Username" {...register('username')} />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
              )}
            </div>
            {/* //? Campo Email */}
            <div>
              <Input placeholder="Email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            {/* //? Campo Password */}
            <div>
              <Input
                placeholder="Password"
                type="password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
            {/* //? Campo Conferma Password */}
            <div>
              <Input
                placeholder="Confirm Password"
                type="password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* //! CAPTCHA Turnstile */}
            <div className="flex justify-center my-4">
              <Turnstile
                ref={turnstileRef}
                siteKey="0x4AAAAAABaVTxn_QOkTDwiB"
                onSuccess={handleCaptchaVerify}
                onExpire={handleCaptchaExpire}
              />
            </div>

            {/* //? Bottone di submit, disabilitato se CAPTCHA non valido */}
            <Button className="w-full mt-2" type="submit" disabled={!captchaToken}>
              Sign up
            </Button>

            {/* //? Separatore visivo */}
            <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
              or
            </div>
          </form>
          
          {/* //! Pulsanti OAuth fuori dal form */}
          <div className="space-y-3 mt-4">
            <GoogleButton
              onClick={() => handleOAuthSignIn('google')}
            >
              Sign up with Google
            </GoogleButton>
            <GithubButton
              onClick={() => handleOAuthSignIn('github')}
            >
              Sign up with GitHub
            </GithubButton>
            <DiscordButton
              onClick={() => handleOAuthSignIn('discord')}
            >
              Sign up with Discord
            </DiscordButton>

            {/* //? Link per chi ha già un account */}
            <p className="text-center text-sm text-gray-600 mt-2">
              Already have an account?&nbsp;
              <Link className="text-blue-500 hover:underline" href="/sign-in">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpForm;
