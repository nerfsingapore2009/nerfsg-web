# Security notes

## 1. Firestore write rules — FIXED, but needs one check before you trust it

**Status: fixed in `firestore.rules`. Not deployed by this repo — rules deploy
separately, see below.**

### What was wrong

```
allow write: if request.auth != null;
```

`src/App.jsx` calls `signInAnon()` on mount, so every visitor to nerfsg.com got
a real anonymous Firebase session, and an anonymous session satisfies
`request.auth != null`. That rule therefore let **any visitor** create,
overwrite or delete any document in `gamedays` and `events`.

No bug in the site was needed. The Firebase web config is public by design (it
ships in the JS bundle, which is fine on its own), so anyone could point the
SDK at the project, sign in anonymously, and write. Realistic worst case:
someone deletes the schedule, or edits a game's location the night before a
session and players drive to the wrong park.

### What it is now

Writes require a signed-in user whose **verified** email is on the admin list:

```
function adminEmails() { return ['simjiajun@gmail.com']; }

function isAdmin() {
  return request.auth != null
    && request.auth.token.email_verified == true
    && request.auth.token.email in adminEmails();
}
```

Reads stay public — the website is read-only and needs them.

`email_verified` is doing real work. Firebase's Email/Password provider will
create an account for any address without proving the inbox belongs to you, so
matching on the address alone would let someone register the admin's email and
inherit write access. Requiring the verified claim means they would need the
inbox itself. Google sign-in always sets it true.

To add an organiser later, add their address to `adminEmails()` and redeploy.

### Verified, not assumed

`npm run test:rules` runs the rules against the Firestore emulator. 19 cases,
all passing, including the ones that matter:

- an anonymous visitor cannot create, edit or delete a gameday or event
- the admin address with `email_verified: false` is rejected
- a look-alike address (`simjiajun@gmail.com.evil.com`) is rejected
- a different signed-in user is rejected
- signed-out and anonymous visitors can still read everything the site shows
- the admin can create, edit and delete

It needs Java and pulls `firebase-tools` through `npx` on first run.

### Before you deploy — the one thing to check

**Does the NerfSG Hub app write to Firestore from the client?** That app is a
separate codebase and is not in this repo, so this could not be checked here.

- If the Hub **backend** writes via the Firebase Admin SDK — nothing to do.
  The Admin SDK bypasses security rules entirely.
- If the Hub **app** writes from the client while signed in with Google as
  `simjiajun@gmail.com` — nothing to do, it matches `isAdmin()`.
- If the Hub app writes from the client while signed in **anonymously**, or as
  any other user (players RSVPing, hosts posting their own games) — **this rule
  will break those writes.** RSVPs and payment submissions are the likely
  casualties, since they are player actions on a gameday document.

That last case is the one to rule out. If players do write their own RSVPs, the
rule needs to allow a narrow player write (own RSVP field only) alongside the
admin write, rather than admin-only.

The website itself cannot be affected — it never writes. Confirmed by grep:
no `setDoc`, `addDoc`, `updateDoc`, `deleteDoc`, `writeBatch` or
`runTransaction` anywhere in `src/`.

### Deploying

```bash
npm run test:rules          # confirm green first
firebase deploy --only firestore:rules
```

Then check in a private window that the site still loads games, and post a test
game from the Hub app to confirm the admin path still works.

**Rollback**, if Hub writes break:

```bash
git show HEAD~1:firestore.rules > firestore.rules
firebase deploy --only firestore:rules
```

That restores the old permissive rule, so treat it as a short-lived measure and
re-fix rather than a resting state.

### Check whether it was abused while open

Firebase Console → Firestore → Usage shows write counts. A spike that does not
line up with games being posted is worth a look. There is no per-write audit
log on the Spark plan, so if the data looks intact, it probably is.

### A note on the admin email being in a public repo

`nerfsingapore2009/nerfsg-web` is public, so `simjiajun@gmail.com` is now
visible in `firestore.rules`. It was already visible in the commit history
(it is the commit author address), so this is not a new exposure, and knowing
the address grants nothing without the Google account behind it. If you would
rather it not be there, the alternative is an `/admins/{uid}` allowlist
collection checked with `exists()` — it keeps the address out of the repo at
the cost of one document read per write.

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
the admin, which means changing where the Hub app writes it. That is app work,
not website work, so it is flagged here rather than attempted.

Under the PDPA this is the item most worth acting on next: names and payment
records are personal data, and "public by default" is hard to justify for the
payment map specifically.

## 3. Things that are fine, so nobody re-raises them

- **The Firebase config in the bundle is not a leak.** `apiKey` for Firebase
  Web is an identifier, not a secret. Security comes from the rules.
- **`.env` is correctly gitignored**, and `.env.example` holds only empty keys.
- **HTTPS is enforced by Vercel automatically.** `vercel.json` also sends
  HSTS, `nosniff`, a referrer policy, `X-Frame-Options` and a permissions
  policy.
