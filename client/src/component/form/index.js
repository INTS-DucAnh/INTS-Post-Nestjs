export default function FormSection({ isRequired = false, heading, children }) {
  return (
    <section>
      <div>
        <p>
          {heading}
          {isRequired && "*"}
        </p>
      </div>
      <div>{children}</div>
    </section>
  );
}
