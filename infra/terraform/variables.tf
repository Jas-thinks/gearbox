variable "region" {
  type    = string
  default = "ap-south-1" # Mumbai — closest to the launch market
}

variable "environment" {
  type    = string
  default = "prod"
}

variable "vpc_cidr" {
  type    = string
  default = "10.20.0.0/16"
}

variable "web_cpu" {
  type    = number
  default = 512
}

variable "web_memory" {
  type    = number
  default = 1024
}

variable "web_min_tasks" {
  type    = number
  default = 2 # one per AZ → survives an AZ outage
}

variable "web_max_tasks" {
  type    = number
  default = 20
}

variable "worker_min_tasks" {
  type    = number
  default = 1
}

variable "worker_max_tasks" {
  type    = number
  default = 6
}

variable "redis_node_type" {
  type    = string
  default = "cache.t4g.small"
}

variable "alarm_email" {
  type        = string
  description = "Where CloudWatch alarms are sent"
  default     = ""
}

variable "web_image_tag" {
  type    = string
  default = "latest"
}

variable "worker_image_tag" {
  type    = string
  default = "latest"
}
