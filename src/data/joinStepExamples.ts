import { JoinDemo } from '../types';

export const JOIN_DEMOS: JoinDemo[] = [
  {
    id: 'demo_sach_tacgia',
    title: 'Liên kết Sách và Tác giả (INNER JOIN)',
    description: 'Tìm hiểu cách hệ quản trị CSDL kết nối thông tin sách với họ tên tác giả qua khóa ngoại MaTG.',
    query: `SELECT Sach.TenSach, TacGia.TenTG, Sach.NamXB
FROM Sach
INNER JOIN TacGia ON Sach.MaTG = TacGia.MaTG
WHERE Sach.NamXB >= 2020
ORDER BY Sach.NamXB DESC;`,
    tablesInvolved: ['Sach', 'TacGia'],
    steps: [
      {
        stepNumber: 1,
        title: 'Bước 1: Nạp Bảng A (Sach)',
        description: 'Hệ thống truy xuất dữ liệu từ bảng Sach làm nguồn bên trái của phép JOIN.',
        operation: 'FROM Sach',
        columns: ['MaSach', 'TenSach', 'MaTG', 'NamXB', 'SoLuong'],
        rows: [
          ['S01', 'Chí Phèo', 'TG01', 2018, 15],
          ['S02', 'Lão Hạc', 'TG01', 2019, 12],
          ['S03', 'Tắt Đèn', 'TG02', 2020, 20],
          ['S04', 'Dế Mèn Phiêu Lưu Ký', 'TG03', 2021, 25],
          ['S05', 'Truyện Kiều', 'TG04', 2017, 30],
          ['S06', 'Mắt Biếc', 'TG05', 2020, 18],
          ['S07', 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'TG05', 2022, 22],
          ['S08', 'Số Đỏ', 'TG06', 2019, 10],
          ['S09', 'Sherlock Holmes Toàn Tập', 'TG07', 2021, 14],
          ['S10', 'Hoàng Tử Bé', 'TG08', 2023, 16]
        ],
        note: 'Tất cả 10 bản ghi của bảng Sach được đưa vào bộ nhớ tạm.'
      },
      {
        stepNumber: 2,
        title: 'Bước 2: Nạp Bảng B (TacGia)',
        description: 'Hệ thống đọc bảng tham chiếu TacGia làm nguồn bên phải của phép JOIN.',
        operation: 'INNER JOIN TacGia',
        columns: ['MaTG', 'TenTG'],
        rows: [
          ['TG01', 'Nam Cao'],
          ['TG02', 'Ngô Tất Tố'],
          ['TG03', 'Tô Hoài'],
          ['TG04', 'Nguyễn Du'],
          ['TG05', 'Nguyễn Nhật Ánh'],
          ['TG06', 'Vũ Trọng Phụng'],
          ['TG07', 'Arthur Conan Doyle'],
          ['TG08', 'Antoine de Saint-Exupéry']
        ],
        note: 'Bảng TacGia chứa khóa chính MaTG tương ứng.'
      },
      {
        stepNumber: 3,
        title: 'Bước 3: Khớp điều kiện liên kết (ON Sach.MaTG = TacGia.MaTG)',
        description: 'So sánh từng dòng của Sach với TacGia. Chỉ giữ lại những dòng có giá trị MaTG trùng khớp ở cả 2 bảng.',
        operation: 'ON Sach.MaTG = TacGia.MaTG',
        columns: ['Sach.MaSach', 'Sach.TenSach', 'Sach.MaTG', 'TacGia.TenTG', 'Sach.NamXB'],
        rows: [
          ['S01', 'Chí Phèo', 'TG01', 'Nam Cao', 2018],
          ['S02', 'Lão Hạc', 'TG01', 'Nam Cao', 2019],
          ['S03', 'Tắt Đèn', 'TG02', 'Ngô Tất Tố', 2020],
          ['S04', 'Dế Mèn Phiêu Lưu Ký', 'TG03', 'Tô Hoài', 2021],
          ['S05', 'Truyện Kiều', 'TG04', 'Nguyễn Du', 2017],
          ['S06', 'Mắt Biếc', 'TG05', 'Nguyễn Nhật Ánh', 2020],
          ['S07', 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'TG05', 'Nguyễn Nhật Ánh', 2022],
          ['S08', 'Số Đỏ', 'TG06', 'Vũ Trọng Phụng', 2019],
          ['S09', 'Sherlock Holmes Toàn Tập', 'TG07', 'Arthur Conan Doyle', 2021],
          ['S10', 'Hoàng Tử Bé', 'TG08', 'Antoine de Saint-Exupéry', 2023]
        ],
        highlightedRowIndices: [2, 3, 5, 6, 8, 9],
        note: 'Bảng tạm sau ghép nối gồm các cột của cả 2 bảng được ghép chính xác theo khóa ngoại.'
      },
      {
        stepNumber: 4,
        title: 'Bước 4: Lọc điều kiện (WHERE Sach.NamXB >= 2020)',
        description: 'Loại bỏ những dòng không thỏa mãn năm xuất bản >= 2020 (các sách xuất bản trước 2020 như Chí Phèo, Lão Hạc, Số Đỏ, Truyện Kiều bị loại bỏ).',
        operation: 'WHERE Sach.NamXB >= 2020',
        columns: ['Sach.MaSach', 'Sach.TenSach', 'TacGia.TenTG', 'Sach.NamXB'],
        rows: [
          ['S03', 'Tắt Đèn', 'Ngô Tất Tố', 2020],
          ['S04', 'Dế Mèn Phiêu Lưu Ký', 'Tô Hoài', 2021],
          ['S06', 'Mắt Biếc', 'Nguyễn Nhật Ánh', 2020],
          ['S07', 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'Nguyễn Nhật Ánh', 2022],
          ['S09', 'Sherlock Holmes Toàn Tập', 'Arthur Conan Doyle', 2021],
          ['S10', 'Hoàng Tử Bé', 'Antoine de Saint-Exupéry', 2023]
        ],
        note: 'Còn lại 6 bản ghi thỏa mãn điều kiện lọc thời gian.'
      },
      {
        stepNumber: 5,
        title: 'Bước 5: Chiếu cột và Sắp xếp (SELECT ... ORDER BY NamXB DESC)',
        description: 'Chỉ chọn các cột cần thiết (TenSach, TenTG, NamXB) và sắp xếp kết quả theo năm xuất bản từ mới nhất đến cũ nhất.',
        operation: 'SELECT Sach.TenSach, TacGia.TenTG, Sach.NamXB ORDER BY NamXB DESC',
        columns: ['TenSach', 'TenTG', 'NamXB'],
        rows: [
          ['Hoàng Tử Bé', 'Antoine de Saint-Exupéry', 2023],
          ['Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'Nguyễn Nhật Ánh', 2022],
          ['Dế Mèn Phiêu Lưu Ký', 'Tô Hoài', 2021],
          ['Sherlock Holmes Toàn Tập', 'Arthur Conan Doyle', 2021],
          ['Tắt Đèn', 'Ngô Tất Tố', 2020],
          ['Mắt Biếc', 'Nguyễn Nhật Ánh', 2020]
        ],
        note: 'Đây là bảng kết quả cuối cùng mà người dùng nhìn thấy trên màn hình!'
      }
    ]
  },
  {
    id: 'demo_muon_docgia',
    title: 'Liên kết Phiếu mượn và Độc giả',
    description: 'Minh họa cơ chế nối bảng Muon với DocGia để hiển thị tên độc giả và lớp mượn sách.',
    query: `SELECT Muon.MaMuon, DocGia.TenDG, DocGia.Lop, Muon.NgayMuon
FROM Muon
INNER JOIN DocGia ON Muon.MaDG = DocGia.MaDG
WHERE DocGia.Lop = '11A1';`,
    tablesInvolved: ['Muon', 'DocGia'],
    steps: [
      {
        stepNumber: 1,
        title: 'Bước 1: Nạp Bảng Muon',
        description: 'Đọc danh sách 10 phiếu mượn từ bảng Muon.',
        operation: 'FROM Muon',
        columns: ['MaMuon', 'MaSach', 'MaDG', 'NgayMuon', 'NgayTra'],
        rows: [
          ['M01', 'S01', 'DG01', '2024-09-05', '2024-09-15'],
          ['M02', 'S04', 'DG02', '2024-09-06', '2024-09-16'],
          ['M03', 'S06', 'DG03', '2024-09-10', null],
          ['M04', 'S07', 'DG04', '2024-09-12', '2024-09-22'],
          ['M05', 'S03', 'DG05', '2024-09-15', '2024-09-25'],
          ['M06', 'S05', 'DG06', '2024-09-18', null],
          ['M07', 'S09', 'DG07', '2024-09-20', '2024-09-30'],
          ['M08', 'S01', 'DG02', '2024-10-01', null],
          ['M09', 'S10', 'DG08', '2024-10-02', '2024-10-12'],
          ['M10', 'S06', 'DG01', '2024-10-05', null]
        ],
        note: 'Bảng gốc Muon có các trường khóa ngoại MaDG.'
      },
      {
        stepNumber: 2,
        title: 'Bước 2: Nạp Bảng DocGia',
        description: 'Đọc thông tin độc giả chứa mã MaDG và tên học sinh.',
        operation: 'INNER JOIN DocGia',
        columns: ['MaDG', 'TenDG', 'Lop'],
        rows: [
          ['DG01', 'Trần Bảo An', '11A1'],
          ['DG02', 'Nguyễn Hoàng Khang', '11A1'],
          ['DG03', 'Lê Minh Duy', '11A2'],
          ['DG04', 'Phạm Quỳnh Chi', '11A2'],
          ['DG05', 'Vũ Đình Hải', '12A1'],
          ['DG06', 'Hoàng Thu Ngân', '12A1'],
          ['DG07', 'Đặng Thảo Vy', '12A3'],
          ['DG08', 'Bùi Gia Huy', '10A1']
        ],
        note: 'Các độc giả lớp 11A1 là DG01 và DG02.'
      },
      {
        stepNumber: 3,
        title: 'Bước 3: Ghép nối theo điều kiện (ON Muon.MaDG = DocGia.MaDG)',
        description: 'Tạo bảng kết hợp bằng cách tìm độc giả tương ứng cho mỗi phiếu mượn.',
        operation: 'ON Muon.MaDG = DocGia.MaDG',
        columns: ['MaMuon', 'TenDG', 'Lop', 'NgayMuon', 'NgayTra'],
        rows: [
          ['M01', 'Trần Bảo An', '11A1', '2024-09-05', '2024-09-15'],
          ['M02', 'Nguyễn Hoàng Khang', '11A1', '2024-09-06', '2024-09-16'],
          ['M03', 'Lê Minh Duy', '11A2', '2024-09-10', null],
          ['M04', 'Phạm Quỳnh Chi', '11A2', '2024-09-12', '2024-09-22'],
          ['M05', 'Vũ Đình Hải', '12A1', '2024-09-15', '2024-09-25'],
          ['M06', 'Hoàng Thu Ngân', '12A1', '2024-09-18', null],
          ['M07', 'Đặng Thảo Vy', '12A3', '2024-09-20', '2024-09-30'],
          ['M08', 'Nguyễn Hoàng Khang', '11A1', '2024-10-01', null],
          ['M09', 'Bùi Gia Huy', '10A1', '2024-10-02', '2024-10-12'],
          ['M10', 'Trần Bảo An', '11A1', '2024-10-05', null]
        ],
        highlightedRowIndices: [0, 1, 7, 9],
        note: 'Có 4 lượt mượn thuộc về học sinh lớp 11A1.'
      },
      {
        stepNumber: 4,
        title: 'Bước 4: Lọc theo lớp (WHERE DocGia.Lop = \'11A1\') và Chiếu SELECT',
        description: 'Lọc các dòng thuộc lớp 11A1 và chỉ hiển thị các cột được chỉ định trong câu lệnh SELECT.',
        operation: 'WHERE DocGia.Lop = \'11A1\' -> SELECT MaMuon, TenDG, Lop, NgayMuon',
        columns: ['MaMuon', 'TenDG', 'Lop', 'NgayMuon'],
        rows: [
          ['M01', 'Trần Bảo An', '11A1', '2024-09-05'],
          ['M02', 'Nguyễn Hoàng Khang', '11A1', '2024-09-06'],
          ['M08', 'Nguyễn Hoàng Khang', '11A1', '2024-10-01'],
          ['M10', 'Trần Bảo An', '11A1', '2024-10-05']
        ],
        note: 'Kết quả cuối cùng hiển thị 4 lượt mượn của 2 bạn học sinh lớp 11A1.'
      }
    ]
  }
];
