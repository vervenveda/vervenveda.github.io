# Verve N Veda Universal Class Tools Toolbar Standard

**Canonical engine:** `/assets/vnv-class-tools-toolbar.js`  
**Directory authority:** `/ecosystem/master-ecosystem-directory.json`  
**Status:** active  
**Purpose:** one idempotent learning-tools toolbar engine with repository-local context configuration.

## Architecture

The Class Tools toolbar lives in the same universal VNV assets layer as:

- `assets/vnv-ecosystem-toolbar.js`
- `assets/vnv-ecosystem-menu.js`

Repositories do **not** copy or fork the engine.

They may provide:

```js
window.KhaemenesClassToolsConfigV1 = { ... };
```

before loading:

```html
<script src="https://vervenveda.com/assets/vnv-class-tools-toolbar.js" defer data-vnv-class-tools="1"></script>
```

## Ecosystem authority

Public ecosystem destinations resolve from:

`https://vervenveda.com/ecosystem/master-ecosystem-directory.json`

The engine only treats entries as eligible when:

- `directoryVisible === true`
- `access === "free-public"`
- `status === "active"`

This preserves the VNV master ecosystem directory as the canonical public source of truth.

## Supported tool slots

### Local link

Use for a route owned by the current school/profile, such as:

- Games
- Daily Lessons
- Notes
- local Reading Room

### Ecosystem link

Use `type:"ecosystem-link"` plus `ecosystemId`.

Example:

```js
{ type:"ecosystem-link", label:"Search", sub:"Search ecosystem", ecosystemId:"plera" }
```

The engine resolves the current canonical URL from the VNV ecosystem directory.

### Ecosystem list

Use `type:"ecosystem-list"` to present a filtered directory view.

Supported filters:

- `category`
- `repository`
- `types`
- `ids`
- `titleIncludes`
- `limit`

Examples:

Verifier / news tools:

```js
{
  type:"ecosystem-list",
  label:"News",
  sub:"Verified news tools",
  filter:{
    repository:"vervenveda/theverifier.github.io",
    types:["app","tool"],
    limit:6
  }
}
```

Linguistics tools:

```js
{
  type:"ecosystem-list",
  label:"Language Tools",
  sub:"Practice languages",
  filter:{
    repository:"vervenveda/Khaemenes_Linguistics.github.io",
    types:["app","tool","studio","course"],
    limit:6
  }
}
```

## Age-appropriate views

The engine is universal; the repository configuration determines the learner view.

Examples:

- Preschool / Kindergarten: stories, numbers, shapes, songs, family tools
- Elementary: games, reading, printables, creative tools, parent tools, safe search
- Middle: games, vocabulary, study tools, research/news, parent tools, search
- High: games, materials, notes, parent tools, search, instructions
- Linguistics: language worlds, dictionary, translator, audio/sound labs, worksheets, practice
- Verifier / Social Studies: Kids News, Science News, World Wire, research/search, evidence tools

## Symmetry

Desktop:
- six controls in a 3 × 2 grid
- lower-left placement

The canonical VNV ecosystem utility toolbar remains lower-right.

This creates a visually balanced universal-tools pair without merging their responsibilities.

Narrow screens may reflow to 2 columns for usability.

## Idempotence

The engine:

- uses stable root/style IDs;
- removes duplicate roots/styles;
- exposes `window.VNVClassToolsToolbar`;
- aliases the older `window.KhaemenesClassToolsToolbarV1` API for compatibility;
- aborts prior event listeners before remount;
- permits safe repeated shared-chrome calls;
- never awards mastery or mutates grades.

## Local repository rule

A school repository should contain only:

1. its configuration/filter;
2. an optional compatibility shim if older pages still point at a local Class Tools script.

The canonical engine remains in Verve N Veda universal assets.
