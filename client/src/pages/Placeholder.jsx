import Layout from "../components/Layout.jsx";

export default function Placeholder({ title }) {
  return (
    <Layout>
      <div className="pb-4 mb-5 border-b border-line">
        <h1 className="text-[19px] font-bold text-ink">{title}</h1>
      </div>
      <div className="bg-card border border-line rounded-card shadow-card p-10 text-center text-muted text-[13.5px]">
        {title} isn't built out yet — add your content here.
      </div>
    </Layout>
  );
}
