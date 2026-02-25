import posthog from 'posthog-js'

export default function PostHogClient() {
  if (typeof window !== 'undefined') {
    posthog.init('phc_w0aP76e1gpiN8ar5I8ZPOglaepZYDKSVGsAV6Nva3Ex', {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false // Disable automatic pageview capture, we'll capture manually
    })
  }
  return posthog
}
