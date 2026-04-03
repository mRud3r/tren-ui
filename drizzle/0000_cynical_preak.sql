CREATE TYPE "public"."difficulty_level" AS ENUM('easy', 'intermediate', 'hard');--> statement-breakpoint
CREATE TYPE "public"."exercise_tracking_type" AS ENUM('reps', 'duration');--> statement-breakpoint
CREATE TYPE "public"."exercise_type" AS ENUM('strength', 'cardio', 'flexibility', 'core', 'plyometric');--> statement-breakpoint
CREATE TYPE "public"."exercise_weight_type" AS ENUM('weighted', 'bodyweight');--> statement-breakpoint
CREATE TABLE "exercise_session" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"exercise_id" integer NOT NULL,
	"user_id" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exercise_set" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"user_id" text,
	"reps" integer,
	"weight" numeric,
	"duration_sec" integer,
	"intensity" integer,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"exercise_name" text,
	"primary_muscle_id" integer,
	"secondary_muscle_ids" integer[],
	"tracking_type" "exercise_tracking_type" DEFAULT 'reps' NOT NULL,
	"type" "exercise_type",
	"weight_type" "exercise_weight_type" DEFAULT 'weighted' NOT NULL,
	"is_unilateral" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "muscle_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"workout_id" integer NOT NULL,
	"exercise_id" integer NOT NULL,
	"exercise_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_plan_days" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"workout_id" integer NOT NULL,
	"day_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workout_session" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"workout_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "exercise_session" ADD CONSTRAINT "exercise_session_session_id_workout_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."workout_session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_session" ADD CONSTRAINT "exercise_session_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_set" ADD CONSTRAINT "exercise_set_session_id_exercise_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."exercise_session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_primary_muscle_id_muscle_groups_id_fk" FOREIGN KEY ("primary_muscle_id") REFERENCES "public"."muscle_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_plan_days" ADD CONSTRAINT "workout_plan_days_plan_id_workout_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."workout_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_plan_days" ADD CONSTRAINT "workout_plan_days_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_session" ADD CONSTRAINT "workout_session_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE no action ON UPDATE no action;