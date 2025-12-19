
import { cache } from "react";
import { headers } from "next/headers";
import ContentstackServer from "@/lib/cstack";
import { plpReferences } from "@/helpers/referencePaths";
import DataContextProvider from "@/context/data.context";

const fetchData = cache(async (locale, url) => {
    const headersList = await headers();
    const variantParam = headersList.get('x-personalize-variants');

    const data = await ContentstackServer.getElementByUrlWithRefs(
        "plp",
        "/plp/" + url,
        locale,
        plpReferences,
        {},
        variantParam
    );
    return data;
});

export const generateMetadata = async ({ params }) => {
    const parameters = await params;
    const locale = parameters.locale;
    const data = await fetchData(locale, parameters.url);
    const entry = data?.[0];

    return {
        title: entry?.headline || "Red Panda Resort",
        description: 'Red Panda Resort is a demo website made using Contentstack.',
        robots: {
            index: false,
            follow: false,
        },
        openGraph: {
            title: entry?.headline || "Red Panda Resort",
            description: 'Red Panda Resort is a demo website made using Contentstack.',
            images: entry?.image?.url,
        },
    }
};

export default async function PLPLayout({
    children,
    params,
}) {
    const parameters = await params;
    const locale = parameters.locale;
    const data = await fetchData(locale, parameters.url);

    return (
        <DataContextProvider data={data}>
            {children}
        </DataContextProvider>
    );
}