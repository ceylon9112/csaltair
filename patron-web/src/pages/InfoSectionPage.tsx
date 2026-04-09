import { Link, useParams } from 'react-router-dom';

import { SEED_INFO } from '@/data/seed/infoSections';

export function InfoSectionPage() {
  const { id } = useParams<{ id: string }>();
  const section = SEED_INFO.find((s) => s.id === id);

  if (!section) {
    return (
      <div className="page">
        <p>Section not found.</p>
        <Link to="/info">Back to Info</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/info" className="caption">
        ← Info
      </Link>
      <h1 className="title" style={{ marginTop: 12 }}>
        {section.title}
      </h1>
      <p style={{ whiteSpace: 'pre-wrap' }}>{section.body}</p>
    </div>
  );
}
