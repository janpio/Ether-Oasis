export default function Page({ params }: { params: { page: string } }) {
  return (
    <section>
      <h1 className="text-2xl font-semibold">this page</h1>
      <p className="mt-4 text-gray-700">Page: {params.page}</p>
    </section>
  );
}
