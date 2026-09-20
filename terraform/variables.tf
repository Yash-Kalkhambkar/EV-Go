###############################################################################
# EV-GO Terraform Variables
# Configure via terraform.tfvars or -var flags
###############################################################################

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region for resources"
  type        = string
  default     = "asia-south1"
}

variable "zone" {
  description = "GCP zone for zonal resources"
  type        = string
  default     = "asia-south1-a"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

###############################################################################
# Database Configuration
###############################################################################

variable "db_instance_tier" {
  description = "Cloud SQL instance tier"
  type        = string
  default     = "db-f1-micro" # dev: db-f1-micro, prod: db-custom-2-7680
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "evgo_db"
}

variable "db_user" {
  description = "PostgreSQL user name"
  type        = string
  default     = "evgo_user"
}

variable "db_deletion_protection" {
  description = "Enable deletion protection for Cloud SQL"
  type        = bool
  default     = true
}

###############################################################################
# Redis Configuration
###############################################################################

variable "redis_memory_size_gb" {
  description = "Memorystore Redis memory size in GB"
  type        = number
  default     = 1
}

variable "redis_tier" {
  description = "Memorystore tier (BASIC or STANDARD_HA)"
  type        = string
  default     = "BASIC"
}

###############################################################################
# Cloud Run Configuration
###############################################################################

variable "cloud_run_cpu" {
  description = "CPU allocation for Cloud Run"
  type        = string
  default     = "1"
}

variable "cloud_run_memory" {
  description = "Memory allocation for Cloud Run"
  type        = string
  default     = "512Mi"
}

variable "cloud_run_min_instances" {
  description = "Minimum number of Cloud Run instances"
  type        = number
  default     = 0
}

variable "cloud_run_max_instances" {
  description = "Maximum number of Cloud Run instances"
  type        = number
  default     = 10
}

variable "backend_image" {
  description = "Docker image for backend (gcr.io/PROJECT_ID/ev-go-backend:TAG)"
  type        = string
}

###############################################################################
# Secrets Configuration
###############################################################################

variable "jwt_secret" {
  description = "JWT signing secret (keep secure!)"
  type        = string
  sensitive   = true
}

variable "razorpay_key_id" {
  description = "Razorpay API key ID"
  type        = string
  sensitive   = true
}

variable "razorpay_key_secret" {
  description = "Razorpay API key secret"
  type        = string
  sensitive   = true
}

variable "gemini_api_key" {
  description = "Google Gemini API key for AI assistant"
  type        = string
  sensitive   = true
}

###############################################################################
# Network Configuration
###############################################################################

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "allowed_ingress_cidrs" {
  description = "CIDR blocks allowed to access Cloud Run (empty = public)"
  type        = list(string)
  default     = [] # Public by default
}
