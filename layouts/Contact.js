import { FaEnvelope, FaUser, FaTwitter, FaFacebook } from "react-icons/fa";
import Link from "next/link";

const Contact = () => {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Contact</h1>

      <h2 className="mb-4 text-2xl font-semibold">
        We&apos;d Love to Hear from You
      </h2>
      <p className="mb-6">
        Have questions, suggestions, or need support? We’re here to help. At
        TheCrypto.Wiki, we’re committed to providing valuable resources and
        insights to help you better understand and navigate the world of
        cryptocurrency. Your feedback is vital to our mission, helping us
        continually improve and grow.
      </p>

      <h2 className="mb-4 text-2xl font-semibold">Contact Information</h2>
      <p className="mb-4">
        For any inquiries, advertising opportunities, or partnership proposals,
        please don’t hesitate to get in touch:
      </p>
      <ul className="mb-6 list-inside list-disc">
        <li className="mb-2">
          <FaTwitter className="mr-2 inline-block text-yellow-500" />
          <strong>Twitter:</strong>{" "}
          <a
            href="https://x.com/TheCrypto_Wiki"
            className="text-yellow-500 hover:underline"
          >
            @TheCrypto_Wiki
          </a>
        </li>
        <li className="mb-2">
          <FaFacebook className="mr-2 inline-block text-yellow-500" />
          <strong>Facebook:</strong>{" "}
          <a
            href="https://www.facebook.com/thecryptowiki"
            className="text-yellow-500 hover:underline"
          >
            @TheCryptoWiki
          </a>
        </li>
        <li className="mb-2">
          <FaEnvelope className="mr-2 inline-block text-yellow-500" />
          <strong>Email:</strong>{" "}
          <a
            href="mailto:oktayshakirov@gmail.com"
            className="text-yellow-500 hover:underline"
          >
            oktayshakirov@gmail.com
          </a>
        </li>
        <li className="mb-2">
          <FaUser className="mr-2 inline-block text-yellow-500" />
          <strong>Linkedin:</strong>{" "}
          <a
            href="https://www.linkedin.com/in/oktayshakirov/"
            className="text-yellow-500 hover:underline"
          >
            Founder / Developer
          </a>
        </li>
      </ul>

      <h2 className="mb-4 text-2xl font-semibold">More Information</h2>
      <p className="mb-4">
        For more information about TheCrypto.Wiki, please visit our{" "}
        <Link href="/about" legacyBehavior>
          <a className="text-yellow-500 hover:underline">About</a>
        </Link>{" "}
        page.
      </p>
      <p>
        If you have any common questions, please check out our{" "}
        <Link href="/faq" legacyBehavior>
          <a className="text-yellow-500 hover:underline">FAQ</a>
        </Link>{" "}
        page for more details.
      </p>
    </div>
  );
};

export default Contact;
