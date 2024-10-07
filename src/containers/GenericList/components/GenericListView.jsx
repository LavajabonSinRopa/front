import React from "react";

const GenericListView = ({ items, renderItem, idKey }) => {
  return (
    <div>
      {items.length === 0 ? (
        <p>Todavia no hay elementos para mostrar.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
          {items.map((item) => (
            <li key={item[idKey]}>{renderItem(item)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GenericListView;
