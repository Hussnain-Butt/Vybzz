--
-- PostgreSQL database dump
--

\restrict MDzEk0da489SMol5hzmxI1fYOBZtGAsW894YidbJ9HphxqRR8SGuYMAyMBf6jwz

-- Dumped from database version 16.10 (Debian 16.10-1.pgdg13+1)
-- Dumped by pg_dump version 16.10 (Debian 16.10-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: CreatorProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CreatorProfile" (
    id text NOT NULL,
    "pageName" text NOT NULL,
    "pageUrl" text NOT NULL,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "youtubeUrl" text,
    "instagramUrl" text,
    "twitterUrl" text,
    "facebookUrl" text,
    "twitchUrl" text,
    "tiktokUrl" text,
    "userId" text NOT NULL,
    "bannerUrl" text,
    bio text,
    "onboardingStep" integer DEFAULT 2 NOT NULL,
    "profileImageUrl" text
);


ALTER TABLE public."CreatorProfile" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    "clerkId" text NOT NULL,
    email text NOT NULL,
    name text,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: CreatorProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CreatorProfile" (id, "pageName", "pageUrl", status, "createdAt", "updatedAt", "youtubeUrl", "instagramUrl", "twitterUrl", "facebookUrl", "twitchUrl", "tiktokUrl", "userId", "bannerUrl", bio, "onboardingStep", "profileImageUrl") FROM stdin;
cmh1n6aox0002rt0uevkr29q5	ali	ali	ACTIVE	2025-10-22 06:58:20.96	2025-10-22 08:29:07.947	https://www.youtube.com/www.youtube.com/	\N	\N	\N	\N	\N	cmh1n5ylq0000rt0uoi4dmne0	https://res.cloudinary.com/dxi6hlanc/image/upload/v1761120563/vybzz_creators/omvycdpqral0yeixs7ig.jpg	Run services locally (no Docker). This requires local Postgres — I can give exact commands to install/run Postgres locally or run a quick ephemeral Postgres using the official Windows installer.	4	https://res.cloudinary.com/dxi6hlanc/image/upload/v1761121747/vybzz_creators/ctllfvhehfth4t9hjdld.jpg
cmh2z6tj40002qe0upgz38d5j	king	king	ACTIVE	2025-10-23 05:22:26.941	2025-10-23 05:24:32.409	https://www.youtube.com/www.youtube.com/	\N	\N	\N	\N	\N	cmh2z6b9z0000qe0ucjptt553	https://res.cloudinary.com/dxi6hlanc/image/upload/v1761196998/vybzz_creators/wcskxbz7quvmt94fyaxh.png	Hkasndjkadhkalshdjkals	5	https://res.cloudinary.com/dxi6hlanc/image/upload/v1761197071/vybzz_creators/olpjaysrd2pnnmu1a9ip.jpg
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, "clerkId", email, name, "imageUrl", "createdAt", "updatedAt") FROM stdin;
cmh1n5ylq0000rt0uoi4dmne0	user_34PXfdebeSnpki3OLyZpc6h3Hju	tools8591@gmail.com	tools	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zNFBYZmRyaWZDMGd6a0U4anU0WDlaQVpiWWoifQ	2025-10-22 06:58:05.289	2025-10-22 06:58:05.289
cmh2z6b9z0000qe0ucjptt553	user_34SB73TeRpQgDngdAoYqWCyCnD6	bhussnain966@gmail.com	hussnain butt	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zNFNCNzJnamJlOGVlWm5ESmpIT1B3QU5kVFUifQ	2025-10-23 05:22:03.265	2025-10-23 05:22:03.265
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9edd58dc-77b7-4300-b6c7-befde51f4727	a4c8201a5d26f76ee637012fd8700ad43643294f872ec4884a0d22948cfd9ebe	2025-10-21 04:06:33.186836+00	20251014_baseline	\N	\N	2025-10-21 04:06:33.136002+00	1
609e3d92-a331-4c3c-a7d7-3bc82170461d	6cd5bc2b416e31b39d326cba35846c9596c8598cda19f7e49ed6b5fc01ae7e1e	2025-10-21 04:06:33.228978+00	20251015040754_updated_user_and_profile_schema	\N	\N	2025-10-21 04:06:33.18927+00	1
af85b4bd-1eb4-4de2-81ca-2873d283d46a	1a5be6acec086fa7ca72367b03c6494b8100224e5467813a0e7c89106725c46a	2025-10-21 04:06:33.28+00	20251015082933_init	\N	\N	2025-10-21 04:06:33.230851+00	1
25ba06e5-aabf-4fe9-a199-6e95746181b5	69cc0c80b6fc152fee765da1d2f88e3322b6b60aadef0fba71e7aa7b220ae076	2025-10-21 04:07:33.380386+00	20251021040733_add_creator_profile_fields	\N	\N	2025-10-21 04:07:33.37274+00	1
\.


--
-- Name: CreatorProfile CreatorProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CreatorProfile"
    ADD CONSTRAINT "CreatorProfile_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: CreatorProfile_pageName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CreatorProfile_pageName_key" ON public."CreatorProfile" USING btree ("pageName");


--
-- Name: CreatorProfile_pageUrl_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CreatorProfile_pageUrl_key" ON public."CreatorProfile" USING btree ("pageUrl");


--
-- Name: CreatorProfile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CreatorProfile_userId_key" ON public."CreatorProfile" USING btree ("userId");


--
-- Name: User_clerkId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_clerkId_idx" ON public."User" USING btree ("clerkId");


--
-- Name: User_clerkId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_clerkId_key" ON public."User" USING btree ("clerkId");


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: CreatorProfile CreatorProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CreatorProfile"
    ADD CONSTRAINT "CreatorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict MDzEk0da489SMol5hzmxI1fYOBZtGAsW894YidbJ9HphxqRR8SGuYMAyMBf6jwz

