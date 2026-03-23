
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
        title: entry?.seo?.title || entry?.headline || "Red Panda Resort",
        description:
            entry?.seo?.description ||
            entry?.description ||
            "Red Panda Resort is a demo website made using Contentstack.",
        robots: {
            index: !entry?.seo?.no_index,
            follow: !entry?.seo?.no_follow,
        },
        openGraph: {
            title: entry?.seo?.og_meta_tags?.title || entry?.headline || "Red Panda Resort",
            description:
                entry?.seo?.og_meta_tags?.description ||
                entry?.description ||
                "Red Panda Resort is a demo website made using Contentstack.",
            images: entry?.seo?.og_meta_tags?.image || entry?.image?.url,
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
    const entry = data?.[0];

    const faqSchema =
        entry?.aeo?.questions?.length > 0
            ? {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: entry?.aeo?.questions?.map((question) => ({
                    "@type": "Question",
                    name: question?.title,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: question?.answer,
                    },
                })),
            }
            : null;

    return (
        <DataContextProvider data={data}>
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            {children}
        </DataContextProvider>
    );
}