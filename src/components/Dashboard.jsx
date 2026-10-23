import { useEffect, useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import "../style.css";

function Dashboard() {
  const { user, setUser } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState("home");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showTripForm, setShowTripForm] = useState(false);
  const [tripName, setTripName] = useState("");
  const [tripStartDate, setTripStartDate] = useState("");
  const [tripEndDate, setTripEndDate] = useState("");
  const [tripTravelers, setTripTravelers] = useState(1);
  const [tripItinerary, setTripItinerary] = useState("");
  const [tripNotes, setTripNotes] = useState("");
  const [savedTrips, setSavedTrips] = useState([]); 
  const [editingTrip, setEditingTrip] = useState(null);

  useEffect(() => {
  window.scrollTo(0, 0);
}, [activePage]);

useEffect(() => {
  const loadTrips = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/trips", {
        headers: {
          Authorization: `Bearer ${token}`
        }
});
      if (!response.ok) {
        throw new Error("Failed to load trips");
      }
      const trips = await response.json();
      const userTrips = trips.filter(
        (trip) => trip.userId === user?.id
      );
      setSavedTrips(userTrips);
    } catch (error) {
      console.error("Could not load trips:", error);
    }
  };
  if (user?.id) {
    loadTrips();
  }
}, [user]);

  const avatar = user?.name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((namePart) => namePart[0]?.toUpperCase())
    .join("");

  // DESTINATION DATA
  const destinations = [
  {
    name: "Goa",
    imageClass: "goa",
    description: "Beaches, nightlife and adventure.",
    overview: "Goa is known for its beautiful beaches, Portuguese heritage and relaxing atmosphere.",
    places: "Baga Beach, Fort Aguada, Palolem Beach, Anjuna Beach, Dudhsagar Falls, Fontainhas",
    activities: "Water sports, beach hopping, sunset cruises, exploring heritage quarters, and enjoying nightlife",
    responsible: "Respect local culture, avoid littering, support local businesses, minimize plastic use, and follow water safety guidelines."
  },
  {
    name: "Manali",
    imageClass: "manali",
    description: "Mountains, snow and adventure.",
    overview: "Manali is a popular mountain destination surrounded by beautiful Himalayan landscapes.",
    places: "Solang Valley, Hadimba Temple, Mall Road, Old Manali, Rohtang Pass, Jogini Waterfall",
    activities: "Trekking, paragliding, skiing, river rafting, temple visits, and exploring local cafes",
    responsible: "Keep mountain trails clean, carry back non-biodegradable waste, respect local communities, and follow eco-trekking practices."
  },
  {
    name: "Kerala",
    imageClass: "kerala",
    description: "Nature and peaceful backwaters.",
    overview: "Kerala is famous for its backwaters, greenery, beaches and rich cultural heritage.",
    places: "Alleppey Backwaters, Munnar Tea Gardens, Fort Kochi, Varkala Beach, Periyar National Park",
    activities: "Houseboat cruises, tea plantation tours, Kathakali performances, bamboo rafting, and Ayurveda wellness treatments",
    responsible: "Protect fragile water ecosystems, avoid disturbing wildlife, support local artisan co-ops, and dispose of waste responsibly."
  }
];

