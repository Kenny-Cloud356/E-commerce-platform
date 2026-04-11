-- Products reference categories by subquery
INSERT INTO products (name, slug, description, price, compare_price, stock, category_id, featured) VALUES
-- Electronics
('Wireless Bluetooth Headphones', 'wireless-bluetooth-headphones', 'Premium noise-cancelling over-ear headphones with 30-hour battery life.', 79.99, 99.99, 150, (SELECT id FROM categories WHERE slug = 'electronics'), true),
('USB-C Fast Charging Cable 3-Pack', 'usb-c-fast-charging-cable', 'Durable braided nylon USB-C cables, 6ft length, supports fast charging.', 14.99, 19.99, 500, (SELECT id FROM categories WHERE slug = 'electronics'), false),
('Portable Bluetooth Speaker', 'portable-bluetooth-speaker', 'Waterproof portable speaker with 360-degree sound and 12-hour playtime.', 49.99, NULL, 200, (SELECT id FROM categories WHERE slug = 'electronics'), true),
('Wireless Mechanical Keyboard', 'wireless-mechanical-keyboard', 'Compact 75% layout mechanical keyboard with RGB backlighting.', 89.99, 109.99, 100, (SELECT id FROM categories WHERE slug = 'electronics'), false),
('4K Webcam with Microphone', 'webcam-4k-microphone', 'Ultra HD webcam with built-in noise-cancelling microphone for streaming.', 59.99, NULL, 120, (SELECT id FROM categories WHERE slug = 'electronics'), false),

-- Clothing
('Classic Fit Cotton T-Shirt', 'classic-fit-cotton-tshirt', 'Soft 100% cotton crew neck t-shirt available in multiple colors.', 19.99, 24.99, 300, (SELECT id FROM categories WHERE slug = 'clothing'), false),
('Slim Fit Denim Jeans', 'slim-fit-denim-jeans', 'Stretch denim jeans with a modern slim fit and comfortable waistband.', 49.99, 64.99, 200, (SELECT id FROM categories WHERE slug = 'clothing'), true),
('Lightweight Running Shoes', 'lightweight-running-shoes', 'Breathable mesh upper with responsive cushioning for daily runs.', 74.99, 89.99, 175, (SELECT id FROM categories WHERE slug = 'clothing'), true),
('Hooded Zip-Up Sweatshirt', 'hooded-zipup-sweatshirt', 'Cozy fleece-lined hoodie with full zip and kangaroo pockets.', 39.99, NULL, 250, (SELECT id FROM categories WHERE slug = 'clothing'), false),

-- Home & Kitchen
('Stainless Steel French Press', 'stainless-steel-french-press', 'Double-wall insulated French press coffee maker, 34oz capacity.', 29.99, 39.99, 180, (SELECT id FROM categories WHERE slug = 'home-kitchen'), true),
('Non-Stick Cookware Set 10pc', 'nonstick-cookware-set', 'Complete cookware set with pots, pans, and utensils. Dishwasher safe.', 89.99, 119.99, 80, (SELECT id FROM categories WHERE slug = 'home-kitchen'), false),
('LED Desk Lamp with USB Port', 'led-desk-lamp-usb', 'Adjustable LED desk lamp with 5 brightness levels and USB charging port.', 34.99, NULL, 220, (SELECT id FROM categories WHERE slug = 'home-kitchen'), false),
('Memory Foam Pillow 2-Pack', 'memory-foam-pillow-2pack', 'Cooling gel memory foam pillows for side and back sleepers.', 44.99, 59.99, 160, (SELECT id FROM categories WHERE slug = 'home-kitchen'), false),

-- Books
('JavaScript: The Good Parts', 'javascript-the-good-parts', 'Classic guide to the best features of JavaScript by Douglas Crockford.', 24.99, NULL, 100, (SELECT id FROM categories WHERE slug = 'books'), false),
('Clean Code', 'clean-code', 'A handbook of agile software craftsmanship by Robert C. Martin.', 34.99, 44.99, 90, (SELECT id FROM categories WHERE slug = 'books'), true),
('The Pragmatic Programmer', 'the-pragmatic-programmer', 'Your journey to mastery. 20th anniversary edition.', 39.99, NULL, 85, (SELECT id FROM categories WHERE slug = 'books'), false),

-- Sports & Outdoors
('Yoga Mat with Carrying Strap', 'yoga-mat-carrying-strap', 'Extra thick non-slip yoga mat, 72x24 inches, eco-friendly material.', 24.99, 34.99, 300, (SELECT id FROM categories WHERE slug = 'sports-outdoors'), false),
('Adjustable Dumbbell Set 50lb', 'adjustable-dumbbell-set-50lb', 'Space-saving adjustable dumbbells from 5-50 lbs per hand.', 199.99, 249.99, 60, (SELECT id FROM categories WHERE slug = 'sports-outdoors'), true),
('Insulated Water Bottle 32oz', 'insulated-water-bottle-32oz', 'Double-wall vacuum insulated stainless steel bottle. Keeps cold 24hrs.', 22.99, NULL, 400, (SELECT id FROM categories WHERE slug = 'sports-outdoors'), false),
('Camping Tent 4-Person', 'camping-tent-4person', 'Waterproof dome tent with easy setup, fits 4 adults comfortably.', 129.99, 159.99, 45, (SELECT id FROM categories WHERE slug = 'sports-outdoors'), true);
