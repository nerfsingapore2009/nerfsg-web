import { Link } from 'react-router-dom'
import LegalPage, { Section, List } from '../components/LegalPage'

export default function Terms() {
  return (
    <LegalPage
      title="Terms & conditions."
      subtitle="The ground rules for using this website and turning up to our games."
      updated="10 September 2026"
    >
      <Section heading="Using this website">
        <p>
          This site is run by NerfSG, a volunteer community group. By using it you agree to these
          terms. If you do not, please stop using the site.
        </p>
        <p>
          We publish this site as a free service and do our best to keep it accurate, but we do not
          guarantee that it is complete, current or uninterrupted. Game times, locations and player
          counts come from live data and can change without notice — always check the Telegram group
          or the NerfSG Hub app before travelling to a game.
        </p>
      </Section>

      <Section heading="Playing at our events">
        <p>
          Foam dart games are a physical activity played outdoors. Running, uneven ground, weather and
          impacts from foam darts all carry a risk of injury. You take part at your own risk, and you
          are responsible for judging whether you are fit to play.
        </p>
        <List
          items={[
            'Impact-rated eye protection is mandatory at all times on the field. Non-impact-rated glasses are not accepted.',
            'Blasters must pass the chrono limits set out in the rule set. Modified blasters over the limit will not be allowed on the field.',
            'Follow the marshals. If you are asked to stop, stop.',
            'Players under 16 should be accompanied by a parent or guardian.',
          ]}
        />
        <p>
          The full rules are on the{' '}
          <Link to="/ruleset" className="text-red font-semibold underline underline-offset-2 hover:text-red2 transition-colors">
            rule set page
          </Link>
          , and they form part of these terms for anyone attending a game.
        </p>
      </Section>

      <Section heading="Conduct">
        <p>
          We say blasters, not guns, and darts, not bullets — in public spaces this matters. Harassment,
          discrimination, unsafe play and deliberately ignoring hit calls all get you asked to leave.
          Organisers may remove anyone from an event or from our community channels at their
          discretion.
        </p>
      </Section>

      <Section heading="Photography">
        <p>
          We photograph and film our game days and publish the results on this site and our social
          channels. By attending you accept that you may appear in those photos. If you would rather
          not, tell a marshal on the day, or ask us afterwards to take a specific photo down — see the{' '}
          <Link to="/privacy" className="text-red font-semibold underline underline-offset-2 hover:text-red2 transition-colors">
            privacy policy
          </Link>
          .
        </p>
      </Section>

      <Section heading="Content and ownership">
        <p>
          Photographs on this site belong to the photographers credited on them and are used with
          permission; please do not reuse them commercially without asking. NerfSG's own text and
          layout may be quoted or linked freely, but not republished wholesale as your own.
        </p>
        <p>
          NERF is a trademark of Hasbro, Inc. NerfSG is an independent community group and is not
          affiliated with, endorsed by or sponsored by Hasbro.
        </p>
      </Section>

      <Section heading="Links to other sites">
        <p>
          We link to modding guides, shops, community groups and social platforms run by other people.
          We do not control those sites and are not responsible for their content, their products or
          their handling of your data.
        </p>
      </Section>

      <Section heading="Liability">
        <p>
          To the extent permitted by Singapore law, NerfSG and its organisers are not liable for injury,
          loss or damage arising from attending our events or relying on information on this site.
          Nothing in these terms limits liability where the law does not allow it to be limited.
        </p>
      </Section>

      <Section heading="Changes and contact">
        <p>
          We may update these terms; the date at the top of this page shows when they last changed.
          Questions go through the{' '}
          <Link to="/contact" className="text-red font-semibold underline underline-offset-2 hover:text-red2 transition-colors">
            contact page
          </Link>
          . These terms are governed by the laws of Singapore.
        </p>
      </Section>
    </LegalPage>
  )
}
