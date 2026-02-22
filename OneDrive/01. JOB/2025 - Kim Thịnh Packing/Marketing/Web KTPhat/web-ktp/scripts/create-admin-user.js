#!/usr/bin/env node

const readline = require('readline');
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdminUser() {
  console.log('=== Tạo User Admin ===\n');

  try {
    // Get Supabase credentials from environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error(
        'Lỗi: Vui lòng đặt NEXT_PUBLIC_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY'
      );
      process.exit(1);
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user input
    const name = await question('Tên admin: ');
    const email = await question('Email: ');
    const password = await question('Mật khẩu: ');
    const role = await question('Vai trò (admin/editor) [admin]: ') || 'admin';

    if (!name || !email || !password) {
      console.error('Lỗi: Vui lòng nhập đầy đủ thông tin');
      process.exit(1);
    }

    // Hash password with bcrypt
    console.log('\nĐang hash mật khẩu...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert admin user
    console.log('Đang tạo user admin...');
    const { data, error } = await supabase.from('admin_users').insert([
      {
        name,
        email,
        password_hash: passwordHash,
        role,
        is_active: true,
      },
    ]).select();

    if (error) {
      console.error('Lỗi:', error.message);
      process.exit(1);
    }

    console.log('\n✓ User admin tạo thành công!');
    console.log('ID:', data[0].id);
    console.log('Email:', data[0].email);
    console.log('Tên:', data[0].name);
    console.log('Vai trò:', data[0].role);

    console.log('\nBạn có thể đăng nhập tại: /admin/dang-nhap');
  } catch (error) {
    console.error('Lỗi:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

createAdminUser();
