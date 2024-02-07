---
title: Locale
menuOrder: 940
---

Harlequin uses your system's locale (the language, region, and other country-specific settings) to format numbers (for example, to set the thousands separator). If the system's locale is not set properly, Harlequin's numbers may look strange to you.

## The Special "C" Locale

Some computers have their locale set to `C` (or `C.UTF-8`), which is the POSIX standard for "Computer" -- it is optimized for servers or other environments that should not localize values. Using Harlequin with the `C` locale shows numbers unformatted, wihout a thousands separator. This probably isn't what you want.

If Harlequin finds itself running in the `C` locale, it attempts to set the locale to `en_US.UTF-8` and prints a warning that is viewable on exiting Harlequin.

If you do want to use Harlequin with the `C` locale, you can either uninstall the `en_US.UTF-8` locale from your OS, or just run Harlequin with the `--locale C` option.

## Setting The System Locale

- Mac: See [Mac Help](https://support.apple.com/guide/mac-help/change-language-region-settings-on-mac-intl163/mac). tldr: Apple > System Settings > General > Language & Region; set Number Format.
- Ubuntu: See [Ubuntu Help](https://help.ubuntu.com/community/Locale). tldr: `sudo nano /etc/default/locale`
- Windows: See [this blog](https://www.windowscentral.com/how-properly-change-system-default-language-windows-10). Update the Language and/or Region.

## Overriding the System Locale

You can also just pass a `--locale` option to Harlequin, like this:

```bash
harlequin --locale en_US.UTF-8
```

If the passed locale is not installed on your system, Harlequin will exit with an error.

As with other options, this value can be saved to a profile in a config file. You can create a profile with `harlequin --config`. See [the help on config](/docs/config-file) for more information.
