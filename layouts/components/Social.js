import {
  FaAndroid,
  FaApple,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaGithub,
  FaMediumM,
  FaBitbucket,
  FaRedditAlien,
  FaVk,
  FaWhatsapp,
  FaTiktok,
  FaGlobe,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWikipediaW,
  FaBitcoin,
  FaWallet,
  FaTelegramPlane,
} from "react-icons/fa";

const Social = ({ source, className }) => {
  if (!source) {
    return null;
  }
  const {
    android,
    apple,
    bitcoin,
    facebook,
    twitter,
    instagram,
    youtube,
    linkedin,
    github,
    medium,
    bitbucket,
    reddit,
    vk,
    whatsapp,
    tiktok,
    telegram,
    website,
    email,
    phone,
    address,
    wallet,
    wikipedia,
  } = source;

  return (
    <ul className={className}>
      {android && (
        <li className="inline-block">
          <a
            aria-label="android"
            href={android}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaAndroid />
          </a>
        </li>
      )}
      {apple && (
        <li className="inline-block">
          <a
            aria-label="apple"
            href={apple}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaApple />
          </a>
        </li>
      )}
      {bitcoin && (
        <li className="inline-block">
          <a
            aria-label="bitcoin"
            href={bitcoin}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaBitcoin />
          </a>
        </li>
      )}
      {facebook && (
        <li className="inline-block">
          <a
            aria-label="facebook"
            href={facebook}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaFacebook />
          </a>
        </li>
      )}
      {twitter && (
        <li className="inline-block">
          <a
            aria-label="twitter"
            href={twitter}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaTwitter />
          </a>
        </li>
      )}
      {telegram && (
        <li className="inline-block">
          <a
            aria-label="telegram"
            href={telegram}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaTelegramPlane />
          </a>
        </li>
      )}
      {instagram && (
        <li className="inline-block">
          <a
            aria-label="instagram"
            href={instagram}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaInstagram />
          </a>
        </li>
      )}
      {youtube && (
        <li className="inline-block">
          <a
            aria-label="youtube"
            href={youtube}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaYoutube />
          </a>
        </li>
      )}
      {linkedin && (
        <li className="inline-block">
          <a
            aria-label="linkedin"
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaLinkedinIn />
          </a>
        </li>
      )}
      {github && (
        <li className="inline-block">
          <a
            aria-label="github"
            href={github}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaGithub />
          </a>
        </li>
      )}
      {medium && (
        <li className="inline-block">
          <a
            aria-label="medium"
            href={medium}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaMediumM />
          </a>
        </li>
      )}
      {bitbucket && (
        <li className="inline-block">
          <a
            aria-label="bitbucket"
            href={bitbucket}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaBitbucket />
          </a>
        </li>
      )}
      {reddit && (
        <li className="inline-block">
          <a
            aria-label="reddit"
            href={reddit}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaRedditAlien />
          </a>
        </li>
      )}
      {vk && (
        <li className="inline-block">
          <a
            aria-label="vk"
            href={vk}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaVk />
          </a>
        </li>
      )}
      {whatsapp && (
        <li className="inline-block">
          <a
            aria-label="whatsapp"
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaWhatsapp />
          </a>
        </li>
      )}
      {tiktok && (
        <li className="inline-block">
          <a
            aria-label="tiktok"
            href={tiktok}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaTiktok />
          </a>
        </li>
      )}
      {website && (
        <li className="inline-block">
          <a
            aria-label="website"
            href={website}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaGlobe />
          </a>
        </li>
      )}
      {email && (
        <li className="inline-block">
          <a aria-label="email" href={`mailto:${email}`}>
            <FaEnvelope />
          </a>
        </li>
      )}
      {phone && (
        <li className="inline-block">
          <a aria-label="telephone" href={`tel:${phone}`}>
            <FaPhoneAlt />
          </a>
        </li>
      )}
      {address && (
        <li className="inline-block">
          <a
            aria-label="location"
            href={address}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaMapMarkerAlt />
          </a>
        </li>
      )}
      {wallet && (
        <li className="inline-block">
          <a
            aria-label="wallet"
            href={wallet}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaWallet />
          </a>
        </li>
      )}
      {wikipedia && (
        <li className="inline-block">
          <a
            aria-label="wikipedia"
            href={wikipedia}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <FaWikipediaW />
          </a>
        </li>
      )}
    </ul>
  );
};

export default Social;
