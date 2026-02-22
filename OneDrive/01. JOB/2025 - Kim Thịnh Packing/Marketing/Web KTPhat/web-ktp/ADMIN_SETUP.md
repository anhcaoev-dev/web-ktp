# Hướng Dẫn Tạo Tài Khoản Admin

## Cách Tạo Admin User An Toàn

Để bảo mật tối đa, chúng tôi sử dụng cách tạo admin user trực tiếp từ database thay vì qua web interface.

### Bước 1: Tạo SHA256 Hash cho Mật Khẩu

Chạy lệnh Node.js này để tạo SHA256 hash cho mật khẩu:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('your_secure_password_here' + 'admin_salt_key').digest('hex'))"
```

Thay `your_secure_password_here` bằng mật khẩu thực tế của bạn.

**Ví dụ:**
```bash
node -e "console.log(require('crypto').createHash('sha256').update('MySecureAdmin@2024' + 'admin_salt_key').digest('hex'))"
```

Kết quả sẽ là một hash SHA256 dài 64 ký tự, ví dụ:
```
5f8c1b9e2d4a7c3f6b8e1d9c2a5f8b3e7d4c1b9e2f5a8c3b6e9d2f5a8b1c4e
```

### Bước 2: Sửa File Migration Script

Mở file `scripts/003_create_admin_user.sql` và sửa:

1. **Email**: Thay `kimthanhphatbb@gmail.com` bằng email admin của bạn
2. **Tên**: Thay `Admin` bằng tên admin
3. **Password Hash**: Thay hash SHA256 bằng hash bạn tạo ở bước 1

### Bước 3: Chạy Migration Script

Sử dụng Supabase Dashboard:

1. Vào https://app.supabase.com
2. Chọn project của bạn
3. Vào **SQL Editor**
4. Copy nội dung từ `scripts/003_create_admin_user.sql`
5. Paste vào SQL Editor
6. Click **Run**

### Bước 4: Đăng Nhập Admin

Truy cập `/admin/dang-nhap` và đăng nhập bằng:
- **Email**: Email bạn đã đặt ở bước 2
- **Mật khẩu**: Mật khẩu bạn tạo ở bước 1

## Bảo Mật

⚠️ **LƯU Ý QUAN TRỌNG:**
- Chỉ chạy script migration này **một lần duy nhất**
- Sử dụng mật khẩu **mạnh và bảo mật** (ít nhất 12 ký tự, mix chữ hoa/thường/số/ký tự đặc biệt)
- Bảo mật hash SHA256 - không chia sẻ với ai
- Xóa hash từ lịch sử command shell nếu cần
- Hệ thống sử dụng `admin_salt_key` như một secret salt cho SHA256 hashing

## Thay Đổi Mật Khẩu Admin

Để thay đổi mật khẩu, chạy query SQL:

```sql
UPDATE admin_users 
SET password_hash = 'your_new_sha256_hash_here'
WHERE email = 'kimthanhphatbb@gmail.com';
```

Lưu ý: Bạn cần tạo SHA256 hash mới bằng cách sử dụng lệnh Node.js ở bước 1.

## Troubleshooting

### "Email hoặc mật khẩu không chính xác"

1. Kiểm tra email đúng chưa
2. Kiểm tra mật khẩu có trùng với mật khẩu khi tạo không
3. Kiểm tra hash SHA256 có đúng không trong database (phải tạo bằng lệnh Node.js ở bước 1)
4. Kiểm tra user có is_active = true không
5. Đảm bảo bạn dùng **đúng salt** (`admin_salt_key`) khi tạo hash

## Quản Lý User Admin

Để xem danh sách admin:

```sql
SELECT id, email, name, role, is_active, created_at FROM admin_users;
```

Để vô hiệu hóa admin:

```sql
UPDATE admin_users 
SET is_active = false
WHERE email = 'admin@baobikimphat.com';
```
