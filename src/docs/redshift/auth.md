---
title: "Redshift Authentication"
description: "Connect Harlequin to Redshift with IAM credentials, Redshift Serverless, or a federated identity provider."
---

Besides a database user name and password, the Redshift adapter supports every authentication method that `redshift_connector` does.

## IAM Authentication

```bash
harlequin -a redshift --iam --cluster-identifier my-cluster --region us-east-1 --db-user analyst -d dev
```

Credentials come from `--profile`, from `--access-key-id` and `--secret-access-key` (plus `--session-token`), or from the environment, in the driver's usual order.

Add `--auto-create` to create `--db-user` if it does not exist, and `--db-groups` to join groups for the session.

## Redshift Serverless

```bash
harlequin -a redshift --iam --is-serverless --serverless-work-group my-workgroup --region us-east-1 -d dev
```

## Federated Identity Providers

Set `--credentials-provider` to a plugin that the driver ships, such as `AzureCredentialsProvider`, `OktaCredentialsProvider`, `BrowserSamlCredentialsProvider`, or `BrowserAzureCredentialsProvider`, along with that plugin's options (`--idp-host`, `--login-url`, `--preferred-role`, and so on).

For descriptions of each option, run:

```
harlequin --help
```
