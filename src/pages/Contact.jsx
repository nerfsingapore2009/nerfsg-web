import PageHeader from '../components/PageHeader'
import { TelegramIcon, FacebookIcon, DiscordIcon } from '../components/icons'
import { getPagePhoto } from '../lib/media'
import { usePageTitle } from '../lib/usePageTitle'

export default function Contact() {
  usePageTitle('Contact')
  return (
    <div className="min-h-screen page-enter">
      <PageHeader
        eyebrow="Get in touch"
        title="Contact us."
        subtitle="Questions, feedback, or want to get involved? We read every message. Most questions are answered faster on Telegram or Facebook."
        photo={getPagePhoto('contact')}
        width="max-w-3xl"
      />

      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10">
        {/* Quick channels — above the form so they're seen first */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <a
            href="https://t.me/+MbMLovtcLyVmYzhl"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-red justify-center flex-1"
          >
            <TelegramIcon />
            Join Telegram
          </a>
          <a
            href="https://www.facebook.com/groups/nerfsingapore/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost justify-center flex-1"
          >
            <FacebookIcon />
            Facebook Group
          </a>
          <a
            href="https://discord.gg/ZszbEyg"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost justify-center flex-1"
          >
            <DiscordIcon />
            Discord
          </a>
        </div>

        <p className="text-muted text-xs uppercase tracking-widest mb-4">Or send us a message</p>

        <div className="card overflow-hidden">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdCH7Dl25KSxqkqKf7Hz8DwlA3URaYBKAEBR6SdUliqTf9VWw/viewform?embedded=true"
            className="w-full"
            height="800"
            frameBorder="0"
            title="NerfSG Contact Form"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </div>
  )
}
