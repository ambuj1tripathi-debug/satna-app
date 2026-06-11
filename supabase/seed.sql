-- SATNA seed data — launch content
-- Run after 0001_init.sql

-- ---------- places (10) ----------
insert into places (slug, name_en, name_hi, category, description_en, hero_image_url, tags, timing, entry_fee, best_time, distance_km, is_featured, extra) values
('maihar-devi-mandir', 'Maihar Devi Mandir', 'मैहर देवी मंदिर', 'religious',
 'The famous Sharda Devi temple atop Trikuta hill in Maihar. One of the most revered Shakti Peethas of the region, reachable by 1063 steps or ropeway.',
 '/images/places/maihar.jpg', '{"pilgrim-friendly","parking available","ropeway"}',
 '5:00 AM – 9:00 PM', 'Free (ropeway ₹120 return)', 'Sunrise; Navratri for the mela', 35.0, true,
 '{"ropeway": "6 AM – 8 PM, ₹120 return", "darshan": "Aarti 5:30 AM & 7:30 PM", "steps": 1063}'),
('bharhut-stupa-museum', 'Bharhut Stupa Archaeological Museum', 'भरहुत स्तूप संग्रहालय', 'heritage',
 'Home to fragments of the 2nd-century BCE Bharhut Stupa, among the earliest Buddhist art in India. The famous railings and gateway carvings were discovered here in 1873.',
 '/images/places/bharhut.jpg', '{"heritage","guided tours","wheelchair accessible"}',
 '10:00 AM – 5:00 PM (closed Mondays)', '₹20 (Indians)', 'Winter mornings', 12.0, true, '{}'),
('satna-junction', 'Satna Junction Railway Station', 'सतना जंक्शन', 'infrastructure',
 'The gateway to Satna — a major junction on the Mumbai–Howrah line connecting the city to Jabalpur, Prayagraj, Bhopal and Delhi.',
 '/images/places/junction.jpg', '{"parking available","24x7"}', '24 hours', 'Free', 'Anytime', 1.5, true, '{}'),
('chitrakoot', 'Chitrakoot', 'चित्रकूट', 'religious',
 'The sacred town where Lord Rama spent years of exile. Kamadgiri parikrama, Ramghat aarti and Hanuman Dhara — a full-day pilgrimage from Satna.',
 '/images/places/chitrakoot.jpg', '{"pilgrim-friendly","day trip"}', 'Open always', 'Free', 'Diwali (Deepdaan Mela)', 75.0, true, '{}'),
('bhadra-waterfall', 'Bhadra Waterfall', 'भद्रा जलप्रपात', 'nature',
 'A monsoon waterfall on the Chitrakoot district boundary, surrounded by Vindhya forest. Popular picnic spot from July to October.',
 '/images/places/bhadra.jpg', '{"monsoon special","trekking"}', 'Daylight hours', 'Free', 'July–October', 55.0, false, '{}'),
('satna-river-ghats', 'Satna River Ghats', 'सतना नदी घाट', 'religious',
 'The ghats along the Satna (Sutna) river — morning aarti, Chhath Puja gatherings and evening walks.',
 '/images/places/ghats.jpg', '{"pilgrim-friendly","evening walks"}', 'Open always', 'Free', 'Early morning', 3.0, false, '{}'),
('vindhyachal-temple', 'Vindhyachal Temple', 'विंध्याचल मंदिर', 'religious',
 'Ancient temple in the Vindhya foothills near Satna, dedicated to Vindhyavasini Devi.',
 '/images/places/vindhyachal.jpg', '{"pilgrim-friendly"}', '6:00 AM – 8:00 PM', 'Free', 'Navratri', 18.0, false, '{}'),
('acc-cement-plant', 'ACC Cement Plant (Kymore Belt)', 'एसीसी सीमेंट संयंत्र', 'infrastructure',
 'Satna is one of India''s biggest cement hubs. The ACC plant area offers a glimpse of the industry that powers the city — industrial visits on prior permission.',
 '/images/places/acc.jpg', '{"industrial tourism","permission required"}', 'By appointment', 'N/A', 'Weekdays', 8.0, false, '{}'),
