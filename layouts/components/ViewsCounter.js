import { useEffect, useState, useRef } from "react";
import { FaEye } from "react-icons/fa";

const ViewsCounter = ({ type, slug }) => {
  const [views, setViews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isProcessingRef = useRef(false);
  const currentKeyRef = useRef(null);

  useEffect(() => {
    const viewKey = `view_${type}_${slug}`;
    const componentKey = `${type}_${slug}`;

    if (currentKeyRef.current !== componentKey) {
      currentKeyRef.current = componentKey;
      setViews(null);
      setIsLoading(true);
      isProcessingRef.current = false;
    }

    if (isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;

    const processViews = async () => {
      try {
        if (typeof window !== "undefined") {
          const sessionIncremented = sessionStorage.getItem(viewKey);
          if (sessionIncremented === "true") {
            const getResponse = await fetch(`/api/views/${type}/${slug}`);
            if (getResponse.ok) {
              const data = await getResponse.json();
              setViews(data.views);
            }
            setIsLoading(false);
            isProcessingRef.current = false;
            return;
          }
        }

        const incrementResponse = await fetch(`/api/views/${type}/${slug}`, {
          method: "POST",
        });

        if (typeof window !== "undefined") {
          sessionStorage.setItem(viewKey, "true");
        }

        if (incrementResponse.ok) {
          const data = await incrementResponse.json();
          setViews(data.views);
        } else {
          const getResponse = await fetch(`/api/views/${type}/${slug}`);
          if (getResponse.ok) {
            const data = await getResponse.json();
            setViews(data.views);
          }
        }
      } catch (error) {
        console.error("Error updating views:", error);
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(viewKey);
        }
        try {
          const getResponse = await fetch(`/api/views/${type}/${slug}`);
          if (getResponse.ok) {
            const data = await getResponse.json();
            setViews(data.views);
          }
        } catch (err) {
          console.error("Error fetching views:", err);
        }
      } finally {
        setIsLoading(false);
        isProcessingRef.current = false;
      }
    };

    processViews();
  }, [type, slug]);

  if (isLoading || views === null) {
    return null;
  }

  return (
    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
      <FaEye className="mr-2 opacity-80" />
      {views.toLocaleString()} {views === 1 ? "view" : "views"}
    </span>
  );
};

export default ViewsCounter;
