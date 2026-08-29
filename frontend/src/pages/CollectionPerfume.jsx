import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

const ACCORD_COLORS = {
  woody: { bg: "#774414", text: "#FFFFFF" },
  powdery: { bg: "#EEDDCC", text: "#000000" },
  sweet: { bg: "#EE363B", text: "#FFFFFF" },
  citrus: { bg: "#F9FF52", text: "#000000" },
  aromatic: { bg: "#37A089", text: "#000000" },
  "fresh spicy": { bg: "#83C928", text: "#000000" },
  amber: { bg: "#BC4D10", text: "#FFFFFF" },
  "warm spicy": { bg: "#CC3300", text: "#FFFFFF" },
  floral: { bg: "#FF5F8D", text: "#000000" },
  musky: { bg: "#E7D8EA", text: "#000000" },
  green: { bg: "#0E8C1D", text: "#FFFFFF" },
  fresh: { bg: "#9BE5ED", text: "#000000" },
  fruity: { bg: "#FF6F61", text: "#FFFFFF" },
  herbal: { bg: "#6B8E23", text: "#FFFFFF" },
  earthy: { bg: "#6F4E37", text: "#FFFFFF" },
  patchouli: { bg: "#5C4033", text: "#FFFFFF" },
  lavender: { bg: "#B497D6", text: "#000000" },
  vanilla: { bg: "#F3E5AB", text: "#000000" },
  "soft spicy": { bg: "#E2925A", text: "#000000" },
  warm: { bg: "#D17842", text: "#FFFFFF" },
  balsamic: { bg: "#7A4A2B", text: "#FFFFFF" },
  leather: { bg: "#5A3825", text: "#FFFFFF" },
  smoky: { bg: "#4A4A4A", text: "#FFFFFF" },
  tobacco: { bg: "#7B5A3A", text: "#FFFFFF" },
  marine: { bg: "#2E86AB", text: "#FFFFFF" },
  aquatic: { bg: "#5BC8D4", text: "#000000" },
  ozonic: { bg: "#A8DADC", text: "#000000" },
  animalic: { bg: "#8B6F47", text: "#FFFFFF" },
  "white floral": { bg: "#FFF5F7", text: "#000000" },
  mossy: { bg: "#5A6B3F", text: "#FFFFFF" },
  rose: { bg: "#E8748A", text: "#FFFFFF" },
  tropical: { bg: "#FFAE42", text: "#000000" },
  coconut: { bg: "#FFF3D6", text: "#000000" },
  almond: { bg: "#EFDECD", text: "#000000" },
  caramel: { bg: "#C68E17", text: "#FFFFFF" },
  honey: { bg: "#FFC30B", text: "#000000" },
  cinnamon: { bg: "#B5502E", text: "#FFFFFF" },
  nutty: { bg: "#8C6239", text: "#FFFFFF" },
};

function getAccordColor(name) {
  return (
    ACCORD_COLORS[name?.toLowerCase()] || {
      bg: "#e0e0e0",
      text: "#333333",
    }
  );
}