('central-library', 'Central Library Satna', 'केंद्रीय पुस्तकालय', 'education',
 'The district''s main public library — reading rooms, competitive-exam section and a children''s corner.',
 '/images/places/library.jpg', '{"wifi","study space"}', '9:00 AM – 8:00 PM', 'Free (membership ₹100/yr)', 'Weekday mornings', 2.0, false, '{}'),
('district-collectorate', 'District Collectorate', 'जिला कलेक्ट्रेट', 'infrastructure',
 'The administrative heart of Satna district — collector office, public hearing (Jan Sunwai) every Tuesday.',
 '/images/places/collectorate.jpg', '{"govt office","parking available"}', '10:30 AM – 5:30 PM (Mon–Fri)', 'Free', 'Tuesday Jan Sunwai', 2.5, false, '{}');

-- ---------- restaurants (10) ----------
insert into restaurants (slug, name_en, name_hi, cuisines, veg_type, price_range, description, hero_image_url, address, phone, distance_km, open_time, close_time, is_featured) values
('krishna-dhaba', 'Krishna Dhaba', 'कृष्णा ढाबा', '{"North Indian","Dhabha"}', 'veg', 'budget',
 'Legendary NH-30 dhaba known for dal tadka, butter naan and truck-route portions. Family seating at the back.',
 '/images/food/krishna.jpg', 'NH-30, Bypass Road, Satna', '07672-223344', 4.0, '10:00', '23:00', true),
('sharma-sweets', 'Sharma Sweets & Namkeen', 'शर्मा स्वीट्स', '{"Sweets","Chaat"}', 'pure_veg', 'budget',
 'The city''s favourite for khoya peda, rasgulla and Sunday-morning jalebi-poha. Third-generation halwais.',
 '/images/food/sharma.jpg', 'Dhawari Chowk, Satna', '07672-225566', 1.0, '07:00', '22:00', true),
('hotel-satna-restaurant', 'Hotel Satna Restaurant', 'होटल सतना', '{"North Indian","Chinese"}', 'mixed', 'mid',
 'The in-house multi-cuisine restaurant of Hotel Satna — AC family dining, thalis and Indo-Chinese.',
 '/images/food/hotelsatna.jpg', 'Rewa Road, Satna', '07672-227788', 2.0, '11:00', '23:00', true),
('bus-stand-chaat-corner', 'Famous Chaat Corner', 'फेमस चाट कॉर्नर', '{"Chaat"}', 'pure_veg', 'budget',
 'The iconic chaat stall near the bus stand — aloo tikki, golgappe and dahi-bhalla since 1985.',
 '/images/food/chaat.jpg', 'Near Bus Stand, Satna', null, 1.2, '15:00', '22:00', false),
('madhuram-thali', 'Madhuram Pure Veg Thali', 'मधुरम थाली', '{"North Indian"}', 'pure_veg', 'mid',
 'Unlimited Rajasthani-MP style thali — 4 sabzi, dal-baati on Sundays, warm service.',
 '/images/food/madhuram.jpg', 'Civil Lines, Satna', '07672-229911', 1.8, '11:30', '22:30', true),
('annapurna-bhojnalaya', 'Annapurna Bhojnalaya', 'अन्नपूर्णा भोजनालय', '{"North Indian","Dhabha"}', 'veg', 'budget',
 'Simple, homely bhojnalaya near the station — fixed thali ₹80, fast service for travellers.',
 '/images/food/annapurna.jpg', 'Station Road, Satna', null, 0.8, '09:00', '22:00', false),
('zaika-family-restaurant', 'Zaika Family Restaurant', 'ज़ायका', '{"North Indian","Chinese","South Indian"}', 'mixed', 'mid',
 'Popular family restaurant — biryani, tandoori and a separate veg kitchen.',
 '/images/food/zaika.jpg', 'Panna Naka, Satna', '07672-233221', 2.5, '11:00', '23:00', false),
('jain-bhojan-griha', 'Jain Bhojan Griha', 'जैन भोजन गृह', '{"North Indian"}', 'jain', 'budget',
 'Strictly Jain kitchen — no onion, no garlic, no root vegetables. Thali and farsan.',
 '/images/food/jain.jpg', 'Mukhtiyarganj, Satna', null, 1.5, '10:00', '21:30', false),
