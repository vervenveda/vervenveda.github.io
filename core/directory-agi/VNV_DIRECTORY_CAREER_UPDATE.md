# VNV Directory AGI — Career Portal Consolidation

Target file:
`vervenveda.github.io/core/directory-agi/index.html`

The current Directory AGI still exposes the four internal Career apps individually.
Now that `Khaemenes_Higher_Learning.github.io/Career/` is a contained portal with its
own Career Directory AGI, the VNV-level directory should route to the Career Portal
as the canonical destination.

## 1. Optional but recommended seed-version bump

Change:

```js
const VERSION = '1.0.0';
const KEYS = Object.freeze({
  cloud: 'VNV_DIRECTORY_AGI_CLOUD_V1',
  directory: 'VNV_DIRECTORY_AGI_DIRECTORY_V1',
  state: 'VNV_DIRECTORY_AGI_STATE_V1'
});
```

to:

```js
const VERSION = '1.1.0';
const KEYS = Object.freeze({
  cloud: 'VNV_DIRECTORY_AGI_CLOUD_V1',
  directory: 'VNV_DIRECTORY_AGI_DIRECTORY_V2',
  state: 'VNV_DIRECTORY_AGI_STATE_V2'
});
```

The cloud key deliberately remains V1 so local directory notes are preserved.
The new directory/state keys force browsers that previously opened Directory AGI
to load the new canonical seed automatically.

## 2. Replace the current Career group

Replace:

```js
{title:'Higher Learning · Careers', items:[
  item('career-star','Career Star',u('Khaemenes_Higher_Learning.github.io/Career/apps/career-star_index.html'),'Career exploration tool.',['career finder','career star']),
  item('career-assessment','Career Assessment',u('Khaemenes_Higher_Learning.github.io/Career/apps/career-assessment_index.html'),'Structured career assessment.',['career test','career assessment']),
  item('career-mentor-hub','Career Mentor Hub',u('Khaemenes_Higher_Learning.github.io/Career/apps/career-mentor-hub_index.html'),'Career mentoring gateway.',['career mentor','mentor hub']),
  item('assessment-mentor','Assessment Mentor',u('Khaemenes_Higher_Learning.github.io/Career/apps/assessment-mentor_index.html'),'Assessment support inside the Career area.',['mentor review','career assessment mentor'])
]},
```

with:

```js
{title:'Higher Learning · Careers', items:[
  item(
    'career-portal',
    'Khaemenes Career Portal',
    u('Khaemenes_Higher_Learning.github.io/Career/'),
    'Unified career assessment, mentor interpretation, Career Star reflection, professional development, and dynamic career-skills directory.',
    [
      'career',
      'career portal',
      'career finder',
      'career star',
      'career assessment',
      'career test',
      'career mentor',
      'career mentor hub',
      'mentor hub',
      'mentor review',
      'assessment mentor',
      'professional development',
      'career skills',
      'career resources'
    ]
  )
]},
```

## Result

VNV Directory AGI
→ Khaemenes Higher Learning
→ Career Portal
→ Career Directory AGI
→ Assessment / Mentor Hub / Career Star / Mentor Review / dynamically discovered tools

This keeps the VNV-level directory clean and delegates internal Career navigation to
the specialized Career Portal rather than maintaining duplicate app lists.
