-- GateKeep MySQL Database Dump
-- Generated programmatically for Go54 phpMyAdmin Import

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `tenants`;
CREATE TABLE `tenants` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `tenant_type` varchar(255) NOT NULL DEFAULT 'residential',
  `subscription_status` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `billing_ends_at` timestamp NULL DEFAULT NULL,
  `paystack_subscription_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenants_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tenants` (`id`, `name`, `slug`, `tenant_type`, `subscription_status`, `created_at`, `updated_at`, `paystack_customer_code`, `subscription_ends_at`) VALUES
('a2447f34-986d-41f0-82c7-29d58387ac79', 'GateKeep Demo Estate', 'gatekeep-demo', 'residential', 'active', '2026-07-15 21:25:56', '2026-07-15 21:25:56', NULL, NULL),
('a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', 'Lekki Gardens Estate', 'lekki-gardens', 'residential', 'active', '2026-07-15 21:25:57', '2026-07-15 21:25:57', NULL, NULL),
('a2447f38-f5b6-488d-987e-086b3b6597f4', 'Parkview Heights', 'parkview-heights', 'residential', 'active', '2026-07-15 21:25:59', '2026-07-15 21:25:59', NULL, NULL),
('a2447f3b-a31b-414e-8fb9-2540716e63af', 'Harmony Business Park', 'harmony-bizpark', 'commercial', 'active', '2026-07-15 21:26:00', '2026-07-15 21:26:00', NULL, NULL);

DROP TABLE IF EXISTS `units`;
CREATE TABLE `units` (
  `id` char(36) NOT NULL,
  `tenant_id` char(36) DEFAULT NULL,
  `unit_label` varchar(255) NOT NULL,
  `payment_status` varchar(255) NOT NULL DEFAULT 'cleared',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `units_tenant_id_foreign` (`tenant_id`),
  CONSTRAINT `units_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `units` (`id`, `tenant_id`, `unit_label`, `payment_status`, `created_at`, `updated_at`) VALUES
('a2447f34-c5e3-45cc-aee0-ca76af9fc269', 'a2447f34-986d-41f0-82c7-29d58387ac79', 'Block A, Suite 101', 'cleared', '2026-07-15 21:25:56', '2026-07-15 21:25:56'),
('a2447f34-d53d-439c-bef7-09268319ee0a', 'a2447f34-986d-41f0-82c7-29d58387ac79', 'Block B, Suite 202', 'cleared', '2026-07-15 21:25:56', '2026-07-15 21:25:56'),
('a2447f34-d7b2-46a0-a284-d1a97634ffc3', 'a2447f34-986d-41f0-82c7-29d58387ac79', 'Block C, Penthouse', 'cleared', '2026-07-15 21:25:56', '2026-07-15 21:25:56'),
('a2447f36-b3ed-4e8f-a9c2-b68873720568', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', 'Villa 1', 'cleared', '2026-07-15 21:25:57', '2026-07-15 21:25:57'),
('a2447f36-b5fe-4083-b227-fb101ad6f3b8', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', 'Villa 2', 'cleared', '2026-07-15 21:25:57', '2026-07-15 21:25:57'),
('a2447f36-b80e-48de-8cb8-6226b314df17', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', 'Villa 3', 'cleared', '2026-07-15 21:25:57', '2026-07-15 21:25:57'),
('a2447f36-ba40-4854-9545-d6d4546b30b6', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', 'Villa 4', 'cleared', '2026-07-15 21:25:57', '2026-07-15 21:25:57'),
('a2447f38-f882-4ed4-adb1-57a9a775a9d6', 'a2447f38-f5b6-488d-987e-086b3b6597f4', 'Flat 1A', 'cleared', '2026-07-15 21:25:59', '2026-07-15 21:25:59'),
('a2447f38-fafb-4065-a2ad-7945a18cdf97', 'a2447f38-f5b6-488d-987e-086b3b6597f4', 'Flat 2B', 'cleared', '2026-07-15 21:25:59', '2026-07-15 21:25:59'),
('a2447f38-fe0a-4090-a974-b640499ba6b2', 'a2447f38-f5b6-488d-987e-086b3b6597f4', 'Flat 3C', 'cleared', '2026-07-15 21:25:59', '2026-07-15 21:25:59'),
('a2447f39-009f-47a7-8dd7-d84aa2380825', 'a2447f38-f5b6-488d-987e-086b3b6597f4', 'Flat 4D', 'cleared', '2026-07-15 21:25:59', '2026-07-15 21:25:59'),
('a2447f39-0396-4af8-9e5a-bd4fe8665ad0', 'a2447f38-f5b6-488d-987e-086b3b6597f4', 'Penthouse', 'cleared', '2026-07-15 21:25:59', '2026-07-15 21:25:59'),
('a2447f3b-a589-4ff9-9d18-a87a98cf1184', 'a2447f3b-a31b-414e-8fb9-2540716e63af', 'Office 101', 'cleared', '2026-07-15 21:26:00', '2026-07-15 21:26:00'),
('a2447f3b-a80f-4e7c-9bb5-29d2d8875ff4', 'a2447f3b-a31b-414e-8fb9-2540716e63af', 'Office 202', 'cleared', '2026-07-15 21:26:00', '2026-07-15 21:26:00'),
('a2447f3b-ab4f-4bb2-9afd-9ca196eec29f', 'a2447f3b-a31b-414e-8fb9-2540716e63af', 'Office 303', 'cleared', '2026-07-15 21:26:00', '2026-07-15 21:26:00');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `tenant_id` char(36) DEFAULT NULL,
  `unit_id` char(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `global_role` enum('super_admin','tenant_admin','guard','resident') NOT NULL DEFAULT 'resident',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_approved` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_tenant_id_foreign` (`tenant_id`),
  KEY `users_unit_id_foreign` (`unit_id`),
  CONSTRAINT `users_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `tenant_id`, `unit_id`, `name`, `email`, `phone`, `email_verified_at`, `password`, `global_role`, `remember_token`, `created_at`, `updated_at`, `is_approved`) VALUES
