import { createClient } from "@/utils/supabase/server";

export async function GET(request, { params }) {
  const supabase = await createClient();

  console.log("params", params.id);

  const { data: products, error } = await supabase.rpc("get_product_by_url", {
    itemurl: params.id,
    storeid: process.env.RED_PANDA_COMMERCE_ID ? process.env.RED_PANDA_COMMERCE_ID : "eda80b80-465f-4735-b0bf-c737c7bf6075"
  });

  if (products.length > 0 ) {
    const { data: images, images_error } = await supabase
    .from("product_images")
    .select("path, ordernum")
    .order("ordernum", {ascending: true})
    .eq("product_id", products[0].product_id);

    products[0].images = images
  }
  if (error) {
    console.log("Error getting product:", error);
    return Response.json({ error: error }, { status: 500 });
  } else {
    return Response.json({ product: products[0] });
  }
}
