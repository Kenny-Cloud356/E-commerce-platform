-- Reviews from seeded customers on various products
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
((SELECT id FROM users WHERE email = 'john@example.com'), (SELECT id FROM products WHERE slug = 'wireless-bluetooth-headphones'), 5, 'Amazing sound quality and super comfortable for long sessions!'),
((SELECT id FROM users WHERE email = 'jane@example.com'), (SELECT id FROM products WHERE slug = 'wireless-bluetooth-headphones'), 4, 'Great headphones, noise cancelling works well. Wish they were lighter.'),
((SELECT id FROM users WHERE email = 'bob@example.com'), (SELECT id FROM products WHERE slug = 'portable-bluetooth-speaker'), 5, 'Took this to the beach, sounds amazing outdoors. Waterproof too!'),
((SELECT id FROM users WHERE email = 'john@example.com'), (SELECT id FROM products WHERE slug = 'slim-fit-denim-jeans'), 4, 'Perfect fit. Material feels premium. Would buy again.'),
((SELECT id FROM users WHERE email = 'jane@example.com'), (SELECT id FROM products WHERE slug = 'stainless-steel-french-press'), 5, 'Makes the best coffee! Easy to clean and keeps it hot.'),
((SELECT id FROM users WHERE email = 'bob@example.com'), (SELECT id FROM products WHERE slug = 'clean-code'), 5, 'Every developer should read this. Changed how I write code.'),
((SELECT id FROM users WHERE email = 'john@example.com'), (SELECT id FROM products WHERE slug = 'adjustable-dumbbell-set-50lb'), 4, 'Solid build quality. Saves so much space in my home gym.'),
((SELECT id FROM users WHERE email = 'jane@example.com'), (SELECT id FROM products WHERE slug = 'lightweight-running-shoes'), 5, 'Most comfortable running shoes I have ever owned!'),
((SELECT id FROM users WHERE email = 'bob@example.com'), (SELECT id FROM products WHERE slug = 'camping-tent-4person'), 3, 'Good tent for the price. Setup was a bit tricky the first time.');
