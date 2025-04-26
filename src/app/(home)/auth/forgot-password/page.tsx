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
import { ArrowRight, Loader, Mail, MailCheckIcon } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/lib/validations/auth.validator';
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

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { forgotPassword, loading } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(values.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <>
      {!isSubmitted ? (
        <div className="py-20 flex items-center justify-center ">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Đặt lại mật khẩu
              </CardTitle>
              <CardDescription className="text-center">
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn
                để đặt lại mật khẩu của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
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
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <Loader className="animate-spin"> Đang gửi... </Loader>
                    ) : (
                      'Gửi yêu cầu đặt lại mật khẩu'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Nhớ mật khẩu?{' '}
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
