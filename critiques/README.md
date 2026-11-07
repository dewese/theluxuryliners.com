# Critiques

Audit and critique reports for theluxuryliners.com, one file per audit and round.

## Rule: private literals are named by role, never by value

This repository is public. A critique, like every other tracked file, must never write a private
literal: the contact address (LL-31), the founding-story town, the college, the profile of a
member's later life, the family page or family names (LL-7). Name each one by its role ("the
contact address", "the founding-story town"), even in a sentence that says it is absent from the
site. `npm test` (suite `repo`, `content/check-content.mjs --repo`) fails on any tracked file that
holds one; critiques are never added to `REPO_EXCEPTIONS`.
