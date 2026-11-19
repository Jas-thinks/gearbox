output "cloudfront_domain" {
  value       = aws_cloudfront_distribution.main.domain_name
  description = "Public URL (point your domain's CNAME here)"
}

output "ecr_web" {
  value = aws_ecr_repository.web.repository_url
}

output "ecr_worker" {
  value = aws_ecr_repository.worker.repository_url
}

output "sqs_queue_url" {
  value = aws_sqs_queue.events.url
}

output "secret_names" {
  value       = [for s in aws_secretsmanager_secret.app : s.name]
  description = "Populate these in Secrets Manager before the first deploy"
}
