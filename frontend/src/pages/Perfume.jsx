import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    const key = name?.toLowerCase();
    return ACCORD_COLORS[key] || { bg: "#e0e0e0", text: "#333333" };
}

function Perfume() {
    const { perfumeId } = useParams();
    const [perfume, setPerfume] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:9000/perfumes/${perfumeId}?perfumeID=${perfumeId}`)
            .then(response => response.json())
            .then(data => setPerfume(data));
    }, [perfumeId]);

    if (!perfume) {
        return (
            <h1 style={{ textAlign: "center", marginTop: "100px", fontFamily: "Arial, sans-serif" }}>
                Loading...
            </h1>
        );
    }

    const sectionStyle = { marginTop: "30px" };
    const headingStyle = {
        fontSize: "18px",
        marginBottom: "12px",
        paddingBottom: "8px",
        borderBottom: "1px solid #e7e5e4"
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f5f3f0", padding: "50px 20px", fontFamily: "Arial, sans-serif", color: "#292524" }}>
            <div style={{ maxWidth: "1100px", margin: "auto", background: "#fff", borderRadius: "20px", padding: "40px", display: "flex", gap: "50px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                <div style={{ flex: "0 0 400px", height: "500px", background: "#f8f6f3", borderRadius: "15px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img src={perfume.image} alt={perfume.name} style={{ width: "90%", height: "90%", objectFit: "contain" }} />
                </div>

                <div style={{ flex: 1 }}>
                    <p style={{ color: "#9a8065", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "bold", margin: "0 0 5px" }}>
                        {perfume.brand}
                    </p>

                    <h1 style={{ fontSize: "42px", margin: "5px 0 10px" }}>
                        {perfume.name}
                    </h1>

                    <p style={{ color: "#777", fontSize: "16px" }}>
                        {perfume.gender}
                        {perfume.concentration && (
                            <>
                                <span style={{ margin: "0 8px" }}>•</span>
                                {perfume.concentration}
                            </>
                        )}
                    </p>

                    <div style={{ display: "flex", gap: "12px", margin: "25px 0 35px" }}>
                        <button style={{ padding: "12px 20px", background: "#292524", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                            + Add to Collection
                        </button>
                        <button style={{ padding: "12px 20px", background: "#fff", color: "#292524", border: "1px solid #d6d3d1", borderRadius: "8px", cursor: "pointer" }}>
                            ♡ Add to Wishlist
                        </button>
                    </div>

                    <div style={sectionStyle}>
                        <h3 style={headingStyle}>Description</h3>
                        <p style={{ color: "#666", lineHeight: "1.7" }}>
                            {perfume.description || "No description available."}
                        </p>
                    </div>

                    <div style={sectionStyle}>
                        <h3 style={headingStyle}>Release Year</h3>
                        <p>{perfume.release_year}</p>
                    </div>

                    <div style={sectionStyle}>
                        <h3 style={headingStyle}>Accords</h3>
                        {perfume.accords?.map((accord, index) => {
                            const color = getAccordColor(accord.name);
                            return (
                                <span key={index} style={{ display: "inline-block", backgroundColor: color.bg, color: color.text, padding: "9px 16px", borderRadius: "20px", margin: "4px", fontSize: "14px", fontWeight: "500" }}>
                                    {accord.name}
                                </span>
                            );
                        })}
                    </div>

                    <div style={sectionStyle}>
                        <h3 style={headingStyle}>Notes Pyramid</h3>

                        <h4 style={{ color: "#9a8065" }}>Top Notes</h4>
                        {perfume.top_notes?.map((note, index) => (
                            <span key={index} style={{ display: "inline-block", background: "#f1eee9", padding: "8px 14px", borderRadius: "20px", margin: "4px", fontSize: "14px" }}>
                                {note.name}
                            </span>
                        ))}

                        <h4 style={{ color: "#9a8065", marginTop: "20px" }}>Middle Notes</h4>
                        {perfume.middle_notes?.map((note, index) => (
                            <span key={index} style={{ display: "inline-block", background: "#f1eee9", padding: "8px 14px", borderRadius: "20px", margin: "4px", fontSize: "14px" }}>
                                {note.name}
                            </span>
                        ))}

                        <h4 style={{ color: "#9a8065", marginTop: "20px" }}>Base Notes</h4>
                        {perfume.bottom_notes?.map((note, index) => (
                            <span key={index} style={{ display: "inline-block", background: "#f1eee9", padding: "8px 14px", borderRadius: "20px", margin: "4px", fontSize: "14px" }}>
                                {note.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Perfume;
