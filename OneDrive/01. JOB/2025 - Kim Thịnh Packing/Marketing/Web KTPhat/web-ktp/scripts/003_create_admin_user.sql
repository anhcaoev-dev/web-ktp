-- Script để tạo admin user
-- Hướng dẫn: Sửa email, tên, và password_hash dưới đây
-- Sau đó copy-paste toàn bộ script vào Supabase SQL Editor và chạy

-- BƯỚC 1: Tạo SHA256 hash từ mật khẩu
-- Mở Terminal/Command Prompt và chạy lệnh Node.js này:
-- node -e "console.log(require('crypto').createHash('sha256').update('YOUR_PASSWORD_HERE' + 'admin_salt_key').digest('hex'))"
-- Ví dụ: Nếu password là "admin123", chạy:
-- node -e "console.log(require('crypto').createHash('sha256').update('admin123' + 'admin_salt_key').digest('hex'))"
-- Copy hash kết quả (dạng 64 ký tự hex) và dán vào dưới đây

-- BƯỚC 2: Thay thế các giá trị sau
-- - 'kimthanhphatbb@gmail.com' → email của bạn
-- - 'Admin' → tên admin
-- - Hash SHA256 (64 ký tự hex)

INSERT INTO admin_users (email, name, password_hash, role, is_active, created_at, updated_at)
VALUES (
  'kimthanhphatbb@gmail.com',
  'Admin',
  '7fe4670a87ab6fb6475a6dc10e005c7e454c00c187e43c474d143cf8a9087876',
  'admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
