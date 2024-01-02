import React, { useState } from "react";

export default function CategorySection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10">
      <div>
        <div className="p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((group) => (
              <div key={group} className="grid gap-4">
                {[1, 2, 2].map((index) => (
                  <div key={index}>
                    <img
                      className="h-auto max-w-full rounded-lg"
                      src={`https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-${
                        3 * (group - 1) + index
                      }.jpg`}
                      alt={`Masonry Image ${3 * (group - 1) + index}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>Col 2</div>
    </div>
  );
}
