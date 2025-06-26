import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Truck,
  Ruler,
  Shirt,
  HelpCircle,
} from 'lucide-react';

const faqCategories = [
  {
    id: 'sizing',
    title: 'Kích cỡ & Phù hợp',
    icon: Ruler,
    questions: [
      {
        question: 'Làm thế nào để tôi chọn đúng kích cỡ?',
        answer:
          'Chúng tôi cung cấp bảng kích cỡ chi tiết cho từng loại sản phẩm. Hãy đo vòng ngực, eo và chiều dài quần, sau đó so sánh với hướng dẫn kích cỡ của chúng tôi. Để có kết quả chính xác nhất, bạn nên đến cửa hàng để được đo chuyên nghiệp. Đội ngũ stylist của chúng tôi cũng sẵn sàng tư vấn kích cỡ phù hợp cho bạn.',
      },
      {
        question: 'Nếu tôi nằm giữa hai kích cỡ thì nên chọn thế nào?',
        answer:
          'Nếu bạn nằm giữa hai kích cỡ, chúng tôi thường khuyên bạn nên chọn size lớn hơn để mặc thoải mái hơn. Tuy nhiên, điều này có thể thay đổi tùy theo thương hiệu và kiểu dáng. Hãy xem phần mô tả sản phẩm để biết thêm lưu ý về kích cỡ, hoặc liên hệ stylist của chúng tôi để được tư vấn.',
      },
    ],
  },
  {
    id: 'orders',
    title: 'Đơn hàng & Giao hàng',
    icon: Truck,
    questions: [
      {
        question: 'Thời gian giao hàng mất bao lâu?',
        answer:
          'Giao hàng tiêu chuẩn mất 3-5 ngày làm việc, giao hàng nhanh mất 1-2 ngày làm việc.',
      },
      {
        question: 'Tôi có thể theo dõi đơn hàng không?',
        answer:
          'Có! Sau khi đơn hàng được gửi đi, bạn sẽ nhận được mã theo dõi qua email. Bạn cũng có thể đăng nhập tài khoản trên website để theo dõi đơn hàng hoặc sử dụng link trong email xác nhận giao hàng.',
      },
      {
        question: 'Tôi có thể thay đổi hoặc hủy đơn hàng không?',
        answer:
          'Bạn có thể thay đổi hoặc hủy đơn hàng trong trạng thái đơn hàng chưa được xử lý. Sau khi đơn hàng được xử lý, bạn không thể thay đổi hoặc hủy đơn hàng. Nếu bạn có thắc mắc về đơn hàng, vui lòng liên hệ với chúng tôi.',
      },
    ],
  },
  {
    id: 'products',
    title: 'Sản phẩm & Thương hiệu',
    icon: Shirt,
    questions: [
      {
        question: 'Bạn có những thương hiệu nào?',
        answer:
          'Chúng tôi tuyển chọn các thương hiệu thời trang nam cao cấp, bao gồm cả các nhà thiết kế nổi tiếng và thương hiệu mới nổi. Bộ sưu tập gồm đồ thường ngày, công sở, dự tiệc và phụ kiện từ các thương hiệu uy tín về chất lượng và phong cách.',
      },
      {
        question: 'Có sản phẩm độc quyền không?',
        answer:
          'Có! Chúng tôi thường xuyên ra mắt các bộ sưu tập giới hạn và sản phẩm độc quyền chỉ có tại cửa hàng. Đăng ký nhận bản tin để không bỏ lỡ các sản phẩm mới và ưu đãi đặc biệt.',
      },
      {
        question: 'Bao lâu có hàng mới?',
        answer:
          'Chúng tôi cập nhật hàng mới hàng tuần, các bộ sưu tập lớn theo mùa sẽ về hàng quý. Theo dõi fanpage hoặc đăng ký nhận tin để cập nhật xu hướng và sản phẩm mới nhất.',
      },
    ],
  },
  {
    id: 'other',
    title: 'Khác',
    icon: HelpCircle,
    questions: [
      {
        question: 'Đây là trang web nào?',
        answer:
          'Đây là luận văn tốt nghiệp phát triển website bán thời trang nam được phát triển bởi Thái Tín Khang - D21_TH01 - Trường ĐH Công Nghệ Sài Gòn '
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h1 className="text-4xl font-bold mb-4">Câu hỏi thường gặp</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Tìm câu trả lời cho các thắc mắc về sản phẩm, dịch vụ và chính
              sách của chúng tôi.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto p-5">

        {/* FAQ Categories */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {faqCategories.map((category) => {
            const Icon = category.icon;
            const questions = category.questions;
            return (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-black text-white p-2 rounded-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {category.title}
                      </CardTitle>
                      <CardDescription>
                        {questions.length} câu hỏi
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.id}-${index}`}
                      >
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-white rounded-lg p-8 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vẫn còn thắc mắc?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Bạn chưa tìm thấy câu trả lời? Đội ngũ CSKH của chúng tôi luôn sẵn
            sàng hỗ trợ bạn mọi thắc mắc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="text-center">
              <p className="font-semibold text-gray-900">Gọi cho chúng tôi</p>
              <p className="text-gray-600">(028) 1234 5678</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">Email</p>
              <p className="text-gray-600">DH52102716@student.stu.edu.vn</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">Chat trực tuyến</p>
              <p className="text-gray-600">Hỗ trợ 9h - 18h hàng ngày</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
