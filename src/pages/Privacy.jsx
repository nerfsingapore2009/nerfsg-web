import { Link } from 'react-router-dom'
import LegalPage, { Section, List } from '../components/LegalPage'
import { openConsentSettings } from '../lib/consent'

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy policy."
      subtitle="What we collect when you use this site, why, and what you can ask us to do about it."
      updated="10 September 2026"
    >
      <Section heading="Who we are">
        <p>
          NerfSG is a volunteer-run community of foam dart players in Singapore, active since 2009. We
          run this website and the companion NerfSG Hub app at nerfsg.app. We are not a company and we
          do not sell anything; this policy covers the website you are reading now.
        </p>
      </Section>

      <Section heading="What this site collects">
        <List
          items={[
            <>
              <strong>Anonymous session ID.</strong> When the site loads it signs you in to Firebase
              anonymously so it can read game data. This ID is random, is not linked to your name or
              email, and is not shared with anyone.
            </>,
            <>
              <strong>Analytics, only if you agree.</strong> If you accept analytics in the cookie
              banner, Google Analytics (via Firebase) records which pages you visit, roughly where you
              are (from your IP address), and what device and browser you use. Decline, and we never
              start it — no analytics cookies are set at all.
            </>,
            <>
              <strong>Anything you type into the contact form.</strong> Our contact form is a Google
              Form. Whatever you put in it — typically a name and a message — goes to the NerfSG
              organisers through Google.
            </>,
            <>
              <strong>Server logs.</strong> Our host, Vercel, keeps standard request logs including IP
              addresses, for security and troubleshooting.
            </>,
          ]}
        />
        <p>
          We do not ask for or store payment card details on this website, and we do not use
          advertising or cross-site tracking.
        </p>
      </Section>

      <Section heading="Game day data shown on this site">
        <p>
          Pages like Events, Gallery and Leaderboard read live data from the NerfSG Hub app. That data
          can include the display names, profile pictures and attendance records of players who chose
          to RSVP in the app, along with group photos taken at game days.
        </p>
        <p>
          If you have played with us and would rather your name, photo or profile picture were not
          shown on this website, tell us and we will remove it. You do not need to give a reason.
        </p>
      </Section>

      <Section heading="Photos taken at game days">
        <p>
          We photograph our game days and publish the results here and on our social channels. If you
          appear in a photo you would like taken down, contact us with enough detail to identify it
          and we will remove it.
        </p>
      </Section>

      <Section heading="Who else sees your data">
        <List
          items={[
            <><strong>Google</strong> — Firebase (hosting the game database and anonymous sign-in), Google Analytics (only with your consent), Google Forms (the contact form), Google Docs (the embedded ruleset) and Google Fonts (which receives your IP address when the page loads its fonts).</>,
            <><strong>Vercel</strong> — serves this website and keeps request logs.</>,
            <><strong>The social platforms we link to</strong> — Telegram, Facebook, Instagram, TikTok, YouTube and Discord. Following those links takes you to their services, under their own privacy policies.</>,
          ]}
        />
        <p>
          We never sell your personal data, and we do not share it with anyone beyond the providers
          above.
        </p>
      </Section>

      <Section heading="Cookies and similar storage">
        <p>
          Without your consent, this site stores only one thing in your browser: your cookie choice
          itself, so we do not ask again on every page. If you accept analytics, Google Analytics sets
          its own cookies to recognise returning visits.
        </p>
        <p>
          <button
            type="button"
            onClick={openConsentSettings}
            className="text-red font-semibold underline underline-offset-2 hover:text-red2 transition-colors"
          >
            Change your cookie choice
          </button>{' '}
          at any time.
        </p>
      </Section>

      <Section heading="How long we keep things">
        <p>
          Analytics data is retained for as long as Google's default Firebase Analytics retention
          window, after which it is deleted automatically. Contact form submissions are kept while we
          need them to answer you. Game day records and photos stay up as a record of the community
          until someone asks us to remove theirs.
        </p>
      </Section>

      <Section heading="Your rights">
        <p>
          Under Singapore's Personal Data Protection Act you can ask us what personal data we hold
          about you, ask us to correct it, and withdraw any consent you have given. To do any of
          those, or to ask us to take something down, use the{' '}
          <Link to="/contact" className="text-red font-semibold underline underline-offset-2 hover:text-red2 transition-colors">
            contact page
          </Link>
          . We aim to reply within 30 days.
        </p>
      </Section>

      <Section heading="Children">
        <p>
          Younger players are welcome at our games, usually with a parent or guardian. This website is
          not aimed at children and we do not knowingly collect personal data from them here. If you
          are a parent and believe we hold something about your child, contact us and we will remove
          it.
        </p>
      </Section>

      <Section heading="Changes to this policy">
        <p>
          If we change how this site handles data, we will update this page and the date at the top of
          it. Material changes will also be posted in our Telegram group.
        </p>
      </Section>
    </LegalPage>
  )
}
