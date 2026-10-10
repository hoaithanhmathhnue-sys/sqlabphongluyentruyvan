-- ============================================================
-- SQLAB: KỊCH BẢN TẠO CƠ SỞ DỮ LIỆU "THƯ VIỆN TRƯỜNG"
-- Môn: Tin học 11 & 12 - Mạch CSDL quan hệ
-- ============================================================

-- 1. Bảng Tác giả (TacGia)
CREATE TABLE TacGia (
  MaTG   TEXT PRIMARY KEY,
  TenTG  TEXT NOT NULL
);

-- 2. Bảng Sách (Sach)
CREATE TABLE Sach (
  MaSach  TEXT PRIMARY KEY,
  TenSach TEXT NOT NULL,
  MaTG    TEXT,
  NamXB   INTEGER,
  SoLuong INTEGER,
  FOREIGN KEY (MaTG) REFERENCES TacGia(MaTG)
);

-- 3. Bảng Độc giả (DocGia)
CREATE TABLE DocGia (
  MaDG  TEXT PRIMARY KEY,
  TenDG TEXT NOT NULL,
  Lop   TEXT
);

-- 4. Bảng Mượn trả (Muon)
CREATE TABLE Muon (
  MaMuon   TEXT PRIMARY KEY,
  MaSach   TEXT,
  MaDG     TEXT,
  NgayMuon TEXT,
  NgayTra  TEXT,
  FOREIGN KEY (MaSach) REFERENCES Sach(MaSach),
  FOREIGN KEY (MaDG) REFERENCES DocGia(MaDG)
);

-- ============================================================
-- NẠP DỮ LIỆU MẪU (INSERT VALUES)
-- ============================================================

INSERT INTO TacGia (MaTG, TenTG) VALUES
('TG01', 'Nam Cao'),
('TG02', 'Ngô Tất Tố'),
('TG03', 'Tô Hoài'),
('TG04', 'Nguyễn Du'),
('TG05', 'Nguyễn Nhật Ánh'),
('TG06', 'Vũ Trọng Phụng'),
('TG07', 'Arthur Conan Doyle'),
('TG08', 'Antoine de Saint-Exupéry');

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

INSERT INTO DocGia (MaDG, TenDG, Lop) VALUES
('DG01', 'Trần Bảo An', '11A1'),
('DG02', 'Nguyễn Hoàng Khang', '11A1'),
('DG03', 'Lê Minh Duy', '11A2'),
('DG04', 'Phạm Quỳnh Chi', '11A2'),
('DG05', 'Vũ Đình Hải', '12A1'),
('DG06', 'Hoàng Thu Ngân', '12A1'),
('DG07', 'Đặng Thảo Vy', '12A3'),
('DG08', 'Bùi Gia Huy', '10A1');

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
