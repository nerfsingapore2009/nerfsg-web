export default function Contact() {
  return (
    <div className="min-h-screen px-4 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Contact Us</h1>
      <p className="text-gray-400 mb-8">Have a question or feedback? Fill in the form below.</p>

      <div className="rounded-xl overflow-hidden border border-[#2a2a2a]">
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

      <div className="mt-8 flex flex-col gap-3">
        <p className="text-gray-500 text-sm">You can also find us on:</p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.facebook.com/groups/nerfsingapore/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook Group
          </a>
          <a
            href="https://discord.gg/ZszbEyg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Discord
          </a>
        </div>
      </div>
    </div>
  )
}
