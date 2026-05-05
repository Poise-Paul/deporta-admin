import React from "react";
import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <>
      {/* If using App router, you can manage metadata in layout.tsx, but this is safe for generic Next.js */}
      <Head>
        <title>Privacy Policy | Deporta</title>
        <meta name="description" content="Privacy Policy for the Deporta App" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Privacy Policy for Deporta
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Effective Date: May 5, 2026
          </p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                1. Introduction
              </h2>
              <p>
                Welcome to Deporta. Deporta ("we," "our," or "us") provides
                vehicle rental and logistics services. We are committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use our mobile application (the "App"). Please read this policy
                carefully.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                2. Information We Collect
              </h2>
              <p className="mb-2">
                We may collect information about you in a variety of ways when
                you use the Deporta app. The information we may collect
                includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Personal Data:</strong> Personally identifiable
                  information, such as your name, email address, phone number,
                  and company details, that you voluntarily give to us when you
                  register with the App.
                </li>
                <li className="bg-blue-50 p-3 rounded-md border border-blue-100">
                  <strong>Camera and Photo Library Access:</strong> The App
                  requires access to your device's camera and photo library. We
                  collect this data strictly to allow you to upload profile
                  pictures, verify documentation, and document vehicle condition
                  before and after rentals. Images are securely uploaded to our
                  servers for verification purposes.
                </li>
                <li>
                  <strong>Location Data:</strong> We may request access or
                  permission to track location-based information from your
                  mobile device to facilitate logistics, vehicle tracking, and
                  rental pickups.
                </li>
                <li>
                  <strong>Derivative Data:</strong> Information our servers
                  automatically collect when you access the App, such as your
                  native actions that are integral to the App, as well as device
                  type and operating system.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                3. How We Use Your Information
              </h2>
              <p className="mb-2">
                Having accurate information about you permits us to provide you
                with a smooth, efficient, and customized experience.
                Specifically, we may use information collected via the App to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Facilitate vehicle rentals and manage logistics services.
                </li>
                <li>
                  Verify user identity and driving credentials for safety and
                  compliance.
                </li>
                <li>Create and manage your account.</li>
                <li>
                  Process transactions and send related information, including
                  confirmations and receipts.
                </li>
                <li>
                  Improve App performance and resolve troubleshooting issues.
                </li>
                <li>Respond to customer service requests.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Disclosure of Your Information
              </h2>
              <p className="mb-2">
                We do not sell your personal information. We may share
                information we have collected about you in certain situations:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>By Law or to Protect Rights:</strong> If we believe
                  the release of information about you is necessary to respond
                  to legal process, to investigate or remedy potential
                  violations of our policies, or to protect the rights,
                  property, and safety of others.
                </li>
                <li>
                  <strong>Third-Party Service Providers:</strong> We may share
                  your information with third parties that perform services for
                  us or on our behalf, such as payment processing, data
                  analysis, email delivery, hosting services, and customer
                  service.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. Security of Your Information
              </h2>
              <p>
                We use administrative, technical, and physical security measures
                to help protect your personal information. While we have taken
                reasonable steps to secure the personal information you provide
                to us, please be aware that despite our efforts, no security
                measures are perfect or impenetrable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Data Retention and Deletion
              </h2>
              <p>
                We keep your personal information only for as long as we need it
                for legitimate business purposes and as permitted by applicable
                law. You may request the deletion of your account and associated
                data at any time by contacting us at the email provided below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                7. Contact Us
              </h2>
              <p className="mb-2">
                If you have questions or comments about this Privacy Policy,
                please contact us at:
              </p>
              <div className="bg-gray-100 p-4 rounded-md">
                <p>
                  <strong>Email:</strong> support@deporta.com
                </p>
                {/* Update the URL below once you have a live domain */}
                <p>
                  <strong>Website:</strong> www.deporta.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
