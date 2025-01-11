-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 11, 2025 at 04:25 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `the-movie-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(128) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `account_details`
--

CREATE TABLE `account_details` (
  `account_detail_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `profile_picture` varchar(500) NOT NULL,
  `gender` tinyint(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications`
--

CREATE TABLE `certifications` (
  `certification_id` int(11) NOT NULL,
  `certification` varchar(10) NOT NULL,
  `mean` varchar(255) NOT NULL,
  `country` varchar(10) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_confirmations`
--

CREATE TABLE `email_confirmations` (
  `email_confirmation_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `email` varchar(320) NOT NULL,
  `confirmation_code` tinyint(6) NOT NULL,
  `created_at` datetime NOT NULL,
  `expires_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favorite_movies`
--

CREATE TABLE `favorite_movies` (
  `account_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `added_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favorite_tv_series`
--

CREATE TABLE `favorite_tv_series` (
  `account_id` int(11) NOT NULL,
  `tv_series_id` int(11) NOT NULL,
  `added_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `genres`
--

CREATE TABLE `genres` (
  `genre_id` int(11) NOT NULL,
  `name` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `keywords`
--

CREATE TABLE `keywords` (
  `keyword_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lists`
--

CREATE TABLE `lists` (
  `list_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `description` varchar(500) NOT NULL,
  `favorite_count` int(11) NOT NULL,
  `item_count` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `poster_path` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media_lists`
--

CREATE TABLE `media_lists` (
  `list_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `tv_series_id` int(11) NOT NULL,
  `type` varchar(10) NOT NULL,
  `added_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `movie_id` int(11) NOT NULL,
  `adult` tinyint(1) NOT NULL,
  `backdrop_path` varchar(500) NOT NULL,
  `budget` int(11) NOT NULL,
  `homepage` varchar(50) NOT NULL,
  `original_country` varchar(10) NOT NULL,
  `original_language` varchar(10) NOT NULL,
  `original_title` varchar(100) NOT NULL,
  `overview` varchar(500) NOT NULL,
  `poster_path` varchar(500) NOT NULL,
  `release_date` date NOT NULL,
  `revenue` int(11) NOT NULL,
  `runtime` smallint(6) NOT NULL,
  `status` varchar(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `vote_average` float NOT NULL,
  `vote_count` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movie_certifications`
--

CREATE TABLE `movie_certifications` (
  `movie_id` int(11) NOT NULL,
  `certification_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movie_genres`
--

CREATE TABLE `movie_genres` (
  `movie_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL,
  `added_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movie_images`
--

CREATE TABLE `movie_images` (
  `movie_image_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `aspect_ratio` float NOT NULL,
  `iso_639_1` varchar(10) DEFAULT NULL,
  `height` smallint(6) NOT NULL,
  `width` smallint(6) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `vote_average` float NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movie_keywords`
--

CREATE TABLE `movie_keywords` (
  `movie_id` int(11) NOT NULL,
  `keyword_id` int(11) NOT NULL,
  `added_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movie_people`
--

CREATE TABLE `movie_people` (
  `movie_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `added_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movie_reviews`
--

CREATE TABLE `movie_reviews` (
  `movie_id` int(11) NOT NULL,
  `review_id` int(11) NOT NULL,
  `added_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movie_videos`
--

CREATE TABLE `movie_videos` (
  `movie_video_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `video_key` varchar(50) NOT NULL,
  `site` varchar(50) NOT NULL,
  `type` text NOT NULL,
  `official` tinyint(1) NOT NULL,
  `popularity` float NOT NULL,
  `published_at` date NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `networks`
--

CREATE TABLE `networks` (
  `network_id` int(11) NOT NULL,
  `logo_path` varchar(500) NOT NULL,
  `name` varchar(100) NOT NULL,
  `original_country` varchar(10) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nicknames`
--

CREATE TABLE `nicknames` (
  `nickname_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `nickname` int(11) NOT NULL,
  `create_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `people`
--

CREATE TABLE `people` (
  `person_id` int(11) NOT NULL,
  `adult` tinyint(1) NOT NULL,
  `biography` varchar(500) NOT NULL,
  `birthday` date NOT NULL,
  `deathday` date NOT NULL,
  `gender` tinyint(1) NOT NULL,
  `homepage` varchar(100) NOT NULL,
  `known_for_department` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `place_of_birth` varchar(500) NOT NULL,
  `profile_path` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `person_images`
--

CREATE TABLE `person_images` (
  `person_image_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `aspect_ratio` float NOT NULL,
  `iso_639_1` varchar(10) NOT NULL,
  `height` smallint(6) NOT NULL,
  `width` smallint(6) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `vote_average` float NOT NULL,
  `vote_count` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rating_movies`
--

CREATE TABLE `rating_movies` (
  `account_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `rating` float NOT NULL,
  `rated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rating_tv_series`
--

CREATE TABLE `rating_tv_series` (
  `account_id` int(11) NOT NULL,
  `tv_series_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `rated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20250111135550-create-account.js');

-- --------------------------------------------------------

--
-- Table structure for table `social_networks`
--

CREATE TABLE `social_networks` (
  `social_network_id` int(11) NOT NULL,
  `social_network` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `social_network_details`
--

CREATE TABLE `social_network_details` (
  `social_network_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `tv_series_id` int(11) NOT NULL,
  `social_network_username` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tv_episodes`
--

CREATE TABLE `tv_episodes` (
  `tv_episode_id` int(11) NOT NULL,
  `tv_season_id` int(11) NOT NULL,
  `air_date` datetime NOT NULL,
  `episode_number` smallint(6) NOT NULL,
  `name` varchar(100) NOT NULL,
  `overview` varchar(500) NOT NULL,
  `runtime` smallint(6) NOT NULL,
  `still_path` varchar(500) NOT NULL,
  `vote_average` float NOT NULL,
  `vote_count` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tv_episode_people`
--

CREATE TABLE `tv_episode_people` (
  `tv_episode_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `character_role` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tv_seasons`
--

CREATE TABLE `tv_seasons` (
  `tv_season_id` int(11) NOT NULL,
  `tv_series_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `air_date` datetime NOT NULL,
  `name` varchar(100) NOT NULL,
  `overview` varchar(500) NOT NULL,
  `poster_path` varchar(500) NOT NULL,
  `season_number` smallint(6) NOT NULL,
  `vote_average` float NOT NULL,
  `vote_count` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tv_series`
--

CREATE TABLE `tv_series` (
  `tv_series_id` int(11) NOT NULL,
  `adult` tinyint(1) NOT NULL,
  `backdrop_path` varchar(500) NOT NULL,
  `first_air_date` datetime NOT NULL,
  `homepage` varchar(100) NOT NULL,
  `in_production` tinyint(1) NOT NULL,
  `last_air_date` datetime NOT NULL,
  `name` varchar(100) NOT NULL,
  `next_episode_to_air` int(11) NOT NULL,
  `original_country` varchar(10) NOT NULL,
  `original_language` varchar(10) NOT NULL,
  `original_name` varchar(100) NOT NULL,
  `overview` varchar(500) NOT NULL,
  `poster_path` varchar(500) NOT NULL,
  `status` varchar(20) NOT NULL,
  `popularity` int(11) NOT NULL,
  `vote_average` float NOT NULL,
  `vote_count` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tv_series_certifications`
--

CREATE TABLE `tv_series_certifications` (
  `tv_series_id` int(11) NOT NULL,
  `certification_id` int(11) NOT NULL,
  `added_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tv_series_genres`
--

CREATE TABLE `tv_series_genres` (
  `tv_series_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL,
  `added_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tv_series_images`
--

CREATE TABLE `tv_series_images` (
  `tv_series_image_id` int(11) NOT NULL,
  `tv_series_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `season` smallint(6) NOT NULL,
  `episode` smallint(6) NOT NULL,
  `aspect_radio` float NOT NULL,
  `iso_639_1` varchar(10) NOT NULL,
  `height` smallint(6) NOT NULL,
  `width` smallint(6) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `vote_average` float NOT NULL,
  `vote_count` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tv_series_networks`
--

CREATE TABLE `tv_series_networks` (
  `tv_series_id` int(11) NOT NULL,
  `network_id` int(11) NOT NULL,
  `added_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tv_series_reviews`
--

CREATE TABLE `tv_series_reviews` (
  `tv_series_id` int(11) NOT NULL,
  `review_id` int(11) NOT NULL,
  `added_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tv_series_videos`
--

CREATE TABLE `tv_series_videos` (
  `tv_series_video_id` int(11) NOT NULL,
  `tv_series_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `video_key` varchar(100) NOT NULL,
  `site` varchar(100) NOT NULL,
  `size` smallint(6) NOT NULL,
  `type` varchar(100) NOT NULL,
  `official` tinyint(1) NOT NULL,
  `published_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `watchlist_movies`
--

CREATE TABLE `watchlist_movies` (
  `account_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `added_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `watchlist_tv_series`
--

CREATE TABLE `watchlist_tv_series` (
  `account_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `rated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD KEY `fk_accounts_role_id` (`role_id`);

--
-- Indexes for table `account_details`
--
ALTER TABLE `account_details`
  ADD PRIMARY KEY (`account_detail_id`),
  ADD KEY `fk_account_details_account_id` (`account_id`);

--
-- Indexes for table `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`certification_id`);

--
-- Indexes for table `email_confirmations`
--
ALTER TABLE `email_confirmations`
  ADD PRIMARY KEY (`email_confirmation_id`),
  ADD KEY `fk_email_confirmations_account_id` (`account_id`);

--
-- Indexes for table `favorite_movies`
--
ALTER TABLE `favorite_movies`
  ADD KEY `fk_favorite_movies_account_id` (`account_id`),
  ADD KEY `fk_favorite_movies_movie_id` (`movie_id`);

--
-- Indexes for table `favorite_tv_series`
--
ALTER TABLE `favorite_tv_series`
  ADD KEY `fk_favorite_tv_series_account_id` (`account_id`),
  ADD KEY `fk_favorite_tv_series_tv_series_id` (`tv_series_id`);

--
-- Indexes for table `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`genre_id`);

--
-- Indexes for table `keywords`
--
ALTER TABLE `keywords`
  ADD PRIMARY KEY (`keyword_id`);

--
-- Indexes for table `lists`
--
ALTER TABLE `lists`
  ADD PRIMARY KEY (`list_id`),
  ADD KEY `fk_lists_account_id` (`account_id`);

--
-- Indexes for table `media_lists`
--
ALTER TABLE `media_lists`
  ADD KEY `fk_media_lists_movie_id` (`movie_id`),
  ADD KEY `fk_media_lists_tv_series_id` (`tv_series_id`),
  ADD KEY `fk_media_lists_list_id` (`list_id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`movie_id`);

--
-- Indexes for table `movie_certifications`
--
ALTER TABLE `movie_certifications`
  ADD KEY `fk_movie_certifications_movie_id` (`movie_id`),
  ADD KEY `fk_movie_certifications_certification_id` (`certification_id`);

--
-- Indexes for table `movie_genres`
--
ALTER TABLE `movie_genres`
  ADD KEY `fk_movie_genres_movie_id` (`movie_id`),
  ADD KEY `fk_movie_genres_genre_id` (`genre_id`);

--
-- Indexes for table `movie_images`
--
ALTER TABLE `movie_images`
  ADD PRIMARY KEY (`movie_image_id`),
  ADD KEY `fk_movie_images_movie_id` (`movie_id`),
  ADD KEY `fk_movie_images_account_id` (`account_id`);

--
-- Indexes for table `movie_keywords`
--
ALTER TABLE `movie_keywords`
  ADD KEY `fk_movie_keywords_movie_id` (`movie_id`),
  ADD KEY `fk_movie_keywords_keyword_id` (`keyword_id`);

--
-- Indexes for table `movie_people`
--
ALTER TABLE `movie_people`
  ADD KEY `fk_movie_people_movie_id` (`movie_id`),
  ADD KEY `fk_movie_people_person` (`person_id`);

--
-- Indexes for table `movie_reviews`
--
ALTER TABLE `movie_reviews`
  ADD KEY `fk_movie_reviews_movie_id` (`movie_id`),
  ADD KEY `fk_movie_reviews_review_id` (`review_id`);

--
-- Indexes for table `movie_videos`
--
ALTER TABLE `movie_videos`
  ADD PRIMARY KEY (`movie_video_id`),
  ADD KEY `fk_movie_videos_movie_id` (`movie_id`),
  ADD KEY `fk_movie_videos_account_id` (`account_id`);

--
-- Indexes for table `networks`
--
ALTER TABLE `networks`
  ADD PRIMARY KEY (`network_id`);

--
-- Indexes for table `nicknames`
--
ALTER TABLE `nicknames`
  ADD PRIMARY KEY (`nickname_id`),
  ADD KEY `fk_nicknames_person_id` (`person_id`);

--
-- Indexes for table `people`
--
ALTER TABLE `people`
  ADD PRIMARY KEY (`person_id`);

--
-- Indexes for table `person_images`
--
ALTER TABLE `person_images`
  ADD PRIMARY KEY (`person_image_id`),
  ADD KEY `fk_person_images_person_id` (`person_id`),
  ADD KEY `person_images_account_id` (`account_id`);

--
-- Indexes for table `rating_movies`
--
ALTER TABLE `rating_movies`
  ADD KEY `fk_rating_movies_account_id` (`account_id`),
  ADD KEY `fk_rating_movies_movie_id` (`movie_id`);

--
-- Indexes for table `rating_tv_series`
--
ALTER TABLE `rating_tv_series`
  ADD PRIMARY KEY (`account_id`),
  ADD KEY `fk_rating_tv_series_tv_series_id` (`tv_series_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `fk_reviews_account_id` (`account_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `social_networks`
--
ALTER TABLE `social_networks`
  ADD PRIMARY KEY (`social_network_id`);

--
-- Indexes for table `social_network_details`
--
ALTER TABLE `social_network_details`
  ADD KEY `fk_social_network_details_social_network_id` (`social_network_id`),
  ADD KEY `fk_social_network_details_account_id` (`account_id`),
  ADD KEY `fk_social_network_details_person_id` (`person_id`),
  ADD KEY `fk_social_network_details_movie_id` (`movie_id`),
  ADD KEY `social_network_details_tv_series_id` (`tv_series_id`);

--
-- Indexes for table `tv_episodes`
--
ALTER TABLE `tv_episodes`
  ADD PRIMARY KEY (`tv_episode_id`),
  ADD KEY `fk_tv_episodes_tv_season_id` (`tv_season_id`);

--
-- Indexes for table `tv_episode_people`
--
ALTER TABLE `tv_episode_people`
  ADD KEY `fk_tv_episode_people_tv_episode_id` (`tv_episode_id`),
  ADD KEY `fk_tv_episode_people_person_id` (`person_id`);

--
-- Indexes for table `tv_seasons`
--
ALTER TABLE `tv_seasons`
  ADD PRIMARY KEY (`tv_season_id`),
  ADD KEY `fk_tv_seasons_tv_series_id` (`tv_series_id`);

--
-- Indexes for table `tv_series`
--
ALTER TABLE `tv_series`
  ADD PRIMARY KEY (`tv_series_id`);

--
-- Indexes for table `tv_series_certifications`
--
ALTER TABLE `tv_series_certifications`
  ADD KEY `fk_tv_series_certifications_tv_series_id` (`tv_series_id`),
  ADD KEY `fk_tv_series_certifications_certification_id` (`certification_id`);

--
-- Indexes for table `tv_series_genres`
--
ALTER TABLE `tv_series_genres`
  ADD KEY `fk_tv_series_genres_tv_series_id` (`tv_series_id`),
  ADD KEY `fk_tv_series_genres_genre_id` (`genre_id`);

--
-- Indexes for table `tv_series_images`
--
ALTER TABLE `tv_series_images`
  ADD PRIMARY KEY (`tv_series_image_id`),
  ADD KEY `fk_tv_series_images_tv_series_id` (`tv_series_id`),
  ADD KEY `fk_tv_series_images_account_id` (`account_id`);

--
-- Indexes for table `tv_series_networks`
--
ALTER TABLE `tv_series_networks`
  ADD KEY `fk_tv_series_networks_tv_series_id` (`tv_series_id`),
  ADD KEY `fk_tv_series_networks_network_id` (`network_id`);

--
-- Indexes for table `tv_series_reviews`
--
ALTER TABLE `tv_series_reviews`
  ADD KEY `fk_tv_series_reviews_tv_series_id` (`tv_series_id`),
  ADD KEY `fk_tv_series_reviews_review_id` (`review_id`);

--
-- Indexes for table `tv_series_videos`
--
ALTER TABLE `tv_series_videos`
  ADD PRIMARY KEY (`tv_series_video_id`),
  ADD KEY `fk_tv_series_videos_tv_series_id` (`tv_series_id`),
  ADD KEY `fk_tv_series_videos_account_id` (`account_id`);

--
-- Indexes for table `watchlist_movies`
--
ALTER TABLE `watchlist_movies`
  ADD KEY `fk_watchlist_movies_account_id` (`account_id`),
  ADD KEY `fk_watchlist_movies_movie_id` (`movie_id`);

--
-- Indexes for table `watchlist_tv_series`
--
ALTER TABLE `watchlist_tv_series`
  ADD KEY `fk_watchlist_tv_series_account_id` (`account_id`),
  ADD KEY `fk_watchlist_tv_series_movie_id` (`movie_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `account_details`
--
ALTER TABLE `account_details`
  MODIFY `account_detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications`
--
ALTER TABLE `certifications`
  MODIFY `certification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_confirmations`
--
ALTER TABLE `email_confirmations`
  MODIFY `email_confirmation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `genres`
--
ALTER TABLE `genres`
  MODIFY `genre_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `keywords`
--
ALTER TABLE `keywords`
  MODIFY `keyword_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lists`
--
ALTER TABLE `lists`
  MODIFY `list_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `movie_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `movie_images`
--
ALTER TABLE `movie_images`
  MODIFY `movie_image_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `movie_videos`
--
ALTER TABLE `movie_videos`
  MODIFY `movie_video_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `networks`
--
ALTER TABLE `networks`
  MODIFY `network_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nicknames`
--
ALTER TABLE `nicknames`
  MODIFY `nickname_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `people`
--
ALTER TABLE `people`
  MODIFY `person_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `person_images`
--
ALTER TABLE `person_images`
  MODIFY `person_image_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rating_tv_series`
--
ALTER TABLE `rating_tv_series`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `social_networks`
--
ALTER TABLE `social_networks`
  MODIFY `social_network_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tv_episodes`
--
ALTER TABLE `tv_episodes`
  MODIFY `tv_episode_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tv_seasons`
--
ALTER TABLE `tv_seasons`
  MODIFY `tv_season_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tv_series`
--
ALTER TABLE `tv_series`
  MODIFY `tv_series_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tv_series_images`
--
ALTER TABLE `tv_series_images`
  MODIFY `tv_series_image_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tv_series_videos`
--
ALTER TABLE `tv_series_videos`
  MODIFY `tv_series_video_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `fk_accounts_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);

--
-- Constraints for table `account_details`
--
ALTER TABLE `account_details`
  ADD CONSTRAINT `fk_account_details_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`);

--
-- Constraints for table `email_confirmations`
--
ALTER TABLE `email_confirmations`
  ADD CONSTRAINT `fk_email_confirmations_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`);

--
-- Constraints for table `favorite_movies`
--
ALTER TABLE `favorite_movies`
  ADD CONSTRAINT `fk_favorite_movies_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`),
  ADD CONSTRAINT `fk_favorite_movies_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`);

--
-- Constraints for table `favorite_tv_series`
--
ALTER TABLE `favorite_tv_series`
  ADD CONSTRAINT `fk_favorite_tv_series_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`),
  ADD CONSTRAINT `fk_favorite_tv_series_tv_series_id` FOREIGN KEY (`tv_series_id`) REFERENCES `tv_series` (`tv_series_id`);

--
-- Constraints for table `lists`
--
ALTER TABLE `lists`
  ADD CONSTRAINT `fk_lists_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`);

--
-- Constraints for table `media_lists`
--
ALTER TABLE `media_lists`
  ADD CONSTRAINT `fk_media_lists_list_id` FOREIGN KEY (`list_id`) REFERENCES `lists` (`list_id`),
  ADD CONSTRAINT `fk_media_lists_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`),
  ADD CONSTRAINT `fk_media_lists_tv_series_id` FOREIGN KEY (`tv_series_id`) REFERENCES `tv_series` (`tv_series_id`);

--
-- Constraints for table `movie_certifications`
--
ALTER TABLE `movie_certifications`
  ADD CONSTRAINT `fk_movie_certifications_certification_id` FOREIGN KEY (`certification_id`) REFERENCES `certifications` (`certification_id`),
  ADD CONSTRAINT `fk_movie_certifications_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`);

--
-- Constraints for table `movie_genres`
--
ALTER TABLE `movie_genres`
  ADD CONSTRAINT `fk_movie_genres_genre_id` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`genre_id`),
  ADD CONSTRAINT `fk_movie_genres_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`);

--
-- Constraints for table `movie_images`
--
ALTER TABLE `movie_images`
  ADD CONSTRAINT `fk_movie_images_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`),
  ADD CONSTRAINT `fk_movie_images_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`);

--
-- Constraints for table `movie_keywords`
--
ALTER TABLE `movie_keywords`
  ADD CONSTRAINT `fk_movie_keywords_keyword_id` FOREIGN KEY (`keyword_id`) REFERENCES `keywords` (`keyword_id`),
  ADD CONSTRAINT `fk_movie_keywords_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`);

--
-- Constraints for table `movie_people`
--
ALTER TABLE `movie_people`
  ADD CONSTRAINT `fk_movie_people_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`),
  ADD CONSTRAINT `fk_movie_people_person` FOREIGN KEY (`person_id`) REFERENCES `people` (`person_id`);

--
-- Constraints for table `movie_reviews`
--
ALTER TABLE `movie_reviews`
  ADD CONSTRAINT `fk_movie_reviews_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`),
  ADD CONSTRAINT `fk_movie_reviews_review_id` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`review_id`);

--
-- Constraints for table `movie_videos`
--
ALTER TABLE `movie_videos`
  ADD CONSTRAINT `fk_movie_videos_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`),
  ADD CONSTRAINT `fk_movie_videos_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`);

--
-- Constraints for table `nicknames`
--
ALTER TABLE `nicknames`
  ADD CONSTRAINT `fk_nicknames_person_id` FOREIGN KEY (`person_id`) REFERENCES `people` (`person_id`);

--
-- Constraints for table `person_images`
--
ALTER TABLE `person_images`
  ADD CONSTRAINT `fk_person_images_person_id` FOREIGN KEY (`person_id`) REFERENCES `people` (`person_id`),
  ADD CONSTRAINT `person_images_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`);

--
-- Constraints for table `rating_movies`
--
ALTER TABLE `rating_movies`
  ADD CONSTRAINT `fk_rating_movies_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`),
  ADD CONSTRAINT `fk_rating_movies_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`);