const searchDestinations = [
  {
    name: "Jammu & Kashmir",
    imageClass: "kashmir",
    description: "Valleys, lakes and beautiful mountains.",
    overview: "Kashmir is known for its scenic valleys, lakes, gardens and Himalayan landscapes.",
    places: "Srinagar, Gulmarg, Pahalgam, Dal Lake",
    activities: "Shikara rides, sightseeing, trekking and exploring local markets",
    responsible: "Respect local culture, keep natural areas clean and support local businesses."
  },
  {
    name: "Jaipur",
    imageClass: "jaipur",
    description: "Royal heritage, forts and culture.",
    overview: "Jaipur is known for its historic forts, palaces, colourful markets and rich Rajasthani culture.",
    places: "Amber Fort, City Palace, Hawa Mahal, Jantar Mantar",
    activities: "Heritage walks, sightseeing, shopping and exploring local cuisine",
    responsible: "Respect historical sites, avoid littering and support local artisans."
  },
  {
    name: "Udaipur",
    imageClass: "udaipur",
    description: "Lakes, palaces and peaceful views.",
    overview: "Udaipur is famous for its lakes, palaces and scenic surroundings.",
    places: "Lake Pichola, City Palace, Jag Mandir, Sajjangarh Palace",
    activities: "Boat rides, sightseeing, photography and exploring local markets",
    responsible: "Keep lakes and heritage areas clean and support local tourism."
  }
]

  // PREVIOUSLY VISITED TRIPS
  const visitedTrips = [
    {
      place: "Mahabaleshwar",
      date: "May 2025",
      details: "Hill station getaway, scenic viewpoints, and nature walks"
    },
    {
      place: "Pune",
      date: "September 2026",
      details: "Weekend trip and heritage sightseeing"
    },
    {
      place: "Lonavala",
      date: "June 2026",
      details: "Nature trip and hill station sightseeing"
    }
  ];

  // SEARCH
  const handleSearch = () => {
    const result = searchDestinations.find(
      (destination) =>
        destination.name.toLowerCase() === search.trim().toLowerCase()
    );
    if (result) {
      setSelectedDestination(result);
      setActivePage("destination-details");
    } else {
      alert("Search destinations like Kashmir...");
    }
  };
  const saveTrip = async () => {
  if (!tripName || !tripStartDate || !tripEndDate || !tripItinerary) {
    alert("Please fill in the required trip details.");
    return;
  }
  if (editingTrip) {
const token = localStorage.getItem("token");
const response = await fetch(
  `http://localhost:3000/trips/${editingTrip.id}`,
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
      body: JSON.stringify({
        title: tripName,
        startDate: tripStartDate,
        endDate: tripEndDate,
        travelers: Number(tripTravelers),
        itinerary: tripItinerary
          .split("\n")
          .filter((day) => day.trim() !== ""),
        notes: tripNotes
      })
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update trip");
  }

  const updatedTrip = await response.json();

  setSavedTrips((previousTrips) =>
    previousTrips.map((trip) =>
      trip.id === editingTrip.id ? updatedTrip : trip
    )
  );

  setSelectedTrip(updatedTrip);
  setEditingTrip(null);
  setShowTripForm(false);

  alert("Trip updated successfully! ✨");
  return;
}
else {
  var newTrip = {
    userId: user.id,
    destination: selectedDestination.name,
    title: tripName,
    startDate: tripStartDate,
    endDate: tripEndDate,
    travelers: Number(tripTravelers),
    itinerary: tripItinerary
      .split("\n")
      .filter((day) => day.trim() !== ""),
    notes: tripNotes
  };
}
  
  try {
const token = localStorage.getItem("token");
const response = await fetch("http://localhost:3000/trips", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
    body: JSON.stringify(newTrip)
    });
    if (!response.ok) {
      throw new Error("Failed to save trip");
    }
  const savedTrip = await response.json();
    setSavedTrips((previousTrips) => [
      ...previousTrips,
      savedTrip
    ]);
    setShowTripForm(false);
    setTripName("");
    setTripStartDate("");
    setTripEndDate("");
    setTripTravelers(1);
    setTripItinerary("");
    setTripNotes("");
    alert("Trip saved successfully! 🎉");
  } catch (error) {
    console.error(error);
    alert("Could not save trip. Please check the backend.");
  }
};

  // DESTINATION DETAILS PAGE
  if (activePage === "destination-details" && selectedDestination) {
    return (
      <>
        <header>
          <div className="logo" onClick={() => setActivePage("home")}>
            Wanderly ✈️
          </div>

          <nav>
            <a href="#" onClick={() => setActivePage("home")}>Home</a>
            <a href="#" onClick={() => setActivePage("destinations")}>
              Destinations
            </a>
            <a href="#" onClick={() => setActivePage("trips")}>
              My Trips
            </a>
            <a href="#" onClick={() => setActivePage("profile")}>
              Profile
            </a>
            <span>🔔</span>

            <button onClick={() => setUser(null)}>
              Logout
            </button>
          </nav>
        </header>

        <main>
<section className="details-page">
  <div className="details-actions">
    <button
      className="back-button"
      onClick={() => setActivePage("home")}
    >
      ← Back to Home
    </button>
    <button
  className="primary-button"
  onClick={() => {
    setEditingTrip(null);
    setTripName("");
    setTripStartDate("");
    setTripEndDate("");
    setTripTravelers(1);
    setTripItinerary("");
    setTripNotes("");
    setShowTripForm(true);
  }}
>
  ➕ Add Trip
</button>
  </div>
{showTripForm && (
  <div className="trip-form">
    <h2>🧳 Plan Your Trip</h2>

    <label>Trip Name</label>
    <input
      type="text"
      placeholder="Example: Kashmir Family Trip"
      value={tripName}
      onChange={(e) => setTripName(e.target.value)}
    />

    <label>Start Date</label>
    <input
    type="date"
    value={tripStartDate}
    onChange={(e) => setTripStartDate(e.target.value)}
    min={new Date().toISOString().split("T")[0]}
    />

   <label>End Date</label>
   <input
   type="date"
   value={tripEndDate}
   onChange={(e) => setTripEndDate(e.target.value)}
   min={tripStartDate || new Date().toISOString().split("T")[0]}
  />

    <label>Number of Travellers</label>
    <input
      type="number"
      min="1"
      value={tripTravelers}
      onChange={(e) => setTripTravelers(e.target.value)}
    />

    <label>Itinerary</label>
    <textarea
      placeholder={"Day 1: Arrival and sightseeing\nDay 2: Local exploration\nDay 3: Return home"}
      value={tripItinerary}
      onChange={(e) => setTripItinerary(e.target.value)}
    />

    <label>Additional Details</label>
    <textarea
      placeholder="Add any other travel plans or notes..."
      value={tripNotes}
      onChange={(e) => setTripNotes(e.target.value)}
    />

    <div className="form-buttons">
      <button className="primary-button" onClick={saveTrip}>
        💾 Save Trip
      </button>

      <button
        className="secondary-button"
        onClick={() => {
          setShowTripForm(false);
          setEditingTrip(null);
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}

            <div className={`details-image ${selectedDestination.imageClass}`}></div>

            <h1>{selectedDestination.name}</h1>

            <p className="details-description">
              {selectedDestination.overview}
            </p>

            <div className="details-box">
              <h3>📍 Places to Visit</h3>
              <p>{selectedDestination.places}</p>
            </div>

            <div className="details-box">
              <h3>🎯 Activities</h3>
              <p>{selectedDestination.activities}</p>
            </div>

            <div className="details-box">
              <h3>🌱 Responsible Travel</h3>
              <p>{selectedDestination.responsible}</p>
            </div>
          </section>
        </main>

        <footer>
          © 2026 Wanderly | Explore • Plan • Travel
        </footer>
      </>
    );
  }

  // UPCOMING TRIP DETAILS PAGE
  if (activePage === "trip-details" && selectedTrip) {
    return (
      <>
        <header>
          <div className="logo" onClick={() => setActivePage("home")}>
            Wanderly ✈️
          </div>

          <nav>
            <a href="#" onClick={() => setActivePage("home")}>
              Home
            </a>
            <a href="#" onClick={() => setActivePage("trips")}>
              My Trips
            </a>
            <a href="#" onClick={() => setActivePage("profile")}>
              Profile
            </a>
            <span>🔔</span>

            <button onClick={() => setUser(null)}>
              Logout
            </button>
          </nav>
        </header>

        <main>
          <section className="details-page">
            <div className="details-actions">
  <button
    className="back-button"
    onClick={() => setActivePage("home")}
  >
    ← Back to Home
  </button>

  <button
  className="primary-button"
  onClick={() => {
    setEditingTrip(selectedTrip);
    setTripName(selectedTrip.title);
    setTripStartDate(selectedTrip.startDate);
    setTripEndDate(selectedTrip.endDate);
    setTripTravelers(selectedTrip.travelers);
    setTripItinerary(selectedTrip.itinerary.join("\n"));
    setTripNotes(selectedTrip.notes || "");
    setSelectedDestination(
      destinations.find(
        (destination) => destination.name === selectedTrip.destination
      )
    );
    setShowTripForm(true);
    setActivePage("destination-details");
  }}
>
  ✏️ Edit Trip
</button>
</div>

            <h1>{selectedTrip.title}</h1>

            <p className="trip-detail-info">
  📅 {new Date(selectedTrip.startDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })} - {new Date(selectedTrip.endDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })}
</p>

           <p className="trip-detail-info">
  👥 {selectedTrip.travelers} {selectedTrip.travelers === 1 ? "Traveler" : "Travelers"}
</p>

            <h2>🗓️ Itinerary</h2>

            <div className="itinerary">
              {selectedTrip.itinerary.map((day, index) => (
                <div className="itinerary-item" key={index}>
                  {day}
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer>
          © 2026 Wanderly | Explore • Plan • Travel
        </footer>
      </>
    );
  }

  // DESTINATIONS PAGE
  if (activePage === "destinations") {
    return (
      <>
        <header>
          <div className="logo" onClick={() => setActivePage("home")}>
            Wanderly ✈️
          </div>

          <nav>
            <a href="#" onClick={() => setActivePage("home")}>
              Home
            </a>
            <a href="#" onClick={() => setActivePage("trips")}>
              My Trips
            </a>
            <a href="#" onClick={() => setActivePage("profile")}>
              Profile
            </a>
            <span>🔔</span>

            <button onClick={() => setUser(null)}>
              Logout
            </button>
          </nav>
        </header>

        <main>
          <section>
            <h2 className="section-title">Explore Destinations</h2>

            <div className="destination-container">
              {destinations.map((destination) => (
                <div className="destination-card" key={destination.name}>

                  <div className={`image ${destination.imageClass}`}></div>

                  <h3>{destination.name}</h3>

                  <p>{destination.description}</p>

                  <button
                    onClick={() => {
  setSelectedDestination(destination);
  setSelectedTrip(null);
  setEditingTrip(null);
  setShowTripForm(false);
  setActivePage("destination-details");
}}
                  >
                    View Details
                  </button>

                </div>
              ))}
            </div>
          </section>
        </main>

        <footer>
          © 2026 Wanderly | Explore • Plan • Travel
        </footer>
      </>
    );
  }

  // MY TRIPS PAGE
  if (activePage === "trips") {
    return (
      <>
        <header>
          <div className="logo" onClick={() => setActivePage("home")}>
            Wanderly ✈️
          </div>

          <nav>
            <a href="#" onClick={() => setActivePage("home")}>
              Home
            </a>
            <a href="#" onClick={() => setActivePage("trips")}>
              My Trips
            </a>
            <a href="#" onClick={() => setActivePage("profile")}>
              Profile
            </a>
            <span>🔔</span>

            <button onClick={() => setUser(null)}>
              Logout
            </button>
          </nav>
        </header>

        <main>
          <section>
            <h2 className="section-title">🧳 My Trips</h2>

            <p className="page-introduction">
              Places you have visited recently.
            </p>

            <div className="visited-trips">
              {visitedTrips.map((trip) => (
                <div className="visited-trip-card" key={trip.place}>
                  <h3>📍 {trip.place}</h3>
                  <p>📅 {trip.date}</p>
                  <p>{trip.details}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer>
          © 2026 Wanderly | Explore • Plan • Travel
        </footer>
      </>
    );
  }

  // PROFILE PAGE
  if (activePage === "profile") {
    return (
      <>
        <header>
          <div className="logo" onClick={() => setActivePage("home")}>
            Wanderly ✈️
          </div>

          <nav>
            <a href="#" onClick={() => setActivePage("home")}>
              Home
            </a>
            <a href="#" onClick={() => setActivePage("trips")}>
              My Trips
            </a>
            <a href="#" onClick={() => setActivePage("profile")}>
              Profile
            </a>
            <span>🔔</span>

            <button onClick={() => setUser(null)}>
              Logout
            </button>
          </nav>
        </header>

        <main>
          <section className="profile-page">
            <div className="large-avatar">
              {avatar}
            </div>

            <h1>{user?.name}</h1>

            <h3>Travel Explorer</h3>

            <div className="profile-details">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Total Trips:</strong> 3</p>
              <p><strong>Saved Places:</strong> 5</p>
              <p><strong>Travel Style:</strong> Wanderlust</p>
            </div>
          </section>
        </main>

        <footer>
          © 2026 Wanderly | Explore • Plan • Travel
        </footer>
      </>
    );
  }

  // HOME PAGE
  return (
    <>
      <header>
        <div
          className="logo"
          onClick={() => setActivePage("home")}
        >
          Wanderly ✈️
        </div>

        <nav>
          <a href="#" onClick={() => setActivePage("home")}>
            Home
          </a>

          <a href="#" onClick={() => setActivePage("trips")}>
            My Trips
          </a>

          <a href="#" onClick={() => setActivePage("profile")}>
            Profile
          </a>

          <span
            className="notification"
            onClick={() =>
              alert("🔔 You have a trip coming up in October!")
            }
          >
            🔔
          </span>

          <button onClick={() => setUser(null)}>
            Logout
          </button>
        </nav>
      </header>

      <main>
        <div className="dashboard-layout">

          <div className="left-content">

            {/* PROFILE */}
            <section className="profile-card">

              <div className="avatar">
                {avatar}
              </div>

              <div className="profile-info">

                <h1>{user?.name}</h1>

                <h3>Wanderlust</h3>

                <p>
                  Plan journeys, discover places and create unforgettable memories.
                </p>

              </div>

              <div className="stats">

                <div>
                  <h2>3</h2>
                  <p>Trips</p>
                </div>

                <div>
                  <h2>75K</h2>
                  <p>Budget</p>
                </div>

              </div>

            </section>

            {/* SEARCH */}
            <section className="search-section">

              <h2>Where do you want to go?</h2>

              <div className="search-box">

                <input
                  type="text"
                  placeholder="Search destinations like Kashmir..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />

                <button onClick={handleSearch}>
                  Explore
                </button>

              </div>

            </section>

            {/* DESTINATIONS */}
            <section>

              <h2 className="section-title">
                Explore Destinations
              </h2>

              <div className="destination-container">

                {destinations.map((destination) => (

                  <div
                    className="destination-card"
                    key={destination.name}
                  >

                    <div
                      className={`image ${destination.imageClass}`}
                    ></div>

                    <h3>{destination.name}</h3>

                    <p>{destination.description}</p>

                    <button
                      onClick={() => {
                        setSelectedDestination(destination);
                        setActivePage("destination-details");
                      }}
                    >
                      View Details
                    </button>

                  </div>

                ))}

              </div>

            </section>

            {/* FEATURES */}
            <section>

              <h2 className="section-title">
                Wanderly Services
              </h2>

              <div className="feature-container">

                <div className="feature-card">
                  <h2>🗺️</h2>
                  <h3>Plan Trips</h3>
                  <p>Create personalized itineraries.</p>
                </div>

                <div className="feature-card">
                  <h2>💰</h2>
                  <h3>Track Budget</h3>
                  <p>Manage travel expenses.</p>
                </div>

                <div className="feature-card">
                  <h2>⭐</h2>
                  <h3>Save Places</h3>
                  <p>Keep favourite destinations.</p>
                </div>

              </div>

            </section>

          </div>

          {/* RIGHT SIDE */}
          <aside className="right-sidebar">

            {/* UPCOMING TRIPS */}
            <section className="trip-section">

              <h2>My Upcoming Journeys</h2>

              {savedTrips.map((trip) => (

                <div
                  className="mini-trip-card"
                  key={trip.title}
                >

                  <h3>{trip.title}</h3>

                  <p>
                    📅 {new Date(trip.startDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })} - {new Date(trip.endDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                 </p>

                  <p>
  👥 {trip.travelers}{" "}
  {trip.travelers === 1 ? "Traveler" : "Travelers"}
</p>

                  <button
                    onClick={() => {
                      setSelectedTrip(trip);
                      setActivePage("trip-details");
                    }}
                  >
                    View Details
                  </button>
                  <button
  className="delete-trip-button"
  title="Delete Trip"
  onClick={async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
    
const token = localStorage.getItem("token");
const response = await fetch(
  `http://localhost:3000/trips/${trip.id}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
      if (!response.ok) {
        throw new Error("Failed to delete trip");
      }

      setSavedTrips((previousTrips) =>
        previousTrips.filter((item) => item.id !== trip.id)
      );

      alert("Trip deleted successfully! 🗑️");
    } catch (error) {
      console.error(error);
      alert("Could not delete trip. Please try again.");
    }
  }}
>
  🗑️
</button>

                </div>

              ))}

            </section>

            {/* SUMMARY */}
            <section className="summary-card">

              <h2>Travel Summary</h2>

              <div className="summary-item">
                <h3>3</h3>
                <p>Places Visited</p>
              </div>

              <div className="summary-item">
                <h3>8500 km</h3>
                <p>Distance Travelled</p>
              </div>

            </section>

          </aside>

        </div>
      </main>

      <footer>
        © 2026 Wanderly | Explore • Plan • Travel
      </footer>
    </>
  );
}

export default Dashboard;