'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, Lock, EyeOff, Eye, Loader } from 'lucide-react';
import Link from 'next/link';
// import { toast } from "sonner";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations/auth.validator';
import type * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/context/auth-provider';
import { GoogleIcon } from '@/components/icons/GoogleIcon';

type LoginFormValues = z.infer<typeof loginSchema>;
export default function LoginPage() {
  const { login,loading, googleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      mat_khau: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.mat_khau);
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="py-20  px-4 sm:px-6 lg:px-8 flex items-center justify-center ">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Chào mừng trở lại
          </CardTitle>
          <CardDescription className="text-center">
            Đăng nhập tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input
                          placeholder="Nhập email"
                          className="pl-10"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mat_khau"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span>Mật khẩu</span>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Nhập mật khẩu"
                          className="pl-10"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="sr-only">
                          {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                    <Loader className="animate-spin"> Đang đăng nhập... </Loader>
                  ) : (
                    'Đăng nhập'
                  )}
              </Button>
            </form>
          </Form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-gray-500">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full cursor-pointer"
              onClick={googleLogin}
              disabled={loading}
          >
            <GoogleIcon />
            Tiếp tục với Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link
              href="/auth/register"
              className="text-primary hover:underline"
            >
              Đăng kí
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