--
-- Constraints for table `rating_tv_series`
--
ALTER TABLE `rating_tv_series`
  ADD CONSTRAINT `fk_rating_tv_series_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`),
  ADD CONSTRAINT `fk_rating_tv_series_tv_series_id` FOREIGN KEY (`tv_series_id`) REFERENCES `tv_series` (`tv_series_id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_reviews_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`);

--
-- Constraints for table `social_network_details`
--
ALTER TABLE `social_network_details`
  ADD CONSTRAINT `fk_social_network_details_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`),
  ADD CONSTRAINT `fk_social_network_details_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`),
  ADD CONSTRAINT `fk_social_network_details_person_id` FOREIGN KEY (`person_id`) REFERENCES `people` (`person_id`),
  ADD CONSTRAINT `fk_social_network_details_social_network_id` FOREIGN KEY (`social_network_id`) REFERENCES `social_networks` (`social_network_id`),
  ADD CONSTRAINT `social_network_details_tv_series_id` FOREIGN KEY (`tv_series_id`) REFERENCES `tv_series` (`tv_series_id`);

--
-- Constraints for table `tv_episodes`
--
ALTER TABLE `tv_episodes`
  ADD CONSTRAINT `fk_tv_episodes_tv_season_id` FOREIGN KEY (`tv_season_id`) REFERENCES `tv_seasons` (`tv_season_id`);

