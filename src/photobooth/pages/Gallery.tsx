import React, {useEffect, useState} from "react";

function Gallery () {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await fetch("api/photos");
                const data = await response.json();
                setPhotos(data);
            }
            catch (error) {
                console.error("Error fetching photos: ", error);
            }
        }
        fetchPhotos();
    }, []);

    return (<div className="container">
        {photos.length === 0 && <p>No photos saved yet</p>}
        {photos.map((photo, idx) => (
            <img 
                key={idx} 
                src={photo} 
                alt={`Saved Photostrip ${idx}`} 
                style={{ width: "200px", margin: "10px", borderRadius: "8px" }}
            />
        ))}
    </div>
    );
}

export default Gallery;


