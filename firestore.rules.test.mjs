/**
 * firestore.rules.test.mjs — proves the security rules do what they claim.
 *
 * Run:  npm run test:rules
 *
 * Needs Java (the Firestore emulator is a JVM process) and will fetch
 * firebase-tools through npx on first run. The project id is a throwaway
 * `demo-` one, so this never touches the real NerfSG project.
 *
 * The case that matters most is "anonymous visitor CANNOT create a gameday".
 * That was allowed in production until September 2026: the old rule asked only
 * for `request.auth != null`, and the site signs every visitor in anonymously.
 * If that test ever goes green-to-red, the hole is back.
 */

import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc, deleteDoc, updateDoc, collection, getDocs } from 'firebase/firestore'
import fs from 'fs'

const [HOST, PORT] = (process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8085').split(':')

const env = await initializeTestEnvironment({
  projectId: 'demo-nerfsg',
  firestore: { rules: fs.readFileSync('firestore.rules', 'utf8'), host: HOST, port: Number(PORT) },
})

// Seed a game, bypassing rules, so read/update/delete tests have something real.
await env.withSecurityRulesDisabled(async ctx => {
  const db = ctx.firestore()
  await setDoc(doc(db, 'gamedays/g1'), { name: 'Sat game', scheduledFor: Date.now(), paymentSubmissions: {} })
  await setDoc(doc(db, 'events/e1'), { name: 'Anniversary' })
  await setDoc(doc(db, 'secrets/s1'), { token: 'x' })
})

const ADMIN = 'simjiajun@gmail.com'
const results = []
const check = async (label, expect, fn) => {
  try {
    await (expect === 'allow' ? assertSucceeds(fn()) : assertFails(fn()))
    results.push(['PASS', label, expect])
  } catch (e) {
    results.push(['FAIL', label, expect, String(e).split('\n')[0].slice(0, 110)])
  }
}

// Identities
const anon       = env.unauthenticatedContext().firestore()
const anonAuth   = env.authenticatedContext('anon-visitor').firestore()             // signInAnonymously: no email claim
const admin      = env.authenticatedContext('admin', { email: ADMIN, email_verified: true }).firestore()
const adminUnver = env.authenticatedContext('imposter', { email: ADMIN, email_verified: false }).firestore()
const otherUser  = env.authenticatedContext('rando', { email: 'someone@else.com', email_verified: true }).firestore()
const lookalike  = env.authenticatedContext('lk', { email: 'simjiajun@gmail.com.evil.com', email_verified: true }).firestore()

// --- reads stay public (the website depends on this) ---
await check('signed-out visitor can read a gameday',      'allow', () => getDoc(doc(anon, 'gamedays/g1')))
await check('anonymous visitor can read a gameday',       'allow', () => getDoc(doc(anonAuth, 'gamedays/g1')))
await check('signed-out visitor can list gamedays',       'allow', () => getDocs(collection(anon, 'gamedays')))
await check('signed-out visitor can read an event',       'allow', () => getDoc(doc(anon, 'events/e1')))

// --- the hole that was open before ---
await check('anonymous visitor CANNOT create a gameday',  'deny',  () => setDoc(doc(anonAuth, 'gamedays/evil'), { name: 'hacked' }))
await check('anonymous visitor CANNOT edit a gameday',    'deny',  () => updateDoc(doc(anonAuth, 'gamedays/g1'), { location: 'wrong park' }))
await check('anonymous visitor CANNOT delete a gameday',  'deny',  () => deleteDoc(doc(anonAuth, 'gamedays/g1')))
await check('anonymous visitor CANNOT delete an event',   'deny',  () => deleteDoc(doc(anonAuth, 'events/e1')))
await check('signed-out visitor CANNOT write',            'deny',  () => setDoc(doc(anon, 'gamedays/evil2'), { name: 'x' }))

// --- impersonation attempts ---
await check('UNVERIFIED admin email CANNOT write',        'deny',  () => setDoc(doc(adminUnver, 'gamedays/g2'), { name: 'x' }))
await check('a different signed-in user CANNOT write',    'deny',  () => setDoc(doc(otherUser, 'gamedays/g3'), { name: 'x' }))
await check('a look-alike domain CANNOT write',           'deny',  () => setDoc(doc(lookalike, 'gamedays/g4'), { name: 'x' }))

// --- the admin can actually work ---
await check('admin CAN create a gameday',                 'allow', () => setDoc(doc(admin, 'gamedays/g9'), { name: 'New game' }))
await check('admin CAN edit a gameday',                   'allow', () => updateDoc(doc(admin, 'gamedays/g1'), { location: 'Hong Lim' }))
await check('admin CAN delete a gameday',                 'allow', () => deleteDoc(doc(admin, 'gamedays/g9')))
await check('admin CAN create an event',                  'allow', () => setDoc(doc(admin, 'events/e9'), { name: 'Open day' }))
await check('admin CAN delete an event',                  'allow', () => deleteDoc(doc(admin, 'events/e9')))

// --- default deny on everything else ---
await check('nobody can read an unlisted collection',     'deny',  () => getDoc(doc(anon, 'secrets/s1')))
await check('admin cannot write an unlisted collection',  'deny',  () => setDoc(doc(admin, 'secrets/s2'), { a: 1 })) 

await env.cleanup()

const fails = results.filter(r => r[0] === 'FAIL')
for (const r of results) console.log(`${r[0]}  [${r[2]}]  ${r[1]}${r[3] ? '  -- ' + r[3] : ''}`)
console.log(`\n${results.length - fails.length}/${results.length} passed`)
process.exit(fails.length ? 1 : 0)
