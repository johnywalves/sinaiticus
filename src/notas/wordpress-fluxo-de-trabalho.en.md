---
title: "Working with WordPress (the developer's mental model)"
layout: base.njk
category: Backend
tags: [wordpress, php, cms, backend]
---

A field summary for people who develop **on top of** WordPress (not just edit posts).
The key to not fighting the core is realizing everything revolves around **hooks**:
you never change WordPress, you **hang off** its extension points.

## The mental model: hooks (actions and filters)

WordPress fires hundreds of "events" while rendering a page. You register functions on
those events instead of touching the core — so updates won't overwrite your code.

- **Action** — "something happened, _do_ something". Returns nothing (side effect).
- **Filter** — "I'm about to use this value, _transform_ it first". Receives and
  **returns** the value.
- ⚠️ Forgetting `return $value` in a filter is bug #1: blank screen or vanished content.

```php
// Action: runs when WP finishes booting.
add_action('init', function () {
    register_post_type('book', [/* ... */]);
});

// Filter: transforms the content before display (note the return).
add_filter('the_content', function ($content) {
    return $content . '<p>Thanks for reading!</p>';
});
```

It's the same extension-pipeline pattern as the [[express-middleware-chain|middleware
chain]]: named points where you inject behavior without editing the core.

## Where your code goes: plugin, not theme

Practical separation-of-concerns rule:

- **Theme** → _appearance_ (templates, CSS, layout). Always use a **child theme** so
  you don't lose customizations when the parent theme updates.
- **Plugin** → _functionality_ (custom post types, integrations, business logic).
  Survives a theme switch. This is where most real code lives.
- ⚠️ Never edit core files (`wp-admin`, `wp-includes`) or the parent theme — any
  `update` wipes it all out.

```php
<?php
/**
 * Plugin Name: My Feature
 */
// A single file at wp-content/plugins/my-feature/my-feature.php is already a plugin.
defined('ABSPATH') || exit; // blocks direct file access.
```

## Data: Custom Post Types and meta

Structured content beyond "post" and "page" becomes a **Custom Post Type** (CPT).
Extra fields (price, ISBN, author) are **post meta** — key/value pairs attached to it.

```php
register_post_type('book', [
    'public'       => true,
    'show_in_rest' => true,           // enables Gutenberg + REST API.
    'supports'     => ['title', 'editor', 'thumbnail'],
]);

update_post_meta($post_id, 'isbn', '978-85-..'); // write a meta value.
$isbn = get_post_meta($post_id, 'isbn', true);    // read (true = single value).
```

## Headless / integration front: REST API

Every CPT with `show_in_rest => true` gets automatic endpoints under `/wp-json/`. It's
the bridge to decoupled front-ends (React, Next.js) and external integrations.

```bash
# Lists "books" as JSON, with no extra code.
curl https://mysite.com/wp-json/wp/v2/book
```

## Quick reference table

| I want to...                | Use                                    |
| :-------------------------- | :------------------------------------- |
| React to a WP event         | `add_action()`                         |
| Transform a value           | `add_filter()` (and **return** it)     |
| New content type            | `register_post_type()`                 |
| Extra field on content      | `get/update_post_meta()`               |
| Expose data to a front-end  | REST API (`show_in_rest`) + `/wp-json` |
| Customize appearance safely | **child theme**                        |

## Common pitfalls

- **Always escape output:** `esc_html()`, `esc_attr()`, `esc_url()` when printing data.
- **Sanitize input:** `sanitize_text_field()` before saving. (XSS/SQLi live here.)
- **Use `$wpdb->prepare()`** for raw queries — never concatenate SQL.
- **Nonces** (`wp_nonce_field` / `check_admin_referer`) on every form/action that
  changes state (CSRF).

## References and tools

- **WP-CLI** — automate everything from the terminal (`wp plugin install`, `wp db export`).
- **Query Monitor** — debug plugin: inspect hooks, slow queries, and PHP errors.
- **Composer** — manages PHP dependencies in modern plugins/themes.

---

Related: [[express-middleware-chain|middleware chain]] ·
[[python-decorators|Python decorators]] · [[git-commands|Git commands]].
