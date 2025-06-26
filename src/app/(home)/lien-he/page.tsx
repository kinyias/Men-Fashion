'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Mail, Clock, Send } from 'lucide-react';
import {
  contactFormSchema,
  ContactFormValues,
} from '@/lib/validations/contact.validator';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader as DialogHeaderUI,
  DialogTitle as DialogTitleUI,
} from '@/components/ui/dialog';

export default function ContactPage() {
  const [open, setOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setLoading(true);
    console.log(data)
    setTimeout(() => {
      setLoading(false);
      setDialogMsg(
        'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi bạn sớm nhất.'
      );
      setOpen(true);
      form.reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Liên Hệ</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Liên hệ với chúng tôi. Chúng tôi sẽ hỗ trợ bạn tìm kiếm phong cách
              phù hợp.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Liên Hệ</h2>
              <p className="text-gray-600 text-lg mb-8">
                Đến cửa hàng của chúng tôi hoặc liên hệ với chúng tôi để nhận
                được lời khuyên về phong cách, hỏi thăm về sản phẩm hoặc bất kỳ
                câu hỏi nào về bộ sưu tập quần áo nam.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-white p-3 rounded-lg">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        Đến cửa hàng của chúng tôi
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Số 180, Cao Lỗ, phường 4, Quận 8, Thành phố
                        <br />
                        Hồ Chí Minh, Việt Nam
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-white p-3 rounded-lg">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        Email
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Email: DH52102716@student.stu.edu.vn
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-white p-3 rounded-lg">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        Giờ làm việc
                      </h3>
                      <div className="text-gray-600 mt-1 space-y-1">
                        <p>Thứ Hai - Thứ Sáu: 10:00 AM - 18:00 PM</p>
                        <p>Thứ Bảy: 10:00 AM - 18:00 PM</p>
                        <p>Chủ Nhật: 12:00 PM - 18:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Gửi cho chúng tôi</CardTitle>
                <CardDescription>
                  Điền vào form bên dưới và chúng tôi sẽ trả lời bạn trong vòng
                  24 giờ.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ</FormLabel>
                            <FormControl>
                              <Input placeholder="Nguyễn" {...field} />
                            </FormControl>
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
                            <FormControl>
                              <Input placeholder="Văn A" {...field} />
                            </FormControl>
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
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="email@example.com"
                              {...field}
                            />
                          </FormControl>
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
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="0909090909"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chủ đề</FormLabel>
                          <FormControl>
                            <Input placeholder="Chủ đề..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nội dung</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nội dung..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-gray-800 text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Send className="mr-2 h-4 w-4 animate-spin" /> Đang
                          gửi...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Gửi
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeaderUI>
                  <DialogTitleUI>Thông báo</DialogTitleUI>
                </DialogHeaderUI>
                <div>{dialogMsg}</div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
