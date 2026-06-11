-- ============================================================
-- SATNA CITY APP — initial schema
-- Covers: profiles/roles, places, restaurants + menus, reviews,
-- photos, events, alerts, community (posts/forums/polls/lost-found/
-- memories), dine-together, cab-share, transport, govt services,
-- heritage trails, quiz/games, moderation queue.
-- ============================================================

-- ---------- enums ----------
create type user_role as enum ('user', 'verified_contributor', 'moderator', 'admin', 'super_admin');
create type moderation_status as enum ('pending', 'approved', 'rejected');
create type content_status as enum ('draft', 'published', 'archived');
create type place_category as enum ('religious', 'nature', 'infrastructure', 'shopping', 'education', 'heritage', 'other');
create type price_range as enum ('budget', 'mid', 'premium');           -- ₹ / ₹₹ / ₹₹₹
create type veg_type as enum ('veg', 'non_veg', 'pure_veg', 'jain', 'mixed');
create type crowd_level as enum ('quiet', 'moderate', 'busy', 'very_busy');
create type event_category as enum ('religious', 'cultural', 'sports', 'trade', 'civic');
create type alert_severity as enum ('emergency', 'civic', 'disruption', 'good_news');
create type alert_status as enum ('active', 'resolved', 'expired');
create type post_type as enum ('question', 'tip', 'photo', 'issue', 'appreciation');
create type plan_vibe as enum ('casual_chat', 'professional_networking', 'family_friendly', 'students_only');
create type plan_status as enum ('open', 'full', 'completed', 'cancelled', 'removed');
create type ride_status as enum ('open', 'full', 'departed', 'cancelled', 'removed');
create type join_status as enum ('requested', 'confirmed', 'declined', 'cancelled');
create type lostfound_type as enum ('lost', 'found');
create type lostfound_status as enum ('open', 'resolved', 'archived');
create type memory_type as enum ('photo', 'story', 'then_vs_now');
create type memory_era as enum ('pre_1947', 'era_1950s_70s', 'era_1980s_90s', 'era_2000s', 'recent');
create type quiz_category as enum ('history_heritage', 'geography', 'culture_festivals', 'famous_people', 'mp_general', 'daily');
create type transport_mode as enum ('train', 'bus', 'auto', 'intercity');

-- ---------- profiles & roles ----------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  phone text,
  avatar_url text,
  neighborhood text,                          -- ward / mohalla tag
  persona text check (persona in ('resident', 'visitor', 'pilgrim')),
  language text not null default 'hi' check (language in ('hi', 'en')),
  role user_role not null default 'user',
  xp integer not null default 0,
  quiz_streak integer not null default 0,
  is_banned boolean not null default false,
  edit_banned boolean not null default false,
  created_at timestamptz not null default now()
);

create table badges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                  -- 'satna-scholar', 'heritage-hero', 'city-champion', 'satna-explorer'
  name_en text not null,
  name_hi text,
  description text,
  icon text
);

create table user_badges (
  user_id uuid references profiles(id) on delete cascade,
  badge_id uuid references badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- ---------- places ----------
create table places (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_hi text,
  category place_category not null default 'other',
  description_en text,
  description_hi text,
  hero_image_url text,
  tags text[] not null default '{}',          -- 'pilgrim-friendly', 'parking available', ...
  timing text,
  entry_fee text,
  best_time text,
  latitude double precision,
  longitude double precision,
  distance_km numeric(6,1),                   -- from city center
  is_featured boolean not null default false,
  status content_status not null default 'published',
  avg_rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  extra jsonb not null default '{}',          -- ropeway info, darshan timing, etc.
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table place_crowd_votes (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references places(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  level crowd_level not null,
  created_at timestamptz not null default now()
);
create index on place_crowd_votes (place_id, created_at desc);

-- ---------- restaurants ----------
create table restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_hi text,
  cuisines text[] not null default '{}',      -- 'North Indian', 'Chaat', 'Sweets', 'Dhabha'...
  veg_type veg_type not null default 'mixed',
  price_range price_range not null default 'budget',
  description text,
  hero_image_url text,
  address text,
  phone text,
  latitude double precision,
  longitude double precision,
  distance_km numeric(6,1),
  open_time time,
  close_time time,
  is_featured boolean not null default false,
  status content_status not null default 'published',
  avg_rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  claimed_by uuid references profiles(id),    -- owner claim flow
  claim_status moderation_status,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  category text not null default 'Main',      -- Starters / Main / Breads / Drinks / Sweets
  name text not null,
  description text,
  price numeric(8,2),
  is_veg boolean not null default true,
  status moderation_status not null default 'approved',
  submitted_by uuid references profiles(id),
  created_at timestamptz not null default now()
);
create index on menu_items (restaurant_id, category);

-- ---------- reviews & photos (polymorphic over places/restaurants) ----------
create table reviews (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('place', 'restaurant')),
  subject_id uuid not null,
  user_id uuid not null references profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text,
  status moderation_status not null default 'approved',
  created_at timestamptz not null default now(),
  unique (subject_type, subject_id, user_id)
);
create index on reviews (subject_type, subject_id, created_at desc);

create table photos (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('place', 'restaurant', 'trail', 'post', 'memory', 'challenge')),
  subject_id uuid not null,
  user_id uuid references profiles(id) on delete set null,
  url text not null,
  caption text,
  status moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);
