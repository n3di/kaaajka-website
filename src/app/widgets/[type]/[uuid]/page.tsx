'use client'

import dynamic from 'next/dynamic';
import { notFound, useParams } from 'next/navigation';
const TipAlertWidget = dynamic(
  () => import('@/components/TipAlertWidget'),
  { ssr: false }
);

export default function WidgetPage() {
  const { type, uuid } = useParams() as { type: string; uuid: string };

  if (!type || !uuid) {
    notFound();
  }

  // Obsługa typów widgetów:
  switch (type) {
    case 'TIP_ALERT':
      return <TipAlertWidget type={type} uuid={uuid} />;
    // dodaj kolejne typy...
    default:
      notFound();
  }
}