('a2447f35-2db6-4a69-ab8c-125313d98058', 'a2447f34-986d-41f0-82c7-29d58387ac79', NULL, 'GateKeep Demo Estate Admin', 'admin@demo.gatekeep.com.ng', NULL, NULL, '$2y$12$KGgA0pan3z.S4lXTp3TdCuH/tfBRQCTApIwuyfUQTfRBfwBhziNk.', 'tenant_admin', NULL, '2026-07-15 21:25:56', '2026-07-15 21:25:56', 1),
('a2447f35-9973-4ba3-99c4-301543f4c8c6', 'a2447f34-986d-41f0-82c7-29d58387ac79', NULL, 'Gate Security', 'guard@demo.gatekeep.com.ng', NULL, NULL, '$2y$12$ODFXBN.5Dia86YgeK/EAiuSwPaQHZ1ha9VFf7pQfyeJSHzFKWIw4e', 'guard', NULL, '2026-07-15 21:25:56', '2026-07-15 21:25:56', 1),
('a2447f35-f459-4c2e-bb08-af8250122d5d', 'a2447f34-986d-41f0-82c7-29d58387ac79', 'a2447f34-c5e3-45cc-aee0-ca76af9fc269', 'Adebayo Okafor', 'adebayo.0@demo.gatekeep.com.ng', NULL, NULL, '$2y$12$3Tp01bnPZ1XT9XQfjKhRMetBABjcI.VnmcWGzvNpuBP6hO1tJllOi', 'resident', NULL, '2026-07-15 21:25:57', '2026-07-15 21:25:57', 1),
('a2447f36-49c9-4908-b0b1-d2bcf4dae2b6', 'a2447f34-986d-41f0-82c7-29d58387ac79', 'a2447f34-d53d-439c-bef7-09268319ee0a', 'Chioma Nwosu', 'chioma.1@demo.gatekeep.com.ng', NULL, NULL, '$2y$12$1wXjLVeiW.fCOnV20fCBje3A/l6.sSPih5DnpvBBTTiYasxK9K8e6', 'resident', NULL, '2026-07-15 21:25:57', '2026-07-15 21:25:57', 1),
('a2447f36-9e06-414b-9192-7dc4d620ee2a', 'a2447f34-986d-41f0-82c7-29d58387ac79', 'a2447f34-d7b2-46a0-a284-d1a97634ffc3', 'Emeka Eze', 'emeka.2@demo.gatekeep.com.ng', NULL, NULL, '$2y$12$5mOkSUmiB2OiC5MUCO.d9ulyStxiHcQf1fHvJ/kXZRw3ShtMz6y2e', 'resident', NULL, '2026-07-15 21:25:57', '2026-07-15 21:25:57', 1),
('a2447f37-0a81-472e-9e75-cbbac86ae05e', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', NULL, 'Lekki Gardens Estate Admin', 'admin@lekki.gatekeep.com.ng', NULL, NULL, '$2y$12$IkPDBzPCCWDWzquguWRInuLVR99Y.H03b/btrD6.bUzroqBhRJvg.', 'tenant_admin', NULL, '2026-07-15 21:25:57', '2026-07-15 21:25:57', 1),
('a2447f37-6366-4732-80b0-cf1a90af9ad9', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', NULL, 'Gate Security', 'guard@lekki.gatekeep.com.ng', NULL, NULL, '$2y$12$Mopr3HkdLgMUKg9ZAEw35.llHjQdpkbjkB7tAUbkdTeDBDY6lpF.y', 'guard', NULL, '2026-07-15 21:25:58', '2026-07-15 21:25:58', 1),
('a2447f37-c31b-4721-89aa-e97348b017a7', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', 'a2447f36-b3ed-4e8f-a9c2-b68873720568', 'Adebayo Okafor', 'adebayo.0@lekki.gatekeep.com.ng', NULL, NULL, '$2y$12$bnhH6jmpme1y71qpR75zEeGoZM2dnqGt4/HlqpHKEzzbDlQVOlmNu', 'resident', NULL, '2026-07-15 21:25:58', '2026-07-15 21:25:58', 1),
('a2447f38-2163-44e2-adb1-edfd6b77b7e1', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', 'a2447f36-b5fe-4083-b227-fb101ad6f3b8', 'Chioma Nwosu', 'chioma.1@lekki.gatekeep.com.ng', NULL, NULL, '$2y$12$AVU5AIM3RxaFH5jjWg6KS.FijdAK9gEzOYA9/kQU4X/uUyhblTBga', 'resident', NULL, '2026-07-15 21:25:58', '2026-07-15 21:25:58', 1),
('a2447f38-8252-41c7-9844-bc6f9fa5e8dc', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', 'a2447f36-b80e-48de-8cb8-6226b314df17', 'Emeka Eze', 'emeka.2@lekki.gatekeep.com.ng', NULL, NULL, '$2y$12$.Ro6/r/hwTP3YlW4G97GVeMAntJSheMcSSrQ73cyp7o3vSL6pApii', 'resident', NULL, '2026-07-15 21:25:58', '2026-07-15 21:25:58', 1),
('a2447f38-deae-462f-992d-4afc7b89f9ad', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', 'a2447f36-ba40-4854-9545-d6d4546b30b6', 'Fatima Musa', 'fatima.3@lekki.gatekeep.com.ng', NULL, NULL, '$2y$12$fPsIuyh748wTF/lO2TH.cOGKakGsVcCYRJV8dlf6N8O2ROwJCkhN2', 'resident', NULL, '2026-07-15 21:25:59', '2026-07-15 21:25:59', 1),
('a2447f39-61cd-4117-8081-9e23a8392b11', 'a2447f38-f5b6-488d-987e-086b3b6597f4', NULL, 'Parkview Heights Admin', 'admin@parkview.gatekeep.com.ng', NULL, NULL, '$2y$12$/6MWjLb296RNmRc.MhxSTOftfCjhbAAQQpWlxgfiWWDO5FAw60srK', 'tenant_admin', NULL, '2026-07-15 21:25:59', '2026-07-15 21:25:59', 1),
('a2447f39-bff3-46f0-bcff-517e6c735b55', 'a2447f38-f5b6-488d-987e-086b3b6597f4', NULL, 'Gate Security', 'guard@parkview.gatekeep.com.ng', NULL, NULL, '$2y$12$IRDAWCOoWuFqrHulQizjKeS0vsrDbRAeTShncG2aH14fyrWiFR916', 'guard', NULL, '2026-07-15 21:25:59', '2026-07-15 21:25:59', 1),
('a2447f3a-21e9-4435-861c-351386ad161a', 'a2447f38-f5b6-488d-987e-086b3b6597f4', 'a2447f38-f882-4ed4-adb1-57a9a775a9d6', 'Adebayo Okafor', 'adebayo.0@parkview.gatekeep.com.ng', NULL, NULL, '$2y$12$.X4YvbcK0R2YQRCKXM2M4OvKs0ZGdaVohWZRC0.tcpavRRg0jNq7S', 'resident', NULL, '2026-07-15 21:25:59', '2026-07-15 21:25:59', 1),
('a2447f3a-7e21-4ccb-9faa-de84bf7e2665', 'a2447f38-f5b6-488d-987e-086b3b6597f4', 'a2447f38-fafb-4065-a2ad-7945a18cdf97', 'Chioma Nwosu', 'chioma.1@parkview.gatekeep.com.ng', NULL, NULL, '$2y$12$pJm1SOmCBMeQsFtjs1t4ZuGEJXKrZOv1EIn9Kodmr4Pe1j7V4fKEK', 'resident', NULL, '2026-07-15 21:26:00', '2026-07-15 21:26:00', 1),
('a2447f3a-d7d7-4a19-80da-67a2661b4beb', 'a2447f38-f5b6-488d-987e-086b3b6597f4', 'a2447f38-fe0a-4090-a974-b640499ba6b2', 'Emeka Eze', 'emeka.2@parkview.gatekeep.com.ng', NULL, NULL, '$2y$12$vz88Otmwp9qWfyQiVNb/iuDsHS/I9kfvuadu9DnXSs83Myjm0iaby', 'resident', NULL, '2026-07-15 21:26:00', '2026-07-15 21:26:00', 1),
('a2447f3b-3317-497c-9664-71d5488261b9', 'a2447f38-f5b6-488d-987e-086b3b6597f4', 'a2447f39-009f-47a7-8dd7-d84aa2380825', 'Fatima Musa', 'fatima.3@parkview.gatekeep.com.ng', NULL, NULL, '$2y$12$q/8a..yPWplhAhWShTS0fupGBG6TpEQvw5LUsoqsxCj8fEItG6cT6', 'resident', NULL, '2026-07-15 21:26:00', '2026-07-15 21:26:00', 1),
('a2447f3b-8e63-4d05-ae0d-e125b3bb13df', 'a2447f38-f5b6-488d-987e-086b3b6597f4', 'a2447f39-0396-4af8-9e5a-bd4fe8665ad0', 'Gbenga Adeyemi', 'gbenga.4@parkview.gatekeep.com.ng', NULL, NULL, '$2y$12$eDSz5XOT9.caveOM.EVIHOZ6IAd/yATWuSQ6HLR.T.umu3YloQJiy', 'resident', NULL, '2026-07-15 21:26:00', '2026-07-15 21:26:00', 1),
('a2447f3c-040f-433c-8116-761ff5471ad2', 'a2447f3b-a31b-414e-8fb9-2540716e63af', NULL, 'Harmony Business Park Admin', 'admin@harmony.gatekeep.com.ng', NULL, NULL, '$2y$12$UWzwLwsTHkU0rPBfDU4dCeniPUwzYLfWi3t7Do0R5vVcYUnURiYIq', 'tenant_admin', NULL, '2026-07-15 21:26:01', '2026-07-15 21:26:01', 1),
('a2447f3c-5fab-454e-b633-e57874febf38', 'a2447f3b-a31b-414e-8fb9-2540716e63af', NULL, 'Gate Security', 'guard@harmony.gatekeep.com.ng', NULL, NULL, '$2y$12$EHKhS4Ap82YpXXQ9fwm.MOY7Z6z1zjM.fFQ7c8ECKrZrI7NsUwqei', 'guard', NULL, '2026-07-15 21:26:01', '2026-07-15 21:26:01', 1),
('a2447f3c-be5f-4f2e-b4b3-4d79700612d4', 'a2447f3b-a31b-414e-8fb9-2540716e63af', 'a2447f3b-a589-4ff9-9d18-a87a98cf1184', 'Adebayo Okafor', 'adebayo.0@harmony.gatekeep.com.ng', NULL, NULL, '$2y$12$l4DJHW9rycSNTBkNdu7SKeIIzKUJMwl/eGt.ntQVaiQMcsoDq4s42', 'resident', NULL, '2026-07-15 21:26:01', '2026-07-15 21:26:01', 1),
('a2447f3d-2902-40c1-a461-278ef0f661e1', 'a2447f3b-a31b-414e-8fb9-2540716e63af', 'a2447f3b-a80f-4e7c-9bb5-29d2d8875ff4', 'Chioma Nwosu', 'chioma.1@harmony.gatekeep.com.ng', NULL, NULL, '$2y$12$ZpXNz/GU7k52BCF7708ny.2LEOxPTGuW4PuvV5sT/LyhzyOW.4uBu', 'resident', NULL, '2026-07-15 21:26:01', '2026-07-15 21:26:01', 1),
('a2447f3d-8659-43cd-840b-849d27829314', 'a2447f3b-a31b-414e-8fb9-2540716e63af', 'a2447f3b-ab4f-4bb2-9afd-9ca196eec29f', 'Emeka Eze', 'emeka.2@harmony.gatekeep.com.ng', NULL, NULL, '$2y$12$chczLWy9TuLY6QDDtEYQs.C0U5hc69QpXwKht.BVR24PuT.fS1P6m', 'resident', NULL, '2026-07-15 21:26:02', '2026-07-15 21:26:02', 1);

DROP TABLE IF EXISTS `password_reset_tokens`;
;

DROP TABLE IF EXISTS `sessions`;
;

DROP TABLE IF EXISTS `visitors`;
CREATE TABLE `visitors` (
  `id` char(36) NOT NULL,
  `tenant_id` char(36) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `visitors_tenant_id_foreign` (`tenant_id`),
  CONSTRAINT `visitors_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `visitors` (`id`, `tenant_id`, `phone_number`, `full_name`, `photo_url`, `created_at`, `updated_at`) VALUES
('a2447f36-a24b-4395-aaa1-bf315af58f5b', 'a2447f34-986d-41f0-82c7-29d58387ac79', '080demo1111', 'Bola Tinubu Jr.', NULL, '2026-07-15 21:25:57', '2026-07-15 21:25:57'),
('a2447f36-a57a-4029-9858-f592458666f3', 'a2447f34-986d-41f0-82c7-29d58387ac79', '080demo2222', 'Ngozi Okonkwo', NULL, '2026-07-15 21:25:57', '2026-07-15 21:25:57'),
('a2447f36-a7e6-4fa8-a848-b1760ee2ae05', 'a2447f34-986d-41f0-82c7-29d58387ac79', '080demo3333', 'James Delivery', NULL, '2026-07-15 21:25:57', '2026-07-15 21:25:57'),
('a2447f38-e5e1-422e-a3b6-3665bc5e7750', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', '080lekki1111', 'Bola Tinubu Jr.', NULL, '2026-07-15 21:25:59', '2026-07-15 21:25:59'),
('a2447f38-e896-42d7-8e23-752d45b4e53e', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', '080lekki2222', 'Ngozi Okonkwo', NULL, '2026-07-15 21:25:59', '2026-07-15 21:25:59'),
('a2447f38-eb3b-4d76-a57a-b076ca3f202c', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', '080lekki3333', 'James Delivery', NULL, '2026-07-15 21:25:59', '2026-07-15 21:25:59'),
('a2447f3b-939a-43d7-8a13-58848164df80', 'a2447f38-f5b6-488d-987e-086b3b6597f4', '080parkview1111', 'Bola Tinubu Jr.', NULL, '2026-07-15 21:26:00', '2026-07-15 21:26:00'),
('a2447f3b-969a-4cda-82c1-b08864733ae7', 'a2447f38-f5b6-488d-987e-086b3b6597f4', '080parkview2222', 'Ngozi Okonkwo', NULL, '2026-07-15 21:26:00', '2026-07-15 21:26:00'),
('a2447f3b-9993-4861-8918-42966878b342', 'a2447f38-f5b6-488d-987e-086b3b6597f4', '080parkview3333', 'James Delivery', NULL, '2026-07-15 21:26:00', '2026-07-15 21:26:00'),
('a2447f3d-8a8c-4e7a-97cb-5c178008c11c', 'a2447f3b-a31b-414e-8fb9-2540716e63af', '080harmony1111', 'Bola Tinubu Jr.', NULL, '2026-07-15 21:26:02', '2026-07-15 21:26:02'),
('a2447f3d-8d21-4f05-bf9c-9c0b835b09f4', 'a2447f3b-a31b-414e-8fb9-2540716e63af', '080harmony2222', 'Ngozi Okonkwo', NULL, '2026-07-15 21:26:02', '2026-07-15 21:26:02'),
('a2447f3d-8fb7-4f37-8d7c-ce839e217bf0', 'a2447f3b-a31b-414e-8fb9-2540716e63af', '080harmony3333', 'James Delivery', NULL, '2026-07-15 21:26:02', '2026-07-15 21:26:02');

DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `visits`;
CREATE TABLE `visits` (
  `id` char(36) NOT NULL,
  `tenant_id` char(36) NOT NULL,
  `unit_id` char(36) DEFAULT NULL,
  `host_id` char(36) NOT NULL,
  `visitor_id` char(36) DEFAULT NULL,
  `visit_type` varchar(255) NOT NULL,
  `otp_code` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `expected_arrival` timestamp NOT NULL,
  `checked_in_at` timestamp NULL DEFAULT NULL,
  `checked_in_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `visits_tenant_id_foreign` (`tenant_id`),
  KEY `visits_unit_id_foreign` (`unit_id`),
  KEY `visits_host_id_foreign` (`host_id`),
  KEY `visits_visitor_id_foreign` (`visitor_id`),
  KEY `visits_checked_in_by_foreign` (`checked_in_by`),
  CONSTRAINT `visits_checked_in_by_foreign` FOREIGN KEY (`checked_in_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `visits_host_id_foreign` FOREIGN KEY (`host_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `visits_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `visits_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE,
  CONSTRAINT `visits_visitor_id_foreign` FOREIGN KEY (`visitor_id`) REFERENCES `visitors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `visits` (`id`, `tenant_id`, `unit_id`, `host_id`, `visitor_id`, `visit_type`, `otp_code`, `status`, `expected_arrival`, `created_at`, `updated_at`, `checked_in_at`, `checked_in_by`) VALUES
('a2447f36-aa7f-4710-bc1b-d189f5485c2a', 'a2447f34-986d-41f0-82c7-29d58387ac79', 'a2447f34-c5e3-45cc-aee0-ca76af9fc269', 'a2447f35-f459-4c2e-bb08-af8250122d5d', 'a2447f36-a24b-4395-aaa1-bf315af58f5b', 'personal', 595171, 'pending', '2026-07-15 23:25:57', '2026-07-15 21:25:57', '2026-07-15 21:25:57', NULL, NULL),
('a2447f36-acb9-4986-b799-2021d67057d8', 'a2447f34-986d-41f0-82c7-29d58387ac79', 'a2447f34-d53d-439c-bef7-09268319ee0a', 'a2447f36-49c9-4908-b0b1-d2bcf4dae2b6', 'a2447f36-a57a-4029-9858-f592458666f3', 'service', 740194, 'checked_out', '2026-07-14 21:25:57', '2026-07-15 21:25:57', '2026-07-15 21:25:57', '2026-07-14 19:25:57', NULL),
('a2447f36-af1a-40a4-a31a-7fca8b106337', 'a2447f34-986d-41f0-82c7-29d58387ac79', 'a2447f34-c5e3-45cc-aee0-ca76af9fc269', 'a2447f35-f459-4c2e-bb08-af8250122d5d', 'a2447f36-a7e6-4fa8-a848-b1760ee2ae05', 'dispatch', 930498, 'checked_in', '2026-07-15 20:25:57', '2026-07-15 21:25:57', '2026-07-15 21:25:57', '2026-07-15 21:05:57', 'a2447f35-9973-4ba3-99c4-301543f4c8c6'),
('a2447f38-edcf-4800-9ed2-ff35c93d2371', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', 'a2447f36-b3ed-4e8f-a9c2-b68873720568', 'a2447f37-c31b-4721-89aa-e97348b017a7', 'a2447f38-e5e1-422e-a3b6-3665bc5e7750', 'personal', 265642, 'pending', '2026-07-15 23:25:59', '2026-07-15 21:25:59', '2026-07-15 21:25:59', NULL, NULL),
('a2447f38-f097-49c3-b2fb-cf9c1b47e952', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', 'a2447f36-b5fe-4083-b227-fb101ad6f3b8', 'a2447f38-2163-44e2-adb1-edfd6b77b7e1', 'a2447f38-e896-42d7-8e23-752d45b4e53e', 'service', 958973, 'checked_out', '2026-07-14 21:25:59', '2026-07-15 21:25:59', '2026-07-15 21:25:59', '2026-07-14 19:25:59', NULL),
('a2447f38-f31d-4ef7-821f-0c8623cc76e2', 'a2447f36-b16e-4ccc-a9e2-9924f1ea52c2', 'a2447f36-b3ed-4e8f-a9c2-b68873720568', 'a2447f37-c31b-4721-89aa-e97348b017a7', 'a2447f38-eb3b-4d76-a57a-b076ca3f202c', 'dispatch', 921961, 'checked_in', '2026-07-15 20:25:59', '2026-07-15 21:25:59', '2026-07-15 21:25:59', '2026-07-15 21:05:59', 'a2447f37-6366-4732-80b0-cf1a90af9ad9'),
('a2447f3b-9c70-4b21-9637-ca3515e386d5', 'a2447f38-f5b6-488d-987e-086b3b6597f4', 'a2447f38-f882-4ed4-adb1-57a9a775a9d6', 'a2447f3a-21e9-4435-861c-351386ad161a', 'a2447f3b-939a-43d7-8a13-58848164df80', 'personal', 232453, 'pending', '2026-07-15 23:26:00', '2026-07-15 21:26:00', '2026-07-15 21:26:00', NULL, NULL),
('a2447f3b-9e85-492f-b35b-adb6f957323c', 'a2447f38-f5b6-488d-987e-086b3b6597f4', 'a2447f38-fafb-4065-a2ad-7945a18cdf97', 'a2447f3a-7e21-4ccb-9faa-de84bf7e2665', 'a2447f3b-969a-4cda-82c1-b08864733ae7', 'service', '051123', 'checked_out', '2026-07-14 21:26:00', '2026-07-15 21:26:00', '2026-07-15 21:26:00', '2026-07-14 19:26:00', NULL),
('a2447f3b-a0a8-4418-9f9b-7711b2d933ee', 'a2447f38-f5b6-488d-987e-086b3b6597f4', 'a2447f38-f882-4ed4-adb1-57a9a775a9d6', 'a2447f3a-21e9-4435-861c-351386ad161a', 'a2447f3b-9993-4861-8918-42966878b342', 'dispatch', 691910, 'checked_in', '2026-07-15 20:26:00', '2026-07-15 21:26:00', '2026-07-15 21:26:00', '2026-07-15 21:06:00', 'a2447f39-bff3-46f0-bcff-517e6c735b55'),
('a2447f3d-92a4-48aa-89ab-702fb1688e2e', 'a2447f3b-a31b-414e-8fb9-2540716e63af', 'a2447f3b-a589-4ff9-9d18-a87a98cf1184', 'a2447f3c-be5f-4f2e-b4b3-4d79700612d4', 'a2447f3d-8a8c-4e7a-97cb-5c178008c11c', 'personal', 170868, 'pending', '2026-07-15 23:26:02', '2026-07-15 21:26:02', '2026-07-15 21:26:02', NULL, NULL),
('a2447f3d-96c5-4081-95b6-c802d96c4bf9', 'a2447f3b-a31b-414e-8fb9-2540716e63af', 'a2447f3b-a80f-4e7c-9bb5-29d2d8875ff4', 'a2447f3d-2902-40c1-a461-278ef0f661e1', 'a2447f3d-8d21-4f05-bf9c-9c0b835b09f4', 'service', 857264, 'checked_out', '2026-07-14 21:26:02', '2026-07-15 21:26:02', '2026-07-15 21:26:02', '2026-07-14 19:26:02', NULL),
('a2447f3d-9978-4239-9126-a7fe36f45cdb', 'a2447f3b-a31b-414e-8fb9-2540716e63af', 'a2447f3b-a589-4ff9-9d18-a87a98cf1184', 'a2447f3c-be5f-4f2e-b4b3-4d79700612d4', 'a2447f3d-8fb7-4f37-8d7c-ce839e217bf0', 'dispatch', '092311', 'checked_in', '2026-07-15 20:26:02', '2026-07-15 21:26:02', '2026-07-15 21:26:02', '2026-07-15 21:06:02', 'a2447f3c-5fab-454e-b633-e57874febf38');

DROP TABLE IF EXISTS `notices`;
CREATE TABLE `notices` (
  `id` char(36) NOT NULL,
  `tenant_id` char(36) NOT NULL,
  `author_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `type` enum('announcement','poll') NOT NULL DEFAULT 'announcement',
  `pinned` tinyint(1) NOT NULL DEFAULT 0,
  `published_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notices_tenant_id_foreign` (`tenant_id`),
  KEY `notices_author_id_foreign` (`author_id`),
  CONSTRAINT `notices_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notices_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `poll_options`;
CREATE TABLE `poll_options` (
  `id` char(36) NOT NULL,
  `notice_id` char(36) NOT NULL,
  `option_text` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `poll_options_notice_id_foreign` (`notice_id`),
  CONSTRAINT `poll_options_notice_id_foreign` FOREIGN KEY (`notice_id`) REFERENCES `notices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `poll_votes`;
CREATE TABLE `poll_votes` (
  `id` char(36) NOT NULL,
  `poll_option_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `poll_votes_poll_option_id_user_id_unique` (`poll_option_id`,`user_id`),
  KEY `poll_votes_user_id_foreign` (`user_id`),
  CONSTRAINT `poll_votes_poll_option_id_foreign` FOREIGN KEY (`poll_option_id`) REFERENCES `poll_options` (`id`) ON DELETE CASCADE,
  CONSTRAINT `poll_votes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `maintenance_tickets`;
CREATE TABLE `maintenance_tickets` (
  `id` char(36) NOT NULL,
  `tenant_id` char(36) NOT NULL,
  `unit_id` char(36) NOT NULL,
  `reporter_id` char(36) NOT NULL,
  `assignee_id` char(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
  `resolved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `maintenance_tickets_tenant_id_foreign` (`tenant_id`),
  KEY `maintenance_tickets_unit_id_foreign` (`unit_id`),
  KEY `maintenance_tickets_reporter_id_foreign` (`reporter_id`),
  KEY `maintenance_tickets_assignee_id_foreign` (`assignee_id`),
  CONSTRAINT `maintenance_tickets_assignee_id_foreign` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `maintenance_tickets_reporter_id_foreign` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `maintenance_tickets_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `maintenance_tickets_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `ticket_comments`;
CREATE TABLE `ticket_comments` (
  `id` char(36) NOT NULL,
  `ticket_id` char(36) NOT NULL,
  `author_id` char(36) NOT NULL,
  `body` text NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ticket_comments_ticket_id_foreign` (`ticket_id`),
  KEY `ticket_comments_author_id_foreign` (`author_id`),
  CONSTRAINT `ticket_comments_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ticket_comments_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `maintenance_tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
