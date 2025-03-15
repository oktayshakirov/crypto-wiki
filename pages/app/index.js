import React from "react";
import Base from "@layouts/Baseof";
import { markdownify } from "@lib/utils/textConverter";
import Image from "next/image";
import { FaCheckCircle, FaClock, FaShieldAlt } from "react-icons/fa";

const App = () => {
  return (
    <Base title={"CRYPTO WIKI APP: Your All-In-One Crypto Hub"}>
      <section className="section">
        <div className="container max-w-6xl">
          <div className="mb-8 text-center">
            {markdownify("CRYPTO WIKI APP", "h1", "h2 mb-4")}
            <p className="mx-auto max-w-2xl text-lg">
              Uncover the World of Crypto
            </p>
          </div>
          <Image
            src="/images/app.jpg"
            alt="Crypto Wiki App Interface"
            layout="responsive"
            width={815}
            height={305}
          />
        </div>
      </section>
      <section className="section">
        <div className="container max-w-6xl">
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="h3 mb-4">Transform Your Crypto Journey</h2>
              <p className="mb-4">
                Master the crypto universe with Crypto Wiki—your trusted
                companion for learning, investing, and connecting with
                visionaries who are reshaping the future of finance.
              </p>
              <p>
                From curious beginners to seasoned traders, we provide the
                essential tools, real-time data, and expert insights you need to
                navigate crypto&apos;s dynamic landscape with confidence.
              </p>
            </div>
            <div>
              <h2 className="h3 mb-4">Why Choose Crypto Wiki?</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-4 rounded-lg p-2">
                    <FaCheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">
                      Comprehensive Learning
                    </h3>
                    <p>Expert-curated content for all skill levels</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 rounded-lg p-2">
                    <FaClock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Real-Time Insights</h3>
                    <p>Live market data and trending analysis</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 rounded-lg p-2">
                    <FaShieldAlt className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Trusted Security</h3>
                    <p>Verified exchange reviews and safety guides</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border p-8">
            <h2 className="h3 mb-8 text-center">
              Powerful Features at Your Fingertips
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    📚 Learn Like a Pro
                  </h3>
                  <p>
                    Access expertly crafted guides, tutorials, and articles
                    tailored for both beginners and advanced users. Stay ahead
                    with current strategies and blockchain innovations.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    🔍 Exchange Reviews
                  </h3>
                  <p>
                    Make informed decisions with our detailed, unbiased reviews
                    of top crypto exchanges, comparing security features and
                    real user experiences.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    👥 Crypto Innovators & Legends
                  </h3>
                  <p>
                    Get inspired by crypto pioneers and visionaries. Access
                    their profiles, social links, and wallet addresses to learn
                    from their strategies.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    🛠️ Smart Trading Tools
                  </h3>
                  <p>
                    Make data-driven decisions with our trading tools, including
                    Fear & Greed Index, Bitcoin Rainbow Chart and Market
                    Heatmap. Calculate staking rewards and discover promising
                    new tokens all in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 text-center">
            <h2 className="h3 mb-4">Ready to Start Your Crypto Journey?</h2>
            <p className="mb-8 text-lg">
              Download Crypto Wiki today and join thousands of successful crypto
              enthusiasts who trust our platform for their crypto education and
              investment decisions.
            </p>
          </div>
        </div>
      </section>
    </Base>
  );
};

export default App;
