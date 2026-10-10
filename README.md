# SQLAB – Phòng luyện truy vấn cơ sở dữ liệu quan hệ

Ứng dụng web giáo dục chuyên sâu phục vụ học sinh THPT học mạch nội dung **Hệ cơ sở dữ liệu quan hệ** và **Ngôn ngữ truy vấn SQL** (Chương trình Giáo dục phổ thông môn Tin học 11 & 12).

---

## 🌟 Tính năng nổi bật

1. **Thực thi SQLite WebAssembly trực tiếp trong trình duyệt (100% Client-side)**:
   - Sử dụng `sql.js` nhúng SQLite engine qua WebAssembly.
   - Không cần cài đặt máy chủ (Serverless), không cần cấu hình database phức tạp.
   - Chạy tức thì, an toàn, bảo mật dữ liệu riêng tư trên máy học sinh.

2. **Chấm tự động theo bảng kết quả (Semantic Result Matching)**:
   - **Không** so khớp chuỗi câu lệnh (hỗ trợ nhiều cách viết đúng khác nhau: alias, thứ tự cột, cách JOIN khác nhau).
   - So khớp đa tập hợp giá trị (Multiset equality), chuẩn hóa khoảng trắng thừa và không phân biệt hoa thường.
   - Hỗ trợ cờ `orderSensitive: true` cho các bài tập yêu cầu sắp xếp thứ tự (`ORDER BY`).
   - Phản hồi sư phạm tích cực, kèm chẩn đoán lỗi cụ thể (thừa/thiếu cột, lệch số dòng, điều kiện WHERE/JOIN).

3. **Sơ đồ thực thể – quan hệ (ER Diagram) tương tác kéo-thả**:
   - Thể hiện rõ khóa chính 🔑 (PK), khóa ngoại 🔗 (FK), kiểu dữ liệu từng cột.
   - Hỗ trợ kéo-thả sắp xếp các thẻ bảng trên canvas.
   - Đường nối SVG Bézier cong mềm mại thể hiện mối quan hệ giữa các bảng kèm nhãn liên kết cột.

4. **Mô phỏng JOIN từng bước (Xem bảng tạm)**:
   - Trực quan hóa tiến trình: Nạp bảng A → Nạp bảng B → Ghép nối điều kiện `ON` → Lọc `WHERE` → Chiếu `SELECT` & `ORDER BY`.
   - Làm nổi bật các dòng thỏa mãn điều kiện và giải thích cơ chế bảng tạm.

5. **Báo cáo & Phân tích lỗi dành cho Giáo viên**:
   - Tổng hợp số học sinh tham gia, tỉ lệ hoàn thành, danh sách bài tập có tỉ lệ sai cao.
   - Bảng phân tích các nhóm lỗi phổ biến: Lỗi cú pháp, Lỗi logic lọc, Cột dữ liệu, Thứ tự sắp xếp.
   - Xuất dữ liệu nhật ký học tập ra định dạng **CSV (Excel UTF-8 có BOM)** hoặc **JSON**.

6. **3 Cơ sở dữ liệu mẫu phong phú**:
   - **Thư viện trường**: `TacGia`, `Sach`, `DocGia`, `Muon`.
   - **Quản lí điểm**: `LopHoc`, `HocSinh`, `MonHoc`, `DiemThi`.
   - **Bán hàng**: `KhachHang`, `SanPham`, `DonHang`, `ChiTietDonHang`.

---

## 🚀 Hướng dẫn cài đặt và chạy cục bộ

### Yêu cầu môi trường
- Node.js version 18 trở lên
- npm hoặc pnpm / yarn

### Các bước thực hiện
```bash
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Khởi động môi trường phát triển (Dev Server)
npm run dev
```

Truy cập ứng dụng tại địa chỉ: `http://localhost:3000` (hoặc cổng được hiển thị trong terminal).

---

## 🌐 Hướng dẫn triển khai (Deployment)

Vì ứng dụng chạy 100% tĩnh ở phía client, bạn có thể dễ dàng triển khai miễn phí lên bất kỳ nền tảng tĩnh nào:

### 1. Triển khai lên Vercel
```bash
# Cài đặt Vercel CLI (nếu chưa có)
npm i -g vercel

# Triển khai dự án
vercel
```
Hoặc kết nối Git repository trên Vercel Dashboard, chọn framework preset **Vite**, thư mục output mặc định là `dist`.

### 2. Triển khai lên Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Có thể dùng lệnh `netlify deploy --prod`

### 3. Triển khai lên GitHub Pages
Thêm thuộc tính `base: './'` trong `vite.config.ts`, chạy `npm run build` và deploy thư mục `dist` lên nhánh `gh-pages`.

---

## 📁 Cấu trúc thư mục

```
src/
├── components/           # Các thành phần giao diện
│   ├── ERDiagram.tsx     # Sơ đồ thực thể quan hệ kéo-thả & đường nối SVG
│   ├── EvaluationResult.tsx # Khung phản hồi kết quả chấm tự động
│   ├── JoinSimulator.tsx # Mô phỏng từng bước thuật toán JOIN
│   ├── Navbar.tsx        # Thanh điều hướng và hồ sơ học sinh
│   ├── SqlEditor.tsx     # Trình soạn thảo SQL với số dòng và phím tắt
│   ├── TableView.tsx     # Bảng hiển thị kết quả truy vấn
│   ├── TaskList.tsx      # Danh sách bài tập phân loại 3 mức độ
│   └── TeacherReportView.tsx # Trang thống kê phân tích dành cho giáo viên
├── data/
│   ├── databases.ts      # DDL Schema và dữ liệu khởi tạo (3 CSDL mẫu)
│   ├── joinStepExamples.ts # Kịch bản từng bước mô phỏng JOIN
│   └── tasks.ts          # Ngân hàng câu hỏi (Nhận biết - Thông hiểu - Vận dụng)
├── services/
│   ├── sqliteService.ts  # Tương tác SQLite WebAssembly (sql.js)
│   ├── evaluator.ts      # Bộ máy chấm tự động đa tập hợp
│   └── storageService.ts # Lưu trữ localStorage và xuất CSV/JSON
├── types.ts              # Định nghĩa kiểu dữ liệu TypeScript
├── App.tsx               # Entry component chính
└── index.css             # Định kiểu Tailwind CSS & Google Fonts
```

---

## 📝 Bản quyền & Giấy phép
Phát triển cho mục đích giáo dục môn Tin học và giảng dạy cơ sở dữ liệu quan hệ. Giấy phép mã nguồn mở Apache 2.0.
