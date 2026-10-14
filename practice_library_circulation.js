class LibraryCirculationManager {
  constructor() {
    this.circulationLogs = [];
  }

  // Create: Mượn sách mới
  borrowBook(logId, studentCode, bookIsbn) {
    const newLog = {
      logId,
      studentCode,
      bookIsbn,
      borrowDate: new Date(),
      status: 'BORROWING',
      fineAmount: 0
    };
    this.circulationLogs.push(newLog);
    console.log(`[CREATE] Đã ghi nhận mượn sách thành công cho sinh viên: ${studentCode}`);
  }

  // Update: Trả sách và tính phí phạt
  returnBook(logId, isLost = false, overdueDays = 0) {
    const log = this.circulationLogs.find(item => item.logId === logId);
    if (!log) {
      console.log(`[ERROR] Không tìm thấy mã giao dịch: ${logId}`);
      return;
    }

    log.status = 'RETURNED';
    let fine = 0;

    if (isLost) {
      fine += 200000;
      console.log(`[INFO] Sách ${log.bookIsbn} bị báo mất. Phạt đền bù: 200.000 VNĐ`);
    } else if (overdueDays > 0) {
      fine += overdueDays * 5000;
      console.log(`[INFO] Sách trả trễ ${overdueDays} ngày. Phạt trễ hạn: ${overdueDays * 5000} VNĐ`);
    }

    log.fineAmount = fine;
    console.log(`[UPDATE] Đã hoàn tất trả sách cho giao dịch: ${logId}. Tổng tiền phạt: ${fine} VNĐ`);
  }

  // Delete: Xóa nhật ký đã hoàn tất và quá 30 ngày
  cleanupOldLogs(currentDate = new Date()) {
    const initialCount = this.circulationLogs.length;
    this.circulationLogs = this.circulationLogs.filter(log => {
      if (log.status === 'RETURNED') {
        const diffTime = Math.abs(currentDate - log.borrowDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // Giữ lại nếu chưa quá 30 ngày
        return diffDays <= 30;
      }
      return true;
    });
    const deletedCount = initialCount - this.circulationLogs.length;
    console.log(`[DELETE] Đã dọn dẹp ${deletedCount} bản ghi cũ hoàn tất quá 30 ngày.`);
  }

  // Read: Báo cáo tổng kết lưu chuyển và tài chính
  generateDailyReport() {
    const borrowingCount = this.circulationLogs.filter(log => log.status === 'BORROWING').length;
    const totalFines = this.circulationLogs.reduce((sum, log) => sum + log.fineAmount, 0);

    console.log('--- BÁO CÁO TỔNG KẾT LƯU CHUYỂN THƯ VIỆN ---');
    console.log(`- Tổng số sách đang được mượn: ${borrowingCount}`);
    console.log(`- Tổng số tiền phạt thu được: ${totalFines.toLocaleString('vi-VN')} VNĐ`);
    console.log('------------------------------------------');
  }
}

// --- Kịch bản mô phỏng một ngày vận hành ---
const manager = new LibraryCirculationManager();

// 1. Mượn sách mới
manager.borrowBook('LOG001', 'SV001', 'ISBN-978-013');
manager.borrowBook('LOG002', 'SV002', 'ISBN-978-024');
manager.borrowBook('LOG003', 'SV003', 'ISBN-978-035');

// 2. Trả sách (Có phát sinh phạt trễ hạn và mất sách)
manager.returnBook('LOG001', false, 3); // Trả trễ 3 ngày -> 15.000 VNĐ
manager.returnBook('LOG002', true, 0);  // Làm mất sách -> 200.000 VNĐ

// 3. Xuất báo cáo tổng kết
manager.generateDailyReport();

// 4. Dọn dẹp nhật ký cũ
manager.cleanupOldLogs();
