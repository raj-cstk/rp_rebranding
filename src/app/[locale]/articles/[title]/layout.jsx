
import { cache } from "react";
import { headers } from "next/headers";
import ContentstackServer from "@/lib/cstack";
import DataContextProvider from "@/context/data.context";

const fetchData = cache(async (locale, title) => {
    const headersList = await headers();
    const variantParam = headersList.get('x-personalize-variants');

    const data = await ContentstackServer.getElementByUrl(
        "article_list",
        "/articles/" + title,
        locale,
        {},
        variantParam
    );
    return data;
});

export const generateMetadata = async ({ params }) => {
    const parameters = await params;
    const locale = parameters.locale;
    const data = await fetchData(locale, parameters.title);
    const entry = data?.[0];

    return {
        title: entry?.seo?.title || entry?.title,
        description: entry?.seo?.description || 'Red Panda Resort is a demo website made using Contentstack.',
        robots: {
            index: entry?.seo?.no_index || false,
            follow: entry?.seo?.no_follow || false,
        },
        openGraph: {
            title: entry?.seo?.og_meta_tags?.title || entry?.title,
            description: entry?.seo?.og_meta_tags?.description || 'Red Panda Resort is a demo website made using Contentstack.',
            images: entry?.seo?.og_meta_tags?.image,
        },
    }
};

export default async function ArticlesLayout({
    children,
    params,
}) {
    const parameters = await params;
    const locale = parameters.locale;
    const data = await fetchData(locale, parameters.title);

    return (
        <DataContextProvider data={data}>
            {children}
        </DataContextProvider>
    );
}