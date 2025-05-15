import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs";
  
  interface SizeGuideProps {
    onClose: () => void;
  }
  
  export function SizeGuide({ onClose }: SizeGuideProps) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Bảng kích thước</DialogTitle>
            <DialogDescription>
              Tìm kích thước phù hợp với bạn qua bảng kích thước chi tiết bên
              dưới.
            </DialogDescription>
          </DialogHeader>
  
          <Tabs defaultValue="inches">
            <TabsList>
              <TabsTrigger value="inches">Inch</TabsTrigger>
              <TabsTrigger value="cm">Centimet</TabsTrigger>
            </TabsList>
  
            <TabsContent value="inches" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cỡ</TableHead>
                    <TableHead>Ngực</TableHead>
                    <TableHead>Eo</TableHead>
                    <TableHead>Mông</TableHead>
                    <TableHead>Tay áo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">XS</TableCell>
                    <TableCell>34-36</TableCell>
                    <TableCell>28-30</TableCell>
                    <TableCell>34-36</TableCell>
                    <TableCell>31.5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">S</TableCell>
                    <TableCell>36-38</TableCell>
                    <TableCell>30-32</TableCell>
                    <TableCell>36-38</TableCell>
                    <TableCell>32</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">M</TableCell>
                    <TableCell>38-40</TableCell>
                    <TableCell>32-34</TableCell>
                    <TableCell>38-40</TableCell>
                    <TableCell>32.5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">L</TableCell>
                    <TableCell>40-42</TableCell>
                    <TableCell>34-36</TableCell>
                    <TableCell>40-42</TableCell>
                    <TableCell>33</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">XL</TableCell>
                    <TableCell>42-44</TableCell>
                    <TableCell>36-38</TableCell>
                    <TableCell>42-44</TableCell>
                    <TableCell>33.5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">XXL</TableCell>
                    <TableCell>44-46</TableCell>
                    <TableCell>38-40</TableCell>
                    <TableCell>44-46</TableCell>
                    <TableCell>34</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
  
            <TabsContent value="cm" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cỡ</TableHead>
                    <TableHead>Ngực</TableHead>
                    <TableHead>Eo</TableHead>
                    <TableHead>Mông</TableHead>
                    <TableHead>Tay áo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">XS</TableCell>
                    <TableCell>86-91</TableCell>
                    <TableCell>71-76</TableCell>
                    <TableCell>86-91</TableCell>
                    <TableCell>80</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">S</TableCell>
                    <TableCell>91-97</TableCell>
                    <TableCell>76-81</TableCell>
                    <TableCell>91-97</TableCell>
                    <TableCell>81</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">M</TableCell>
                    <TableCell>97-102</TableCell>
                    <TableCell>81-86</TableCell>
                    <TableCell>97-102</TableCell>
                    <TableCell>82.5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">L</TableCell>
                    <TableCell>102-107</TableCell>
                    <TableCell>86-91</TableCell>
                    <TableCell>102-107</TableCell>
                    <TableCell>84</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">XL</TableCell>
                    <TableCell>107-112</TableCell>
                    <TableCell>91-97</TableCell>
                    <TableCell>107-112</TableCell>
                    <TableCell>85</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">XXL</TableCell>
                    <TableCell>112-117</TableCell>
                    <TableCell>97-102</TableCell>
                    <TableCell>112-117</TableCell>
                    <TableCell>86</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
  
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Cách đo kích thước</h3>
            <p className="text-sm text-muted-foreground">
              <strong>Ngực:</strong> Đo quanh phần đầy nhất của ngực, giữ thước đo
              ngang.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Eo:</strong> Đo quanh vòng eo tự nhiên, giữ thước đo hơi lỏng
              một chút.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Mông:</strong> Đo quanh phần đầy nhất của mông.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Tay áo:</strong> Đo từ giữa cổ sau, qua vai và xuống đến cổ tay.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  