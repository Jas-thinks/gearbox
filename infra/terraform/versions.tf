terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.73"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Remote state: create the bucket + lock table once, then uncomment.
  # backend "s3" {
  #   bucket         = "gearbox-tf-state"
  #   key            = "prod/terraform.tfstate"
  #   region         = "ap-south-1"
  #   dynamodb_table = "gearbox-tf-lock"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Project     = "gearbox"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# CloudFront WAF and certificates must live in us-east-1.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
