# Hướng dẫn Upload Source lên GitHub và Deploy lên Vercel

## Phần 1: Upload Source lên GitHub

### Bước 1: Tạo Repository mới trên GitHub
1. Truy cập [github.com](https://github.com)
2. Đăng nhập tài khoản của bạn
3. Click nút **"+"** góc phải trên → Chọn **"New repository"**
4. Điền thông tin:
   - Repository name: `web-ktp` (hoặc tên bạn muốn)
   - Description: Website công ty TNHH MTV In Ấn Kim Thịnh
   - Chọn **Public** hoặc **Private**
   - **KHÔNG** check "Add a README file"
   - **KHÔNG** check "Add .gitignore" (vì project đã có sẵn)
5. Click **"Create repository"**

### Bước 2: Chuẩn bị và Upload Code

Mở Terminal tại thư mục project và chạy các lệnh sau:

```
bash
# Khởi tạo Git repository (nếu chưa có)
git init

# Thêm tất cả file vào staging
git add .

# Tạo commit đầu tiên
git commit -m "Initial commit - Web KTP"

# Thêm remote repository (thay YOUR_USERNAME và REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Đổi tên branch từ master thành main
git branch -M main

# Push code lên GitHub
git push -u origin main
```

**Lưu ý quan trọng:** File `.env` chứa thông tin nhạy cảm (API keys, database credentials) - KHÔNG nên push lên GitHub. Hãy đảm bảo `.env` nằm trong `.gitignore`.

---

## Phần 2: Deploy lên Vercel

### Cách 1: Deploy trực tiếp từ GitHub (Khuyên dùng)

1. Truy cập [vercel.com](https://vercel.com)
2. Đăng nhập tài khoản Vercel (nên dùng tài khoản GitHub để đăng nhập)
3. Click **"Add New..."** → Chọn **"Project"**
4. Tìm repository bạn vừa tạo (web-ktp) và click **"Import"**
5. Cấu hình Project:
   - **Framework Preset**: Chọn **Next.js**
   - **Build Command**: Để mặc định là `vercel-build` (hoặc `next build`)
   - **Output Directory**: Để mặc định là `.next`
   - **Install Command**: Để mặc định là `npm install` hoặc `pnpm install`
6. Click **"Deploy"**

### Cách 2: Cấu hình Environment Variables

Sau khi deploy, bạn cần cấu hình các biến môi trường:

1. Vào Project trên Vercel
2. Chọn tab **"Settings"** → **"Environment Variables"**
3. Thêm các biến cần thiết:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Các biến khác nếu có
```

### Bước 3: Cấu hình Domain (nếu có)

1. Vào **"Settings"** → **"Domains"**
2. Nhập domain của bạn (ví dụ: `kimthinhpack.com`)
3. Làm theo hướng dẫn để cấu DNS records

---

## Kiểm tra sau Deploy

Sau khi deploy hoàn tất:
1. Vercel sẽ cấp cho bạn một domain dạng `your-project.vercel.app`
2. Truy cập để kiểm tra website
3. Vào `/admin` để kiểm tra trang quản trị

---

## Lưu ý quan trọng

1. **Supabase**: Đảm bảo Supabase của bạn cho phép truy cập từ domain Vercel
   - Vào Supabase Dashboard → Settings → API
   - Thêm domain Vercel vào `Redirect URLs`

2. **Build Errors**: Nếu gặp lỗi build, kiểm tra:
   - Node.js version (project dùng Node 16+)
   - Các biến môi trường đã được thêm đầy đủ chưa
   - Chạy `npm run build` local để kiểm tra lỗi

3. **Auto Deploy**: Mỗi khi push code lên GitHub, Vercel sẽ tự động deploy lại

---

## Cập nhật code sau này

```
bash
# Sau khi chỉnh sửa code
git add .
git commit -m "Mô tả thay đổi"
git push origin main
```

Vercel sẽ tự động detect thay đổi và deploy lại.
