export default function Button({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="btn-exchange"
    >
      {children}
    </a>
  );
}
