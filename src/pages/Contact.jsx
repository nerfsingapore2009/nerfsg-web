import { usePageTitle } from '../lib/usePageTitle'

export default function Contact() {
  usePageTitle('Contact')
  return (
    <div className="min-h-screen page-enter">
      <div className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-ink">Contact Us</h1>
          <p className="text-muted mt-2 max-w-[58ch]">Questions, feedback, or want to get involved? We read every message. Most questions are answered faster on Telegram or Facebook.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10">
        {/* Quick channels — above the form so they're seen first */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <a
            href="https://t.me/+MbMLovtcLyVmYzhl"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-red justify-center flex-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Join Telegram
          </a>
          <a
            href="https://www.facebook.com/groups/nerfsingapore/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost justify-center flex-1"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook Group
          </a>
          <a
            href="https://discord.gg/ZszbEyg"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost justify-center flex-1"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
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
