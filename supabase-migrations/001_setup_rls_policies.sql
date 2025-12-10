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

