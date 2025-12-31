import React from "react";

const VideoDescriptionCard: React.FC<{
  categories: string[];
  createdAt: string;
  description: string;
}> = ({ categories, description, createdAt }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    React.useState(false);
  return (
    <div
      onClick={
        !isDescriptionExpanded
          ? () => setIsDescriptionExpanded(!isDescriptionExpanded)
          : () => {}
      }
      className={`${
        !isDescriptionExpanded && "hover:bg-red-300/30 cursor-pointer"
      } p-2 rounded-lg mt-5 bg-gray-400/30 backdrop-blur-2xl overflow-hidden`}
    >
      {/* categories and date */}
      <p>
        {" "}
        {createdAt}{" "}
        {categories.map((category, index) => (
          <span key={index}>#{category}</span>
        ))}
      </p>
      <h3 className="font-body mt-5">About this Video </h3>
      <p
        className={`${
          isDescriptionExpanded ? "line-clamp-none" : "line-clamp-3"
        } my-2`}
      >
        {description}
      </p>
      {/* see more or less button */}
      {isDescriptionExpanded && (
        <button
        className="cursor-pointer"
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
        >
          See Less
        </button>
      )}
    </div>
  );
};

export default React.memo(VideoDescriptionCard);
