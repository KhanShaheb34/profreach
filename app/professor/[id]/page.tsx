import { ProfessorDetail } from "@/components/professor/professor-detail";

export default async function ProfessorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfessorDetail id={id} />;
}
