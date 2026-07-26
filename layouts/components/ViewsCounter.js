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

  // The counter occupies its final footprint from first paint and fades in as a
  // single unit once the count arrives, so nothing around it shifts and there is
  // no half-rendered state where the icon sits next to an empty space.
  return (
    <span
      aria-hidden={!hasViews}
      className={`flex min-h-[1.5rem] min-w-[9ch] items-center text-sm text-gray-600 transition-opacity duration-200 ease-in motion-reduce:transition-none dark:text-gray-400 ${
        hasViews ? "opacity-100" : "opacity-0"
      }`}
    >
      {hasViews && (
        <>
          <FaEye className="mr-2 opacity-80" />
          {views.toLocaleString()} {views === 1 ? "view" : "views"}
        </>
      )}
    </span>
  );
};

export default ViewsCounter;
