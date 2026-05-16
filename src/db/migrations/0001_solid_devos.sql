CREATE TABLE "dexter_accounts" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "dexter_accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "dexter_auth_sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dexter_users" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" text,
	"email" text,
	"email_verified" timestamp with time zone,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dexter_verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "dexter_verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "dexter_accounts" ADD CONSTRAINT "dexter_accounts_user_id_dexter_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dexter_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dexter_auth_sessions" ADD CONSTRAINT "dexter_auth_sessions_user_id_dexter_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dexter_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dexter_accounts_user_idx" ON "dexter_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "dexter_auth_sessions_user_idx" ON "dexter_auth_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "dexter_users_email_uq" ON "dexter_users" USING btree ("email");--> statement-breakpoint
ALTER TABLE "dexter_web_sessions" ADD CONSTRAINT "dexter_web_sessions_user_id_dexter_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dexter_users"("id") ON DELETE set null ON UPDATE no action;