import { TaskItem } from '../types';

export const TASKS: TaskItem[] = [
  // ================= THƯ VIỆN TRƯỜNG =================
  // 1. Nhận biết (3 bài)
  {
    id: 'tv_nb_01',
    dbId: 'thu_vien',
    title: 'Danh sách toàn bộ tác giả',
    level: 'nhan_biet',
    prompt: 'Viết truy vấn để hiển thị toàn bộ thông tin của tất cả các tác giả trong bảng TacGia.',
    solutionQuery: 'SELECT * FROM TacGia;',
    orderSensitive: false,
    hint: 'Sử dụng lệnh SELECT * FROM ... để lấy tất cả các cột và dòng trong bảng.',
    detailedExplanation: 'Cú pháp SELECT * FROM TacGia; truy xuất toàn bộ dữ liệu tác giả mà không cần điều kiện lọc.',
    points: 5,
    initialQuery: 'SELECT * FROM TacGia;'
  },
  {
    id: 'tv_nb_02',
    dbId: 'thu_vien',
    title: 'Tra cứu mã sách và tên sách',
    level: 'nhan_biet',
    prompt: 'Hiển thị danh sách gồm hai cột: MaSach và TenSach từ bảng Sach.',
    solutionQuery: 'SELECT MaSach, TenSach FROM Sach;',
    orderSensitive: false,
    hint: 'Liệt kê các cột cần lấy sau từ khóa SELECT, ngăn cách bằng dấu phẩy.',
    detailedExplanation: 'Chọn lọc các cột cụ thể giúp tối ưu hiệu năng và hiển thị đúng thông tin cần thiết.',
    points: 5,
    initialQuery: 'SELECT MaSach, TenSach FROM Sach;'
  },
  {
    id: 'tv_nb_03',
    dbId: 'thu_vien',
    title: 'Thông tin học sinh mượn sách',
    level: 'nhan_biet',
    prompt: 'Lấy thông tin gồm MaDG, TenDG và Lop của toàn bộ độc giả trong bảng DocGia.',
    solutionQuery: 'SELECT MaDG, TenDG, Lop FROM DocGia;',
    orderSensitive: false,
    hint: 'Liệt kê các trường MaDG, TenDG, Lop sau từ khóa SELECT và chỉ định bảng DocGia.',
    detailedExplanation: 'Đọc dữ liệu từ bảng DocGia để xem danh sách bạn đọc đăng ký thẻ thư viện.',
    points: 5,
    initialQuery: 'SELECT MaDG, TenDG, Lop FROM DocGia;'
  },

  // 2. Thông hiểu (3 bài)
  {
    id: 'tv_th_01',
    dbId: 'thu_vien',
    title: 'Lọc sách xuất bản từ năm 2020 trở lại đây',
    level: 'thong_hieu',
    prompt: 'Liệt kê TenSach và NamXB của các cuốn sách xuất bản từ năm 2020 trở đi (NamXB >= 2020), sắp xếp giảm dần theo năm xuất bản.',
    solutionQuery: 'SELECT TenSach, NamXB FROM Sach WHERE NamXB >= 2020 ORDER BY NamXB DESC;',
    orderSensitive: true,
    hint: 'Sử dụng mệnh đề WHERE NamXB >= 2020 để lọc và ORDER BY NamXB DESC để sắp xếp giảm dần.',
    detailedExplanation: 'Mệnh đề WHERE lọc các bản ghi thỏa mãn điều kiện số học, còn ORDER BY ... DESC xếp các năm lớn nhất lên đầu.',
    points: 10,
    initialQuery: 'SELECT TenSach, NamXB\nFROM Sach\nWHERE NamXB >= 2020\nORDER BY NamXB DESC;'
  },
  {
    id: 'tv_th_02',
    dbId: 'thu_vien',
    title: 'Đếm tổng số lượt mượn sách',
    level: 'thong_hieu',
    prompt: 'Đếm xem có bao nhiêu lượt mượn sách đã được ghi nhận trong bảng Muon. Đặt tên cột kết quả là SoLuotMuon.',
    solutionQuery: 'SELECT COUNT(*) AS SoLuotMuon FROM Muon;',
    orderSensitive: false,
    hint: 'Sử dụng hàm gộp COUNT(*) kết hợp bí danh cột AS SoLuotMuon.',
    detailedExplanation: 'Hàm COUNT(*) đếm toàn bộ số dòng bản ghi trong bảng Muon.',
    points: 10,
    initialQuery: 'SELECT COUNT(*) AS SoLuotMuon FROM Muon;'
  },
  {
    id: 'tv_th_03',
    dbId: 'thu_vien',
    title: 'Tính tổng số lượng sách trong kho',
    level: 'thong_hieu',
    prompt: 'Tính tổng số lượng tất cả các cuốn sách hiện có trong bảng Sach. Đặt tên cột kết quả là TongSoLuong.',
    solutionQuery: 'SELECT SUM(SoLuong) AS TongSoLuong FROM Sach;',
    orderSensitive: false,
    hint: 'Sử dụng hàm SUM(SoLuong) với bí danh AS TongSoLuong.',
    detailedExplanation: 'Hàm SUM tính tổng giá trị của cột số SoLuong trong toàn bộ bảng Sach.',
    points: 10,
    initialQuery: 'SELECT SUM(SoLuong) AS TongSoLuong FROM Sach;'
  },

  // 3. Vận dụng (3 bài)
  {
    id: 'tv_vd_01',
    dbId: 'thu_vien',
    title: 'Liên kết Tác giả và Tác phẩm (JOIN)',
    level: 'van_dung',
    prompt: 'Hiển thị TenSach và TenTG tương ứng của mỗi cuốn sách bằng cách liên kết bảng Sach và bảng TacGia theo MaTG.',
    solutionQuery: 'SELECT Sach.TenSach, TacGia.TenTG FROM Sach INNER JOIN TacGia ON Sach.MaTG = TacGia.MaTG;',
    orderSensitive: false,
    hint: 'Sử dụng INNER JOIN giữa Sach và TacGia với điều kiện ON Sach.MaTG = TacGia.MaTG.',
    detailedExplanation: 'Phép JOIN kết nối hai bảng qua khóa ngoại MaTG để hiển thị tên tác giả thay vì mã ký hiệu.',
    points: 15,
    initialQuery: 'SELECT Sach.TenSach, TacGia.TenTG\nFROM Sach\nINNER JOIN TacGia ON Sach.MaTG = TacGia.MaTG;'
  },
  {
    id: 'tv_vd_02',
    dbId: 'thu_vien',
    title: 'Thống kê số lượng đầu sách theo tác giả',
    level: 'van_dung',
    prompt: 'Đếm số đầu sách của từng tác giả. Kết quả gồm TenTG và SoDauSach (dùng COUNT(*)), chỉ lấy những tác giả có từ 2 đầu sách trở lên.',
    solutionQuery: 'SELECT TacGia.TenTG, COUNT(*) AS SoDauSach FROM Sach INNER JOIN TacGia ON Sach.MaTG = TacGia.MaTG GROUP BY TacGia.TenTG HAVING COUNT(*) >= 2;',
    orderSensitive: false,
    hint: 'Kết hợp JOIN, GROUP BY TacGia.TenTG và điều kiện lọc sau nhóm HAVING COUNT(*) >= 2.',
    detailedExplanation: 'GROUP BY gom các sách cùng tác giả lại, sau đó HAVING lọc các nhóm có số lượng bản ghi thỏa mãn điều kiện >= 2.',
    points: 15,
    initialQuery: 'SELECT TacGia.TenTG, COUNT(*) AS SoDauSach\nFROM Sach\nINNER JOIN TacGia ON Sach.MaTG = TacGia.MaTG\nGROUP BY TacGia.TenTG\nHAVING COUNT(*) >= 2;'
  },
  {
    id: 'tv_vd_03',
    dbId: 'thu_vien',
    title: 'Danh sách học sinh đang mượn sách chưa trả',
    level: 'van_dung',
    prompt: 'Hiển thị TenDG, Lop và TenSach của những lượt mượn chưa trả sách (NgayTra IS NULL).',
    solutionQuery: 'SELECT DocGia.TenDG, DocGia.Lop, Sach.TenSach FROM Muon INNER JOIN DocGia ON Muon.MaDG = DocGia.MaDG INNER JOIN Sach ON Muon.MaSach = Sach.MaSach WHERE Muon.NgayTra IS NULL;',
    orderSensitive: false,
    hint: 'Nối 3 bảng Muon, DocGia, Sach và sử dụng điều kiện WHERE Muon.NgayTra IS NULL.',
    detailedExplanation: 'Cần nối 3 bảng qua 2 khóa ngoại MaDG và MaSach, sau đó lọc những phiếu mượn có trường NgayTra bằng NULL.',
    points: 15,
    initialQuery: 'SELECT DocGia.TenDG, DocGia.Lop, Sach.TenSach\nFROM Muon\nINNER JOIN DocGia ON Muon.MaDG = DocGia.MaDG\nINNER JOIN Sach ON Muon.MaSach = Sach.MaSach\nWHERE Muon.NgayTra IS NULL;'
  },

  // ================= QUẢN LÍ ĐIỂM =================
  {
    id: 'diem_nb_01',
    dbId: 'quan_ly_diem',
    title: 'Danh sách học sinh toàn trường',
    level: 'nhan_biet',
    prompt: 'Hiển thị MaHS, HoTen và GioiTinh của tất cả học sinh trong bảng HocSinh.',
    solutionQuery: 'SELECT MaHS, HoTen, GioiTinh FROM HocSinh;',
    orderSensitive: false,
    hint: 'Dùng lệnh SELECT các cột MaHS, HoTen, GioiTinh từ bảng HocSinh.',
    detailedExplanation: 'Truy vấn danh sách thông tin cơ bản của học sinh.',
    points: 5,
    initialQuery: 'SELECT MaHS, HoTen, GioiTinh FROM HocSinh;'
  },
  {
    id: 'diem_th_01',
    dbId: 'quan_ly_diem',
    title: 'Lọc học sinh nữ lớp 11A1',
    level: 'thong_hieu',
    prompt: 'Tìm các học sinh nữ (GioiTinh = \'Nữ\') thuộc lớp 11A1 (MaLop = \'11A1\'). Hiển thị HoTen và NgaySinh.',
    solutionQuery: "SELECT HoTen, NgaySinh FROM HocSinh WHERE GioiTinh = 'Nữ' AND MaLop = '11A1';",
    orderSensitive: false,
    hint: 'Dùng toán tử logic AND để kết hợp hai điều kiện: GioiTinh = \'Nữ\' AND MaLop = \'11A1\'.',
    detailedExplanation: 'Toán tử AND đòi hỏi bản ghi phải thỏa mãn đồng thời cả 2 điều kiện lọc.',
    points: 10,
    initialQuery: "SELECT HoTen, NgaySinh FROM HocSinh WHERE GioiTinh = 'Nữ' AND MaLop = '11A1';"
  },
  {
    id: 'diem_vd_01',
    dbId: 'quan_ly_diem',
    title: 'Bảng điểm chi tiết kèm họ tên học sinh',
    level: 'van_dung',
    prompt: 'Hiển thị HoTen của học sinh, TenMH của môn học, DiemGK và DiemCK bằng cách kết nối 3 bảng HocSinh, MonHoc và DiemThi.',
    solutionQuery: 'SELECT HocSinh.HoTen, MonHoc.TenMH, DiemThi.DiemGK, DiemThi.DiemCK FROM DiemThi INNER JOIN HocSinh ON DiemThi.MaHS = HocSinh.MaHS INNER JOIN MonHoc ON DiemThi.MaMH = MonHoc.MaMH;',
    orderSensitive: false,
    hint: 'Liên kết DiemThi với HocSinh qua MaHS và với MonHoc qua MaMH.',
    detailedExplanation: 'Truy vấn JOIN đa bảng cho phép tổng hợp thông tin học sinh và môn học vào bảng kết quả điểm.',
    points: 15,
    initialQuery: 'SELECT HocSinh.HoTen, MonHoc.TenMH, DiemThi.DiemGK, DiemThi.DiemCK\nFROM DiemThi\nINNER JOIN HocSinh ON DiemThi.MaHS = HocSinh.MaHS\nINNER JOIN MonHoc ON DiemThi.MaMH = MonHoc.MaMH;'
  },

  // ================= BÁN HÀNG =================
  {
    id: 'bh_nb_01',
    dbId: 'ban_hang',
    title: 'Xem danh mục sản phẩm',
    level: 'nhan_biet',
    prompt: 'Hiển thị TenSP và DonGia của tất cả sản phẩm trong bảng SanPham.',
    solutionQuery: 'SELECT TenSP, DonGia FROM SanPham;',
    orderSensitive: false,
    hint: 'Lấy 2 cột TenSP và DonGia từ bảng SanPham.',
    detailedExplanation: 'Xem bảng giá niêm yết của các mặt hàng.',
    points: 5,
    initialQuery: 'SELECT TenSP, DonGia FROM SanPham;'
  },
  {
    id: 'bh_th_01',
    dbId: 'ban_hang',
    title: 'Sản phẩm có giá trên 500.000 VNĐ',
    level: 'thong_hieu',
    prompt: 'Tìm các sản phẩm có DonGia > 500000, hiển thị TenSP và DonGia sắp xếp giảm dần theo giá.',
    solutionQuery: 'SELECT TenSP, DonGia FROM SanPham WHERE DonGia > 500000 ORDER BY DonGia DESC;',
    orderSensitive: true,
    hint: 'WHERE DonGia > 500000 kết hợp ORDER BY DonGia DESC.',
    detailedExplanation: 'Lọc các sản phẩm thuộc phân khúc giá cao và xếp giảm dần để dễ so sánh.',
    points: 10,
    initialQuery: 'SELECT TenSP, DonGia FROM SanPham WHERE DonGia > 500000 ORDER BY DonGia DESC;'
  },
  {
    id: 'bh_vd_01',
    dbId: 'ban_hang',
    title: 'Tổng tiền mua hàng theo từng đơn (GROUP BY)',
    level: 'van_dung',
    prompt: 'Tính tổng thành tiền của từng đơn hàng trong ChiTietDonHang (thành tiền = SoLuongMua * DonGiaBan). Hiển thị MaDH và TongTien (dùng SUM(SoLuongMua * DonGiaBan)).',
    solutionQuery: 'SELECT MaDH, SUM(SoLuongMua * DonGiaBan) AS TongTien FROM ChiTietDonHang GROUP BY MaDH;',
    orderSensitive: false,
    hint: 'Dùng GROUP BY MaDH và SUM(SoLuongMua * DonGiaBan) AS TongTien.',
    detailedExplanation: 'Biểu thức tính toán kết hợp hàm tổng hợp SUM được tính riêng cho từng nhóm mã đơn hàng MaDH.',
    points: 15,
    initialQuery: 'SELECT MaDH, SUM(SoLuongMua * DonGiaBan) AS TongTien\nFROM ChiTietDonHang\nGROUP BY MaDH;'
  }
];
