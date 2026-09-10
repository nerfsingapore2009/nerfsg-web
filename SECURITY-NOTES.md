# Security notes

## 1. Firestore write rules are open to every visitor — needs a decision

**Status: not fixed. A proposed replacement is in `firestore.rules.proposed`.**

`firestore.rules` currently says:

```
allow write: if request.auth != null;
```

`src/App.jsx` calls `signInAnon()` on mount, so every visitor to nerfsg.com
gets a real anonymous Firebase session. An anonymous session satisfies
`request.auth != null`. The rule therefore permits **any visitor** to create,
overwrite or delete any document in `gamedays` and `events`.

This does not require a bug in the site. The Firebase web config is public by
design (it is in the JS bundle, and that is fine on its own), so anyone can
point the Firebase SDK at the project, sign in anonymously, and write.

Worst realistic case: someone deletes the game schedule, or edits a game's
location the night before a session and players turn up at the wrong park.

### Why it is not fixed in this branch

The fix is to gate writes on "is an organiser", and only you know how
organisers are identified in this project. `firestore.rules.proposed` offers
three ways to write `isOrganiser()`:

| Option | Mechanism | Pick it if |
| --- | --- | --- |
| A | Custom auth claim `organiser: true` | You can run a one-off Admin SDK script. Cheapest at evaluation time. |
| B | An `/organisers/{uid}` allowlist collection | You would rather add organisers from the Firebase console. Costs one read per write check. |
| C | Hardcoded UIDs in the rules | Two or three organisers who never change. |

Guessing wrong locks whoever posts the game days out of posting them, which is
why this one waits for you.

**To apply, once you have picked:** edit `firestore.rules.proposed`, delete the
two options you did not choose, then:

```bash
mv firestore.rules.proposed firestore.rules
firebase deploy --only firestore:rules
```

Verify afterwards by opening the deployed site in a private window and trying a
write from the browser console — it should be rejected.

### Check whether it has already been abused

Firebase Console → Firestore → Usage will show write counts. A spike that does
not line up with game days being posted is worth a look. There is no per-write
audit log on the Spark plan, so if the data looks intact, it probably is.

## 2. Public reads expose attendee names and payment submissions

**Status: not fixed. Needs a change in the NerfSG Hub app as well.**

`allow read: if true` on `gamedays` is right for schedules, but the same
documents carry:

- `attendees[]` — display names and avatar URLs
- `rsvps{}` — user IDs
- `paymentSubmissions{}` — names, payment method, timestamps

All of that is readable in bulk by anyone, not just through the website UI.
`src/components/Archive.jsx` also renders the payment submissions table on the
homepage.

The fix is to move `paymentSubmissions` into a subcollection readable only by
organisers, which means changing where the Hub app writes it. That is app work,
not website work, so it is flagged here rather than attempted.

Under the PDPA this is the item most worth acting on: names and payment
records are personal data, and "public by default" is hard to justify for the
payment map specifically.

## 3. Things that are fine, so nobody re-raises them

- **The Firebase config in the bundle is not a leak.** `apiKey` for Firebase
  Web is an identifier, not a secret. Security comes from the rules — which is
  exactly why item 1 matters.
- **`.env` is correctly gitignored**, and `.env.example` holds only empty keys.
  (It is missing `VITE_FIREBASE_MEASUREMENT_ID`, which the README does list —
  worth adding for consistency, but not a security issue.)
- **HTTPS is enforced by Vercel automatically.** `vercel.json` now also sends
  HSTS, `nosniff`, a referrer policy and `X-Frame-Options`.
