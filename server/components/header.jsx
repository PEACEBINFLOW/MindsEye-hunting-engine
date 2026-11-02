export default function Header({ title = "MindsEye", subtitle = "Cognitive dashboard" }) {
  return (
    <header className="header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
