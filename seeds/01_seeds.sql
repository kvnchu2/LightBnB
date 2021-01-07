INSERT INTO users (name, email, password) 
VALUES ('Eva Stanley', 'didi@aol.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Ling Chan', 'dinga@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Jon Low', 'dsd@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Don Bills', 'diasdf@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('David Upton', 'werwe@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Tony Li', 'tonyli@shaw.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties(owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'mansion', 'description', 'https://images.pexels.com/photos/87378/pexels-photo-87378.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'https://images.pexels.com/photos/87378/pexels-photo-87378.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 555, 5, 3, 3, 'Canada', '2125 Niasky Way', 'Saskatoon', 'Saskatchewan', '83680', true),
(2, 'loft', 'description', 'https://images.pexels.com/photos/2459/stairs-home-loft-lifestyle.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'https://images.pexels.com/photos/5998040/pexels-photo-5998040.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 678, 3, 2, 1, 'Canada', '7878 Johnson Road', 'Vancouver', 'British Columbia', '83645', true),
(3, 'house', 'description', 'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'https://images.pexels.com/photos/2625766/pexels-photo-2625766.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 727, 2, 4, 3, 'Canada', '3434 Brooks Street', 'Calgary', 'Alberta', '23463', true);

INSERT INTO reservations(start_date, end_date, property_id, guest_id) 
VALUES ('2018-09-11', '2019-01-01', 1, 4),
('2017-09-11', '2020-01-01', 2, 5),
('2015-09-11', '2016-01-01', 3, 6);

INSERT INTO property_reviews(guest_id, property_id, reservation_id, rating, message) 
VALUES (1, 2, 1, 2, 'message'),
(2, 3, 2, 3, 'message'),
(3, 1, 3, 9, 'message');
