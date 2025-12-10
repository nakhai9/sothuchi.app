# Hướng dẫn thiết lập Supabase RLS Policies

## Lỗi hiện tại
```
"code": "42501",
"message": "new row violates row-level security policy for table \"transactions\""
```

Lỗi này xảy ra vì bảng `transactions` đã bật Row Level Security (RLS) nhưng chưa có policies cho phép user thực hiện các thao tác.

## Cách khắc phục

### Bước 1: Mở Supabase Dashboard
1. Đăng nhập vào [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn
3. Vào **SQL Editor** ở menu bên trái

### Bước 2: Chạy SQL Migration
Copy và chạy đoạn SQL sau trong SQL Editor:

```sql
-- Enable Row Level Security cho bảng transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Cho phép user SELECT transactions của chính họ
CREATE POLICY "Users can view their own transactions"
ON transactions
FOR SELECT
USING (auth.uid() = "userId");

-- Policy: Cho phép user INSERT transactions cho chính họ
CREATE POLICY "Users can insert their own transactions"
ON transactions
FOR INSERT
WITH CHECK (auth.uid() = "userId");

-- Policy: Cho phép user UPDATE transactions của chính họ
CREATE POLICY "Users can update their own transactions"
ON transactions
FOR UPDATE
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

-- Policy: Cho phép user DELETE transactions của chính họ (soft delete)
CREATE POLICY "Users can delete their own transactions"
ON transactions
FOR DELETE
USING (auth.uid() = "userId");
```

### Bước 3: Kiểm tra
Sau khi chạy SQL, thử tạo transaction mới trong ứng dụng. Lỗi sẽ biến mất.

## Giải thích các Policies

1. **SELECT Policy**: User chỉ có thể xem transactions có `userId` trùng với `auth.uid()` (user hiện tại)
2. **INSERT Policy**: User chỉ có thể tạo transactions với `userId` là chính họ
3. **UPDATE Policy**: User chỉ có thể cập nhật transactions của chính họ
4. **DELETE Policy**: User chỉ có thể xóa transactions của chính họ

## Lưu ý
- `auth.uid()` là function của Supabase trả về UUID của user hiện tại đang đăng nhập
- Tất cả policies đều kiểm tra `userId` phải trùng với user hiện tại để đảm bảo bảo mật

