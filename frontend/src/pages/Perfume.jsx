import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Perfume() {
    const { perfumeId } = useParams();
    const [perfume, setPerfume] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:9000/perfumes/${perfumeId}`)
        .then(response => response.json())
        .then(data => setPerfume(data));
    }, [perfumeId]);

    if (!perfume) return <h1>Loading...</h1>;

    return(<>

        <img src={perfume.image} alt={perfume.name} width={300} />

        <h1>{perfume.name}</h1>
        <h2>{perfume.brand}</h2>
        <p>{perfume.gender} • {perfume.concentration}</p>

        <button>+ Add to Collection</button>
        <button>+ Add to Wishlist</button>

        <h3>Description</h3>
        <p>{perfume.description}</p>

        <h3>Release Year</h3>
        <p>{perfume.release_year}</p>

        <h3>Accords</h3>
        {perfume.accords?.map((accord, index) => (
            <span key={index}>[ {accord.name} ] </span>
        ))}

        <h3>Notes Pyramid</h3>

        <h4>Top Notes</h4>
        {perfume.top_notes?.map((note, index) => (
            <span key={index}>[ {note.name} ] </span>
        ))}

        <h4>Middle Notes</h4>
        {perfume.middle_notes?.map((note, index) => (
            <span key={index}>[ {note.name} ] </span>
        ))}

        <h4>Base Notes</h4>
        {perfume.bottom_notes?.map((note, index) => (
            <span key={index}>[ {note.name} ] </span>
        ))}

        </>
    )
}
export default Perfume;