--
-- Constraints for table `tv_episode_people`
--
ALTER TABLE `tv_episode_people`
  ADD CONSTRAINT `fk_tv_episode_people_person_id` FOREIGN KEY (`person_id`) REFERENCES `people` (`person_id`),
  ADD CONSTRAINT `fk_tv_episode_people_tv_episode_id` FOREIGN KEY (`tv_episode_id`) REFERENCES `tv_episodes` (`tv_episode_id`);

--
-- Constraints for table `tv_seasons`
--
ALTER TABLE `tv_seasons`
  ADD CONSTRAINT `fk_tv_seasons_tv_series_id` FOREIGN KEY (`tv_series_id`) REFERENCES `tv_series` (`tv_series_id`);

--
-- Constraints for table `tv_series_certifications`
--
ALTER TABLE `tv_series_certifications`
  ADD CONSTRAINT `fk_tv_series_certifications_certification_id` FOREIGN KEY (`certification_id`) REFERENCES `certifications` (`certification_id`),
  ADD CONSTRAINT `fk_tv_series_certifications_tv_series_id` FOREIGN KEY (`tv_series_id`) REFERENCES `tv_series` (`tv_series_id`);

--
-- Constraints for table `tv_series_genres`
--
ALTER TABLE `tv_series_genres`
  ADD CONSTRAINT `fk_tv_series_genres_genre_id` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`genre_id`),
  ADD CONSTRAINT `fk_tv_series_genres_tv_series_id` FOREIGN KEY (`tv_series_id`) REFERENCES `tv_series` (`tv_series_id`);