('highway-king-dhaba', 'Highway King Dhaba', 'हाईवे किंग ढाबा', '{"North Indian","Dhabha"}', 'mixed', 'budget',
 'Late-night NH-30 dhaba — paneer butter masala, charpai seating, open till 1 AM.',
 '/images/food/highwayking.jpg', 'NH-30 near Sherganj, Satna', null, 6.0, '11:00', '01:00', false),
('maihar-prasad-bhandar', 'Maihar Prasad & Sweets Bhandar', 'मैहर प्रसाद भंडार', '{"Sweets"}', 'pure_veg', 'budget',
 'At the base of Maihar temple — famous for besan laddoo prasad and kalakand.',
 '/images/food/maiharprasad.jpg', 'Temple Road, Maihar', null, 35.0, '05:00', '21:00', false);

-- menu items for a few restaurants
insert into menu_items (restaurant_id, category, name, description, price, is_veg) values
((select id from restaurants where slug='krishna-dhaba'), 'Main', 'Dal Tadka', 'Signature smoky tadka dal', 120, true),
((select id from restaurants where slug='krishna-dhaba'), 'Main', 'Paneer Butter Masala', 'Rich tomato gravy', 180, true),
((select id from restaurants where slug='krishna-dhaba'), 'Breads', 'Butter Naan', 'Tandoor fresh', 35, true),
((select id from restaurants where slug='krishna-dhaba'), 'Drinks', 'Lassi', 'Sweet, malai-topped', 60, true),
((select id from restaurants where slug='sharma-sweets'), 'Sweets', 'Khoya Peda', 'Local speciality, per kg', 480, true),
((select id from restaurants where slug='sharma-sweets'), 'Sweets', 'Jalebi', 'Sunday mornings, per kg', 240, true),
((select id from restaurants where slug='sharma-sweets'), 'Starters', 'Samosa', 'With chhole', 20, true),
((select id from restaurants where slug='hotel-satna-restaurant'), 'Main', 'Veg Thali', '3 sabzi, dal, rice, roti, sweet', 220, true),
((select id from restaurants where slug='hotel-satna-restaurant'), 'Main', 'Chicken Curry', 'Home style', 280, false),
((select id from restaurants where slug='hotel-satna-restaurant'), 'Starters', 'Veg Manchurian', 'Indo-Chinese', 160, true),
((select id from restaurants where slug='madhuram-thali'), 'Main', 'Unlimited Thali', '4 sabzi, dal, baati on Sundays', 250, true),
((select id from restaurants where slug='bus-stand-chaat-corner'), 'Starters', 'Aloo Tikki', '2 pc with chutneys', 40, true),
((select id from restaurants where slug='bus-stand-chaat-corner'), 'Starters', 'Golgappe', '6 pc, spicy pani', 30, true);

-- ---------- events (5) ----------
insert into events (title_en, title_hi, category, venue, description, starts_at, ends_at, is_featured) values
('Maihar Mela 2026', 'मैहर मेला २०२६', 'religious', 'Maihar, Sharda Devi Temple', 'The grand Navratri mela at Maihar — lakhs of pilgrims, special ropeway hours, cultural programs.', '2026-06-24 05:00+05:30', '2026-07-02 22:00+05:30', true),
('Satna Trade Fair', 'सतना व्यापार मेला', 'trade', 'Exhibition Ground, Satna', 'Annual trade fair — local businesses, food stalls, rides.', '2026-07-10 10:00+05:30', '2026-07-20 22:00+05:30', false),
('Independence Day Parade', 'स्वतंत्रता दिवस परेड', 'civic', 'Police Parade Ground', 'District-level flag hoisting and parade.', '2026-08-15 08:00+05:30', '2026-08-15 11:00+05:30', false),
('District Cricket Tournament', 'जिला क्रिकेट टूर्नामेंट', 'sports', 'Stadium Ground, Satna', 'Inter-ward T20 tournament — register your team.', '2026-07-05 08:00+05:30', '2026-07-12 18:00+05:30', false),
('Sharad Navratri Garba Nights', 'शरद नवरात्रि गरबा', 'cultural', 'Town Hall, Satna', 'Community garba and dandiya evenings.', '2026-10-11 19:00+05:30', '2026-10-19 23:00+05:30', false);

