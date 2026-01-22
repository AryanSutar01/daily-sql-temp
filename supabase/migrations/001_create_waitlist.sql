-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  occupation TEXT NOT NULL,
  job_role TEXT NOT NULL,
  years_of_experience INTEGER NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert their own waitlist entry"
  ON waitlist
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read their own waitlist entry"
  ON waitlist
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow service role to read all (for admin purposes)
CREATE POLICY "Service role can read all waitlist entries"
  ON waitlist
  FOR SELECT
  USING (true);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_user_id ON waitlist(user_id);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_waitlist_updated_at
  BEFORE UPDATE ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

