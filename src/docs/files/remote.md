---
title: Remote Objects (S3)
menuOrder: 4
---

## Installation

Before viewing remote objects, you must install the `boto3` package in the same environment as Harlequin. You can do this by installing Harlequin with the `s3` extra:

```bash
uv tool install harlequin[s3]
```

## Compatibility

Harlequin works with any object storage system that provides an S3-compatible API, including Amazon S3, Google Cloud Storage, and Minio; basically, if you can query the storage with `boto3` and manage credentials with the AWS CLI, Harlequin can display your files.

## Authentication

Harlequin relies on the AWS CLI credential toolchain for authentication. Specifically, it will attempt to connect to your storage using whatever credentials are currently active (or default) in your AWS CLI config, **including the region**. You can use the credentials from another profile by setting the `AWS_PROFILE` environment variable.

For Google Cloud Storage please see [the docs](https://cloud.google.com/storage/docs/authentication/hmackeys) on the XML API and HMAC authentication. After generating HMAC Keys, you can use the AWS CLI (`aws configure`) to store these keys in a profile accessible to Harlequin.

Your user must have `ListObjects` or the equivalent permission to view a bucket's objects in Harlequin.

Currently this is not configurable; if that doesn't work for you, please [open an issue](https://github.com/tconbeer/harlequin/issues/new/choose).

## Usage

Harlequin will display the remote tree if it is initialized with the `--show-s3` option (alias `--s3`). This option takes a reference to remote object storage.

### Displaying All Buckets

Use Harlequin with `--show-s3 all` to display all Amazon S3 buckets that the authenticated user has access to. (This is not advised if you have access to millions of objects in S3):

```bash
harlequin --show-s3 all
```

For GCS or another endpoint that supports `ListBuckets`, provide the endpoint url without a path:

```bash
harlequin --show-s3 "https://storage.googleapis.com"
```

### Displaying a Single Bucket

Use `--show-s3` with an argument that represents a bucket and (optionally) an endpoint url and key prefix:

```bash
harlequin --show-s3 my-bucket
```

```bash
harlequin --show-s3 my-bucket/my-prefix
```

A one-liner to set the AWS Profile and connect to a GCS bucket, filtering for a prefix:

```bash
AWS_PROFILE=gcs harlequin --s3 "https://storage.googleapis.com/my-gcs-bucket/my-prefix"
```

Harlequin takes any of the following formats as a value for the `--s3` option (you likely have to wrap these in single or double quotes, depending on your shell):

```
# Amazon S3 Formats
all
my-bucket
my-bucket/my-prefix
s3://my-bucket
s3://my-bucket/my-prefix
https://s3.amazonaws.com/my-bucket
https://s3.amazonaws.com/my-bucket/my-prefix
https://my-bucket.s3.amazonaws.com
https://my-bucket.s3.amazonaws.com/my-prefix

# Google Cloud Storage Formats
https://storage.googleapis.com
https://storage.googleapis.com/my-bucket
https://storage.googleapis.com/my-bucket/my-prefix
https://my-bucket.storage.googleapis.com
https://my-bucket.storage.googleapis.com/my-prefix

# Minio, AWS PrivateLink, etc.
https://my-storage.com/my-bucket/
https://my-storage.com/my-bucket/my-prefix
```