create index on photos (subject_type, subject_id);

create table bookmarks (
  user_id uuid references profiles(id) on delete cascade,
  subject_type text not null check (subject_type in ('place', 'restaurant', 'trail')),
  subject_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (user_id, subject_type, subject_id)
);

-- ---------- moderation queue (suggested edits to any content) ----------
create table content_edits (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null,                 -- 'place', 'restaurant', 'govt_service', 'transport_route'...
  subject_id uuid,
  submitted_by uuid not null references profiles(id),
  changes jsonb not null,                     -- proposed field -> value map (diff view in admin)
  note text,
  status moderation_status not null default 'pending',
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index on content_edits (status, created_at);

create table content_flags (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null,
  subject_id uuid not null,
  flagged_by uuid not null references profiles(id),
  reason text,
  status moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ---------- events ----------
create table events (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_hi text,
  category event_category not null,
  venue text,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  is_featured boolean not null default false, -- featured banner on home
  image_url text,
  status content_status not null default 'published',
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);
create index on events (starts_at);

-- ---------- alerts ----------
create table alerts (
  id uuid primary key default gen_random_uuid(),
  severity alert_severity not null,
  headline text not null,
  description text,
  affected_area text,
  source_verified boolean not null default false,  -- Admin Verified vs Community Report
  status alert_status not null default 'active',
  expires_at timestamptz,
  created_by uuid references profiles(id),
  moderation moderation_status not null default 'approved',
  created_at timestamptz not null default now()
);

create table alert_confirmations (
  alert_id uuid references alerts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  still_active boolean not null,
  created_at timestamptz not null default now(),
  primary key (alert_id, user_id)
);

-- ---------- community: feed posts ----------
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type post_type not null default 'question',
  category text not null default 'general',   -- roads/water/electricity/events/business/general/help
  title text not null,
  body text,
  neighborhood text,
  is_anonymous boolean not null default false,
  like_count integer not null default 0,
  status moderation_status not null default 'approved',
  created_at timestamptz not null default now()
);

create table post_likes (
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (post_id, user_id)
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('post', 'memory', 'thread', 'challenge_entry')),
  subject_id uuid not null,
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index on comments (subject_type, subject_id, created_at);

-- ---------- forums ----------
create table forum_boards (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  sort_order integer not null default 0
);

create table forum_threads (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references forum_boards(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text,
  is_pinned boolean not null default false,
  reply_count integer not null default 0,
  last_active_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table forum_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references forum_threads(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- ---------- polls ----------
create table polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  proposed_by uuid references profiles(id),
  status moderation_status not null default 'approved',
  closes_at timestamptz not null,
  is_archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references polls(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0
);

create table poll_votes (
  poll_id uuid references polls(id) on delete cascade,
  option_id uuid references poll_options(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  neighborhood text,
  created_at timestamptz not null default now(),
  primary key (poll_id, user_id)
);

-- ---------- lost & found ----------
create table lost_found (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type lostfound_type not null,
  category text not null default 'other',     -- documents/valuables/pets/other
  title text not null,
  description text,
  location text,
  contact_masked text,
  status lostfound_status not null default 'open',
  created_at timestamptz not null default now()
);

-- ---------- memories (Satna Yaadein) ----------
create table memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type memory_type not null,
  era memory_era,
  caption text,
  story text,                                 -- max 300 words enforced in app
  year_estimate smallint,
  location_tag text,
  photo_url text,
  then_photo_url text,                        -- for then_vs_now
  now_photo_url text,
  like_count integer not null default 0,
  remember_count integer not null default 0,  -- "I remember this too"
  is_featured boolean not null default false, -- Satna Ka Ek Safha
  status moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ---------- dine together ----------
create table dining_plans (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references profiles(id) on delete cascade,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  meal_type text not null default 'lunch' check (meal_type in ('lunch', 'dinner', 'chai')),
  scheduled_at timestamptz not null,
  max_people smallint not null check (max_people between 2 and 6),
  vibe plan_vibe not null default 'casual_chat',
  note text,
  status plan_status not null default 'open',
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table dining_plan_members (
  plan_id uuid references dining_plans(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  status join_status not null default 'requested',
  good_company boolean,                       -- post-meal thumbs-up only
  created_at timestamptz not null default now(),
  primary key (plan_id, user_id)
);

-- ---------- cab share ----------
create table cab_rides (
  id uuid primary key default gen_random_uuid(),
  poster_id uuid not null references profiles(id) on delete cascade,
  origin text not null default 'Satna',
  destination text not null,                  -- Rewa / Jabalpur / Prayagraj / Bhopal / other
  drop_point text,
  departs_at timestamptz not null,
  total_fare numeric(8,2) not null,
  total_seats smallint not null check (total_seats between 2 and 4),
  seats_taken smallint not null default 0,
  note text,
  status ride_status not null default 'open',
  created_at timestamptz not null default now()
);

create table cab_ride_requests (
  ride_id uuid references cab_rides(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  status join_status not null default 'requested',
  phone_revealed boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (ride_id, user_id)
);

-- shared chat for dining plans and cab rides
create table group_messages (
  id uuid primary key default gen_random_uuid(),
  context_type text not null check (context_type in ('dining_plan', 'cab_ride')),
  context_id uuid not null,
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index on group_messages (context_type, context_id, created_at);

-- ---------- heritage trails ----------
create table trails (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_hi text,
  intro text,
  duration_text text,                         -- '2 hrs', 'half day'
  difficulty text not null default 'easy' check (difficulty in ('easy', 'easy_moderate', 'moderate')),
  cover_image_url text,
  status content_status not null default 'published',
  created_at timestamptz not null default now()
);

create table trail_stops (
  id uuid primary key default gen_random_uuid(),
  trail_id uuid not null references trails(id) on delete cascade,
  stop_number smallint not null,
  name text not null,
  description text,
  photo_url text,
  latitude double precision,
  longitude double precision,
  unique (trail_id, stop_number)
);

-- ---------- transport ----------
create table transport_routes (
  id uuid primary key default gen_random_uuid(),
  mode transport_mode not null,
  name text not null,                         -- 'Rewa Express', 'Satna → Jabalpur MP Roadways'
  origin text not null default 'Satna',
  destination text not null,
  timing text,
  frequency text,
  platform_info text,
  distance_km integer,
  duration_text text,
  booking_url text,                           -- IRCTC link etc.
  notes text,
  status content_status not null default 'published',
  updated_at timestamptz not null default now()
);

create table fare_chart (
  id uuid primary key default gen_random_uuid(),
  mode transport_mode not null default 'auto',
  from_point text not null,
  to_point text not null,
  fare_text text not null,                    -- '₹40–60'
  is_community_verified boolean not null default false,
  updated_at timestamptz not null default now()
);

-- ---------- govt services & emergency ----------
create table govt_services (
  id uuid primary key default gen_random_uuid(),
  department_en text not null,
  department_hi text,
  address text,
  timings text,
  phone text,
  services_offered text,
  status content_status not null default 'published',
  updated_at timestamptz not null default now()
);

create table emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_hi text,
  phone text not null,
  category text not null default 'general',   -- police/fire/medical/civic/helpline
  sort_order integer not null default 0
);

-- ---------- home-screen content ----------
create table daily_thoughts (                  -- Aaj ka vichar
  id uuid primary key default gen_random_uuid(),
  body_hi text,
  body_en text,
  submitted_by uuid references profiles(id),
  status moderation_status not null default 'pending',
  shown_on date unique
);

create table history_facts (                   -- This week in Satna history
  id uuid primary key default gen_random_uuid(),
  fact text not null,
  week_start date,
  created_at timestamptz not null default now()
);

create table city_mood_votes (                 -- resets at midnight (query by date)
  user_id uuid references profiles(id) on delete cascade,
  mood text not null check (mood in ('chill', 'festive', 'quiet', 'busy')),
  voted_on date not null default current_date,
  primary key (user_id, voted_on)
);

-- ---------- play: quiz ----------
create table quiz_questions (
  id uuid primary key default gen_random_uuid(),
  category quiz_category not null,
  question_en text not null,
  question_hi text,
  options text[] not null,                    -- exactly 4
  correct_index smallint not null check (correct_index between 0 and 3),
  explanation text,
  learn_more_type text,                       -- 'place' | 'trail' link target
  learn_more_id uuid,
  source_url text,
  submitted_by uuid references profiles(id),
  status moderation_status not null default 'approved',
  daily_on date unique,                       -- set => "Aaj ka sawaal" for that date
  times_answered integer not null default 0,
  times_correct integer not null default 0,
  created_at timestamptz not null default now()
);

create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  category quiz_category not null,
  score integer not null default 0,
  correct_count smallint not null default 0,
  total_questions smallint not null default 10,
  played_on date not null default current_date,
  created_at timestamptz not null default now()
);
create index on quiz_attempts (played_on, score desc);

-- ---------- play: city challenge ----------
create table city_challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  week_start date not null,
  status content_status not null default 'published',
  created_at timestamptz not null default now()
);

create table challenge_entries (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references city_challenges(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  photo_url text,
  answer text,
  upvote_count integer not null default 0,
  is_winner boolean not null default false,
  created_at timestamptz not null default now(),
  unique (challenge_id, user_id)
);

create table challenge_upvotes (
  entry_id uuid references challenge_entries(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (entry_id, user_id)
);

-- ---------- play: bingo ----------
create table bingo_cards (
  id uuid primary key default gen_random_uuid(),
  month date not null unique,                 -- first of month
  theme text not null,                        -- 'Satna Explorer', 'Monsoon Satna'...
  status content_status not null default 'published'
);

create table bingo_squares (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references bingo_cards(id) on delete cascade,
  position smallint not null check (position between 0 and 24),
  challenge text not null,
  unique (card_id, position)
);

create table bingo_progress (
  user_id uuid references profiles(id) on delete cascade,
  square_id uuid references bingo_squares(id) on delete cascade,
  photo_url text,
  completed_at timestamptz not null default now(),
  primary key (user_id, square_id)
);

-- ---------- notifications & feedback ----------
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text,
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  type text not null default 'feedback' check (type in ('feedback', 'bug')),
  body text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- triggers: keep aggregate ratings in sync
-- ============================================================
create or replace function refresh_rating() returns trigger language plpgsql as $$
declare
  s_type text := coalesce(new.subject_type, old.subject_type);
  s_id uuid := coalesce(new.subject_id, old.subject_id);
begin
  if s_type = 'place' then
    update places set
      avg_rating = coalesce((select round(avg(rating)::numeric, 1) from reviews where subject_type = 'place' and subject_id = s_id and status = 'approved'), 0),
      review_count = (select count(*) from reviews where subject_type = 'place' and subject_id = s_id and status = 'approved')
    where id = s_id;
  elsif s_type = 'restaurant' then
    update restaurants set
      avg_rating = coalesce((select round(avg(rating)::numeric, 1) from reviews where subject_type = 'restaurant' and subject_id = s_id and status = 'approved'), 0),
      review_count = (select count(*) from reviews where subject_type = 'restaurant' and subject_id = s_id and status = 'approved')
    where id = s_id;
  end if;
  return null;
end $$;

create trigger trg_refresh_rating
after insert or update or delete on reviews
for each row execute function refresh_rating();

-- auto-create profile on signup
create or replace function handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, username, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', 'satnawale_' || left(new.id::text, 8)), new.phone);
  return new;
end $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- ============================================================
-- RLS — public content readable by all; writes scoped to owner;
-- moderation/admin via role check
-- ============================================================
create or replace function current_role_at_least(min_role user_role) returns boolean language sql stable security definer as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and not is_banned
      and case min_role
        when 'user' then true
        when 'verified_contributor' then role in ('verified_contributor', 'moderator', 'admin', 'super_admin')
        when 'moderator' then role in ('moderator', 'admin', 'super_admin')
        when 'admin' then role in ('admin', 'super_admin')
        when 'super_admin' then role = 'super_admin'
      end
  );
$$;

alter table profiles enable row level security;
create policy "profiles readable" on profiles for select using (true);
create policy "own profile update" on profiles for update using (auth.uid() = id);

-- public read-only catalogs
do $$
declare t text;
begin
  foreach t in array array['places', 'restaurants', 'menu_items', 'events', 'trails', 'trail_stops',
    'transport_routes', 'fare_chart', 'govt_services', 'emergency_contacts', 'forum_boards',
    'badges', 'history_facts', 'bingo_cards', 'bingo_squares', 'city_challenges']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "public read" on %I for select using (true)', t);
    execute format('create policy "admin write" on %I for all using (current_role_at_least(''admin''))', t);
  end loop;
end $$;

-- user-generated content: read approved/own, insert own
do $$
declare t text;
begin
  foreach t in array array['reviews', 'photos', 'posts', 'comments', 'memories', 'alerts',
    'forum_threads', 'forum_replies', 'lost_found', 'content_edits', 'content_flags',
    'daily_thoughts', 'quiz_questions']
  loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

create policy "read approved or own" on reviews for select using (status = 'approved' or user_id = auth.uid() or current_role_at_least('moderator'));
create policy "insert own" on reviews for insert with check (user_id = auth.uid());
create policy "moderate" on reviews for update using (current_role_at_least('moderator'));

create policy "read approved or own" on photos for select using (status = 'approved' or user_id = auth.uid() or current_role_at_least('moderator'));
create policy "insert own" on photos for insert with check (user_id = auth.uid());
create policy "moderate" on photos for update using (current_role_at_least('moderator'));

create policy "read approved or own" on posts for select using (status = 'approved' or user_id = auth.uid() or current_role_at_least('moderator'));
create policy "insert own" on posts for insert with check (user_id = auth.uid());
create policy "update own or mod" on posts for update using (user_id = auth.uid() or current_role_at_least('moderator'));

create policy "read all" on comments for select using (true);
create policy "insert own" on comments for insert with check (user_id = auth.uid());

create policy "read approved or own" on memories for select using (status = 'approved' or user_id = auth.uid() or current_role_at_least('moderator'));
create policy "insert own" on memories for insert with check (user_id = auth.uid());
create policy "moderate" on memories for update using (current_role_at_least('moderator'));

create policy "read approved" on alerts for select using (moderation = 'approved' or created_by = auth.uid() or current_role_at_least('moderator'));
create policy "insert own" on alerts for insert with check (created_by = auth.uid());
create policy "moderate" on alerts for update using (current_role_at_least('moderator'));

create policy "read all" on forum_threads for select using (true);
create policy "insert own" on forum_threads for insert with check (user_id = auth.uid());
create policy "update own or mod" on forum_threads for update using (user_id = auth.uid() or current_role_at_least('moderator'));

create policy "read all" on forum_replies for select using (true);
create policy "insert own" on forum_replies for insert with check (user_id = auth.uid());

create policy "read all" on lost_found for select using (true);
create policy "insert own" on lost_found for insert with check (user_id = auth.uid());
create policy "update own or mod" on lost_found for update using (user_id = auth.uid() or current_role_at_least('moderator'));

create policy "read own or mod" on content_edits for select using (submitted_by = auth.uid() or current_role_at_least('moderator'));
create policy "insert own" on content_edits for insert with check (submitted_by = auth.uid());
create policy "moderate" on content_edits for update using (current_role_at_least('moderator'));

create policy "read own or mod" on content_flags for select using (flagged_by = auth.uid() or current_role_at_least('moderator'));
create policy "insert own" on content_flags for insert with check (flagged_by = auth.uid());

create policy "read approved" on daily_thoughts for select using (status = 'approved' or submitted_by = auth.uid() or current_role_at_least('moderator'));
create policy "insert own" on daily_thoughts for insert with check (submitted_by = auth.uid());
create policy "moderate" on daily_thoughts for update using (current_role_at_least('moderator'));

create policy "read approved" on quiz_questions for select using (status = 'approved' or submitted_by = auth.uid() or current_role_at_least('moderator'));
create policy "insert own" on quiz_questions for insert with check (submitted_by = auth.uid());
create policy "moderate" on quiz_questions for update using (current_role_at_least('moderator'));

-- social/interactive tables: authenticated read + owner write
do $$
declare t text;
begin
  foreach t in array array['dining_plans', 'dining_plan_members', 'cab_rides', 'cab_ride_requests',
    'group_messages', 'poll_votes', 'polls', 'poll_options', 'post_likes', 'bookmarks',
    'place_crowd_votes', 'city_mood_votes', 'quiz_attempts', 'challenge_entries',
    'challenge_upvotes', 'bingo_progress', 'user_badges', 'alert_confirmations',
    'notifications', 'feedback']
  loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

create policy "read all" on dining_plans for select using (true);
create policy "insert own" on dining_plans for insert with check (host_id = auth.uid());
create policy "update own or mod" on dining_plans for update using (host_id = auth.uid() or current_role_at_least('moderator'));

create policy "read members" on dining_plan_members for select using (
  user_id = auth.uid()
  or exists (select 1 from dining_plans p where p.id = plan_id and p.host_id = auth.uid())
  or current_role_at_least('moderator'));
create policy "insert own" on dining_plan_members for insert with check (user_id = auth.uid());
create policy "update own or host" on dining_plan_members for update using (
  user_id = auth.uid()
  or exists (select 1 from dining_plans p where p.id = plan_id and p.host_id = auth.uid()));

create policy "read all" on cab_rides for select using (true);
create policy "insert own" on cab_rides for insert with check (poster_id = auth.uid());
create policy "update own or mod" on cab_rides for update using (poster_id = auth.uid() or current_role_at_least('moderator'));

create policy "read involved" on cab_ride_requests for select using (
  user_id = auth.uid()
  or exists (select 1 from cab_rides r where r.id = ride_id and r.poster_id = auth.uid())
  or current_role_at_least('moderator'));
create policy "insert own" on cab_ride_requests for insert with check (user_id = auth.uid());
create policy "update own or poster" on cab_ride_requests for update using (
  user_id = auth.uid()
  or exists (select 1 from cab_rides r where r.id = ride_id and r.poster_id = auth.uid()));

create policy "read in group" on group_messages for select using (
  (context_type = 'dining_plan' and (
    exists (select 1 from dining_plan_members m where m.plan_id = context_id and m.user_id = auth.uid() and m.status = 'confirmed')
    or exists (select 1 from dining_plans p where p.id = context_id and p.host_id = auth.uid())))
  or (context_type = 'cab_ride' and (
    exists (select 1 from cab_ride_requests q where q.ride_id = context_id and q.user_id = auth.uid() and q.status = 'confirmed')
    or exists (select 1 from cab_rides r where r.id = context_id and r.poster_id = auth.uid())))
  or current_role_at_least('moderator'));
create policy "insert own" on group_messages for insert with check (user_id = auth.uid());

create policy "read all" on polls for select using (true);
create policy "propose" on polls for insert with check (proposed_by = auth.uid());
create policy "admin manage" on polls for update using (current_role_at_least('admin'));
create policy "read all" on poll_options for select using (true);
create policy "admin manage" on poll_options for all using (current_role_at_least('admin'));
create policy "read own" on poll_votes for select using (user_id = auth.uid() or current_role_at_least('admin'));
create policy "vote once" on poll_votes for insert with check (user_id = auth.uid());

create policy "own likes" on post_likes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own bookmarks" on bookmarks for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "read all" on place_crowd_votes for select using (true);
create policy "insert own" on place_crowd_votes for insert with check (user_id = auth.uid());
create policy "read all" on city_mood_votes for select using (true);
create policy "insert own" on city_mood_votes for insert with check (user_id = auth.uid());
create policy "read all" on quiz_attempts for select using (true);
create policy "insert own" on quiz_attempts for insert with check (user_id = auth.uid());
create policy "read all" on challenge_entries for select using (true);
create policy "insert own" on challenge_entries for insert with check (user_id = auth.uid());
create policy "own upvotes" on challenge_upvotes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "read own" on bingo_progress for select using (user_id = auth.uid());
create policy "insert own" on bingo_progress for insert with check (user_id = auth.uid());
create policy "read all" on user_badges for select using (true);
create policy "admin award" on user_badges for insert with check (current_role_at_least('admin'));
create policy "read all" on alert_confirmations for select using (true);
create policy "insert own" on alert_confirmations for insert with check (user_id = auth.uid());
create policy "own notifications" on notifications for select using (user_id = auth.uid());
create policy "mark read" on notifications for update using (user_id = auth.uid());
create policy "insert any" on feedback for insert with check (true);
create policy "admin read" on feedback for select using (current_role_at_least('admin'));
