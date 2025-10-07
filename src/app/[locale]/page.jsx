"use client";
import { useDataContext } from "@/context/data.context";
import { ContentstackClient } from "@/lib/contentstack-client";
import { useState, useEffect, use } from "react";

export default function Home({ params }) {
  const { locale } = use(params);
  const initialData = useDataContext();

  // states
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await ContentstackClient.getElementByType("homepage", locale);
      setEntry(data[0]);
    }

    ContentstackClient.onEntryChange(fetchData);
  }, [locale, initialData]);

  return (
    <div>
      <h1 {...entry?.$?.title}>{entry?.title}</h1>
      <p {...entry?.$?.description}>{entry?.description}</p>
    </div>
  );
}
