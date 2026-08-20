import { useEffect, useState, useRef } from "react";
import { FaEye } from "react-icons/fa";

const ViewsCounter = ({ type, slug }) => {
  const [views, setViews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasIncrementedRef = useRef({});
  const currentKeyRef = useRef(null);

  useEffect(() => {
    const componentKey = `${type}_${slug}`;
    const viewKey = `view_${type}_${slug}`;

    if (currentKeyRef.current !== componentKey) {
      currentKeyRef.current = componentKey;
      setViews(null);
      setIsLoading(true);
    }

    const hasIncremented = hasIncrementedRef.current[componentKey] || false;

    if (typeof window !== "undefined") {
      const sessionIncremented = sessionStorage.getItem(viewKey);
      if (sessionIncremented === "true" || hasIncremented) {
        const getViews = async () => {
          try {
            const getResponse = await fetch(`/api/views/${type}/${slug}`);
            if (getResponse.ok) {
              const data = await getResponse.json();
              setViews(data.views);
            }
          } catch (err) {
            console.error("Error fetching views:", err);
          } finally {
            setIsLoading(false);
          }
        };
        getViews();
        return;
      }
    }

    hasIncrementedRef.current[componentKey] = true;

    const incrementViews = async () => {
      try {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(viewKey, "true");
        }

        const incrementResponse = await fetch(`/api/views/${type}/${slug}`, {
          method: "POST",
        });

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
        hasIncrementedRef.current[componentKey] = false;
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
      }
    };

    incrementViews();
  }, [type, slug]);

  const hasViews = !isLoading && views !== null;

  // The counter keeps its footprint from first paint: the eye icon is always
  // there and a skeleton bar stands in for the number until the count arrives,
  // so there is never an empty gap and nothing around it shifts.
  return (
    <span
      className="flex min-h-[1.5rem] min-w-[9ch] items-center text-sm text-gray-600 dark:text-gray-400"
      aria-live="polite"
      aria-busy={!hasViews}
    >
      <FaEye className="mr-2 shrink-0 opacity-80" />
      {hasViews ? (
        <span className="animate-fade-in">
          {views.toLocaleString()} {views === 1 ? "view" : "views"}
        </span>
      ) : (
        <span
          className="h-[0.7em] w-[5.5ch] animate-pulse rounded-full bg-current opacity-20"
          aria-label="Loading views"
        />
      )}
    </span>
  );
};

export default ViewsCounter;
