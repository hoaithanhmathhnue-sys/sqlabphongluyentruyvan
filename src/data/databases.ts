import { DatabaseMetadata } from '../types';

export const DATABASES: DatabaseMetadata[] = [
  {
    id: 'thu_vien',
    name: 'Thư viện trường',
    description: 'Quản lý tác giả, đầu sách, độc giả học sinh và lượt mượn trả sách trong thư viện trường THPT.',
    icon: 'BookOpen',
    schemaSql: `
CREATE TABLE TacGia (
  MaTG   TEXT PRIMARY KEY,
  TenTG  TEXT NOT NULL
);

CREATE TABLE Sach (
  MaSach  TEXT PRIMARY KEY,
  TenSach TEXT NOT NULL,
  MaTG    TEXT,
  NamXB   INTEGER,
  SoLuong INTEGER,
  FOREIGN KEY (MaTG) REFERENCES TacGia(MaTG)
);

CREATE TABLE DocGia (
  MaDG  TEXT PRIMARY KEY,
  TenDG TEXT NOT NULL,
  Lop   TEXT
);

CREATE TABLE Muon (
  MaMuon   TEXT PRIMARY KEY,
  MaSach   TEXT,
  MaDG     TEXT,
  NgayMuon TEXT,
  NgayTra  TEXT,
  FOREIGN KEY (MaSach) REFERENCES Sach(MaSach),
  FOREIGN KEY (MaDG) REFERENCES DocGia(MaDG)
);
    `,
    seedSql: `
-- Dữ liệu Tác giả
INSERT INTO TacGia (MaTG, TenTG) VALUES
('TG01', 'Nam Cao'),
('TG02', 'Ngô Tất Tố'),
('TG03', 'Tô Hoài'),
('TG04', 'Nguyễn Du'),
('TG05', 'Nguyễn Nhật Ánh'),
('TG06', 'Vũ Trọng Phụng'),
('TG07', 'Arthur Conan Doyle'),
('TG08', 'Antoine de Saint-Exupéry');

-- Dữ liệu Sách
INSERT INTO Sach (MaSach, TenSach, MaTG, NamXB, SoLuong) VALUES
('S01', 'Chí Phèo', 'TG01', 2018, 15),
('S02', 'Lão Hạc', 'TG01', 2019, 12),
('S03', 'Tắt Đèn', 'TG02', 2020, 20),
('S04', 'Dế Mèn Phiêu Lưu Ký', 'TG03', 2021, 25),
('S05', 'Truyện Kiều', 'TG04', 2017, 30),
('S06', 'Mắt Biếc', 'TG05', 2020, 18),
('S07', 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'TG05', 2022, 22),
('S08', 'Số Đỏ', 'TG06', 2019, 10),
('S09', 'Sherlock Holmes Toàn Tập', 'TG07', 2021, 14),
('S10', 'Hoàng Tử Bé', 'TG08', 2023, 16);

-- Dữ liệu Độc giả
INSERT INTO DocGia (MaDG, TenDG, Lop) VALUES
('DG01', 'Trần Bảo An', '11A1'),
('DG02', 'Nguyễn Hoàng Khang', '11A1'),
('DG03', 'Lê Minh Duy', '11A2'),
('DG04', 'Phạm Quỳnh Chi', '11A2'),
('DG05', 'Vũ Đình Hải', '12A1'),
('DG06', 'Hoàng Thu Ngân', '12A1'),
('DG07', 'Đặng Thảo Vy', '12A3'),
('DG08', 'Bùi Gia Huy', '10A1');

-- Dữ liệu Mượn sách
INSERT INTO Muon (MaMuon, MaSach, MaDG, NgayMuon, NgayTra) VALUES
('M01', 'S01', 'DG01', '2024-09-05', '2024-09-15'),
('M02', 'S04', 'DG02', '2024-09-06', '2024-09-16'),
('M03', 'S06', 'DG03', '2024-09-10', NULL),
('M04', 'S07', 'DG04', '2024-09-12', '2024-09-22'),
('M05', 'S03', 'DG05', '2024-09-15', '2024-09-25'),
('M06', 'S05', 'DG06', '2024-09-18', NULL),
('M07', 'S09', 'DG07', '2024-09-20', '2024-09-30'),
('M08', 'S01', 'DG02', '2024-10-01', NULL),
('M09', 'S10', 'DG08', '2024-10-02', '2024-10-12'),
('M10', 'S06', 'DG01', '2024-10-05', NULL);
    `,
    tables: [
      {
        name: 'TacGia',
        description: 'Lưu trữ thông tin các tác giả văn học',
        sampleCount: 8,
        columns: [
          { name: 'MaTG', type: 'TEXT', isPrimary: true, description: 'Mã định danh tác giả (Khóa chính)' },
          { name: 'TenTG', type: 'TEXT', description: 'Họ và tên tác giả' }
        ]
      },
      {
        name: 'Sach',
        description: 'Danh mục sách hiện có trong thư viện',
        sampleCount: 10,
        columns: [
          { name: 'MaSach', type: 'TEXT', isPrimary: true, description: 'Mã số đầu sách (Khóa chính)' },
          { name: 'TenSach', type: 'TEXT', description: 'Tên tác phẩm' },
          { name: 'MaTG', type: 'TEXT', isForeign: true, refTable: 'TacGia', refColumn: 'MaTG', description: 'Mã tác giả sáng tác (Khóa ngoại)' },
          { name: 'NamXB', type: 'INTEGER', description: 'Năm xuất bản của cuốn sách' },
          { name: 'SoLuong', type: 'INTEGER', description: 'Số bản sách trong kho' }
        ]
      },
      {
        name: 'DocGia',
        description: 'Danh sách học sinh đăng ký thẻ thư viện',
        sampleCount: 8,
        columns: [
          { name: 'MaDG', type: 'TEXT', isPrimary: true, description: 'Mã số thẻ độc giả (Khóa chính)' },
          { name: 'TenDG', type: 'TEXT', description: 'Họ tên học sinh' },
          { name: 'Lop', type: 'TEXT', description: 'Lớp học tại trường' }
        ]
      },
      {
        name: 'Muon',
        description: 'Sổ ghi nhận các lượt mượn và trả sách',
        sampleCount: 10,
        columns: [
          { name: 'MaMuon', type: 'TEXT', isPrimary: true, description: 'Mã phiếu mượn (Khóa chính)' },
          { name: 'MaSach', type: 'TEXT', isForeign: true, refTable: 'Sach', refColumn: 'MaSach', description: 'Mã sách được mượn (Khóa ngoại)' },
          { name: 'MaDG', type: 'TEXT', isForeign: true, refTable: 'DocGia', refColumn: 'MaDG', description: 'Mã học sinh mượn sách (Khóa ngoại)' },
          { name: 'NgayMuon', type: 'TEXT', description: 'Ngày mượn sách (YYYY-MM-DD)' },
          { name: 'NgayTra', type: 'TEXT', description: 'Ngày trả sách (NULL nếu chưa trả)' }
        ]
      }
    ],
    relationships: [
      {
        id: 'rel_sach_tacgia',
        fromTable: 'Sach',
        fromColumn: 'MaTG',
        toTable: 'TacGia',
        toColumn: 'MaTG',
        type: 'n-1',
        label: 'Sach.MaTG -> TacGia.MaTG'
      },
      {
        id: 'rel_muon_sach',
        fromTable: 'Muon',
        fromColumn: 'MaSach',
        toTable: 'Sach',
        toColumn: 'MaSach',
        type: 'n-1',
        label: 'Muon.MaSach -> Sach.MaSach'
      },
      {
        id: 'rel_muon_docgia',
        fromTable: 'Muon',
        fromColumn: 'MaDG',
        toTable: 'DocGia',
        toColumn: 'MaDG',
        type: 'n-1',
        label: 'Muon.MaDG -> DocGia.MaDG'
      }
    ]
  },
  {
    id: 'quan_ly_diem',
    name: 'Quản lí điểm',
    description: 'Hệ thống quản lý lớp học, học sinh, môn học và kết quả kiểm tra học kỳ.',
    icon: 'GraduationCap',
    schemaSql: `
CREATE TABLE LopHoc (
  MaLop TEXT PRIMARY KEY,
  TenLop TEXT NOT NULL,
  GVCN TEXT
);

CREATE TABLE HocSinh (
  MaHS TEXT PRIMARY KEY,
  HoTen TEXT NOT NULL,
  GioiTinh TEXT,
  NgaySinh TEXT,
  MaLop TEXT,
  FOREIGN KEY (MaLop) REFERENCES LopHoc(MaLop)
);

CREATE TABLE MonHoc (
  MaMH TEXT PRIMARY KEY,
  TenMH TEXT NOT NULL,
  SoTiet INTEGER
);

CREATE TABLE DiemThi (
  MaDiem TEXT PRIMARY KEY,
  MaHS TEXT,
  MaMH TEXT,
  DiemGK REAL,
  DiemCK REAL,
  FOREIGN KEY (MaHS) REFERENCES HocSinh(MaHS),
  FOREIGN KEY (MaMH) REFERENCES MonHoc(MaMH)
);
    `,
    seedSql: `
INSERT INTO LopHoc (MaLop, TenLop, GVCN) VALUES
('11A1', 'Lớp 11A1 - Chuyên Toán', 'Cô Nguyễn Thị Mai'),
('11A2', 'Lớp 11A2 - Chuyên Lý', 'Thầy Lê Văn Hùng'),
('11A3', 'Lớp 11A3 - Chuyên Hóa', 'Cô Phạm Thu Trang');

INSERT INTO HocSinh (MaHS, HoTen, GioiTinh, NgaySinh, MaLop) VALUES
('HS01', 'Nguyễn An Bình', 'Nam', '2008-03-15', '11A1'),
('HS02', 'Trần Thị Cúc', 'Nữ', '2008-07-22', '11A1'),
('HS03', 'Lê Hoàng Dũng', 'Nam', '2008-01-10', '11A1'),
('HS04', 'Phạm Minh Giang', 'Nam', '2008-11-05', '11A2'),
('HS05', 'Võ Thu Hương', 'Nữ', '2008-05-19', '11A2'),
('HS06', 'Đặng Khánh Linh', 'Nữ', '2008-09-30', '11A3'),
('HS07', 'Hoàng Quốc Nam', 'Nam', '2008-12-14', '11A3'),
('HS08', 'Bùi Yến Nhi', 'Nữ', '2008-04-02', '11A3');

INSERT INTO MonHoc (MaMH, TenMH, SoTiet) VALUES
('TOAN', 'Toán học', 105),
('VAN', 'Ngữ văn', 90),
('ANH', 'Tiếng Anh', 70),
('TIN', 'Tin học', 52);

INSERT INTO DiemThi (MaDiem, MaHS, MaMH, DiemGK, DiemCK) VALUES
('D01', 'HS01', 'TOAN', 9.5, 9.0),
('D02', 'HS01', 'TIN', 10.0, 9.5),
('D03', 'HS02', 'TOAN', 8.0, 8.5),
('D04', 'HS02', 'VAN', 9.0, 9.0),
('D05', 'HS03', 'TOAN', 7.5, 8.0),
('D06', 'HS04', 'TIN', 8.5, 9.0),
('D07', 'HS05', 'ANH', 9.0, 9.5),
('D08', 'HS06', 'TOAN', 8.5, 8.5),
('D09', 'HS07', 'TIN', 6.5, 7.0),
('D10', 'HS08', 'VAN', 8.0, 8.5);
    `,
    tables: [
      {
        name: 'LopHoc',
        description: 'Danh sách các lớp trong khối',
        sampleCount: 3,
        columns: [
          { name: 'MaLop', type: 'TEXT', isPrimary: true, description: 'Mã định danh lớp' },
          { name: 'TenLop', type: 'TEXT', description: 'Tên lớp chi tiết' },
          { name: 'GVCN', type: 'TEXT', description: 'Giáo viên chủ nhiệm' }
        ]
      },
      {
        name: 'HocSinh',
        description: 'Hồ sơ học sinh',
        sampleCount: 8,
        columns: [
          { name: 'MaHS', type: 'TEXT', isPrimary: true, description: 'Mã học sinh' },
          { name: 'HoTen', type: 'TEXT', description: 'Họ và tên học sinh' },
          { name: 'GioiTinh', type: 'TEXT', description: 'Giới tính (Nam/Nữ)' },
          { name: 'NgaySinh', type: 'TEXT', description: 'Ngày sinh' },
          { name: 'MaLop', type: 'TEXT', isForeign: true, refTable: 'LopHoc', refColumn: 'MaLop', description: 'Mã lớp theo học' }
        ]
      },
      {
        name: 'MonHoc',
        description: 'Các môn học trong chương trình',
        sampleCount: 4,
        columns: [
          { name: 'MaMH', type: 'TEXT', isPrimary: true, description: 'Mã môn học' },
          { name: 'TenMH', type: 'TEXT', description: 'Tên môn học' },
          { name: 'SoTiet', type: 'INTEGER', description: 'Tổng số tiết theo PPCT' }
        ]
      },
      {
        name: 'DiemThi',
        description: 'Bảng điểm giữa kỳ và cuối kỳ',
        sampleCount: 10,
        columns: [
          { name: 'MaDiem', type: 'TEXT', isPrimary: true, description: 'Mã bảng điểm' },
          { name: 'MaHS', type: 'TEXT', isForeign: true, refTable: 'HocSinh', refColumn: 'MaHS', description: 'Mã học sinh' },
          { name: 'MaMH', type: 'TEXT', isForeign: true, refTable: 'MonHoc', refColumn: 'MaMH', description: 'Mã môn học' },
          { name: 'DiemGK', type: 'REAL', description: 'Điểm kiểm tra giữa kỳ' },
          { name: 'DiemCK', type: 'REAL', description: 'Điểm kiểm tra cuối kỳ' }
        ]
      }
    ],
    relationships: [
      {
        id: 'rel_hs_lop',
        fromTable: 'HocSinh',
        fromColumn: 'MaLop',
        toTable: 'LopHoc',
        toColumn: 'MaLop',
        type: 'n-1',
        label: 'HocSinh.MaLop -> LopHoc.MaLop'
      },
      {
        id: 'rel_diem_hs',
        fromTable: 'DiemThi',
        fromColumn: 'MaHS',
        toTable: 'HocSinh',
        toColumn: 'MaHS',
        type: 'n-1',
        label: 'DiemThi.MaHS -> HocSinh.MaHS'
      },
      {
        id: 'rel_diem_mh',
        fromTable: 'DiemThi',
        fromColumn: 'MaMH',
        toTable: 'MonHoc',
        toColumn: 'MaMH',
        type: 'n-1',
        label: 'DiemThi.MaMH -> MonHoc.MaMH'
      }
    ]
  },
  {
    id: 'ban_hang',
    name: 'Bán hàng',
    description: 'Hệ thống bán hàng trực tuyến với khách hàng, sản phẩm, đơn hàng và chi tiết sản phẩm đã mua.',
    icon: 'ShoppingCart',
    schemaSql: `
CREATE TABLE KhachHang (
  MaKH TEXT PRIMARY KEY,
  TenKH TEXT NOT NULL,
  DiaChi TEXT,
  SoDienThoai TEXT
);

CREATE TABLE SanPham (
  MaSP TEXT PRIMARY KEY,
  TenSP TEXT NOT NULL,
  DonGia INTEGER NOT NULL,
  SoLuongTon INTEGER
);

CREATE TABLE DonHang (
  MaDH TEXT PRIMARY KEY,
  MaKH TEXT,
  NgayDat TEXT,
  TrangThai TEXT,
  FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH)
);

CREATE TABLE ChiTietDonHang (
  MaCT TEXT PRIMARY KEY,
  MaDH TEXT,
  MaSP TEXT,
  SoLuongMua INTEGER,
  DonGiaBan INTEGER,
  FOREIGN KEY (MaDH) REFERENCES DonHang(MaDH),
  FOREIGN KEY (MaSP) REFERENCES SanPham(MaSP)
);
    `,
    seedSql: `
INSERT INTO KhachHang (MaKH, TenKH, DiaChi, SoDienThoai) VALUES
('KH01', 'Công ty Ánh Dương', 'Hà Nội', '0901234567'),
('KH02', 'Cửa hàng Bình Minh', 'Đà Nẵng', '0912345678'),
('KH03', 'Nguyễn Văn Thành', 'TP. Hồ Chí Minh', '0987654321'),
('KH04', 'Trần Thị Mai', 'Cần Thơ', '0933445566'),
('KH05', 'Lê Hoàng Long', 'Hải Phòng', '0977889900');

INSERT INTO SanPham (MaSP, TenSP, DonGia, SoLuongTon) VALUES
('SP01', 'Chuột không dây Logitech', 250000, 45),
('SP02', 'Bàn phím cơ DareU', 650000, 30),
('SP03', 'Tai nghe Gaming Razer', 1200000, 15),
('SP04', 'Màn hình Dell 24 inch', 3400000, 12),
('SP05', 'Cáp HDMI 2m Ugreen', 120000, 80),
('SP06', 'USB 64GB Kingston', 150000, 60);

INSERT INTO DonHang (MaDH, MaKH, NgayDat, TrangThai) VALUES
('DH01', 'KH01', '2024-10-01', 'Đã giao'),
('DH02', 'KH02', '2024-10-02', 'Đã giao'),
('DH03', 'KH03', '2024-10-05', 'Đang xử lý'),
('DH04', 'KH01', '2024-10-06', 'Đã giao'),
('DH05', 'KH04', '2024-10-08', 'Đang giao'),
('DH06', 'KH05', '2024-10-09', 'Đã hủy');

INSERT INTO ChiTietDonHang (MaCT, MaDH, MaSP, SoLuongMua, DonGiaBan) VALUES
('CT01', 'DH01', 'SP01', 2, 250000),
('CT02', 'DH01', 'SP02', 1, 650000),
('CT03', 'DH02', 'SP04', 1, 3400000),
('CT04', 'DH03', 'SP03', 1, 1200000),
('CT05', 'DH03', 'SP05', 2, 120000),
('CT06', 'DH04', 'SP01', 5, 240000),
('CT07', 'DH04', 'SP06', 3, 150000),
('CT08', 'DH05', 'SP02', 2, 650000);
    `,
    tables: [
      {
        name: 'KhachHang',
        description: 'Thông tin đối tác và người mua',
        sampleCount: 5,
        columns: [
          { name: 'MaKH', type: 'TEXT', isPrimary: true, description: 'Mã khách hàng' },
          { name: 'TenKH', type: 'TEXT', description: 'Tên hoặc công ty khách hàng' },
          { name: 'DiaChi', type: 'TEXT', description: 'Tỉnh/Thành phố' },
          { name: 'SoDienThoai', type: 'TEXT', description: 'Số điện thoại liên lạc' }
        ]
      },
      {
        name: 'SanPham',
        description: 'Danh mục mặt hàng kinh doanh',
        sampleCount: 6,
        columns: [
          { name: 'MaSP', type: 'TEXT', isPrimary: true, description: 'Mã sản phẩm' },
          { name: 'TenSP', type: 'TEXT', description: 'Tên hàng hóa' },
          { name: 'DonGia', type: 'INTEGER', description: 'Đơn giá niêm yết (VNĐ)' },
          { name: 'SoLuongTon', type: 'INTEGER', description: 'Số lượng còn trong kho' }
        ]
      },
      {
        name: 'DonHang',
        description: 'Lịch sử đặt đơn',
        sampleCount: 6,
        columns: [
          { name: 'MaDH', type: 'TEXT', isPrimary: true, description: 'Mã hóa đơn' },
          { name: 'MaKH', type: 'TEXT', isForeign: true, refTable: 'KhachHang', refColumn: 'MaKH', description: 'Khách hàng đặt mua' },
          { name: 'NgayDat', type: 'TEXT', description: 'Thời gian đặt hàng' },
          { name: 'TrangThai', type: 'TEXT', description: 'Tình trạng giao dịch' }
        ]
      },
      {
        name: 'ChiTietDonHang',
        description: 'Các sản phẩm và số lượng trong từng đơn',
        sampleCount: 8,
        columns: [
          { name: 'MaCT', type: 'TEXT', isPrimary: true, description: 'Mã dòng chi tiết' },
          { name: 'MaDH', type: 'TEXT', isForeign: true, refTable: 'DonHang', refColumn: 'MaDH', description: 'Mã đơn hàng liên quan' },
          { name: 'MaSP', type: 'TEXT', isForeign: true, refTable: 'SanPham', refColumn: 'MaSP', description: 'Mã sản phẩm được chọn' },
          { name: 'SoLuongMua', type: 'INTEGER', description: 'Số lượng mua' },
          { name: 'DonGiaBan', type: 'INTEGER', description: 'Giá bán thực tế' }
        ]
      }
    ],
    relationships: [
      {
        id: 'rel_dh_kh',
        fromTable: 'DonHang',
        fromColumn: 'MaKH',
        toTable: 'KhachHang',
        toColumn: 'MaKH',
        type: 'n-1',
        label: 'DonHang.MaKH -> KhachHang.MaKH'
      },
      {
        id: 'rel_ct_dh',
        fromTable: 'ChiTietDonHang',
        fromColumn: 'MaDH',
        toTable: 'DonHang',
        toColumn: 'MaDH',
        type: 'n-1',
        label: 'ChiTietDonHang.MaDH -> DonHang.MaDH'
      },
      {
        id: 'rel_ct_sp',
        fromTable: 'ChiTietDonHang',
        fromColumn: 'MaSP',
        toTable: 'SanPham',
        toColumn: 'MaSP',
        type: 'n-1',
        label: 'ChiTietDonHang.MaSP -> SanPham.MaSP'
      }
    ]
  }
];
