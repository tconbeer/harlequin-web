---
title: MotherDuck
menuOrder: 23
---

You can use Harlequin with [MotherDuck](https://motherduck.com/), just as you would use the DuckDB CLI:

```bash
harlequin "md:"
```

You can attach local databases as additional arguments (`md:` has to be first:)

```bash
harlequin "md:" "local_duck.db"
```

## Authentication Options

1. Web browser: Run `harlequin "md:"`, and Harlequin will attempt to open a web browser where you can log in.
2. Environment variable: Set the `motherduck_token` variable before running `harlequin "md:"`, and Harlequin will authenticate with MotherDuck using your service token.
3. CLI option: You can pass a service token to Harlequin with `harlequin "md:" --md_token <my token>`

## SaaS Mode

You can run Harlequin in ["SaaS Mode"](https://motherduck.com/docs/authenticating-to-motherduck#authentication-using-saas-mode) by passing the `md_saas` option: `harlequin "md:" --md_saas`.
