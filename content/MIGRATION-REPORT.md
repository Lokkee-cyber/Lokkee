# LokkeeVerse category migration report

This migration is intentionally non-destructive. Existing article JSON files keep
their original category field, slugs, publication state, dates, images, and body
content. The public application applies a reversible classification at read time.

| Existing classification | Public LokkeeVerse category | Handling |
| --- | --- | --- |
| AI Tools, AI Video, AI Image, AI Writing, AI Voice & Audio, AI Coding, AI for Creators, AI for Business, AI for Students, AI Comparisons | AI Content | Original label is retained as `originalCategory` for legacy routes and filtering. |
| Automated editorial/news records and non-AI categories | News Feed | Source/topic tags remain available to the existing automation workflow. |
| Serial Fiction / Novels | Serial Fiction / Novels | Reserved for the separate series/episode file model. |

At the time of the redesign, the file-backed article directory contains 169 JSON
records: 124 mapped to AI Content and 45 automated records mapped to News Feed.
No existing record was classified as fiction: that requires an editorial decision
rather than a filename/category guess. Draft files remain drafts and are excluded
by the existing public article loader.

## Manual review queue

- Any non-automated general-interest article should be reviewed before it is
  presented as News Feed content.
- Creative writing must be explicitly imported as a fiction series and episodes;
  it is never inferred from an ordinary article.
- Older AI URL paths remain public filtered views and must not be removed until
  redirect/canonical analytics support a separate deprecation decision.
