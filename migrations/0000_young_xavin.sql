CREATE TABLE "agents" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"voice" text NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"prompt" text,
	"retell_agent_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "batch_calls" (
	"id" serial PRIMARY KEY NOT NULL,
	"batch_call_id" text NOT NULL,
	"name" text NOT NULL,
	"from_number" text NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"total_task_count" integer NOT NULL,
	"completed_count" integer DEFAULT 0 NOT NULL,
	"successful_count" integer DEFAULT 0 NOT NULL,
	"scheduled_timestamp" integer,
	"agent_id" integer,
	"created_by" integer,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	CONSTRAINT "batch_calls_batch_call_id_unique" UNIQUE("batch_call_id")
);
--> statement-breakpoint
CREATE TABLE "calls" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"from_number" text NOT NULL,
	"to_number" text NOT NULL,
	"duration" integer,
	"cost" text,
	"status" text NOT NULL,
	"end_reason" text,
	"sentiment" text,
	"outcome" text,
	"latency" integer,
	"lead_id" integer,
	"agent_id" integer,
	"batch_call_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"source" text,
	"type" text DEFAULT 'New Lead' NOT NULL,
	"description" text,
	"sentiment" text,
	"quality_score" integer,
	"status" text DEFAULT 'New' NOT NULL,
	"assigned_to" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"avatar_url" varchar(500),
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "batch_calls" ADD CONSTRAINT "batch_calls_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_calls" ADD CONSTRAINT "batch_calls_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calls" ADD CONSTRAINT "calls_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calls" ADD CONSTRAINT "calls_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calls" ADD CONSTRAINT "calls_batch_call_id_batch_calls_id_fk" FOREIGN KEY ("batch_call_id") REFERENCES "public"."batch_calls"("id") ON DELETE no action ON UPDATE no action;