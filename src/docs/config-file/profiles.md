---
title: Selecting a Profile
menuOrder: 9
---

All configs are nested within profiles. You may wish to use distinct profiles for connecting to different databases, or just to change the theme from time to time.

Config files can also specify a default profile. In this case, invoking Harlequin without the `--profile` option will cause it to load the configuration from the default profile.

To load Harlequin with the config from a specific profile, invoke Harlequin with the `--profile` option (alias `-P`):

```bash
harlequin --profile my-profile
```

If a default profile is specified, but you wish to run Harlequin without the config from the default profile, invoke Harlequin with the special profile named `None`:

```bash
harlequin --profile None
```

Alternatively, any options given at the command-line will override their counterparts in config files.