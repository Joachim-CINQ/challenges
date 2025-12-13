export const metadata = {
  title: 'Privacy Policy',
}

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col justify-center py-6 sm:py-12">
        <div className="prose relative mx-auto py-3 dark:prose-invert sm:max-w-2xl">
          <h1>Privacy Policy</h1>
          <p>
            Our website, metro-memory.com (&quot;we&quot;, &quot;us&quot;,
            &quot;our&quot;), respects your privacy and is committed to
            protecting it in accordance with this Privacy Policy.
          </p>
          <h2>Information We Collect</h2>
          <p>
            We collect limited personal data, such as your IP address and other
            non-identifiable information, for analytics and to improve the user
            experience.
          </p>
          <h2>Google AdSense & Cookies</h2>
          <p>
            We use Google AdSense to display ads on our website. Google uses
            cookies to serve ads based on your interests and previous
            interactions. By using our website, you consent to the use of these
            cookies.
          </p>
          <p>
            You can manage your preferences or opt-out of personalized ads by
            visiting Google&apos;s Ads Settings:{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              https://www.google.com/settings/ads
            </a>
          </p>
          <h2>Google Analytics</h2>
          <p>
            We use Google Analytics to collect information about how our website
            is used. Google Analytics uses cookies to collect non-identifiable
            information such as your IP address, device information, and other
            non-identifiable information.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to access, rectify, or erase any personal data we
            hold about you. To exercise these rights, please contact us at
            benjamin.tdm@gmail.com.
          </p>
          <p>
            If you have any questions or concerns about our Privacy Policy,
            please feel free to contact us at benjamin.tdm@gmail.com.
          </p>
        </div>
      </div>
    </>
  )
}

export default PrivacyPolicy
