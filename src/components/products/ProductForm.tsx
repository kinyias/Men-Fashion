"use client"

import { useState, useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter, useParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { createProduct, updateProduct } from "@/lib/api/api-products"
import { getCategories, getSubCategories, getBrands,getColors, getSizes } from "@/lib/api"
import { ApiError, CreateSanPhamData, LoaiSanPham, MauSacWithImages, SanPham } from "@/types"
import { Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { UploadButton } from "@/utils/uploadthing"
import axios from "axios"
import { SimpleEditor } from "../tiptap/tiptap-templates/simple/simple-editor"
import { ColorVariant } from "./ColorVariant"
import { SizeVariant } from "./SizeVariant"
import { ColorSizeMatrix } from "./ColorSizeMatrix"
import { formatNumber, parseCurrency } from "@/utils/currency"
import { productFormSchema } from "@/lib/validations/product.validator"


type ProductFormValues = z.infer<typeof productFormSchema>

export interface BienThe {
  ma: number
  gia: string
  soluong: number
  masp: number
  mamausac: number
  makichco: number
}
export default function ProductForm({product}:{product: SanPham}) {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const productId = params?.id ? Number(params.id) : undefined
  const isEditMode = !!productId
  
  // State for selected colors with images
  const [selectedColors, setSelectedColors] = useState<MauSacWithImages[]>([])

  // State for selected sizes
  const [selectedSizes, setSelectedSizes] = useState<{ ma: number; ten: string }[]>([])

  // State for variants (BienThe)
  const [variants, setVariants] = useState<BienThe[]>([])

  // State for filtered sub-categories based on selected category
  const [filteredSubCategories, setFilteredSubCategories] = useState<LoaiSanPham[]>([])

  // State for color selection dialog
  const [colorDialogOpen, setColorDialogOpen] = useState(false)
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>([])

  // State for size selection dialog
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false)
  const [selectedSizeIds, setSelectedSizeIds] = useState<number[]>([])
  
  // State for upload progress
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  
  
  // Fetch categories, brands, etc.
  const { data: categoriesData } = useQuery({
    queryKey: ['categories-dropdown'],
    queryFn: () => getCategories({ page: 1, limit: 100 }),
  })
  
  const { data: brandsData } = useQuery({
    queryKey: ['brands-dropdown'],
    queryFn: () => getBrands({ page: 1, limit: 100 }),
  })
  
  const { data: colorsData } = useQuery({
    queryKey: ['colors-dropdown'],
    queryFn: () => getColors({ page: 1, limit: 100 }),
  })
  
  const { data: sizesData } = useQuery({
    queryKey: ['sizes-dropdown'],
    queryFn: () => getSizes({ page: 1, limit: 100 }),
  })
  const createMutation = useMutation({
    mutationFn: (data: CreateSanPhamData) => createProduct(data),
    onSuccess: () => {
      toast.success('Tạo sản phẩm thành công')
      router.push('/admin/products')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: ApiError) => {
      console.error("Error creating product:", error)
      toast.error(`Tạo sản phẩm thất bại. ${error.response.data.message}`)
    }
  })
  
  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: CreateSanPhamData }) => 
      updateProduct(id, data),
    onSuccess: () => {
      toast.success('Cập nhật sản phẩm thành công')
      router.push('/admin/products')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
    },
    onError: (error: ApiError) => {
      console.error("Error updating product:", error)
      toast.error(`Cập nhật sản phẩm thất bại. ${error.response.data.message}`)
    }
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const danhMucs =  useMemo(() =>categoriesData?.data || [] , [categoriesData?.data])
  const thuongHieus =  useMemo(() =>brandsData?.data || [] , [brandsData?.data])
  const realMauSacs = useMemo(() => colorsData?.data || [], [colorsData?.data])
  const realKichCos = useMemo(() => sizesData?.data || [], [sizesData?.data])

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      ten: product?.ten || "",
      mota: product?.mota || "",
      giaban: product?.giaban.toString() || "",
      giagiam: product?.giagiam ? product.giagiam.toString() : "",
      hinhanh: product?.hinhanh || "",
      noibat: product?.noibat || false,
      trangthai: product?.trangthai || true,
      madanhmuc: product?.madanhmuc.toString() || "",
      maloaisanpham: product?.maloaisanpham.toString() || "",
      mathuonghieu: product?.mathuonghieu.toString() || "",
    },
  })

  // Load product data into form when in edit mode
  useEffect(() => {
    if (product && isEditMode) {
      
      // Load colors, sizes, and variants
      if (product.bienThes && product.bienThes.length > 0) {
        // Extract unique colors and sizes from variants
        const uniqueColorIds = [...new Set(product.bienThes.map(bt => bt.mamausac))]
        const uniqueSizeIds = [...new Set(product.bienThes.map(bt => bt.makichco))]
        
        // Set selected colors
        const productColors = uniqueColorIds.map(colorId => {
          const color = realMauSacs.find(c => c.ma === colorId)
          if (!color) return null
          
          // Get images for this color
          const colorImages = product.hinhAnhMauSacs?.[colorId] || []
          
          return {
            ma: color.ma,
            ten: color.ten,
            ma_mau: color.ma_mau,
            hinhAnhs: colorImages.map(img => ({
              ma: img.ma,
              hinhAnh: img.hinhAnh,
              anhChinh: img.anhChinh
            }))
          }
        }).filter(Boolean) as MauSacWithImages[]
        
        setSelectedColors(productColors)
        
        // Set selected sizes
        const productSizes = uniqueSizeIds.map(sizeId => {
          const size = realKichCos.find(s => s.ma === sizeId)
          if (!size) return null
          return {
            ma: size.ma,
            ten: size.ten
          }
        }).filter(Boolean) as { ma: number; ten: string }[]
        
        setSelectedSizes(productSizes)
        
        // Set variants
        setVariants(product.bienThes.map(bt => ({
          ma: bt.ma,
          gia: bt.gia.toString(),
          soluong: bt.soluong,
          masp: bt.masp,
          mamausac: bt.mamausac,
          makichco: bt.makichco
        })))
      }
      if (product.madanhmuc) {
        getSubCategories({ madanhmuc: product.madanhmuc, page: 1, limit: 100 })
          .then(response => {
            setFilteredSubCategories(response.data)
          })
          .catch(error => {
            console.error("Error fetching sub-categories:", error)
            setFilteredSubCategories([])
          })
      }
    }
  }, [product, isEditMode, form, realMauSacs, realKichCos])

  // Watch for category changes to filter sub-categories
  const selectedCategoryId = form.watch("madanhmuc")
  useEffect(() => {
    if (selectedCategoryId) {
      const categoryId = Number.parseInt(selectedCategoryId)
      
      // Fetch sub-categories for the selected category
      getSubCategories({ madanhmuc: categoryId, page: 1, limit: 100 })
        .then(response => {
          setFilteredSubCategories(response.data)
          const currentSubCategoryId = form.getValues("maloaisanpham")
          const subCategoryExists = response.data.some(
            subCat => subCat.ma.toString() === currentSubCategoryId
          )
          
          if (!subCategoryExists && currentSubCategoryId) {
            form.setValue("maloaisanpham", "")
          }
        })
        .catch(error => {
          console.error("Error fetching sub-categories:", error)
          setFilteredSubCategories([])
        })
    }
  }, [selectedCategoryId, form])

  // Function to add selected colors
  const addSelectedColors = () => {
    const newColors = selectedColorIds
      .filter((id) => !selectedColors.some((color) => color.ma === id))
      .map((id) => {
        const color = realMauSacs.find((color) => color.ma === id)!
        return {
          ma: color.ma,
          ten: color.ten,
          ma_mau: color.ma_mau,
          hinhAnhs: [],
        }
      })

    if (newColors.length > 0) {
      const updatedColors = [...selectedColors, ...newColors]
      setSelectedColors(updatedColors)

      // Update variants for new colors
      const newVariants = newColors.flatMap((color) =>
        selectedSizes.map((size) => ({
          ma: 0, // Temporary ID for UI
          gia: form.getValues("giagiam") || form.getValues("giaban"),
          soluong: 0,
          masp: 0, // Will be set after product creation
          mamausac: color.ma,
          makichco: size.ma,
        })),
      )

      setVariants([...variants, ...newVariants])
    }

    setColorDialogOpen(false)
    setSelectedColorIds([])
  }

  // Function to add selected sizes
  const addSelectedSizes = () => {
    const newSizes = selectedSizeIds
      .filter((id) => !selectedSizes.some((size) => size.ma === id))
      .map((id) => {
        const size = realKichCos.find((size) => size.ma === id)!
        return {
          ma: size.ma,
          ten: size.ten,
        }
      })

    if (newSizes.length > 0) {
      const updatedSizes = [...selectedSizes, ...newSizes]
      setSelectedSizes(updatedSizes)

      // Update variants for new sizes
      const newVariants = newSizes.flatMap((size) =>
        selectedColors.map((color) => ({
          ma: 0, // Temporary ID for UI
          gia: form.getValues("giagiam") || form.getValues("giaban"),
          soluong: 0,
          masp: 0, // Will be set after product creation
          mamausac: color.ma,
          makichco: size.ma,
        })),
      )

      setVariants([...variants, ...newVariants])
    }

    setSizeDialogOpen(false)
    setSelectedSizeIds([])
  }

  // Function to remove a color
  const removeColor = (colorId: number) => {
    setSelectedColors(selectedColors.filter((color) => color.ma !== colorId))
    // Also remove from variants
    setVariants(variants.filter((variant) => variant.mamausac !== colorId))
  }

  // Function to remove a size
  const removeSize = (sizeId: number) => {
    setSelectedSizes(selectedSizes.filter((size) => size.ma !== sizeId))
    // Also remove from variants
    setVariants(variants.filter((variant) => variant.makichco !== sizeId))
  }

  // Function to add image to a color
  const addImageToColor = (colorId: number, imageUrl: string) => {
    setSelectedColors(
      selectedColors.map((color) => {
        if (color.ma === colorId) {
          const newImages = [...color.hinhAnhs]
          newImages.push({
            ma: 0,
            hinhAnh: imageUrl,
            anhChinh: newImages.length === 0, // First image is primary
            mamausac: color.ma,
            masp: 0, // Will be set after product creation
          })
          return { ...color, hinhAnhs: newImages }
        }
        return color
      }),
    )
  }

  // Function to remove image from a color
  const removeImageFromColor = (colorId: number, imageId: number) => {
    setSelectedColors(
      selectedColors.map((color) => {
        if (color.ma === colorId) {
          const newImages = color.hinhAnhs.filter((img) => img.ma !== imageId)
          // If we removed the primary image, make the first one primary
          if (newImages.length > 0 && !color.hinhAnhs.find((img) => img.ma === imageId)?.anhChinh) {
            newImages[0].anhChinh = true
          }
          return { ...color, hinhAnhs: newImages }
        }
        return color
      }),
    )
  }

  // Function to set primary image for a color
  const setPrimaryImage = (colorId: number, imageId: number) => {
    setSelectedColors(
      selectedColors.map((color) => {
        if (color.ma === colorId) {
          const newImages = color.hinhAnhs.map((img) => ({
            ...img,
            anhChinh: img.ma === imageId,
          }))
          return { ...color, hinhAnhs: newImages }
        }
        return color
      }),
    )
  }

  // Function to update variant price and quantity
  const updateVariant = (colorId: number, sizeId: number, data: { gia?: string; soluong?: number }) => {
    setVariants(
      variants.map((variant) => {
        if (variant.mamausac === colorId && variant.makichco === sizeId) {
          return { ...variant, ...data }
        }
        return variant
      }),
    )
  }

  // Image upload handling
  const handleImageUpload = async (colorId: number, files: FileList | null) => {
    if (!files) return
    
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      for (const file of Array.from(files)) {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return prev + 10
          })
        }, 200)
        
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/cloudinary', {
          method: 'POST',
          body: formData,
        })
        
        clearInterval(progressInterval)
        
        if (!response.ok) {
          throw new Error('Failed to upload image')
        }
        
        setUploadProgress(100)
        const data = await response.json()
        addImageToColor(colorId, data.secure_url)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Lỗi khi tải ảnh lên')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }
  const handleImageDelete = (image: string) => {
    const imageKey = image.substring(image.lastIndexOf('/') + 1);

    axios
      .post('/api/uploadthing/delete', { imageKey })
      .then((res) => {
        if (res.data.success) {
          form.setValue('hinhanh', '');
          toast.success('Hình ảnh đã được xoá');
        }
      })
      .catch(() => {
        toast.error('Đã xảy ra lỗi khi xoá hình ảnh');
      })
  };
  function onSubmit(data: ProductFormValues) {
    // Validate that at least one color and size is selected
    if (selectedColors.length === 0) {
      toast.error("Vui lòng chọn ít nhất một màu sắc")
      return
    }

    if (selectedSizes.length === 0) {
      toast.error("Vui lòng chọn ít nhất một kích cỡ")
      return
    }

    // Validate that all colors have at least one image
    const colorsWithoutImages = selectedColors.filter((color) => color.hinhAnhs.length === 0)
    if (colorsWithoutImages.length > 0) {
      toast.error(`Vui lòng thêm ít nhất một hình ảnh cho màu: ${colorsWithoutImages.map((c) => c.ten).join(", ")}`)
      return
    }

    // In a real application, you would send this data to your API
    const productData: CreateSanPhamData = {
      ...data,
      madanhmuc: Number.parseInt(data.madanhmuc),
      maloaisanpham: Number.parseInt(data.maloaisanpham),
      mathuonghieu: Number.parseInt(data.mathuonghieu),
      giaban: Number.parseFloat(data.giaban),
      giagiam: data.giagiam ? Number.parseFloat(data.giagiam) : undefined,
      bienThes: variants,
      mauSacs: selectedColors.flatMap(mauSac => mauSac.hinhAnhs),
    }

    // Submit based on mode
    if (isEditMode && productId) {
      updateMutation.mutate({ id: productId, data: productData })
    } else {
      createMutation.mutate(productData)
    }
  }
  return (
    <>
 
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* SanPham Section */}
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin sản phẩm</CardTitle>
            <CardDescription>Nhập thông tin cơ bản của sản phẩm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="ten"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sản phẩm</FormLabel>
                    <FormControl>
                      <Input placeholder="Áo thun cotton" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="giaban"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá bán (VNĐ)</FormLabel>
                      <FormControl>
                        <Input type="text" min={0} placeholder="299000" {...field}
                          value={formatNumber(Number(field.value))} // Display formatted value
                      
                          onBlur={(e) =>
                            field.onChange(parseCurrency(e.target.value))
                          } // Parse back to number on blur
                          onChange={(e) =>
                            field.onChange(parseCurrency(e.target.value))
                          } // Handle manual typing
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="giagiam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá giảm (VNĐ)</FormLabel>
                      <FormControl>
                        <Input type="text" min={0} placeholder="199000" {...field} 
                         value={formatNumber(Number(field.value))} // Display formatted value
                        //  onFocus={(e) =>
                        //    (e.target.value = field.value?.toString() || '')
                        //  } // Show raw number on focus
                         onBlur={(e) =>
                           field.onChange(parseCurrency(e.target.value))
                         } // Parse back to number on blur
                         onChange={(e) =>
                           field.onChange(parseCurrency(e.target.value))
                         } // Handle manual typing
                        />
                      </FormControl>
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-6 w-full">
              <FormField
                control={form.control}
                name="madanhmuc"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Danh mục</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {danhMucs.map((category) => (
                          <SelectItem key={category.ma} value={category.ma.toString()}>
                            {category.ten}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
                </div>
              
<div className="space-y-6 w-full">
              <FormField
                control={form.control}
                name="maloaisanpham"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Loại sản phẩm</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategoryId && filteredSubCategories.length === 0}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={selectedCategoryId ? "Chọn loại sản phẩm" : "Chọn danh mục trước"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredSubCategories.map((subCategory) => (
                          <SelectItem key={subCategory.ma} value={subCategory.ma.toString()}>
                            {subCategory.ten }
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
</div>
                  </div>

              <FormField
                control={form.control}
                name="mathuonghieu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thương hiệu</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thương hiệu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {thuongHieus.map((brand) => (
                          <SelectItem key={brand.ma} value={brand.ma.toString()}>
                            {brand.ten}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
  <div className="flex flex-col gap-4 md:flex-row md:col-span-2">
                <FormField
                  control={form.control}
                  name="noibat"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 flex-1">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Sản phẩm nổi bật</FormLabel>
                        <FormDescription>Đánh dấu sản phẩm này là nổi bật trên trang chủ</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trangthai"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 flex-1">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Trạng thái</FormLabel>
                        <FormDescription>Bật để hiển thị sản phẩm trên cửa hàng</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="mota"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Mô tả sản phẩm</FormLabel>
                    <FormControl>
                    <div className="border">
                     
                      <SimpleEditor 
                         
                          content={field.value || ''} 
                          onChange={field.onChange}
                        />
                       </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </CardContent>
        </Card>
          </div>
        <div className="space-y-6">
          <Card>
            <CardContent>
            <FormField
                  control={form.control}
                  name="hinhanh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hình ảnh đại diện</FormLabel>
                      <FormControl>
                      <div className="space-y-4">
                          {field.value && (
                            <div className="relative w-full h-full overflow-hidden rounded-md">
                              <Image 
                                src={field.value} 
                                alt="Ảnh đại diện" 
                                className="object-cover w-full h-full"
                                width={500}
                                height={300}
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 cursor-pointer"
                                onClick={() => field.value && handleImageDelete(field.value)}
                              >
                                Xóa
                              </Button>
                            </div>
                          )}
                          
                          {!field.value && (
                            <div className="flex flex-col items-center h-full max-w-[500px] p-6 border-2 border-dashed border-primary/50 rounded">
                              {isUploading && (
                                <div className="w-full mb-4">
                                  <p className="text-sm text-muted-foreground mb-2 text-center">
                                    Đang tải lên: {uploadProgress/100}%
                                  </p>
                                  <Progress value={uploadProgress} className="h-2" />
                                </div>
                              )}
                              
                              <UploadButton
                                endpoint="imageUploader"
                                onUploadBegin={() => {
                                  setIsUploading(true);
                                  setUploadProgress(0);
                                }}
                                onUploadProgress={(progress) => {
                                  setUploadProgress(Math.round(progress * 100));
                                }}
                                onClientUploadComplete={(res) => {
                                  // Update the form field with the uploaded image URL
                                  field.onChange(res[0].url);
                                  
                                  // Reset upload state
                                  setIsUploading(false);
                                  setUploadProgress(0);
                                  
                                  // Show success toast
                                  toast.success("Tải ảnh lên thành công");
                                }}
                                onUploadError={(error: Error) => {
                                  // Reset upload state
                                  setIsUploading(false);
                                  setUploadProgress(0);
                                  
                                  // Show error toast
                                  toast.error(`Lỗi tải ảnh: ${error.message}`);
                                }}
                                appearance={{
                                  button: "bg-blue-500 text-primary-foreground hover:bg-primary/90 px-5",
                                  allowedContent: "text-sm text-muted-foreground",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>Hình ảnh đại diện cho loại sản phẩm.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            
            </CardContent>
          </Card>
          </div>
          </div>

        {/* MauSac Section */}
       
        <ColorVariant
          selectedColors={selectedColors}
          availableColors={realMauSacs}
          colorDialogOpen={colorDialogOpen}
          setColorDialogOpen={setColorDialogOpen}
          selectedColorIds={selectedColorIds}
          setSelectedColorIds={setSelectedColorIds}
          onAddColors={addSelectedColors}
          onRemoveColor={removeColor}
          onAddImageToColor={addImageToColor}
          onRemoveImageFromColor={removeImageFromColor}
          onSetPrimaryImage={setPrimaryImage}
          onHandleImageUpload={handleImageUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />

        {/* KichCo Section */}
        <SizeVariant
          selectedSizes={selectedSizes}
          availableSizes={realKichCos}
          sizeDialogOpen={sizeDialogOpen}
          setSizeDialogOpen={setSizeDialogOpen}
          selectedSizeIds={selectedSizeIds}
          setSelectedSizeIds={setSelectedSizeIds}
          onAddSizes={addSelectedSizes}
          onRemoveSize={removeSize}
        />

        {/* BienThe Section (Inventory Matrix) */}
        {selectedColors.length > 0 && selectedSizes.length > 0 ? (
           <ColorSizeMatrix
           selectedColors={selectedColors}
           selectedSizes={selectedSizes}
           variants={variants}
           onUpdateVariant={updateVariant}
         />
        ) : (
          selectedColors.length > 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Vui lòng thêm kích cỡ để tạo bảng quản lý tồn kho.
              </CardContent>
            </Card>
          )
        )}

<div className="flex justify-end gap-4">
  <Button 
    type="button" 
    variant="outline" 
    onClick={() => router.back()} 
    disabled={isSubmitting}
  >
    Hủy
  </Button>
  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    {isSubmitting ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Lưu"}
  </Button>
</div>
      </form>
    </Form>

  </>
  )
}
