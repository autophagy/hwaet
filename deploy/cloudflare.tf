variable "zone_id" {
  type = string
}

resource "cloudflare_record" "hwaet" {
  zone_id = var.zone_id
  name = "hwaet"
  value = aws_s3_bucket.hwaet.website_endpoint
  type = "CNAME"
  proxied = true
}
