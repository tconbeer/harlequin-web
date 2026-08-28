---
title: Config Overview
---

<script>
    import wizard from "$lib/assets/docs/config-wizard.png"
</script>

Typing in command-line options with every invocation of Harlequin can get tiring. Instead, you can create profiles (sets of configurations that specify adapter and database connection options). Those profiles are saved in config files, which Harlequin will discover and load automatically. Selecting a profile is a simple command-line flag, or config files can define a default.

Config files are simple text files, written in TOML. Harlequin provides a wizard for creating and editing config files.

Harlequin searches for config files in several different locations, merging multiple files if many are found.

When you run Harlequin, you select a specific profile to use.

These three elements are detailed on the following pages.
