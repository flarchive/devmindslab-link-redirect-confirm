# External Link Confirmation (Flarum)

This extension shows a confirmation modal before opening external links posted anywhere in the forum.

## Features
- Confirmation modal for external links
- Whitelist support (domains without confirmation)
- Automatically excludes the forum's own domain
- Shows the destination URL in the modal

## Installation
```
composer require devmindslab/link-redirect-confirm
```

## Build front-end assets
```
cd js
npm install
npm run build
```

## Configuration
Set a whitelist in the Admin panel (comma-separated). Wildcards are supported via `*.example.org`.

By default, the forum's own domain and `rene-baumgarten.de` are always allowed.

## Styling
You can fully customize the modal via LESS variables, e.g.:
- `--link-redirect-confirm-modal-max-width`
- `--link-redirect-confirm-modal-padding`
- `--link-redirect-confirm-modal-radius`
- `--link-redirect-confirm-modal-bg`
- `--link-redirect-confirm-header-bg`
- `--link-redirect-confirm-title-color`
- `--link-redirect-confirm-body-color`
- `--link-redirect-confirm-overlay-bg`
- `--link-redirect-confirm-buttons-gap`