export default function CollectionPerfume() {
  const { perfumeId } = useParams();
  const navigate = useNavigate();

  const [perfume, setPerfume] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const [editingRating, setEditingRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [savingRating, setSavingRating] = useState(false);

  useEffect(() => {
    async function getCollectionPerfume() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:9000/me/collection",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error(
            "Failed to get collection:",
            response.status
          );
          setLoading(false);
          return;
        }

        const collection = await response.json();

        const foundPerfume = collection.find(
          (item) => item.id === perfumeId
        );

        if (!foundPerfume) {
          console.error("Collection perfume not found");
          setLoading(false);
          return;
        }

        setPerfume(foundPerfume);
        setNotes(foundPerfume.notes || "");
        setRating(foundPerfume.rating ?? 0);
      } catch (error) {
        console.error("Failed to get perfume:", error);
      }

      setLoading(false);
    }

    getCollectionPerfume();
  }, [perfumeId]);

  async function deleteFromCollection() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:9000/me/collection/${perfumeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error(await response.json());
        return;
      }

      navigate("/home");
    } catch (error) {
      console.error("Failed to remove perfume:", error);
    }
  }

  async function saveNotes() {
    const token = localStorage.getItem("token");
    setSavingNotes(true);

    try {
      const response = await fetch(
        `http://localhost:9000/me/collection/${perfumeId}?notes=${encodeURIComponent(
          notes
        )}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.detail || "Failed to update notes");
        return;
      }

      const updatedPerfume = await response.json();

      setPerfume(updatedPerfume);
      setNotes(updatedPerfume.notes || "");
      setEditingNotes(false);
    } catch (error) {
      console.error("Failed to update notes:", error);
      alert("Something went wrong");
    } finally {
      setSavingNotes(false);
    }
  }

  async function saveRating() {
    const token = localStorage.getItem("token");

    if (rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5.");
      return;
    }

    setSavingRating(true);

    try {
      const response = await fetch(
        `http://localhost:9000/me/collection/${perfumeId}/rating?rating=${rating}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.detail || "Failed to update rating");
        return;
      }

      const updatedPerfume = await response.json();

      setPerfume(updatedPerfume);
      setRating(updatedPerfume.rating ?? 0);
      setEditingRating(false);
    } catch (error) {
      console.error("Failed to update rating:", error);
      alert("Something went wrong");
    } finally {
      setSavingRating(false);
    }
  }

  if (loading) {
    return <h1 className="loading">Loading...</h1>;
  }

  if (!perfume) {
    return (
      <>
        <Navbar />

        <div className="not-found">
          <h1>Perfume not found</h1>

          <button onClick={() => navigate("/home")}>
            Back to Collection
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="perfume-page">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="perfume-container">
          {/* IMAGE */}
          <div className="perfume-image-container">
            <img
              src={perfume.image}
              alt={perfume.name}
              className="perfume-image"
            />
          </div>

          {/* DETAILS */}
          <div className="perfume-details">
            <p className="perfume-brand">{perfume.brand}</p>

            <h1 className="perfume-name">{perfume.name}</h1>

            <p className="perfume-info">
              {perfume.gender}

              {perfume.concentration && (
                <>
                  <span> • </span>
                  {perfume.concentration}
                </>
              )}
            </p>

            {/* BUTTONS */}
            <div className="button-container">
              <button
                className="delete-button"
                onClick={deleteFromCollection}
              >
                Remove From Collection
              </button>

              <button
                className="wishlist-button"
                onClick={() =>
                  navigate(`/addtowishlist/${perfume.original_id}`)
                }
              >
                Add to Wishlist
              </button>
            </div>

            {/* DESCRIPTION */}
            <div className="section">
              <h3 className="section-heading">
                Description
              </h3>

              <p className="description">
                {perfume.description ||
                  "No description available."}
              </p>
            </div>

            {/* RELEASE YEAR */}
            <div className="section">
              <h3 className="section-heading">
                Release Year
              </h3>

              <p>
                {perfume.release_year || "Unknown"}
              </p>
            </div>

            {/* ACCORDS */}
            <div className="section">
              <h3 className="section-heading">
                Accords
              </h3>

              {perfume.accords?.length > 0 ? (
                perfume.accords.map((accord, index) => {
                  const color = getAccordColor(
                    accord.name
                  );

                  return (
                    <span
                      key={index}
                      className="accord"
                      style={{
                        backgroundColor: color.bg,
                        color: color.text,
                      }}
                    >
                      {accord.name}
                    </span>
                  );
                })
              ) : (
                <p className="muted">
                  No accords available.
                </p>
              )}
            </div>

            {/* NOTES PYRAMID */}
            <div className="section">
              <h3 className="section-heading">
                Notes Pyramid
              </h3>

              <h4 className="note-heading">
                Top Notes
              </h4>

              {perfume.top_notes?.length > 0 ? (
                perfume.top_notes.map((note, index) => (
                  <span
                    key={index}
                    className="note"
                  >
                    {note.name}
                  </span>
                ))
              ) : (
                <p className="muted">None listed</p>
              )}

              <h4 className="middle-heading">
                Middle Notes
              </h4>

              {perfume.middle_notes?.length > 0 ? (
                perfume.middle_notes.map(
                  (note, index) => (
                    <span
                      key={index}
                      className="note"
                    >
                      {note.name}
                    </span>
                  )
                )
              ) : (
                <p className="muted">None listed</p>
              )}

              <h4 className="base-heading">
                Base Notes
              </h4>

              {perfume.bottom_notes?.length > 0 ? (
                perfume.bottom_notes.map(
                  (note, index) => (
                    <span
                      key={index}
                      className="note"
                    >
                      {note.name}
                    </span>
                  )
                )
              ) : (
                <p className="muted">None listed</p>
              )}
            </div>

            {/* MY NOTES */}
            <div className="section">
              <div className="section-title-row">
                <h3 className="section-heading">
                  My Notes
                </h3>

                {!editingNotes && (
                  <button
                    className="edit-button"
                    onClick={() => {
                      setNotes(perfume.notes || "");
                      setEditingNotes(true);
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>

              {editingNotes ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) =>
                      setNotes(e.target.value)
                    }
                    placeholder="Write your thoughts about this perfume..."
                    className="notes-input"
                  />

                  <div className="edit-buttons">
                    <button
                      className="save-button"
                      onClick={saveNotes}
                      disabled={savingNotes}
                    >
                      {savingNotes
                        ? "Saving..."
                        : "Save"}
                    </button>

                    <button
                      className="cancel-button"
                      onClick={() => {
                        setNotes(perfume.notes || "");
                        setEditingNotes(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="description">
                  {perfume.notes ||
                    "You haven't written any notes about this perfume yet."}
                </p>
              )}
            </div>

            {/* MY RATING */}
            <div className="section">
              <div className="section-title-row">
                <h3 className="section-heading">
                  My Rating
                </h3>

                {!editingRating && (
                  <button
                    className="edit-button"
                    onClick={() => {
                      setRating(perfume.rating ?? 0);
                      setEditingRating(true);
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>

              {editingRating ? (
                <div className="rating-editor">
                  <div className="rating-input-row">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={rating}
                      onChange={(e) =>
                        setRating(
                          Number(e.target.value)
                        )
                      }
                      className="rating-input"
                    />

                    <span className="rating-out-of">
                      / 5
                    </span>
                  </div>

                  <p className="rating-help">
                    Enter a rating from 1 to 5. Decimal
                    ratings are allowed.
                  </p>

                  <div className="edit-buttons">
                    <button
                      className="save-button"
                      onClick={saveRating}
                      disabled={savingRating}
                    >
                      {savingRating
                        ? "Saving..."
                        : "Save"}
                    </button>

                    <button
                      className="cancel-button"
                      onClick={() => {
                        setRating(
                          perfume.rating ?? 0
                        );
                        setEditingRating(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rating">
                  <span className="rating-number">
                    {perfume.rating != null
                      ? `${perfume.rating}/5`
                      : "Not rated"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
