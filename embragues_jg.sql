-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 12, 2026 at 12:43 AM
-- Server version: 10.11.19-MariaDB
-- PHP Version: 8.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `embragues_jg`
--
CREATE DATABASE IF NOT EXISTS `embragues_jg` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `embragues_jg`;

-- --------------------------------------------------------

--
-- Table structure for table `contact_form`
--

CREATE TABLE `contact_form` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `phone` varchar(55) NOT NULL,
  `email` varchar(55) NOT NULL,
  `service` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_form`
--

INSERT INTO `contact_form` (`id`, `name`, `phone`, `email`, `service`, `message`, `date`) VALUES
(2, 'Andrés Felipe Sánchez Camacho', '3137074996', 'andresfsanchez@gmail.com', 'transmisiones', 'Mensaje 2', '2026-11-03 23:10:44'),
(3, 'Andrés Felipe Sánchez Camacho', '3137074996', 'andresfsanchez71@gmail.com', 'cajas', 'Proembla', '2026-11-09 19:24:29'),
(4, 'Andrés Felipe Sánchez Camacho', '3137074996', 'andresfsanchez71@gmail.com', 'Cajas de Cambio', 'hgfdfg', '2026-11-09 21:18:25'),
(5, 'Andrés Felipe Sánchez Camacho', '3137074996', 'andresfsanchez71@gmail.com', 'embragues', 'dsasda', '2026-11-10 02:11:57');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'Administrador'),
(3, 'Cliente'),
(2, 'Colaborador');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `category_id` int(11) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `description`, `category_id`, `icon`, `is_active`) VALUES
(1, 'Cambio de Embrague Completo', 'Reemplazo del kit de embrague: disco, prensa y collarín de empuje', 3, NULL, 1),
(2, 'Reparación de Caja de Cambios', 'Diagnóstico y reparación de sincronizadores, rodamientos y engranajes.', 3, NULL, 1),
(3, 'Ajuste de Embrague', 'Regulación del pedal y punto de enganche del embrague.', 1, NULL, 1),
(4, 'Cambio de Aceite de Transmisión', 'Drenaje y llenado con aceite de transmisión de alta viscosidad.', 1, NULL, 1),
(5, 'Diagnóstico Vehicular', 'Inspección completa del sistema de transmisión y embrague.', 2, NULL, 1),
(6, 'Cambio de Volante de Inercia', 'Reemplazo del volante motor simple o bimasa.', 3, NULL, 1),
(7, 'Rectificación de Volante Motor', 'Rectificado de precisión para superficie de contacto limpia.', 1, NULL, 0),
(8, 'Mantenimiento del Sistema Hidráulico', 'Reemplazo de bomba esclava y purgado del circuito hidráulico.', 1, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `services_categories`
--

CREATE TABLE `services_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services_categories`
--

INSERT INTO `services_categories` (`id`, `name`) VALUES
(1, 'Mantenimiento'),
(2, 'Diagnóstico'),
(3, 'Reparación');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(60) NOT NULL,
  `email` varchar(100) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `pass`, `role_id`, `image`, `is_active`) VALUES
(1, 'Andrés Sánchez', 'admin', 'admin@correo.com', 'yxmErSQVEvqNRUG2G+nqCQ==:rQcSVUFdcW5CqX7ZxAm3lHTcIYufFesXBu3OrhyZgkw=', 1, NULL, 1),
(2, 'Nicole Agudelo', 'colab', 'colab@email.com', 'fBJDU8IkCGmEt7FAZns/bA==:SadX+N97YRsxgk2Kas9gpmbk1BOkZXyWgKe/crnV2LU=', 2, NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact_form`
--
ALTER TABLE `contact_form`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_services_category` (`category_id`);

--
-- Indexes for table `services_categories`
--
ALTER TABLE `services_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact_form`
--
ALTER TABLE `contact_form`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `services_categories`
--
ALTER TABLE `services_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `fk_services_category` FOREIGN KEY (`category_id`) REFERENCES `services_categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
