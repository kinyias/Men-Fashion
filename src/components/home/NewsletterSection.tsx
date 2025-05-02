import React from 'react'
import { Button } from '../ui/button'
import { Mail } from 'lucide-react'

export default function NewsletterSection() {
  return (
    <section className="py-16 md:py-24 bg-primary/5">
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Nhận tin tức mới nhất từ chung tôi</h2>
          <p className="max-w-[600px] text-muted-foreground md:text-lg">
          Đăng ký để nhận các ưu đãi đặc biệt, quà tặng miễn phí và các ưu đãi duy nhất trong đời.
          </p>
        </div>
        <div className="mx-auto w-full max-w-md space-y-2">
          <form className="flex space-x-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="Nhập địa chỉ email của bạn"
                className="w-full rounded-full border border-input bg-background py-2 pl-10 pr-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Button type="submit" className="rounded-full">
              Đăng ký
            </Button>
          </form>
        </div>
      </div>
    </div>
  </section>
  )
}
