export async function GET(request, { params }) {
  const { id } = await params;
  console.log("id", id);
  const storeId = process.env.RED_PANDA_COMMERCE_ID || "eda80b80-465f-4735-b0bf-c737c7bf6075";

  const res = await fetch(
    `https://red-panda-commerce-v2.contentstackapps.com/api/public/store/${storeId}/products?url=${id}&includeMedia=true&includeVariants=true&includeAttributes=true&includeAttributesMap=true&includeCategories=true&includeTags=true&includeCustomData=true`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        cache: 'no-store'
      },
    }
  );

  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch from Red Panda Commerce API' }),
      { status: res.status }
    );
  }

  const data = await res.json();
  return new Response(JSON.stringify({ product: data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
