"use client";
import { useDataContext } from "@/context/data.context";
import { ContentstackClient } from "@/lib/contentstack-client";
import { useState, useEffect, use } from "react";

export default function Home({ params }) {
  const { locale } = use(params);
  const initialData = useDataContext();

  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // example of how to fetch data from contentstack, replace "homepage" with the content type you want to fetch
      const data = await ContentstackClient.getElementByType("homepage", locale, initialData);
      if(data) {
        setEntry(data[0]);
      } else {
        setEntry(null);
      }
    }

    ContentstackClient.onEntryChange(fetchData);
  }, [locale, initialData]);

  return (
    <div>
      <h1 {...entry?.$?.title}>{entry?.title}</h1>
    </div>
  );
}
