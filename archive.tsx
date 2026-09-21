import type { ArchiveData } from "./types";

type ArchiveProps = {
  data: ArchiveData;
  onClose: () => void;
};

export function Archive({ data, onClose }: ArchiveProps) {
  return (
    <div className="archive-overlay" role="dialog" aria-label="The archive">
      <div className="archive-inner">
        <h2 className="archive-title">{data.title}</h2>
        <p className="archive-sub">{data.subtitle}</p>
        {data.pages.map((page) => (
          <section key={page.id} className="archive-page">
            <h3 className="archive-heading">{page.heading}</h3>
            {page.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}
        <button type="button" className="archive-back" onClick={onClose}>
          put it back
        </button>
      </div>
    </div>
  );
}
