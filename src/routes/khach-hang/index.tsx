import { Button } from "#/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import {
  CopyIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  ShieldCheckIcon,
  TrashIcon,
  User2Icon,
  UserCheckIcon,
} from "lucide-react";
import { useState } from "react";
import { Input } from "#/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table";
import { Badge } from "#/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/khach-hang/")({
  component: RouteComponent,
});

const MOCK_CUSTOMERS = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    role: "chu",
    status: "active",
    createdAt: "2026-06-01",
  },
  {
    id: "2",
    name: "Trần Thị B",
    role: "khach",
    status: "active",
    createdAt: "2026-06-03",
  },
  {
    id: "3",
    name: "Lê Văn C",
    role: "khach",
    status: "inactive",
    createdAt: "2026-06-04",
  },
  {
    id: "4",
    name: "Phạm Văn D",
    role: "chu",
    status: "active",
    createdAt: "2026-06-05",
  },
];

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Xử lý sao chép thông tin
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Đã sao chép: ${text}`);
  };

  // Xử lý xóa
  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đối tác này?")) {
      alert(`Đã xóa ID: ${id}`);
    }
  };

  // Lọc dữ liệu theo tên và tab
  const filteredCustomers = MOCK_CUSTOMERS.filter((c) => {
    const matchesSearch = c.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (activeTab === "chu") return matchesSearch && c.role === "chu";
    if (activeTab === "khach") return matchesSearch && c.role === "khach";
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 pb-24">
      {/* Tiêu đề & Nút thêm mới */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Đối tác</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý danh sách chủ hàng, khách hàng và trạng thái hoạt động.
          </p>
        </div>
        <Button className="gap-2 shadow-sm">
          <PlusIcon className="h-4 w-4" />
          Thêm mới
        </Button>
      </div>

      {/* Tìm kiếm & Tabs lọc */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full sm:w-60">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="khach">Khách</TabsTrigger>
            <TabsTrigger value="chu">Chủ</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Bảng dữ liệu */}
      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Phân loại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-muted/50">
                  {/* Tên - Bấm vào chuyển trang chi tiết */}
                  <TableCell className="font-medium">
                    <Link
                      to="/khach-hang/$customerId"
                      params={{ customerId: customer.id }}
                      className="flex items-center gap-3 w-full hover:text-primary"
                    >
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <User2Icon className="h-5 w-5" />
                      </div>
                      <span className="truncate font-semibold">
                        {customer.name}
                      </span>
                    </Link>
                  </TableCell>

                  {/* Phân loại (Chủ / Khách) */}
                  <TableCell>
                    {customer.role === "chu" ? (
                      <Badge
                        variant="default"
                        className="gap-1 bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        <ShieldCheckIcon className="h-3 w-3" /> Chủ
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <UserCheckIcon className="h-3 w-3" /> Khách
                      </Badge>
                    )}
                  </TableCell>

                  {/* Trạng thái hoạt động */}
                  <TableCell>
                    {customer.status === "active" ? (
                      <Badge
                        variant="outline"
                        className="border-emerald-500 text-emerald-600 bg-emerald-50"
                      >
                        Đang hoạt động
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-destructive/50 text-destructive bg-destructive/10"
                      >
                        Ngừng hoạt động
                      </Badge>
                    )}
                  </TableCell>

                  {/* Hành động (Dropdown Menu: Sao chép, Sửa, Xóa) */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Mở menu</span>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 rounded-xl"
                      >
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleCopy(customer.name)}
                          className="gap-2 cursor-pointer"
                        >
                          <CopyIcon className="h-4 w-4" /> Sao chép
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            alert(`Sửa khách hàng ID: ${customer.id}`)
                          }
                          className="gap-2 cursor-pointer"
                        >
                          <PencilIcon className="h-4 w-4" /> Sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(customer.id)}
                          className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                        >
                          <TrashIcon className="h-4 w-4" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không tìm thấy kết quả phù hợp.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
