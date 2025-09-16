import UrlStatisticsPage from "@/pages/Statistic";
export default async function GetClientComponent({params}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // console.log('ID:', id);
  return (
    <div>
      <UrlStatisticsPage id={id} />
    </div>
  );
}
