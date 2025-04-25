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
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Loader,
  MailCheckIcon,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validations/auth.validator';
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
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const {register, loading, googleLogin} = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await register(values);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Đăng kí thất bại:', error);
    }
    
  };

  return (
    <>
      {!isSubmitted ? (
        <div className="py-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Tạo tài khoản
              </CardTitle>
              <CardDescription className="text-center">
                Đăng nhập với tài khoản mới
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4">
                  <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ</FormLabel>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <FormControl>
                              <Input
                                placeholder="An"
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
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên</FormLabel>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <FormControl>
                              <Input
                                placeholder="An"
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
                  </div>
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
                              type="email"
                              placeholder="email@example.com"
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
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
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận nhận mật khẩu</FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+84 000-000-000"
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input
                              placeholder="Số nhà tên đường, phường/xã, Quận/Huyện, Tỉnh/Thành phố"
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
                  <Button type="submit" className="w-full" 
                  disabled={loading}
                  >
                    {loading ? (
                      <Loader className="animate-spin">
                        Đang tạo tài khoản...
                      </Loader>
                    ) : (
                      'Đăng kí'
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
                className="w-full"
                onClick={googleLogin}
                disabled={loading}
              >
                <GoogleIcon/>
                Tiếp tục với Google
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="w-full h-[80vh] flex flex-col gap-2 items-center justify-center rounded-md">
          <div className="size-[48px]">
            <MailCheckIcon size="48px" className="animate-bounce" />
          </div>
          <h2 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold">
            Kiểm tra email của bạn
          </h2>
          <p className="mb-2 text-center text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
            Chúng tôi đã gửi link xác nhận email tới {form.getValues().email}.
          </p>
          <Link href="/auth/login">
            <Button className="h-[40px]">
              Tiếp tục đăng nhập
              <ArrowRight />
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