-- ---------- heritage trails (3) ----------
insert into trails (slug, name_en, name_hi, intro, duration_text, difficulty, cover_image_url) values
('bharhut-stupa-circuit', 'Bharhut Stupa Circuit', 'भरहुत स्तूप परिक्रमा', 'Walk through 2,200 years of Buddhist history — from the excavation site to the museum galleries that hold the famous carved railings.', '2 hrs', 'easy', '/images/trails/bharhut.jpg'),
('maihar-pilgrimage-walk', 'Maihar Pilgrimage Walk', 'मैहर तीर्थ यात्रा', 'The classic pilgrim route — Alha-Udal akhada, the 1063 steps (or ropeway), Sharda Devi darshan and Baba Allauddin Khan''s musical legacy.', 'Half day', 'easy_moderate', '/images/trails/maihar.jpg'),
('vindhya-nature-edge', 'Vindhya Nature Edge', 'विंध्य प्रकृति किनारा', 'Forest edges and viewpoints of the Vindhya range around Satna — birdlife, sunset points.', '3 hrs', 'moderate', '/images/trails/vindhya.jpg');

insert into trail_stops (trail_id, stop_number, name, description) values
((select id from trails where slug='bharhut-stupa-circuit'), 1, 'Bharhut Excavation Site', 'Where Alexander Cunningham discovered the stupa in 1873.'),
((select id from trails where slug='bharhut-stupa-circuit'), 2, 'Archaeological Museum Galleries', 'Railing fragments, Yakshi carvings, Jataka panels.'),
((select id from trails where slug='bharhut-stupa-circuit'), 3, 'Interpretation Centre', 'Replica of the original gateway (torana).'),
((select id from trails where slug='maihar-pilgrimage-walk'), 1, 'Alha-Udal Akhada', 'Legendary warriors said to still worship Sharda Devi daily.'),
((select id from trails where slug='maihar-pilgrimage-walk'), 2, 'Ropeway Base / 1063 Steps', 'Choose your ascent.'),
((select id from trails where slug='maihar-pilgrimage-walk'), 3, 'Sharda Devi Darshan', 'The main shrine atop Trikuta hill.'),
((select id from trails where slug='maihar-pilgrimage-walk'), 4, 'Baba Allauddin Khan Samadhi', 'Resting place of the legendary musician, founder of the Maihar gharana.'),
((select id from trails where slug='vindhya-nature-edge'), 1, 'Forest Watchtower', 'Panoramic view of the Vindhya foothills.'),
((select id from trails where slug='vindhya-nature-edge'), 2, 'Sunset Point', 'Best photographed October–February.');

