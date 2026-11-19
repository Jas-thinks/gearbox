# ---------- ElastiCache Redis: rate limits, cache, idempotency ----------
resource "aws_elasticache_subnet_group" "redis" {
  name       = "gearbox-${var.environment}"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "gearbox-${var.environment}"
  description                = "Gearbox cache / rate-limit / idempotency"
  engine                     = "redis"
  engine_version             = "7.1"
  node_type                  = var.redis_node_type
  num_cache_clusters         = 2 # primary + replica in separate AZs
  automatic_failover_enabled = true
  multi_az_enabled           = true
  subnet_group_name          = aws_elasticache_subnet_group.redis.name
  security_group_ids         = [aws_security_group.redis.id]
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
}

# ---------- SQS: async work with a dead-letter queue ----------
resource "aws_sqs_queue" "events_dlq" {
  name                      = "gearbox-events-dlq-${var.environment}"
  message_retention_seconds = 1209600 # 14 days to investigate
  sqs_managed_sse_enabled   = true
}

resource "aws_sqs_queue" "events" {
  name                       = "gearbox-events-${var.environment}"
  visibility_timeout_seconds = 60
  receive_wait_time_seconds  = 20
  sqs_managed_sse_enabled    = true

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.events_dlq.arn
    maxReceiveCount     = 5
  })
}

# ---------- S3: user media (equipment photos, KYC docs) ----------
resource "random_id" "suffix" {
  byte_length = 3
}

resource "aws_s3_bucket" "media" {
  bucket = "gearbox-media-${var.environment}-${random_id.suffix.hex}"
}

resource "aws_s3_bucket_public_access_block" "media" {
  bucket                  = aws_s3_bucket.media.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "media" {
  bucket = aws_s3_bucket.media.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# ---------- Secrets Manager: injected into tasks at start, never in images ----------
locals {
  secret_names = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "API_SECRET",
    "WAITLIST_API_KEY",
    "GROWTH_OS_WEBHOOK_SECRET",
  ]
}

resource "aws_secretsmanager_secret" "app" {
  for_each = toset(local.secret_names)
  name     = "gearbox/${var.environment}/${each.key}"
}
