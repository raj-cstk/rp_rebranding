
import { cache } from "react";
import { headers } from "next/headers";
import ContentstackServer from "@/lib/cstack";
import { pdpReferences } from "@/helpers/referencePaths";
import DataContextProvider from "@/context/data.context";

const fetchData = cache(async (locale, id) => {
    const headersList = await headers();
    const variantParam = headersList.get('x-personalize-variants');

    const data = await ContentstackServer.getElementByUrlWithRefs(
        "pdp",
        "/pdp/" + id,
        locale,
        pdpReferences,
        {},
        variantParam
    );
    return data;
});

export const generateMetadata = async ({ params }) => {
    const parameters = await params;
    const locale = parameters.locale;
    const data = await fetchData(locale, parameters.id);
    const entry = data?.[0];

    return {
        title: entry?.product_name || "Red Panda Resort",
        description: entry?.description || 'Red Panda Resort is a demo website made using Contentstack.',
        robots: {
            index: false,
            follow: false,
        },
        openGraph: {
            title: entry?.product_name || "Red Panda Resort",
            description: entry?.description || 'Red Panda Resort is a demo website made using Contentstack.',
            images: entry?.images?.[0]?.image?.url,
        },
    }
};

export default async function PLPLayout({
    children,
    params,
}) {
    const parameters = await params;
    const locale = parameters.locale;
    const data = await fetchData(locale, parameters.id);

    return (
        <DataContextProvider data={data}>
            {children}
        </DataContextProvider>
    );
}