-- ---------- transport ----------
insert into transport_routes (mode, name, origin, destination, timing, frequency, platform_info, distance_km, duration_text, booking_url, notes) values
('train', 'Rewa Express (11447/11448)', 'Satna', 'Delhi (via Katni)', 'Dep 18:35', 'Daily', 'Usually PF 1', null, '~14 hrs', 'https://www.irctc.co.in', null),
('train', 'Sarnath Express', 'Satna', 'Prayagraj / Varanasi', 'Dep 13:10', 'Daily', 'PF 2', 130, '~3 hrs to Prayagraj', 'https://www.irctc.co.in', null),
('train', 'Mahanagari Express', 'Satna', 'Mumbai CSMT', 'Dep 21:50', 'Daily', 'PF 1', null, '~17 hrs', 'https://www.irctc.co.in', null),
('train', 'Howrah Mail (via Allahabad)', 'Satna', 'Howrah', 'Dep 23:15', 'Daily', 'PF 3', null, '~14 hrs', 'https://www.irctc.co.in', null),
('train', 'Intercity Express', 'Satna', 'Jabalpur', 'Dep 07:20', 'Daily', 'PF 2', 120, '~3 hrs', 'https://www.irctc.co.in', null),
('train', 'Vindhyachal Express', 'Satna', 'Bhopal (via Katni)', 'Dep 20:05', 'Daily', 'PF 1', 350, '~8 hrs', 'https://www.irctc.co.in', null),
('bus', 'MP Roadways', 'Satna', 'Rewa', 'First 06:00, last 21:00', 'Every 30 min', null, 60, '1.5 hrs', null, 'From Satna Bus Stand'),
('bus', 'MP Roadways / Private', 'Satna', 'Jabalpur', 'First 05:30, last 19:00', 'Hourly', null, 120, '3 hrs', null, null),
('bus', 'Private operators', 'Satna', 'Prayagraj', '06:00, 09:00, 14:00, 22:00 (sleeper)', '4–5 daily', null, 130, '3.5 hrs', null, null),
('bus', 'Private sleeper', 'Satna', 'Bhopal', 'Dep 21:00', 'Daily', null, 350, '7–8 hrs', null, null),
('bus', 'Local shuttle', 'Satna', 'Maihar', 'Throughout the day', 'Every 20 min', null, 35, '50 min', null, 'Extra services during Navratri'),
('intercity', 'Satna → Rewa', 'Satna', 'Rewa', null, null, null, 60, '1–1.5 hrs', null, 'Bus, shared cab, train options'),
('intercity', 'Satna → Jabalpur', 'Satna', 'Jabalpur', null, null, null, 120, '2.5–3 hrs', null, null),
('intercity', 'Satna → Prayagraj', 'Satna', 'Prayagraj', null, null, null, 130, '3–3.5 hrs', null, null),
('intercity', 'Satna → Bhopal', 'Satna', 'Bhopal', null, null, null, 350, '7–8 hrs', null, 'Overnight train recommended');

insert into fare_chart (mode, from_point, to_point, fare_text, is_community_verified) values
('auto', 'Satna Junction', 'Bus Stand', '₹30–40', true),
('auto', 'Satna Junction', 'Civil Lines', '₹40–60', true),
('auto', 'Satna Junction', 'Collectorate', '₹50–70', true),
('auto', 'Bus Stand', 'Dhawari Chowk', '₹20–30', true),
('auto', 'Satna Junction', 'Bharhut Museum', '₹150–200 (return)', false);

-- ---------- govt services (13) ----------
insert into govt_services (department_en, department_hi, address, timings, phone, services_offered) values
('District Collectorate & Collector''s Office', 'जिला कलेक्ट्रेट', 'Collectorate Campus, Satna', 'Mon–Fri 10:30 AM – 5:30 PM', '07672-222401', 'Revenue matters, Jan Sunwai (Tue), certificates, RTI'),
('Satna Municipal Corporation (Nagar Nigam)', 'नगर निगम सतना', 'City Office, Satna', 'Mon–Sat 10:30 AM – 5:30 PM', '07672-222301', 'Property tax, birth/death certificates, sanitation complaints'),
('Sub-Divisional Magistrate Office', 'एसडीएम कार्यालय', 'Collectorate Campus, Satna', 'Mon–Fri 10:30 AM – 5:30 PM', null, 'Land records, magistrate matters'),
('Civil Hospital Satna (District Hospital)', 'जिला चिकित्सालय', 'Hospital Road, Satna', 'OPD 9 AM – 4 PM; Emergency 24x7', '07672-223333', 'OPD, emergency, maternity, pathology'),
('District Court', 'जिला न्यायालय', 'Court Campus, Satna', 'Mon–Sat 10:30 AM – 5:00 PM', null, 'District judiciary, legal aid (DLSA)'),
('Police Headquarters (SP Office)', 'पुलिस अधीक्षक कार्यालय', 'SP Office, Satna', '24x7 control room', '100 / 07672-224444', 'FIR, verification, all thana contacts'),
('Passport Seva Kendra (POPSK)', 'पासपोर्ट सेवा केंद्र', 'Head Post Office, Satna', 'Mon–Fri 9 AM – 4 PM (by appointment)', null, 'Passport applications — book via passportindia.gov.in'),
('Aadhaar Enrollment Center', 'आधार केंद्र', 'Head Post Office & lok seva kendras', 'Mon–Sat 10 AM – 5 PM', null, 'New Aadhaar, updates, biometrics'),
('MPEZ Electricity Board', 'विद्युत मंडल', 'Power House Road, Satna', 'Complaint line 24x7', '1912', 'New connections, billing, outage complaints'),
('Jal Nigam / PHE (Water Supply)', 'जल निगम', 'PHE Office, Satna', 'Mon–Sat 10:30 AM – 5:30 PM', '07672-222555', 'Water supply complaints, new connections'),
('RTO Office', 'परिवहन कार्यालय', 'RTO Campus, Rewa Road, Satna', 'Mon–Fri 10:30 AM – 5:30 PM', null, 'Driving licence, vehicle registration, permits'),
('Employment Exchange', 'रोजगार कार्यालय', 'Collectorate Campus, Satna', 'Mon–Fri 10:30 AM – 5:30 PM', null, 'Job registration, career counselling'),
('Krishi Vigyan Kendra', 'कृषि विज्ञान केंद्र', 'Majhgawan, Satna', 'Mon–Sat 10 AM – 5 PM', null, 'Farmer training, soil testing, crop advisories');

