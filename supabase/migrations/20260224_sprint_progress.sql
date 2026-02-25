-- Sprint progress: stores every checkbox toggle with timestamp for auditing
create table if not exists sprint_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  task_id text not null,
  checked boolean not null default false,
  updated_at timestamptz not null default now(),
  unique(user_id, task_id)
);

-- Sprint prize unlocks: stores unlock attempts with codes + timestamps
create table if not exists sprint_prize_unlocks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  day integer not null check (day between 1 and 5),
  unlock_code text not null,
  unlocked_at timestamptz not null default now(),
  unique(user_id, day)
);

-- Sprint audit log: detailed log of every action for compliance
create table if not exists sprint_audit_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  action text not null, -- 'task_checked', 'task_unchecked', 'prize_unlock_attempt'
  payload jsonb not null default '{}'::jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

-- Indexes for fast lookups
create index if not exists idx_sprint_progress_user on sprint_progress(user_id);
create index if not exists idx_sprint_prize_unlocks_user on sprint_prize_unlocks(user_id);
create index if not exists idx_sprint_audit_log_user on sprint_audit_log(user_id);
create index if not exists idx_sprint_audit_log_created on sprint_audit_log(created_at);

-- RLS policies
alter table sprint_progress enable row level security;
alter table sprint_prize_unlocks enable row level security;
alter table sprint_audit_log enable row level security;

-- Users can only read/write their own progress
create policy "Users can view own progress" on sprint_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on sprint_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on sprint_progress for update using (auth.uid() = user_id);

-- Users can only read/insert their own unlocks
create policy "Users can view own unlocks" on sprint_prize_unlocks for select using (auth.uid() = user_id);
create policy "Users can insert own unlocks" on sprint_prize_unlocks for insert with check (auth.uid() = user_id);

-- Users can only insert their own audit logs (admins read via service role)
create policy "Users can insert own audit logs" on sprint_audit_log for insert with check (auth.uid() = user_id);
create policy "Users can view own audit logs" on sprint_audit_log for select using (auth.uid() = user_id);