--
-- Constraints for table `tv_series_images`
--
ALTER TABLE `tv_series_images`
  ADD CONSTRAINT `fk_tv_series_images_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`),
  ADD CONSTRAINT `fk_tv_series_images_tv_series_id` FOREIGN KEY (`tv_series_id`) REFERENCES `tv_series` (`tv_series_id`);

--
-- Constraints for table `tv_series_networks`
--
ALTER TABLE `tv_series_networks`
  ADD CONSTRAINT `fk_tv_series_networks_network_id` FOREIGN KEY (`network_id`) REFERENCES `networks` (`network_id`),
  ADD CONSTRAINT `fk_tv_series_networks_tv_series_id` FOREIGN KEY (`tv_series_id`) REFERENCES `tv_series` (`tv_series_id`);

--
-- Constraints for table `tv_series_reviews`
--
ALTER TABLE `tv_series_reviews`
  ADD CONSTRAINT `fk_tv_series_reviews_review_id` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`review_id`),
  ADD CONSTRAINT `fk_tv_series_reviews_tv_series_id` FOREIGN KEY (`tv_series_id`) REFERENCES `tv_series` (`tv_series_id`);

--
-- Constraints for table `tv_series_videos`
--
ALTER TABLE `tv_series_videos`
  ADD CONSTRAINT `fk_tv_series_videos_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`),
  ADD CONSTRAINT `fk_tv_series_videos_tv_series_id` FOREIGN KEY (`tv_series_id`) REFERENCES `tv_series` (`tv_series_id`);

--
-- Constraints for table `watchlist_movies`
--
ALTER TABLE `watchlist_movies`
  ADD CONSTRAINT `fk_watchlist_movies_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`),
  ADD CONSTRAINT `fk_watchlist_movies_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`);

--
-- Constraints for table `watchlist_tv_series`
--
ALTER TABLE `watchlist_tv_series`
  ADD CONSTRAINT `fk_watchlist_tv_series_account_id` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`),
  ADD CONSTRAINT `fk_watchlist_tv_series_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