-- ---------- emergency contacts (10) ----------
insert into emergency_contacts (name_en, name_hi, phone, category, sort_order) values
('Police Control Room', 'पुलिस कंट्रोल रूम', '100', 'police', 1),
('Fire Brigade', 'दमकल', '101', 'fire', 2),
('Ambulance', 'एम्बुलेंस', '102', 'medical', 3),
('District Hospital Satna', 'जिला अस्पताल', '07672-223333', 'medical', 4),
('Women Helpline', 'महिला हेल्पलाइन', '1091', 'helpline', 5),
('Child Helpline', 'चाइल्ड हेल्पलाइन', '1098', 'helpline', 6),
('Satna Nagar Nigam', 'नगर निगम', '07672-222301', 'civic', 7),
('MPEZ Electricity Complaint', 'बिजली शिकायत', '1912', 'civic', 8),
('Water Supply Complaint', 'जल आपूर्ति शिकायत', '07672-222555', 'civic', 9),
('Anti-Corruption Helpline', 'भ्रष्टाचार विरोधी हेल्पलाइन', '1064', 'helpline', 10);

-- ---------- forum boards (9) ----------
insert into forum_boards (slug, name, description, sort_order) values
('city-development', 'City Development Ideas', 'Suggest improvements to Satna', 1),
('tourism-heritage', 'Tourism & Heritage', 'Trails, places, preservation', 2),
('business-jobs', 'Business & Jobs', 'Local opportunities, classifieds', 3),
('education', 'Education', 'Schools, coaching, results', 4),
('festivals-events', 'Festivals & Events', 'Planning, volunteer coordination', 5),
('sports-youth', 'Sports & Youth', 'Cricket, kabaddi, local leagues', 6),
('ask-a-local', 'Ask a Local', 'Outsiders asking residents anything about Satna', 7),
('dine-together-stories', 'Dine Together Stories', 'Share how a dining meetup went', 8),
('cab-share-coordination', 'Cab Share Coordination', 'Routes, timing, trusted companions', 9);

-- ---------- home content ----------
insert into daily_thoughts (body_hi, body_en, status, shown_on) values
('अपना शहर वही है जहाँ दिल बसता है।', 'Your city is where your heart lives.', 'approved', current_date);

insert into history_facts (fact, week_start) values
('On this day in 1962, Bharhut Stupa fragments were officially catalogued by the ASI.', date_trunc('week', current_date)::date),
('Satna got its name from the Sutna (Satna) river, a tributary of the Tamas.', null),
('Baba Allauddin Khan of Maihar trained Pt. Ravi Shankar and Ustad Ali Akbar Khan — the Maihar gharana was born here.', null);

-- ---------- badges ----------
insert into badges (slug, name_en, name_hi, description, icon) values
('satna-scholar', 'Satna Scholar', 'सतना विद्वान', '50 quiz questions correct', 'graduation-cap'),
('heritage-hero', 'Heritage Hero', 'धरोहर नायक', 'Finished the Heritage quiz category', 'bank'),
('city-champion', 'City Champion', 'शहर चैंपियन', 'Won a weekly City Challenge', 'trophy'),
('satna-explorer', 'Satna Explorer', 'सतना खोजी', 'Completed a Bingo card line', 'compass');
