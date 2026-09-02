---
title: "Snowflake Authentication"
description: "Choose a Snowflake authenticator, from password and SSO to key pair, OAuth, and workload identity."
---

<script>
    import Note from "$lib/components/note.svelte"
</script>

Set `--authenticator` (or `authenticator` in `connections.toml`, or in a Harlequin profile) to any of the values the Snowflake connector supports:

| Authenticator               | What it needs                                                                                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `snowflake` (default)       | `--user` and `--password`                                                                                                                                      |
| `externalbrowser`           | `--user`; opens a browser for SSO. Add `--client-store-temporary-credential` so it does not open one every time.                                               |
| `snowflake_jwt` (key pair)  | `--user` and `--private-key-file` (plus `--private-key-file-pwd` if the key is encrypted). Passing `--private-key-file` selects this authenticator on its own. |
| `oauth`                     | `--token`, or `--token-file-path`                                                                                                                              |
| `oauth_authorization_code`  | `--oauth-client-id`, `--oauth-client-secret`, and optionally the URL options                                                                                   |
| `oauth_client_credentials`  | `--oauth-client-id`, `--oauth-client-secret`, and `--oauth-token-request-url`                                                                                  |
| `programmatic_access_token` | `--user` and the PAT in `--token`                                                                                                                              |
| `username_password_mfa`     | `--user`, `--password`, and `--passcode` (or `--passcode-in-password`). Add `--client-request-mfa-token` to cache the token.                                   |
| `workload_identity`         | `--workload-identity-provider` (`AWS`, `AZURE`, `GCP`, or `OIDC`)                                                                                              |
| `https://myorg.okta.com`    | `--user` and `--password`, for native Okta                                                                                                                     |

## Secrets

The `--password`, `--token`, `--passcode`, `--private-key-file-pwd`, `--oauth-client-secret`, and `--proxy-password` options are marked as secrets, so Harlequin never prints them back.

## Read-Only Mode

<Note>

Snowflake has no server-enforced read-only session or transaction, so this adapter does not offer Harlequin's `--read-only` option: it would be a promise it could not keep. Connect with a role that only has the privileges you want instead.

</Note>
