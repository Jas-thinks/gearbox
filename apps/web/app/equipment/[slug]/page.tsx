import { notFound } from "next/navigation";
import { EquipmentDetails } from "@/features/equipment/equipment-details";
import { getEquipmentBySlug, getEquipmentSlugs } from "@/lib/data";
import { createMetadata } from "@/utils/metadata";

interface EquipmentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getEquipmentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: EquipmentPageProps) {
  const { slug } = await params;
  const equipment = getEquipmentBySlug(slug);

  if (!equipment) {
    return createMetadata({ title: "Equipment Not Found", noIndex: true });
  }

  return createMetadata({
    title: equipment.name,
    description: equipment.description,
    path: `/equipment/${slug}`,
  });
}

export default async function EquipmentPage({ params }: EquipmentPageProps) {
  const { slug } = await params;
  const equipment = getEquipmentBySlug(slug);

  if (!equipment) {
    notFound();
  }

  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <EquipmentDetails equipment={equipment} />
      </div>
    </div>
  );
}
