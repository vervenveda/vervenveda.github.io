# Mentor Resource Manifest Guide

To make a public repository automatically contribute resources to the Khaemenes Mentor, add this file at the repository root:

`mentor-manifest.json`

The central discovery workflow will detect it.

## Minimum example

```json
{
  "version": 1,
  "sourceId": "verve.arcade",
  "name": "Verve N Veda Arcade",
  "classification": "educational",
  "mentorSearchable": true,
  "audiences": ["elementary", "middle", "high"],
  "resources": [
    {
      "id": "logic-garden",
      "title": "Logic Garden",
      "url": "https://vervenveda.com/arcade.github.io/games/logic-garden/",
      "domains": ["logic", "mathematics"],
      "skills": ["patterns", "reasoning"],
      "audiences": ["elementary", "middle"],
      "minutes": 10,
      "energy": "steady",
      "mentorEligible": true
    }
  ]
}
```

## Classifications

Recommended values:

- `educational`
- `creative-cultural`
- `wellness`
- `research-information`
- `civic`
- `professional-practical`
- `campaign`
- `admin-only`
- `restricted`

`admin-only` and `restricted` are never recommended.

Campaign resources are segregated from ordinary Khaemenes learning and require explicit adult opt-in policy before recommendation.

## Audiences

Use one or more:

- `preschool`
- `kindergarten`
- `elementary`
- `middle`
- `high`
- `higher-learning`
- `adult`
- `parent`

## Roles

Optional:

- `student`
- `parent`
- `educator`

If omitted, the indexer uses all three.

## Resource metadata

Useful fields include:

- `domains`
- `skills`
- `tags`
- `minutes`
- `energy`
- `featured`
- `mentorEligible`

Adding a resource to this manifest allows the central Mentor registry to see it on the next index refresh without changing Mentor Core code.
